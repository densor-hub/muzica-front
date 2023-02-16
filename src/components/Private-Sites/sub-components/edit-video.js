import { useState, useCallback, useEffect, useMemo } from "react";
import useAuth from "../../../customHooks/useAuth";
import axios from "axios";
import GotoRefreshEndPoint from "../../../FNS/GoToRefreshEndPoint";
import setStatuscodeErrorMessage from "../../../FNS/setStatuscodeErrorMessage";
import { API_BASE_URL } from "../../../Resources/BaseURL";
import { useNavigate } from "react-router-dom";
import Loading from "../../micro-components/loading";
import { isValidDate } from "../../../FNS/DurationValidator";


import '../../micro-components/add-videos.css';
import '../CSS/added.css'

const EditVideo = () => {
    const themeColrs = { error: "rgb(255, 71, 86)", valid: 'white' };
    const { auth } = useAuth();
    const navigateTo = useNavigate();
    const VideoRefs = useMemo(() => { return [] }, []);
    const addToVideoRefs = (element) => {
        if (element && !VideoRefs.includes(element)) {
            VideoRefs.push(element)
        }
    }
    const [feedback, setFeedback] = useState("");
    const [selectedVideo, setselectedVideo] = useState("");
    const [bools, setBools] = useState({ showloading: false });

    const getSelectedItem = useCallback(
        async () => {
            setBools(p => { return { ...p, showloading: true } })
            try {
                let response = await axios.get(`${API_BASE_URL}/get-videos:${window.location.pathname?.split(':')[1]}`, { withCredentials: true });

                console.log(response);
                if (response?.status === 200) {
                    setBools(p => { return { ...p, showloading: false } })
                    setselectedVideo(response?.data?.results);
                }

            } catch (error) {
                console.log(error);
                if (!error?.response?.data) {
                    setBools(p => { return { ...p, showloading: false } })
                    setFeedback('Network challenges...')
                }
                else {
                    if (error?.response?.status === 401) {
                        GotoRefreshEndPoint(auth).then((r) => {
                            if (r.status === 200) {
                                getSelectedItem();
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
        getSelectedItem();
    }, [getSelectedItem])

    const editVideo = useCallback(async () => {

        let requiredButEmptyFields = 0;
        let invalidLinkProvided = 0;
        let invalidDate = false;
        let submitedVideo = { title: VideoRefs[0].value, link: VideoRefs[1].value, dateReleased: VideoRefs[2]?.value };

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

            if (element?.type === 'date' || element?.id === 'date') {
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
                let response = await axios.patch(`${API_BASE_URL}/update-videos:${selectedVideo?._id}`, submitedVideo, { withCredentials: true });
                if (response?.status === 200) {
                    // VideoRefs.forEach(element=>{ element.value = ""});
                    // setBools(p=>{return {...p, showloading : false}});
                    // setFeedback("Saved successfully..redirecting")

                    // setTimeout(() => {
                    //     setFeedback('');
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
                                editVideo();
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
    }, [VideoRefs, auth, navigateTo, selectedVideo?._id, themeColrs?.error, themeColrs?.valid])


    // const cancelOperation=()=>{
    //     VideoRefs.forEach(element=>{
    //         element.value="";
    //     })
    // }

    return (
        <>
            {bools?.showloading && <Loading />}
            {selectedVideo !== "" && <main>


                <div className="feedback-container" style={!feedback ? { backgroundColor: "transparent" } : {}}>
                    <div className="feeback"> <span style={{ visibility: "hidden" }}>.</span>{feedback}</div>
                </div>

                <div className="page-heading">EDIT <i><b>VIDEO</b></i></div>
                <section className="add-videos">

                    <form>
                        <table>
                            <tbody>
                                <tr>
                                    <td className="req"><label>Title</label> <span>*</span></td>
                                    <td><input ref={addToVideoRefs} defaultValue={selectedVideo?.title} placeholder="Title"></input></td>
                                </tr>
                                <tr>
                                    <td className="req"><label>YouTube link</label> <span>*</span></td>
                                    <td><input ref={addToVideoRefs} defaultValue={selectedVideo?.link} id={'youtube'} className={'link'} placeholder="YouTube link"></input></td>
                                </tr>
                                <tr>
                                    <td className="req"><label>Date released</label> <span>*</span></td>
                                    <td><input ref={addToVideoRefs} defaultValue={selectedVideo?.dateReleased} type={'date'} className={'req'} id='date' placeholder="YYYY-MM-DD"></input></td>
                                </tr>
                                <tr style={{ textAlign: "center" }}>
                                    <td><button onClick={(e) => { e.preventDefault(); editVideo() }}>Save</button></td>
                                    <td><button onClick={(e) => { e.preventDefault(); navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-videos`) }}>Cancel</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </section>
            </main>}
        </>
    )
}
export default EditVideo;