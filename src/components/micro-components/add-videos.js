import axios from 'axios';
import { API_BASE_URL } from '../../Resources/BaseURL';
import './add-videos.css'
import GotoRefreshEndPoint from '../../FNS/GoToRefreshEndPoint';
import Loading from './loading';
import setStatuscodeErrorMessage from '../../FNS/setStatuscodeErrorMessage';
import useAuth from '../../customHooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { isValidDate } from '../../FNS/DurationValidator';

const AddVideos = ({ setBools, bools, content, currentContent, setCurrentContent, setFeedback, submitted }) => {
    const { auth } = useAuth();
    const navigateTo = useNavigate();
    const VideoRefs = [];
    const addToVideoRefs = (element) => {
        if (element && !VideoRefs.includes(element)) {
            VideoRefs.push(element)
        }
    }

    const themeColrs = { error: "rgb(255, 71, 86)", valid: 'white' }

    const addToSubmitedVideos = async () => {
        let submitedVideo = { title: VideoRefs[0].value, link: VideoRefs[1].value, dateReleased: VideoRefs[2]?.value };

        let requiredButEmptyFields = 0;
        let invalidLinkProvided = 0;
        let invalidDate = false;
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
                }
            }


            if (element?.value === "") {
                setFeedback('Enter all fields');
                requiredButEmptyFields = requiredButEmptyFields + 1;
                element.style.borderBottom = `3px solid ${themeColrs?.error}`;
            }
        })

        if (requiredButEmptyFields === 0 && invalidLinkProvided === 0 && invalidDate === false) {
            // setAddedVideos(p=>{return[...p, submitedVideo]});

            setBools(p => { return { ...p, showloading: true } });

            try {
                let response = await axios.post(`${API_BASE_URL}/save-video`, submitedVideo, { withCredentials: true });
                if (response?.status === 200) {
                    if (!submitted.includes(currentContent)) {
                        submitted?.push(currentContent)
                    }

                    VideoRefs.forEach(element => { element.value = "" });
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
                                addToSubmitedVideos();
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



    const cancelOperation = () => {
        VideoRefs.forEach(element => {
            element.value = "";
            element.style.borderBottom = `3px solid ${themeColrs?.valid}`
        })
    }


    const Back = async () => {
        try {
            setBools(p => { return { ...p, showloading: true } });
            let response = await axios.post(`${API_BASE_URL}/current-content`, { content: content?.audio }, { withCredentials: true });

            if (response?.status === 200) {
                setBools(p => { return { ...p, showloading: false } });
                setFeedback("")
                setCurrentContent(content?.audio);
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
            let response = await axios.post(`${API_BASE_URL}/current-content`, { content: content?.images }, { withCredentials: true });

            if (response?.status === 200) {
                setBools(p => { return { ...p, showloading: false } });
                setFeedback("");
                setCurrentContent(content?.images)

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
            {bools?.showloading ? <Loading /> :
                <main style={bools.showloading ? { height: "0PX", width: "0px", overflow: "hidden" } : {}}>
                    {currentContent === content.video && !bools.showAdded && <section className="add-videos">

                        <form>
                            <table>
                                <tbody>
                                    <tr>
                                        <td className="req"><label>Title</label> <span>*</span></td>
                                        <td><input ref={addToVideoRefs} placeholder="Title"></input></td>
                                    </tr>
                                    <tr>
                                        <td className="req"><label>YouTube link</label> <span>*</span></td>
                                        <td><input ref={addToVideoRefs} id='youtube' className={'link'} placeholder="YouTube link"></input></td>
                                    </tr>
                                    <tr>
                                        <td className="req"><label>Date released</label> <span>*</span></td>
                                        <td><input ref={addToVideoRefs} type={'date'} id={"date"} className={'date-released'} placeholder="Date released"></input></td>
                                    </tr>
                                    <tr style={{ textAlign: "center" }}>
                                        <td><button onClick={(e) => { e.preventDefault(); addToSubmitedVideos() }}>Save</button></td>
                                        <td><button onClick={(e) => { e.preventDefault(); cancelOperation() }}>Cancel</button></td>
                                    </tr>
                                </tbody>
                            </table>

                        </form>
                    </section>}

                    <div className="next-skip-back-buttons">
                        <button onClick={(e) => { e.preventDefault(); Back() }}>Back to audios</button>

                        {(submitted?.length > 0 && submitted.includes(currentContent)) && <button type="submit" onClick={(e) => { e.preventDefault(); Next() }}>Next</button>}
                    </div>

                </main>}
        </>
    )
}
export default AddVideos;