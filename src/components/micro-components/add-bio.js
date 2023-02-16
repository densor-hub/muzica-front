import { useRef } from "react";
import { API_BASE_URL } from '../../Resources/BaseURL';
import GotoRefreshEndPoint from '../../FNS/GoToRefreshEndPoint';
import Loading from './loading';
import setStatuscodeErrorMessage from '../../FNS/setStatuscodeErrorMessage';
import useAuth from '../../customHooks/useAuth';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBiograpgy = ({ setBools, bools, content, currentContent, setCurrentContent, setAddedBio, addedBio, setFeedback, submitted, setSubmitted }) => {
    const { auth } = useAuth();
    const navigateTo = useNavigate();
    const themeColrs = { error: "rgb(255, 71, 86)", valid: 'white' }

    const inputRefs = useRef([]);
    const addToInputRefs = (element) => {
        if (element && !inputRefs.current.includes(element)) {
            inputRefs.current.push(element)
        }
        else {
            inputRefs.current.pop(element);
        }
    }

    const saveBio = async () => {
        inputRefs.current[0].style.borderBottom = `3px solid ${themeColrs?.error}`;
        setAddedBio(inputRefs.current[0].value);

        const bioObject = { biography: inputRefs.current[0]?.value }

        if (inputRefs.current[0].value === "") {
            setFeedback("Enter all fields");
        }
        else {
            if (inputRefs.current[0]?.value?.length < 100) {
                setFeedback('Enter at least 100 characters')
            } else {
                inputRefs.current[0].style.borderBottom = `3px solid ${themeColrs?.valid}`;
                setBools(p => { return { ...p, showloading: true } });

                try {
                    let response = await axios.post(`${API_BASE_URL}/save-biography`, bioObject, { withCredentials: true });
                    if (response?.status === 200) {

                        if (!submitted.includes(currentContent)) {
                            submitted?.push(currentContent)
                        }
                        inputRefs.current?.forEach(element => { element.value = "" });
                        setAddedBio("")
                        setBools(p => { return { ...p, showloading: false, submitted: currentContent } });


                        setFeedback("Added successfully")
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
                                    saveBio();
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
    }

    const clearBio = () => {
        inputRefs.current[0].value = "";
        inputRefs.current[0].style.borderBottom = `3px solid ${themeColrs?.valid}`;
    }




    const Back = async () => {
        try {
            setBools(p => { return { ...p, showloading: true } });
            let response = await axios.post(`${API_BASE_URL}/current-content`, { content: content?.news }, { withCredentials: true });

            if (response?.status === 200) {
                setBools(p => { return { ...p, showloading: false } });
                setFeedback("");
                setCurrentContent(content?.news);
                if (bools?.submitted === currentContent) {
                    if (!submitted?.includes(currentContent)) {
                        submitted?.push(currentContent)
                    }
                }
            }
            else if (response?.status === 204) {
                setBools(p => { return { ...p, showloading: false } });
                setCurrentContent(content?.news);
                //setFeedback('Facing cahllenges, could not navigate')
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
            let response = await axios.post(`${API_BASE_URL}/current-content`, { content: content?.socials }, { withCredentials: true });

            if (response?.status === 200) {
                setBools(p => { return { ...p, showloading: false } });
                setFeedback("");
                setCurrentContent(content?.socials)

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
            {currentContent === content.biography &&
                <main style={bools.showloading ? { height: "0PX", width: "0px", overflow: "hidden", opacity: "0" } : {}}>
                    <section className="add-news">
                        <form>
                            <table>
                                <tbody>
                                    <tr>
                                        <td className="label"><label>Biography</label> <span>*</span></td>
                                        <td><textarea ref={addToInputRefs} defaultValue={addedBio}></textarea></td>
                                    </tr>

                                    <tr>
                                        <td><button onClick={(e) => { e.preventDefault(); saveBio() }}>Save</button></td>
                                        <td><button onClick={(e) => { e.preventDefault(); clearBio() }}>Cancel</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </section>

                    <div className="next-skip-back-buttons">
                        <button onClick={(e) => { e.preventDefault(); Back() }}>Back to upcoming</button>

                        {(submitted?.length > 0 && submitted.includes(currentContent)) && <button type="submit" onClick={(e) => { e.preventDefault(); Next() }}>Next</button>}
                    </div>
                </main>
            }
        </>
    )
}
export default AddBiograpgy;