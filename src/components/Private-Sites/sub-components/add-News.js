import axios from "axios";
import { useRef, useState } from "react";
import { API_BASE_URL } from "../../../Resources/BaseURL";
import GotoRefreshEndPoint from "../../../FNS/GoToRefreshEndPoint";
import setStatuscodeErrorMessage from "../../../FNS/setStatuscodeErrorMessage";
import useAuth from "../../../customHooks/useAuth";
import Loading from "../../micro-components/loading";
import { useNavigate } from "react-router-dom";

import '../../micro-components/add-news.css';
import '../CSS/added.css';

const AddNews = () => {
    const themeColor = { valid: "white", error: "rgb(255, 71, 86)" }
    const { auth } = useAuth();
    const navigateTo = useNavigate();
    const [bools, setBools] = useState({ showloading: false });
    const [feedback, setFeedback] = useState('');
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
        const newsObject = { headline: inputRefs.current[0].value, details: inputRefs.current[1].value, not_current_content: true };
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
            setBools(p => { return { ...p, showloading: true } });

            try {
                let response = await axios.post(`${API_BASE_URL}/save-news`, newsObject, { withCredentials: true });

                if (response.status === 200) {
                    // setBools(p=>{return {...p, showloading : false}});
                    // setFeedback('Saved successfully, redirecting...');
                    // clearNews();
                    // setTimeout(()=>{
                    navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-news`)
                    //},2000)
                }
            } catch (error) {
                if (!error?.response?.data) {
                    console.log(error);
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


    return (
        <>
            {bools?.showloading && <Loading />}
            {
                <main >

                    <div className="feedback-container" style={!feedback ? { backgroundColor: "transparent" } : {}}>
                        <div className="feeback"> <span style={{ visibility: "hidden" }}>.</span>{!bools?.showDeleteModal && feedback}</div>
                    </div>

                    <div className="page-heading">ADD <i><b>NEWS</b></i></div>



                    <section className="add-news" >
                        <form>
                            <table>
                                <tbody>
                                    <tr>
                                        <td className="label"><label>Headline</label><span>*</span></td>
                                        <td><input type={'text'} ref={addToInputRefs} placeholder={'News headline'}></input></td>
                                    </tr>

                                    <tr>
                                        <td className="label"><label>Details</label> <span>*</span></td>
                                        <td><textarea ref={addToInputRefs} placeholder={'Description'}></textarea></td>
                                    </tr>

                                    <tr style={{ textAlign: "center" }}>
                                        <td><button onClick={(e) => { e.preventDefault(); saveNews(); }}>Save</button></td>
                                        <td><button onClick={(e) => { e.preventDefault(); navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-news`) }}>Cancel</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </section>

                </main>}

        </>
    )
}

export default AddNews;