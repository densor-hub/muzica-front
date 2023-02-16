import axios from "axios";
import { useRef } from "react";
import { API_BASE_URL } from "../../Resources/BaseURL";
import Loading from "./loading";
import GotoRefreshEndPoint from "../../FNS/GoToRefreshEndPoint";
import setStatuscodeErrorMessage from "../../FNS/setStatuscodeErrorMessage";
import useAuth from "../../customHooks/useAuth";
import { useNavigate } from "react-router-dom";

import './add-images.css'

const AddImages = ({ setBools, bools, content, currentContent, setCurrentContent, addedImages, setAddedImages, setFeedback, submitted }) => {
    const { auth } = useAuth();
    const navigateTo = useNavigate();
    const imageRef = useRef();
    const addToImages = (e) => {
        const allowedSize = 1024 * 1024 * 3;
        let filename = '';
        if (e.target.files.length > 5) {
            setFeedback('Select not more than 5 files')
        }
        else {
            //code is this way cos the idea was to manage multiple file uploads at a time (5 at a time)
            for (var i = 0; i <= e.target.files.length; i++) {

                if (i !== e.target.files.length) {
                    if (e?.target?.files[i]?.size > allowedSize) {
                        setFeedback(`file ${e?.target?.files[i]?.name} size too large`);
                        filename = filename + ', ' + e?.target?.files[i]?.name;
                    }
                    else {
                        setAddedImages([e.target.files[i]]);
                    }
                }

                if (i === e.target.files.length) {
                    if (filename !== "") {
                        setFeedback(`${filename} size too large`)
                    }
                }
            }
        }
    }

    const Save = async () => {
        const ImageformData = new FormData();
        ImageformData.append("file", addedImages[0]);

        if (addedImages?.length > 0) {
            setBools(p => { return { ...p, showloading: true } });
            try {
                let response = await axios.post(`${API_BASE_URL}/save-image`, ImageformData, { withCredentials: true })
                if (response.status === 200) {
                    if (!submitted.includes(currentContent)) {
                        submitted.push(currentContent);
                    }
                    setBools(p => { return { ...p, submitted: currentContent, showloading: false } });
                    setAddedImages([])
                    setFeedback('Save successfully')
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
        else {
            setFeedback('Select image')
        }
    }


    const Back = async () => {
        try {
            setBools(p => { return { ...p, showloading: true } });
            let response = await axios.post(`${API_BASE_URL}/current-content`, { content: content?.video }, { withCredentials: true });

            if (response?.status === 200) {
                setBools(p => { return { ...p, showloading: false } });
                setFeedback("")
                setCurrentContent(content?.video)
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
            let response = await axios.post(`${API_BASE_URL}/current-content`, { content: content?.upcoming }, { withCredentials: true });

            if (response?.status === 200) {
                setBools(p => { return { ...p, showloading: false } });
                setFeedback("");

                setCurrentContent(content?.upcoming)

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
            {bools.showloading ? <Loading /> :
                <main style={bools.showloading ? { height: "0PX", width: "0px", overflow: "hidden" } : {}}>

                    {currentContent === content.images && addedImages.length === 0 &&
                        <section>
                            <section className="add-images">
                                <form>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td><label>Select images</label> </td>

                                            </tr>
                                            <tr>
                                                <td><input style={{ width: "0px", height: "0px", overflow: "hidden" }} type={'file'} accept={'.png,.jpg,.jpeg,.svg'} ref={imageRef} onChange={(e) => { addToImages(e) }}></input>
                                                    <button className="upload-image" onClick={(e) => { e.preventDefault(); imageRef?.current?.click(); }}>Upload</button></td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </form>
                            </section>

                            <div className="next-skip-back-buttons">
                                <button onClick={(e) => { e.preventDefault(); Back() }}>Back to videos</button>

                                {submitted?.length > 0 && submitted.includes(currentContent) && <button type="submit" onClick={(e) => { e.preventDefault(); Next() }}>Next</button>}
                            </div>
                        </section>
                    }

                    {currentContent === content.images && addedImages.length > 0 && <section>

                        <div className="image-viewer">
                            {addedImages.length > 0 && <img alt="" src={addedImages[0] && URL.createObjectURL(addedImages[0])}></img>}

                        </div>

                        <section className="navigation-btns">
                            {addedImages?.length > 0 && <button onClick={(e) => { e.preventDefault(); Save() }}>Save</button>}
                            {addedImages?.length > 0 && <button onClick={(e) => { e.preventDefault(); setAddedImages([]) }}>Cancel</button>}

                        </section>

                    </section>}

                </main>}
        </>
    )
}

export default AddImages;