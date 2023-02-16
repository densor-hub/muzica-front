import axios from "axios";
import { useRef } from "react";
import { API_BASE_URL } from "../../Resources/BaseURL";
import GotoRefreshEndPoint from "../../FNS/GoToRefreshEndPoint";
import setStatuscodeErrorMessage from "../../FNS/setStatuscodeErrorMessage";
import Loading from "./loading";
import useAuth from "../../customHooks/useAuth";
import { useNavigate } from "react-router-dom";

import './add-news.css';

const AddNews = ({ setBools, bools, content, currentContent, setCurrentContent, setAddedNews, addedNews, setFeedback, submitted }) => {
    const themeColor = { valid: "white", error: "rgb(255, 71, 86)" }
    const { auth } = useAuth();
    const navigateTo = useNavigate();
    const inputRefs = useRef([]);
    const addToInputRefs = (element) => {
        if (element && !inputRefs.current.includes(element)) {
            inputRefs.current.push(element)
        }
        else {
            inputRefs.current.pop(element);
        }
    }

    const saveNews = async () => {
        const newsObject = { headline: inputRefs.current[0].value, details: inputRefs.current[1].value };
        setAddedNews(p => { return { ...p, heading: inputRefs.current[0].value, details: inputRefs.current[1].value } })
        let requiredButEmpty = false;

        inputRefs?.current.forEach(element => {
            if (element?.value === "") {
                element.style.borderBottom = `3px solid ${themeColor?.error}`;
                requiredButEmpty = true;
            }
            else {
                element.style.borderBottom = `3px solid ${themeColor?.valid}`
            }
        })

        if (requiredButEmpty) {
            setFeedback("Enter all fields")
        }
        else {

            try {
                setBools(p => { return { ...p, showloading: true } });
                let response = await axios.post(`${API_BASE_URL}/save-news`, newsObject, { withCredentials: true });

                if (response.status === 200) {
                    if (!submitted.includes(currentContent)) {
                        submitted?.push(currentContent)
                    }
                    setBools(p => { return { ...p, showloading: false, submitted: currentContent } });
                    setFeedback('Saved successfully');
                    setAddedNews("");
                    clearNews();
                }
            } catch (error) {
                if (!error?.response?.data) {
                    setBools(p => { return { ...p, showloading: false } });
                    setFeedback('Network error...')
                }
                else {
                    if (error?.response?.status === 401) {
                        GotoRefreshEndPoint(auth).then((r) => {
                            if (r.status === 200) {
                                saveNews();
                            } else {
                                navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/sign-out`);
                            }
                        })
                    }
                    else {
                        setStatuscodeErrorMessage(error?.response?.status, setFeedback)
                        setBools(p => { return { ...p, showloading: false } });
                    }
                }
            }
        }
    }


    const clearNews = () => {
        inputRefs.current.forEach((element) => {
            element.value = "";
            element.style.borderBottom = `3px solid ${themeColor?.valid}`;
        })
    }


    const Back = async () => {
        try {
            setBools(p => { return { ...p, showloading: true } });
            let response = await axios.post(`${API_BASE_URL}/current-content`, { content: content?.upcoming }, { withCredentials: true });

            if (response?.status === 200) {
                setBools(p => { return { ...p, showloading: false } });
                setFeedback("")
                setCurrentContent(content?.upcoming);
                if (bools?.submitted === currentContent) {
                    if (!submitted?.includes(currentContent)) {
                        submitted?.push(currentContent)
                    }
                }
            }
            else if (response?.status === 204) {
                setBools(p => { return { ...p, showloading: false } });
                setFeedback('Facing cahllenges, could not navigate')
            }
        } catch (error) {
            if (!error?.response?.data) {
                setBools(p => { return { ...p, showloading: false } });
                setFeedback('Network error...')
            }
            else {
                if (error?.response?.status === 401) {
                    GotoRefreshEndPoint(auth).then((r) => {
                        if (r.status === 200) {
                            Back();
                        } else {
                            navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/sign-out`);
                        }
                    })
                }
                else {
                    setBools(p => { return { ...p, showloading: false } });
                    setStatuscodeErrorMessage(error?.response?.status, setFeedback)
                    setBools(p => { return { ...p, showloading: false } });
                }
            }
        }
    }

    const Next = async () => {
        try {
            setBools(p => { return { ...p, showloading: true } });
            let response = await axios.post(`${API_BASE_URL}/current-content`, { content: content?.biography }, { withCredentials: true });

            if (response?.status === 200) {
                setBools(p => { return { ...p, showloading: false } });
                setFeedback("");
                setCurrentContent(content?.biography)
            }
            else if (response?.status === 204) {
                setBools(p => { return { ...p, showloading: false } });
                setFeedback('Facing cahllenges, could not navigate')
            }
        } catch (error) {
            if (!error?.response?.data) {
                setBools(p => { return { ...p, showloading: false } });
                setFeedback('Network error...')
            }
            else {
                if (error?.response?.status === 401) {
                    GotoRefreshEndPoint(auth).then((r) => {
                        if (r.status === 200) {
                            Next();
                        } else {
                            navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/sign-out`);
                        }
                    })
                }
                else {
                    setBools(p => { return { ...p, showloading: false } });
                    setStatuscodeErrorMessage(error?.response?.status, setFeedback)
                    setBools(p => { return { ...p, showloading: false } });
                }
            }
        }

    }

    return (
        <>
            {bools?.showloading && <Loading />}
            {currentContent === content.news &&
                <main style={bools?.showloading ? { height: "0px", width: "0px", overflow: "hidden", opacity: "0" } : {}}>

                    <section className="add-news" >
                        <form>
                            <table>
                                <tbody>
                                    <tr>
                                        <td className="label"><label>Headline</label><span>*</span></td>
                                        <td><input type={'text'} ref={addToInputRefs} defaultValue={addedNews.heading} placeholder={'News headline'}></input></td>
                                    </tr>

                                    <tr>
                                        <td className="label"><label>Details</label> <span>*</span></td>
                                        <td><textarea ref={addToInputRefs} defaultValue={addedNews.details} placeholder={'Description'}></textarea></td>
                                    </tr>

                                    <tr style={{ textAlign: "center" }}>
                                        <td><button onClick={(e) => { e.preventDefault(); saveNews(); }}>Save</button></td>
                                        <td><button onClick={(e) => { e.preventDefault(); clearNews() }}>Cancel</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </section>

                    <div className="next-skip-back-buttons">
                        <button onClick={(e) => { e.preventDefault(); Back() }}>Back to upcoming</button>

                        {submitted?.length > 0 && submitted.includes(currentContent) && <button type="submit" onClick={(e) => { e.preventDefault(); Next() }}>Next</button>}
                    </div>
                </main>}

        </>
    )
}

export default AddNews;