import { useRef, useState } from "react";
import { API_BASE_URL } from '../../../Resources/BaseURL';
import GotoRefreshEndPoint from '../../../FNS/GoToRefreshEndPoint';
import Loading from "../../micro-components/loading";
import setStatuscodeErrorMessage from '../../../FNS/setStatuscodeErrorMessage';
import useAuth from '../../../customHooks/useAuth';
import axios from "axios";
import { useNavigate } from "react-router-dom";

import '../../micro-components/add-news.css';
import '../CSS/added.css';

const AddBiograpgy = () => {
    const { auth } = useAuth();
    const navigateTo = useNavigate();
    const themeColrs = { error: "rgb(255, 71, 86)", valid: 'white' }
    const [bools, setBools] = useState({ showloading: false });
    const [feedback, setFeedback] = useState('')
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
        const bioObject = { biography: inputRefs.current[0]?.value, not_current_content: true }

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
                        navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-biography`)
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

    return (
        <>
            {bools?.showloading && <Loading />}
            {
                <main style={bools.showloading ? { height: "0PX", width: "0px", overflow: "hidden", opacity: "0" } : {}}>
                    <div className="feedback-container" style={!feedback ? { backgroundColor: "transparent" } : {}}>
                        <div className="feeback">{feedback}<span style={{ visibility: "hidden" }}>.</span></div>
                    </div>

                    <section className="add-news">
                        <form>
                            <table>
                                <tbody>
                                    <tr>
                                        <td className="label"><label>Biography</label> <span>*</span></td>
                                        <td><textarea ref={addToInputRefs}></textarea></td>
                                    </tr>

                                    <tr>
                                        <td><button onClick={(e) => { e.preventDefault(); saveBio() }}>Save</button></td>
                                        <td><button onClick={(e) => { e.preventDefault(); navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-biography`) }}>Cancel</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </section>
                </main>
            }
        </>
    )
}
export default AddBiograpgy;