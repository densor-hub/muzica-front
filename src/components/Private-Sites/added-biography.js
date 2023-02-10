import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import GotoRefreshEndPoint from "../../FNS/GoToRefreshEndPoint";
import { API_BASE_URL } from "../../Resources/BaseURL";
import useAuth from "../../customHooks/useAuth";
import setStatuscodeErrorMessage from "../../FNS/setStatuscodeErrorMessage";
import Loading from "../micro-components/loading";
import { Link, useNavigate } from "react-router-dom";

import './CSS/added.css';
import './CSS/added-biography.css'



const AddedBiography = () => {

    const { auth } = useAuth();
    const navigateTo = useNavigate();
    const [addedBiography, setAddedBiography] = useState([]);
    const [feedback, setFeedback] = useState("")
    const [bools, setBools] = useState({ showloading: false })
    const [readMoreOpened, setReadMoreOpen] = useState([]);

    const getData = useCallback(
        async () => {
            setBools(p => { return { ...p, showloading: true } });

            try {
                let response = await axios.get(`${API_BASE_URL}/get-added-biography`, { withCredentials: true });
                if (response?.status === 200) {
                    setAddedBiography(response?.data?.addedItems);
                    setBools(p => { return { ...p, showloading: false } });
                }
                else if (response?.status === 204) {
                    setAddedBiography([]);
                    setBools(p => { return { ...p, showloading: false } });
                    setFeedback('No bio found...')
                }
            } catch (error) {
                if (!error?.response?.data) {
                    setFeedback('Network challenges...')
                }
                else {
                    if (error?.response?.status === 401) {
                        GotoRefreshEndPoint(auth).then((results) => {
                            if (results?.status === 200) {
                                getData();
                            }
                            else {
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
            {bools?.showloading && <Loading />}
            <main className="" style={{ paddingTop: "40px" }}>
                <div className="page-heading" >ADDED <i><b>BIO</b></i></div>
                <div className="feedback-container" style={!feedback ? { backgroundColor: "transparent" } : {}}>
                    <div className="feeback">{!bools?.showDeleteModal && feedback}</div>
                </div>

                <div style={{ textAlign: "center", marginBottom: "10px" }}>{addedBiography?.length === 0 && <Link to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/createwebsite`}>Create website</Link>}</div>

                <div className="biography-container" style={addedBiography?.length === 0 ? { backgroundColor: "transparent", borderTop: "2px solid white", overflow: 'hidden', borderRadius: "0PX", borderLeft: "0px", borderBottom: "0px", borderRight: "0px" } : { overflow: "hidden" }}>
                    {addedBiography?.map(element => {
                        return <div key={element?._id}>
                            {readMoreOpened[0] !== element?._id && <div>
                                {element?.biography[0]?.toUpperCase() + element?.biography?.slice(1, 500)?.toLowerCase()}
                                <i className="read-more" onClick={() => {
                                    if (readMoreOpened?.length > 0) {
                                        setReadMoreOpen([]);
                                    }
                                    setReadMoreOpen([element?._id])
                                }}> ...read more</i>
                            </div>}

                            {readMoreOpened[0] === element?._id && <div>
                                {element?.biography[0]?.toUpperCase() + element?.biography?.slice(1, element?.biography?.length)?.toLowerCase()}
                                <i className="fold-up" onClick={() => { setReadMoreOpen([]) }}> fold up</i>
                            </div>}
                        </div>
                    })}


                </div>

                {addedBiography?.length > 0 ? <div style={{ textAlign: 'center', color: "black", marginTop: "30px" }}><button onClick={() => { navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/edit-biography:${addedBiography[0]?._id}`) }} style={{ textDecoration: "none", textAlign: 'center', color: "black", padding: "5px" }}>Edit</button></div> :

                    !bools?.showloading && <div style={{ textAlign: "center" }}>No results found</div>}

            </main>
        </>
    )
}

export default AddedBiography;