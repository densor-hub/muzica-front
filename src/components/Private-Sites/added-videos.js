import axios from "axios";
import { useState, useEffect, useCallback, useRef } from "react";
import GotoRefreshEndPoint from "../../FNS/GoToRefreshEndPoint";
import { API_BASE_URL } from "../../Resources/BaseURL";
import useAuth from "../../customHooks/useAuth";
import setStatuscodeErrorMessage from "../../FNS/setStatuscodeErrorMessage";
import Loading from "../micro-components/loading";
import { Link, useNavigate } from "react-router-dom";
import DeleteVideo from "./Modals/delete-video-modal";
import { SlOptions } from 'react-icons/sl';


import './CSS/added-videos.css'


const AddedVideos = () => {
    const { auth } = useAuth();
    const navigateTo = useNavigate();
    const [addedVideos, setAddedVideos] = useState([]);
    const [feedback, setFeedback] = useState("")

    const [bools, setBools] = useState({ showloading: false, toggler: false, seachedItemsAvailable: true, showDetails: false, showDeleteModal: false });
    const [opened, setOpened] = useState({ optionsOpened: [], deatilsOpened: [] });
    const searchInputRef = useRef();
    const [selectedVideo, setSelectedVideo] = useState("");

    const getData = useCallback(
        async () => {
            setBools(p => { return { ...p, showloading: true } });

            try {
                let response = await axios.get(`${API_BASE_URL}/get-added-videos`, { withCredentials: true });

                if (response?.status === 200) {
                    setAddedVideos(response?.data?.addedItems);
                    setBools(p => { return { ...p, showloading: false } });
                }
                else if (response?.status === 204) {
                    setAddedVideos([]);
                    setBools(p => { return { ...p, showloading: false } });
                    setFeedback('No videos found...')
                }
            } catch (error) {
                if (!error?.response?.data) {
                    setFeedback('Network challenges...')
                }
                else {
                    if (error?.response?.status === 401) {
                        GotoRefreshEndPoint(auth).then((r) => {
                            if (r.status === 200) {
                                getData();
                            } else {
                                navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/sign-out`);
                            }
                        })
                    }
                    else {
                        setBools((p) => { return { ...p, showloading: false } })
                        setStatuscodeErrorMessage(error?.response?.status, setFeedback)
                    }
                }

            }
        }, [auth, navigateTo]
    )

    useEffect(() => {
        getData()
    }, [getData]);

    //feedback clearing
    useEffect(() => {
        if (feedback) {
            setTimeout(() => {
                setFeedback('');
            }, 3000);
        }
    }, [feedback])

    return (
        <>
            {bools?.showloading && <Loading />}
            {bools?.showDeleteModal && <DeleteVideo getData={getData} setBools={setBools} bools={bools} selectedVideo={selectedVideo} setFeedback={setFeedback} feedback={feedback} />}
            <main className="added-videos" style={{ paddingTop: '40px' }}>
                <div className="page-heading">ADDED <i><b>VIDEOS</b></i></div>

                <div className="feedback-container" style={!feedback ? { backgroundColor: "transparent" } : {}}>
                    <div className="feeback">{!bools?.showDeleteModal && feedback}</div>
                </div>

                <section className="search-item">
                    <input ref={searchInputRef} placeholder={'Enter video title to search'} onChange={() => { setBools((p) => { return { ...p, toggler: !bools?.search } }) }}></input>
                </section>


                <div className="add-new-button-container" style={{ textAlign: "center" }}>
                    {auth?.websiteCreated ? <Link to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/add-video`}>Add new</Link> : <Link to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/createwebsite`}>Create website</Link>}
                </div>

                <div >

                    {<div className="list-of-individual-items" style={addedVideos?.filter(elements => {
                        if (searchInputRef?.current?.value) {
                            return elements?.title?.toLowerCase()?.includes(searchInputRef?.current?.value?.toLowerCase())
                        } else return elements
                    })?.length === 0 ? { width: "70vw" } : {}}>{addedVideos?.length > 0 && addedVideos?.sort((a, b) => {
                        return (new Date(b.dateReleased) - new Date(a.dateReleased))
                    }).filter((elements) => {
                        if (searchInputRef?.current?.value !== "") { return elements?.title?.toLowerCase().includes(searchInputRef?.current?.value?.toLowerCase()) } else {
                            return elements
                        }
                    }).map((elements) => {
                        return (<div key={elements?._id} className='indivial-item for-videos'>
                            <div className="video-container">
                                <div>
                                    <iframe src={new URL(elements?.link)?.search !== "" ? `https://youtube.com/embed/${new URL(elements?.link)?.search?.split('=')[1]}?autoplay=1&mute=1&controls=0&loop=1` :
                                        `https://youtube.com/embed${new URL(elements?.link)?.pathname}?autoplay=1&mute=1&controls=0&loop=1`}

                                        title={elements?.title}></iframe>
                                </div>

                                <div className="title">
                                    {elements?.title[0]?.toUpperCase() + elements?.title?.slice(1, elements?.title?.length)?.toLowerCase()}
                                </div>
                            </div>

                            <div className="options-container">
                                <div>
                                    {!opened?.optionsOpened.includes(elements?._id) && <button className="optionsBtn firstoptionsBtn" onClick={(e) => {
                                        e.preventDefault(); setBools((p) => { return { ...p, toggler: !bools?.search } });
                                        if (!opened?.optionsOpened?.includes(elements?._id)) {
                                            opened?.optionsOpened.push(elements?._id)
                                        }
                                    }}><SlOptions size={'20px'} /></button>}

                                    {opened?.optionsOpened.includes(elements?._id) && <button className="optionsBtn" onClick={(e) => {
                                        e.preventDefault(); setBools((p) => { return { ...p, toggler: !bools?.search } });
                                        if (opened?.optionsOpened?.includes(elements?._id)) {
                                            let filtered = opened?.optionsOpened?.filter(items => { return items !== elements?._id });
                                            setOpened(p => { return { ...p, optionsOpened: filtered } });
                                        }
                                    }}><b>X</b></button>}
                                </div>
                                {opened?.optionsOpened?.includes(elements?._id) && <div className="options">
                                    <div>
                                        <Link to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/edit-video:${elements?._id}`} className="edit">Edit</Link>
                                    </div>

                                    <button onClick={(e) => { e.preventDefault(); setSelectedVideo(elements); setBools(p => { return { showDeleteModal: true } }) }} className="delete">Delete</button>
                                </div>}
                            </div>


                        </div>)
                    })}</div>}

                </div>

                <div style={{ textAlign: "center", marginTop: "50px" }}>
                    {!bools.showloading && addedVideos?.filter(elements => {
                        if (searchInputRef?.current?.value) {
                            return elements?.title?.toLowerCase()?.includes(searchInputRef?.current?.value?.toLowerCase())
                        } else return elements
                    })?.length === 0 && <span>No results found</span>}
                </div>
            </main>
        </>
    )
}

export default AddedVideos;