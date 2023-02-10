import axios from "axios";
import { useState, useEffect, useRef, useCallback } from "react";
import GotoRefreshEndPoint from "../../FNS/GoToRefreshEndPoint";
import { API_BASE_URL } from "../../Resources/BaseURL";
import useAuth from "../../customHooks/useAuth";
import setStatuscodeErrorMessage from "../../FNS/setStatuscodeErrorMessage";
import Loading from "../micro-components/loading";
import { Link, useNavigate } from "react-router-dom";
import DeleteNews from "./Modals/delete-news-modal";



import './CSS/added-news.css'


const AddedNews = () => {

    const { auth } = useAuth();
    const navigateTo = useNavigate();
    const [addedNews, setAddedNews] = useState([]);
    const [feedback, setFeedback] = useState("")
    const [bools, setBools] = useState({ showloading: false, readMoreDetails: false, toggler: false, showDeleteModal: false });
    const [opened, setOpened] = useState({ optionsOpened: [], deatilsOpened: [] });
    const searchInputRef = useRef();
    const [selectedNews, setSelectedNews] = useState([])

    const getData = useCallback(
        async () => {
            setBools(p => { return { ...p, showloading: true } });

            try {
                let response = await axios.get(`${API_BASE_URL}/get-added-news`, { withCredentials: true });

                if (response?.status === 200) {
                    setAddedNews(response?.data?.addedItems);
                    setBools(p => { return { ...p, showloading: false } });
                }
                else if (response?.status === 204) {
                    setAddedNews([]);
                    setBools(p => { return { ...p, showloading: false } });
                    setFeedback('No news found...')
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
    }, [getData])

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
            {bools?.showDeleteModal && <DeleteNews getData={getData} selectedNews={selectedNews} setBools={setBools} feedback={feedback} setFeedback={setFeedback} />}
            {bools?.showloading && <Loading />}
            <main className="added-news" style={{ paddingTop: "40px" }}>
                <div className="page-heading" >ADDED <i><b>NEWS</b></i></div>


                <div className="feedback-container" style={!feedback ? { backgroundColor: "transparent" } : {}}>
                    <div className="feeback">{!bools?.showDeleteModal && feedback}</div>
                </div>

                <section className="search-item">
                    <input ref={searchInputRef} placeholder={'Enter news headline to search'} onChange={() => { setBools((p) => { return { ...p, toggler: !bools?.search } }) }}></input>
                </section>

                <div className="add-new-button-container" style={{ textAlign: "center" }}>
                    {auth?.websiteCreated ? <Link to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/add-news`}>Add new</Link> : <Link to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/createwebsite`}>Create website</Link>}
                </div>

                <section className="fornews" style={addedNews?.filter(elements => {
                    if (searchInputRef?.current?.value) {
                        return elements?.headline?.toLowerCase()?.includes(searchInputRef?.current?.value?.toLowerCase())
                    } else return elements
                })?.length === 0 ? { padding: "0px", width: "70vw", borderBottom: "0px", overflow: "hidden" } : {}}>
                    {addedNews?.length > 0 && addedNews?.sort((a, b) => { return (new Date(b?.date) - new Date(a?.date)) })
                        .filter(elements => {
                            if (searchInputRef?.current?.value) {
                                return elements?.headline?.toLowerCase()?.includes(searchInputRef?.current?.value?.toLowerCase())
                            } else return elements
                        })
                        .map((elements) => {

                            return (
                                <div key={elements?._id} className="indivial-item" style={addedNews?.length < 2 ? { width: "70vw" } : {}}>
                                    <div className="item" style={addedNews?.length < 2 ? { width: "100%" } : {}}>
                                        <div className="headline">{elements?.headline?.toUpperCase()}</div>
                                        {String(opened?.deatilsOpened[0]) !== String(elements?._id) && <div>{elements?.details[0]?.toUpperCase() + elements?.details?.slice(1, 150)?.toLowerCase()} {elements?.details?.length > 150 && <i className="read-more" onClick={() => {
                                            if (opened?.deatilsOpened?.length > 0) {
                                                opened.deatilsOpened = []
                                            }
                                            opened?.deatilsOpened?.push(elements?._id);
                                            setBools(p => { return { ...p, toggler: !bools?.toggler } })
                                        }}> ...read more</i>}</div>}

                                        {String(opened?.deatilsOpened[0]) === String(elements?._id) &&
                                            <div>{elements?.details[0]?.toUpperCase() + elements?.details?.slice(1, elements?.details?.length)?.toLowerCase()}  <i className="fold-up" onClick={() => {
                                                opened.deatilsOpened = [];
                                                setBools(p => { return { ...p, toggler: !bools?.toggler } })

                                                //retdundunt--- line below
                                                setOpened(p => { return { ...p, deatilsOpened: [] } })
                                            }}>fold up</i></div>}
                                    </div>

                                    <div className="options-container">
                                        {/* <div>
                                            {! opened?.optionsOpened.includes(elements?._id)  &&<button className="optionsBtn" onClick={(e)=>{e.preventDefault(); setBools((p)=>{return{...p, toggler : !bools?.search}}); 
                                            if(! opened?.optionsOpened?.includes(elements?._id)){
                                            opened?.optionsOpened.push(elements?._id)
                                        }}}>I</button>}

                                        {opened?.optionsOpened.includes(elements?._id) && <button className="optionsBtn" onClick={(e)=>{e.preventDefault();setBools((p)=>{return{...p, toggler : !bools?.search}});  
                                        if( opened?.optionsOpened?.includes(elements?._id)){
                                            let filtered = opened?.optionsOpened?.filter(items=>{ return items !== elements?._id });
                                            setOpened(p=>{ return{...p, optionsOpened: filtered}});
                                        }}}>X</button>}
                                        </div> */}
                                        {//opened?.optionsOpened?.includes(elements?._id) && 
                                            <div className="options">
                                                <Link to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/edit-news:${elements?._id}`} className="edit">Edit</Link>

                                                <button onClick={(e) => { e.preventDefault(); setSelectedNews(elements); setBools(p => { return { showDeleteModal: true } }) }} className="delete">Delete</button>
                                            </div>}
                                    </div>
                                </div>
                            )
                        })}
                </section>

                <div style={{ textAlign: "center", marginTop: "50px" }}>
                    {!bools?.showloading && addedNews?.filter(elements => {
                        if (searchInputRef?.current?.value) {
                            return elements?.headline?.toLowerCase()?.includes(searchInputRef?.current?.value?.toLowerCase())
                        } else return elements
                    })?.length === 0 && <span>No results found</span>}
                </div>



            </main>
        </>
    )
}

export default AddedNews;