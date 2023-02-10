import { useRef, useState } from "react";
import axios from "axios";
import Loading from "../../micro-components/loading";
import GotoRefreshEndPoint from "../../../FNS/GoToRefreshEndPoint";
import useAuth from "../../../customHooks/useAuth";
import { API_BASE_URL } from "../../../Resources/BaseURL";
import setStatuscodeErrorMessage from "../../../FNS/setStatuscodeErrorMessage";
import { useNavigate } from "react-router-dom";
import { isValidDate } from "../../../FNS/DurationValidator";


import '../../micro-components/add-audios.css';
import '../CSS/added.css';



const AddAudios = () => {
    const navigateTo = useNavigate()
    const themeColrs = { error: "rgb(255, 71, 86)", valid: 'white' }
    const [selectedImage, setSelectedImage] = useState({ image: "", url: "" })
    const form2Ref = useRef();
    const { auth } = useAuth();
    const [audioDetails, setAudioDetails] = useState({})
    const [bools, setBools] = useState({ showloading: false })
    const [feedback, setFeedback] = useState("")

    //add audio input refs
    const audioRefs = [];
    const addToAudioRefs = (element) => {
        if (element && !audioRefs.includes(element)) {
            audioRefs.push(element)
        }
    }

    const selectCoverArt = () => {
        audioRefs.forEach(element => {
            if (element.type === 'file') {
                if (element.size > 1024 * 1024 * 3) {
                    setFeedback('Image size too large')
                }
                else {
                    if (element?.files?.length !== 0) {
                        setSelectedImage(prev => {
                            return {
                                ...prev,
                                url: URL.createObjectURL(element.files[0]),
                                image: element.files[0],
                            }
                        })
                    }
                }
            }
        })
    }


    const Save = async () => {

        setAudioDetails((p) => { return { ...p, title: audioRefs[0].value, artWork: selectedImage?.image, datereleased: audioRefs[2].value, applemusic: audioRefs[3].value, spotify: audioRefs[4].value, audiomack: audioRefs[5].value, youtube: audioRefs[6].value, soundcloud: audioRefs[7].value } });

        var requiredButBlankFields = 0;
        var atLeastOneOptionalField = 0;
        var invalidLinkProvided = 0;
        let invalidDate = false;

        const audioDetailFormData = new FormData();
        audioDetailFormData.append("title", audioRefs[0].value)
        audioDetailFormData.append("file", selectedImage.image)
        audioDetailFormData.append("datereleased", audioRefs[2].value)
        audioDetailFormData.append("applemusic", audioRefs[3].value)
        audioDetailFormData.append("spotify", audioRefs[4].value)
        audioDetailFormData.append("audiomack", audioRefs[5].value)
        audioDetailFormData.append("youtube", audioRefs[6].value)
        audioDetailFormData.append("soundcloud", audioRefs[7].value)
        audioDetailFormData?.append('not_current_content', true);

        audioRefs.forEach(element => {

            if (element?.className === 'req') {
                if (element?.value === "") {
                    if (!bools.showEdit) {

                        if (element?.type === "file") {
                            if (selectedImage?.image === "" && selectedImage?.url === "") {
                                requiredButBlankFields = requiredButBlankFields + 1;
                                element.style.borderBottom = `3px solid ${themeColrs.error}`;
                            }
                        }
                        else {
                            requiredButBlankFields = requiredButBlankFields + 1;
                            element.style.borderBottom = `3px solid ${themeColrs.error}`;
                        }
                    } else {
                        if (element.type === 'file') {
                            if (selectedImage.image === "" && selectedImage.url === "") {
                                requiredButBlankFields = requiredButBlankFields + 1;
                            }
                        }
                    }


                } else {
                    element.style.borderBottom = `3px solid ${themeColrs.valid}`;
                }
            }

            if (element?.type === 'date' || element?.id === 'date') {
                console.log(element)

                if (new Date(`${element?.value}`) === 'Invalid Date' || !isValidDate(element?.value)) {
                    invalidDate = true;
                    element.style.borderBottom = `3px solid ${themeColrs?.error}`
                    setFeedback('Invalid date')
                }
                else {
                    element.style.borderBottom = `3px solid ${themeColrs?.valid}`
                }
            }

            if (element?.className === 'streaminglink') {
                if (element?.value !== "") {
                    atLeastOneOptionalField = atLeastOneOptionalField + 1;
                    if (element?.value?.startsWith('https://') && new URL(element?.value?.trim())?.origin?.toLowerCase().endsWith(element?.id?.toLowerCase() + ".com")) {
                        try {
                            new URL(element?.value?.trim())
                        } catch (error) {
                            invalidLinkProvided = invalidLinkProvided + 1;
                            element.style.borderBottom = `3px solid ${themeColrs.error}`;
                            setFeedback(`Invalid ${element?.id} URL proovided`);
                        }

                        if (!invalidLinkProvided === 0) {
                            element.style.borderBottom = `3px solid ${themeColrs.valid}`;
                        }
                    }
                    else {
                        invalidLinkProvided = invalidLinkProvided + 1;
                        element.style.borderBottom = `3px solid ${themeColrs?.error}`;
                        setFeedback(`Invalid ${element?.id} URL proovided`);
                    }

                    if (element?.id === 'youtube') {
                        if (!(element?.value?.startsWith('https://') && ((new URL(element?.value?.trim())?.origin?.toLowerCase().endsWith(element?.id?.toLowerCase() + ".com"))
                            || (new URL(element?.value)?.origin.endsWith((element?.id?.toLowerCase()?.slice(0, 5) + '.' + element?.id?.trim().slice(5, 8))?.trim()))))) {
                            invalidLinkProvided = invalidLinkProvided + 1;
                        }
                    }
                }


            }


        })

        if (atLeastOneOptionalField < 1) {
            setFeedback("Enter at least, one streamining platform link");
        }


        if (requiredButBlankFields > 0) {
            setFeedback('Enter all required field')
        }

        if (atLeastOneOptionalField > 0 && requiredButBlankFields === 0 && invalidLinkProvided === 0 && invalidDate === false) {

            setBools(p => { return { ...p, showloading: true } })
            try {
                let response = await axios.post(`${API_BASE_URL}/save-audio`, audioDetailFormData, { withCredentials: true });

                if (response?.status === 200) {
                    // audioRefs.forEach(element=>{element.value = "" });
                    // setFeedback("Saved successfully, redirecting...");
                    // setSelectedImage(p=>{return {...p, image:"", url:""}});
                    // setAudioDetails('');
                    // setBools(p=>{return {...p, showloading : false}});

                    // setTimeout(() => {
                    navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-audios`)
                    //  }, 2000);
                }
            } catch (error) {

                console?.log(error)
                if (!error?.response?.data) {
                    setFeedback('Network error...')
                    setBools(p => { return { ...p, showloading: false } });
                }
                else {
                    if (error?.response?.status === 401) {
                        GotoRefreshEndPoint(auth).then((r) => {
                            if (r.status === 200) {
                                Save();
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


    return (<>
        {bools?.showloading ? <Loading /> :
            <main>

                <div className="feedback-container" style={!feedback ? { backgroundColor: "transparent" } : {}}>
                    <div className="feedback">{feedback}<span style={{ visibility: "hidden" }}>.</span></div>
                </div>

                <div className="page-heading">ADD NEW <i><b>AUDIO</b></i></div>
                {
                    !bools?.showAdded &&
                    <section className="add-audios">
                        <section className="details">
                            {<div className="image-container"><img src={selectedImage.url} alt={'select cover art less than 3mb'}></img></div>}
                            <form className="form1">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="required"><label>Title</label> <span>*</span></td>
                                            <td><input className="req" type={'text'} placeholder='Song title' ref={addToAudioRefs} defaultValue={audioDetails?.title}></input></td>
                                        </tr>

                                        <tr>
                                            <td className="required"><label>Art work </label><span>*</span></td>
                                            <td><input className="req" type={'file'} accept={'.png,.jpeg,.svg,.jpg'} ref={addToAudioRefs} onChange={() => { selectCoverArt() }}></input></td>
                                        </tr>

                                        <tr>
                                            <td className="required"><label>Date released</label> <span>*</span></td>
                                            <td><input className="req" type={'date'} id={'date'} placeholder='YYYY-MM-DD' ref={addToAudioRefs} defaultValue={audioDetails.datereleased} ></input></td>
                                        </tr>

                                    </tbody>
                                </table>
                            </form>

                            <div className="streaming-platforms-directive">Add at least one streamning platform link</div>
                            <form className="form2">
                                <table ref={form2Ref}>
                                    <tbody>
                                        <tr>
                                            <td><label>Apple music</label></td>
                                            <td><input className="streaminglink" id="apple" type={'text'} placeholder='Apple music link' ref={addToAudioRefs} defaultValue={audioDetails?.applemusic}></input></td>
                                        </tr>

                                        <tr>
                                            <td><label>Spotify</label></td>
                                            <td><input className="streaminglink" id="spotify" type={'text'} placeholder='Spotify link' ref={addToAudioRefs} defaultValue={audioDetails?.spotify}></input></td>
                                        </tr>

                                        <tr>
                                            <td><label>AudioMack</label></td>
                                            <td><input className="streaminglink" id="audiomack" type={'text'} placeholder='AudioMack link' ref={addToAudioRefs} defaultValue={audioDetails?.audiomack}></input></td>
                                        </tr>

                                        <tr>
                                            <td><label>YouTube</label></td>
                                            <td><input className="streaminglink" id="youtube" type={'text'} placeholder='YouTube link' ref={addToAudioRefs} defaultValue={audioDetails?.youtube}></input></td>
                                        </tr>

                                        <tr>
                                            <td><label>Soundcloud</label></td>
                                            <td><input className="streaminglink" id="soundcloud" type={'text'} placeholder='Soundcloud link' ref={addToAudioRefs} defaultValue={audioDetails?.soundcloud}></input></td>
                                        </tr>


                                        <tr>
                                            <td className="btn-container"><button onClick={(e) => { e.preventDefault(); Save() }}>Save</button></td>

                                            <td className="btn-container"><button onClick={(e) => { e.preventDefault(); navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-audios`) }}>Cancel</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </section>
                    </section>
                }

            </main>}


    </>)
}

export default AddAudios;