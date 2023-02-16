import axios from "axios";
import { useState, useEffect, useCallback, useRef } from "react";
import GotoRefreshEndPoint from "../../FNS/GoToRefreshEndPoint";
import { API_BASE_URL } from "../../Resources/BaseURL";
import useAuth from "../../customHooks/useAuth";
import setStatuscodeErrorMessage from "../../FNS/setStatuscodeErrorMessage";
import Loading from "../micro-components/loading";
import { Link, useNavigate } from "react-router-dom";
import { CovertMonthNumbersToAlphabets } from "../../FNS/MonthNumberToAlphabets";
import DeleteAudioModal from "./sub-components/delete-audio-modal";
import { SlOptions } from 'react-icons/sl';
import { BsYoutube } from 'react-icons/bs';
import { ImSoundcloud, ImSpotify } from 'react-icons/im';
import { FaItunesNote } from 'react-icons/fa';
import { SiAudiomack } from 'react-icons/si';


import './CSS/added-audios.css';



const AddedAudios = () => {

    const { auth } = useAuth();
    const [addedAudios, setAddedAudios] = useState([]);
    const [feedback, setFeedback] = useState("")
    const [bools, setBools] = useState({ showloading: false, toggler: false, seachedItemsAvailable: true, showDetails: false, showDeleteModal: false });
    const [opened, setOpened] = useState({ optionsOpened: [], deatilsOpened: [] });
    const searchInputRef = useRef();
    const [selectedAudio, setSelectedAudio] = useState("");
    const navigateTo = useNavigate();

    const getData = useCallback(
        async () => {
            setBools(p => { return { ...p, showloading: true } });

            try {
                let response = await axios.get(`${API_BASE_URL}/get-added-audios`, { withCredentials: true });

                if (response?.status === 200) {
                    if (response?.data?.addedItems?.length > 0) {
                        setAddedAudios(response?.data?.addedItems);
                        setBools(p => { return { ...p, showloading: false } });
                    }
                }
                else if (response?.status === 204) {
                    setAddedAudios([]);
                    setBools(p => { return { ...p, showloading: false } });
                    setFeedback('No audios found...')
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


    useEffect(() => {
        addedAudios?.length > 0 && document?.getElementsByClassName('indivial-item')?.length === 0 && setFeedback('No results found');
    }, [addedAudios?.length]);

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
            {bools?.showDeleteModal && <DeleteAudioModal getData={getData} setBools={setBools} bools={bools} selectedAudio={selectedAudio} setFeedback={setFeedback} feedback={feedback} />}

            <main className="added-audios" style={{ paddingTop: "40px" }}>
                <div className="page-heading">ADDED <i><b>AUDIOS</b></i></div>

                <div className="feedback-container" style={!feedback ? { backgroundColor: "transparent" } : {}}>
                    <div className="feeback">{!bools?.showDeleteModal && feedback}</div>
                </div>

                <section className="search-item">
                    <input ref={searchInputRef} placeholder={'Enter audio title to search'} onChange={() => { setBools((p) => { return { ...p, toggler: !bools?.search } }) }}></input>
                </section>


                <div className="add-new-button-container" style={{ textAlign: "center" }}>
                    {auth?.websiteCreated ? <Link to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/add-audio`}>Add new</Link> :
                        <Link to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/createwebsite`}>Create website</Link>}
                </div>


                <div>
                    {<div className="list-of-individual-items" style={addedAudios?.filter(elements => {
                        if (searchInputRef?.current?.value) {
                            return elements?.headline?.toLowerCase()?.includes(searchInputRef?.current?.value?.toLowerCase())
                        } else return elements
                    })?.length === 0 ? { width: "70vw" } : {}}>{addedAudios?.length > 0 && addedAudios?.sort((a, b) => { return (new Date(b.datereleased) - new Date(a.datereleased)) }).filter((elements) => {
                        if (searchInputRef?.current?.value !== "") { return elements?.title?.toLowerCase().includes(searchInputRef?.current?.value?.toLowerCase()) } else {
                            return elements
                        }
                    }).map((elements) => {
                        return (<div key={elements?._id} className='indivial-item for-audios'>
                            <div className="audio-container">
                                <div>
                                    <img alt="" src={`${elements?.coverart}`}></img>
                                </div>

                                <div className="title">
                                    {elements?.title[0]?.toUpperCase() + elements?.title?.slice(1, elements?.title?.length)?.toLowerCase()}
                                </div>

                                {
                                    //opened?.deatilsOpened?.includes(elements?._id) &&
                                    <div className="details-conatiner">
                                        <div className="date-released" style={{ color: "black", backgroundColor: "white" }}>Released</div>
                                        <div className="date-released" style={{ marginBottom: "5px" }}> {CovertMonthNumbersToAlphabets(elements?.datereleased)}</div>
                                        <div className="date-released" style={{ color: `${"wheat"}` }}>Platforms</div>
                                        <div className="added-streaming-platforms">
                                            <section className="platforms">
                                                <div>{elements?.youtube !== "" && <Link onClick={(e) => { e.preventDefault(); window?.open(elements?.youtube, '_blank') }} to={""}><BsYoutube size={'15PX'} /></Link>}</div>

                                                <div>{elements?.audiomack !== "" && <Link to={""} onClick={(e) => { e.preventDefault(); window?.open(elements?.audiomack, '_blank') }}><SiAudiomack size={'15px'} /></Link>}</div>

                                                <div>{elements?.spotify !== "" && <Link to={""} onClick={(e) => { e.preventDefault(); window?.open(elements?.spotify, '_blank') }}><ImSpotify size={'15PX'} /></Link>}</div>

                                                <div>{elements?.applemusic !== "" && <Link to={""} onClick={(e) => { e.preventDefault(); window?.open(elements?.applemusic, '_blank') }}><FaItunesNote size={'15PX'} /></Link>}</div>

                                                <div>{elements?.soundcloud !== "" && <Link to={""} onClick={(e) => { e.preventDefault(); window?.open(elements?.soundcloud, '_blank') }}><ImSoundcloud size={'15PX'} /></Link>}</div>
                                            </section>
                                        </div>
                                    </div>}
                            </div>
                            <div className="options-container">
                                <div>
                                    {!opened?.optionsOpened.includes(elements?._id) && <button className="optionsBtn firstoptionsBtn" onClick={(e) => {
                                        e.preventDefault(); setBools((p) => { return { ...p, toggler: !bools?.search } });
                                        if (!opened?.optionsOpened?.includes(elements?._id)) {
                                            opened?.optionsOpened.push(elements?._id)
                                        }
                                    }}><SlOptions size={'20px'} style={{ position: "relative", left: "10px" }} /></button>}

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
                                        <Link to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/edit-audio:${elements?._id}`} className="edit">Edit</Link>
                                    </div>

                                    {/* {! opened?.deatilsOpened?.includes(elements?._id) &&<button onClick={(e)=>{e.preventDefault(); setBools((p)=>{return{...p, toggler : !bools?.search}}); 
                                    if( ! opened?.deatilsOpened?.includes(elements?._id) ){ opened?.deatilsOpened.push(elements?._id)}}} className="details">Details</button>} */}

                                    {/* {opened?.deatilsOpened?.includes(elements?._id) && <button onClick={(e)=>{e.preventDefault(); setBools((p)=>{return{...p, toggler : !bools?.search}}); 
                                   if(opened?.deatilsOpened?.includes(elements?._id)){ let filtered  = opened?.deatilsOpened?.filter(items=>{ return items !== elements?._id}); setOpened((p)=>{ return {...p, deatilsOpened : filtered}})}}} className="details">Hide details</button>} */}
                                    <button onClick={(e) => { e.preventDefault(); setSelectedAudio(elements); setBools(p => { return { showDeleteModal: true } }) }} className="delete">Delete</button>
                                </div>}
                            </div>
                        </div>)
                    })}</div>}
                </div>

                <div style={{ textAlign: "center", marginTop: "50px" }}>
                    {!bools.showloading && addedAudios?.filter(elements => {
                        if (searchInputRef?.current?.value) {
                            return elements?.headline?.toLowerCase()?.includes(searchInputRef?.current?.value?.toLowerCase())
                        } else return elements
                    })?.length === 0 && <span>No results found</span>}
                </div>
            </main>
        </>
    )
}

export default AddedAudios;