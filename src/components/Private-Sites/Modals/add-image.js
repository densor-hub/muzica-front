import axios from "axios";
import { useState, useRef } from "react";
import { API_BASE_URL } from "../../../Resources/BaseURL";
import useAuth from "../../../customHooks/useAuth";
import setStatuscodeErrorMessage from "../../../FNS/setStatuscodeErrorMessage";
import Loading from "../../micro-components/loading";
import GotoRefreshEndPoint from "../../../FNS/GoToRefreshEndPoint";
import { useNavigate } from "react-router-dom";

import '../../micro-components/add-images.css';
import '../CSS/edit-audio-modal.css';
import '../CSS/added.css';

const AddImage = () => {
    const { auth } = useAuth();
    const navigateTo = useNavigate();
    const [addedImages, setAddedImages] = useState('')
    const [feedback, setFeedback] = useState('');
    const [bools, setBools] = useState({ showloading: false });

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
        ImageformData?.append("file", addedImages[0]);
        ImageformData?.append("not_current_content", true);

        if (addedImages?.length > 0) {
            setBools(p => { return { ...p, showloading: true } });
            try {
                let response = await axios.post(`${API_BASE_URL}/save-image`, ImageformData, { withCredentials: true })
                if (response.status === 200) {
                    navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-images`)
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

    return (
        <>
            {bools.showloading ? <Loading /> :
                <main>
                    <div className="feedback-container" style={!feedback ? { backgroundColor: "transparent" } : {}}>
                        <div className="feeback"> <span style={{ visibility: "hidden" }}>.</span>{feedback}</div>
                    </div>
                    <div className="page-heading">ADD NEW <i><b>IMAGE</b></i></div>


                    {addedImages.length === 0 &&
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

                        </section>
                    }

                    {addedImages.length > 0 && <section>

                        <div className="image-viewer">
                            {addedImages.length > 0 && <img alt="" src={addedImages[0] && URL.createObjectURL(addedImages[0])}></img>}

                        </div>

                        <section className="decision-buttons" style={{ textAlign: "center" }}>
                            {addedImages?.length > 0 && <button onClick={(e) => { e.preventDefault(); Save() }}>Save</button>}
                            {addedImages?.length > 0 && <button onClick={(e) => { e.preventDefault(); navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-images`) }}>Cancel</button>}

                        </section>

                    </section>}

                </main>}
        </>
    )
}

export default AddImage;