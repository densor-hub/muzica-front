import axios from "axios";
import { useState, useEffect, useCallback, useRef } from "react";
import GotoRefreshEndPoint from "../../FNS/GoToRefreshEndPoint";
import { API_BASE_URL } from "../../Resources/BaseURL";
import useAuth from "../../customHooks/useAuth";
import setStatuscodeErrorMessage from "../../FNS/setStatuscodeErrorMessage";
import Loading from "../micro-components/loading";
import { Link, useNavigate } from "react-router-dom";
import DeleteUpcomingModal from "./sub-components/delete-upcoming-modal";
import { SlOptions } from 'react-icons/sl';
import { equal_To_Or_Bigger_Than_Toadys_Date, isValidDate } from "../../FNS/DurationValidator";


import { CovertMonthNumbersToAlphabets } from "../../FNS/MonthNumberToAlphabets";

import './CSS/added.css';
import './CSS/added-upcoming.css'


const AddedUpcoming = () => {

    const { auth } = useAuth();
    const upcoming = ['New release', 'Tour', 'Event'];
    const navigateTo = useNavigate();

    const [addedUpcoming, setAddedUpcoming] = useState([]);
    const [feedback, setFeedback] = useState("")
    const [bools, setBools] = useState({ showloading: false, showDeleteModal: false })
    const [opened, setOpened] = useState({ optionsOpened: [], deatilsOpened: [] });
    const [selectedUpcoming, setSelectedUpcoming] = useState('');
    const searchInputRef = useRef();

    const getData = useCallback(
        async () => {
            setBools(p => { return { ...p, showloading: true } });

            try {
                let response = await axios.get(`${API_BASE_URL}/get-added-upcoming`, { withCredentials: true });
                if (response?.status === 200) {
                    setAddedUpcoming(response?.data?.addedItems);
                    setBools(p => { return { ...p, showloading: false } });
                }
                else if (response?.status === 204) {
                    setAddedUpcoming([]);
                    setBools(p => { return { ...p, showloading: false } });
                    setFeedback('No upcoming stuff found...')
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
                                navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/sign-out`)
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
            {bools?.showDeleteModal && <DeleteUpcomingModal getData={getData} selectedUpcoming={selectedUpcoming} setBools={setBools} feedback={feedback} setFeedback={setFeedback} />}
            {bools?.showloading && <Loading />}
            <main className="addeed-upcoming" style={{ paddingTop: "40px" }}>
                <div className="page-heading" >ADDED <i><b>UPCOMING</b></i></div>

                <div className="feedback-container" style={!feedback ? { backgroundColor: "transparent" } : {}}>
                    <div className="feeback">{!bools?.showDeleteModal && feedback}</div>
                </div>

                <section className="search-item">
                    <input ref={searchInputRef} placeholder={'Enter "title / venue / location" to search'} onChange={() => { setBools((p) => { return { ...p, toggler: !bools?.search } }) }}></input>
                </section>

                <div className="add-new-button-container" style={{ textAlign: "center" }}>
                    {auth?.websiteCreated ? <Link to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/add-upcoming`}>Add new</Link> : <Link to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/createwebsite`}>Create website</Link>}
                </div>

                <section className="list-of-individual-items" style={addedUpcoming?.filter(elements => {
                    if (searchInputRef?.current?.value) {
                        return elements?.specifics?.toLowerCase()?.includes(searchInputRef?.current?.value?.toLowerCase())
                    } else return elements
                })?.length === 0 ? { padding: '0px', width: "70vw" } : {}}>
                    {addedUpcoming?.length > 0 && addedUpcoming?.filter((elements) => {
                        if (searchInputRef?.current?.value !== null && searchInputRef?.current?.value !== "" && searchInputRef?.current?.value !== undefined) {
                            return elements?.specifics?.toLowerCase().includes(searchInputRef?.current?.value?.toLowerCase()) && isValidDate(elements?.date) && equal_To_Or_Bigger_Than_Toadys_Date(elements?.date)
                        }
                        else {
                            return isValidDate(elements?.date) && equal_To_Or_Bigger_Than_Toadys_Date(elements?.date)
                        }
                    })
                        .sort((a, b) => { return (new Date(a?.date) - new Date(b?.date)) }).map((elements) => {
                            return (
                                <div key={elements?._id} className="indivial-item for-upcoming">
                                    <div className="items">
                                        <div className="type" >{elements?.type}</div>
                                        <div className="date">{CovertMonthNumbersToAlphabets(elements?.date)}</div>

                                        <div style={{ marginTop: "10px" }}> <i>{
                                            elements?.type === upcoming[0] ? <span style={{ textAlign: "center", color: "wheat" }}>{"Title"}</span> :
                                                elements?.type === upcoming[1] ? <span style={{ textAlign: "center", color: "wheat" }}>{"Location"}</span> :
                                                    elements?.type === upcoming[2] ? <span style={{ textAlign: "center", color: "wheat" }}>{'Venue'}</span> : ""
                                        }</i></div>
                                        <div className="specifics">{elements?.specifics}</div>

                                        <div style={{ marginTop: "10px" }} ><i style={{ textAlign: "center", color: "wheat" }}>Details</i></div>
                                        <div className="description" style={{ marginBottom: '10px' }}>{elements?.description}</div>
                                    </div>

                                    <div className="options-container">
                                        <div>
                                            {!opened?.optionsOpened.includes(elements?._id) && <button className="optionsBtn firstoptionsBtn" onClick={(e) => {
                                                e.preventDefault(); setBools((p) => { return { ...p, toggler: !bools?.search } });
                                                if (!opened?.optionsOpened?.includes(elements?._id)) {
                                                    opened?.optionsOpened.push(elements?._id)
                                                }
                                            }}><SlOptions size={'20px'} /></button>}

                                            {opened?.optionsOpened.includes(elements?._id) && <button className="optionsBtn cancelBtn" onClick={(e) => {
                                                e.preventDefault(); setBools((p) => { return { ...p, toggler: !bools?.search } });
                                                if (opened?.optionsOpened?.includes(elements?._id)) {
                                                    let filtered = opened?.optionsOpened?.filter(items => { return items !== elements?._id });
                                                    setOpened(p => { return { ...p, optionsOpened: filtered } });
                                                }
                                            }}><b>X</b></button>}
                                        </div>
                                        {opened?.optionsOpened?.includes(elements?._id) && <div className="options">
                                            <div>
                                                <Link to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/edit-upcoming:${elements?._id}`} className="edit">Edit</Link>
                                            </div>

                                            {opened?.deatilsOpened?.includes(elements?._id) && <button onClick={(e) => {
                                                e.preventDefault(); setBools((p) => { return { ...p, toggler: !bools?.search } });
                                                if (opened?.deatilsOpened?.includes(elements?._id)) { let filtered = opened?.deatilsOpened?.filter(items => { return items !== elements?._id }); setOpened((p) => { return { ...p, deatilsOpened: filtered } }) }
                                            }} className="details">Hide details</button>}
                                            <button onClick={(e) => { e.preventDefault(); setSelectedUpcoming(elements); setBools(p => { return { showDeleteModal: true } }) }} className="delete">Delete</button>
                                        </div>}
                                    </div>
                                </div>
                            )
                        })}
                </section>

                <div style={{ textAlign: "center", marginTop: "50px" }}>
                    {!bools?.showloading && addedUpcoming?.filter(elements => {
                        if (searchInputRef?.current?.value) {
                            return elements?.specifics?.toLowerCase()?.includes(searchInputRef?.current?.value?.toLowerCase())
                        } else return elements
                    })?.length === 0 && <span>No results found</span>}
                </div>



            </main>
        </>
    )
}

export default AddedUpcoming;