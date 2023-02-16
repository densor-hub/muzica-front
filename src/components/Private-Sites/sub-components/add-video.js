import useAuth from "../../../customHooks/useAuth";
import axios from "axios";
import GotoRefreshEndPoint from "../../../FNS/GoToRefreshEndPoint";
import setStatuscodeErrorMessage from "../../../FNS/setStatuscodeErrorMessage";
import { API_BASE_URL } from "../../../Resources/BaseURL";
import { useNavigate } from "react-router-dom";
import Loading from "../../micro-components/loading";
import { useState } from "react";
import { isValidDate } from "../../../FNS/DurationValidator";

import '../../micro-components/add-videos.css';
import '../CSS/added.css';

const AddVideo = () => {
    const themeColrs = { error: "rgb(255, 71, 86)", valid: 'white' };
    const { auth } = useAuth();
    const navigateTo = useNavigate();
    const VideoRefs = [];
    const addToVideoRefs = (element) => {
        if (element && !VideoRefs.includes(element)) {
            VideoRefs.push(element)
        }
    }
    const [feedback, setFeedback] = useState("");
    const [bools, setBools] = useState({ showloading: false });



    const addVideo = async () => {

        let requiredButEmptyFields = 0;
        let invalidLinkProvided = 0;
        let invalidDate = false;
        let submitedVideo = { title: VideoRefs[0].value, link: VideoRefs[1].value, not_current_content: true, dateReleased: VideoRefs[2]?.value };

        VideoRefs.forEach((element) => {
            element.style.borderBottom = `3px solid ${themeColrs?.valid}`;
            if (element?.className === 'link') {
                if (element?.value !== "") {
                    if (element?.value?.startsWith('https://') && ((new URL(element?.value?.trim())?.origin?.toLowerCase().endsWith(element?.id?.toLowerCase() + ".com"))
                        || (new URL(element?.value)?.origin.endsWith((element?.id?.toLowerCase()?.slice(0, 5) + '.' + element?.id?.trim().slice(5, 8))?.trim())))) {
                        element.style.borderBottom = `3px solid ${themeColrs.valid}`;

                        try {
                            new URL(element?.value);
                        } catch (error) {
                            invalidLinkProvided = invalidLinkProvided + 1;
                            element.style.borderBottom = `3px solid ${themeColrs.error}`;
                            setFeedback(`Invalid ${element?.id} URL proovided`);
                        }
                    }
                    else {
                        invalidLinkProvided = invalidLinkProvided + 1;
                        element.style.borderBottom = `3px solid ${themeColrs?.error}`;
                        setFeedback(`Invalid ${element?.id} URL proovided`);
                    }


                }
            }

            if (element?.type === 'date' || element?.id === 'date' || element?.className === 'date') {
                if (new Date(`${element?.value}`) === 'Invalid Date' || !isValidDate(element?.value)) {
                    invalidDate = true;
                    element.style.borderBottom = `3px solid ${themeColrs?.error}`
                    setFeedback('Invalid date')
                }
                else {
                    element.style.borderBottom = `3px solid ${themeColrs?.valid}`
                }
            }



            if (element?.value === "") {
                setFeedback('Enter all fields');
                requiredButEmptyFields = requiredButEmptyFields + 1;
                element.style.borderBottom = `3px solid ${themeColrs?.error}`;
            }
        })

        if (requiredButEmptyFields === 0 && invalidLinkProvided === 0 && invalidDate === false) {


            setBools(p => { return { ...p, showloading: true } });

            try {
                let response = await axios.post(`${API_BASE_URL}/save-video`, submitedVideo, { withCredentials: true });
                if (response?.status === 200) {
                    //VideoRefs.forEach(element=>{ element.value = ""});
                    //setBools(p=>{return {...p, showloading : false}});
                    //  setFeedback("Saved successfully..redirecting")

                    //setTimeout(() => {
                    //  setFeedback('');
                    navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-videos`);
                    //}, 2000);
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
                                addVideo();
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


    // const cancelOperation=()=>{
    //     VideoRefs.forEach(element=>{
    //         element.value="";
    //         element.style.borderBottom = `3px solid ${themeColrs?.valid}`;
    //         setFeedback("")
    //     })
    // }

    return (
        <>
            {bools?.showloading && <Loading />}
            <main >


                <div className="feedback-container" style={!feedback ? { backgroundColor: "transparent" } : {}}>
                    <div className="feedback">
                        <span style={{ visibility: "hidden" }}>.</span>{feedback}</div>
                </div>

                <div className="page-heading">ADDED NEW <i><b>VIDEO</b></i></div>

                <section className="add-videos">

                    <form>
                        <table>
                            <tbody>
                                <tr>
                                    <td className="req"><label>Title</label> <span>*</span></td>
                                    <td><input ref={addToVideoRefs} placeholder="Title"></input></td>
                                </tr>
                                <tr>
                                    <td className="req"><label>YouTube link</label> <span>*</span></td>
                                    <td><input ref={addToVideoRefs} id="youtube" className={'link'} placeholder="YouTube link"></input></td>
                                </tr>
                                <tr>
                                    <td className="req"><label>Date released</label> <span>*</span></td>
                                    <td><input ref={addToVideoRefs} type={'date'} id={'date'} placeholder="YYYY-MM-DD"></input></td>
                                </tr>
                                <tr style={{ textAlign: "center" }}>
                                    <td><button onClick={(e) => { e.preventDefault(); addVideo() }}>Save</button></td>
                                    <td><button onClick={(e) => { e.preventDefault(); navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-videos`) }}>Cancel</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </section>
            </main>
        </>
    )
}
export default AddVideo;