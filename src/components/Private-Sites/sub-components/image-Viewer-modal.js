import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../../../Resources/BaseURL";
import axios from "axios";
import GotoRefreshEndPoint from "../../../FNS/GoToRefreshEndPoint";
import setStatuscodeErrorMessage from "../../../FNS/setStatuscodeErrorMessage";
import useAuth from "../../../customHooks/useAuth";
import { useNavigate } from "react-router-dom";
import Loading from "../../micro-components/loading";
import '../CSS/image-viewer.css';


const ImageViewer = ({ addedImages, selectedImageUrl, setSelectedImage, setParentFeedback, showDeleteButton }) => {
    const [iterator, setIterator] = useState(0);
    const [showLoading, setShowLoading] = useState(false);
    const [childFeedback, setChildFeedback] = useState('');
    const { auth } = useAuth();
    const NextButtonRef = useRef();
    const PreviousButtonRef = useRef();

    const navigateTo = useNavigate();
    useEffect(() => {
        if (addedImages?.length > 0) {
            addedImages.map((element, index) => {
                if (String(element?.image).trim() === String(selectedImageUrl).trim()) {
                    return setIterator(index);
                }
                return (String(element?.image).trim() === String(selectedImageUrl).trim())
            })
        }
    }, [addedImages, selectedImageUrl]);

    let iterate = false;
    const Next = () => {
        iterate = true;
        if (iterate && iterator !== (addedImages?.length - 1)) {
            setIterator(p => { return p + 1 });
            iterate = false;
        }
        else {
            setIterator(0);
            iterate = false;
        }
    }

    const Previous = () => {
        iterate = true;
        if (iterate && !(iterator <= 0)) {
            setIterator(p => { return p - 1 })
            iterate = false;
        }
        else {
            setIterator(addedImages?.length - 1);
            iterate = false;
        }
    }


    // console.log(iterator)
    // useEffect(()=>{
    //     const navigateImages =(e)=>{
    //         if(e.key==='ArrowRight'){
    //             NextButtonRef?.current?.click();
    //         }
    //         else if(e.key==='ArrowLeft'){
    //             PreviousButtonRef?.current?.click();
    //         }
    //     }
    //     document?.addEventListener('keydown', navigateImages);

    //     return ()=>{
    //         document?.removeEventListener('keydown', navigateImages);
    //     }
    // },[PreviousButtonRef?.current, NextButtonRef?.current])

    const Delete = async () => {
        try {
            setShowLoading(true)
            let response = await axios.put(`${API_BASE_URL}/delete-images:${addedImages[iterator]?._id}`, { selectedItem: addedImages?._id }, { withCredentials: true });

            if (response?.status === 200) {
                setParentFeedback('Deleted successfully...');
                setSelectedImage('')
                setShowLoading(false);
                navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-images`)
            }
            else if (response?.status === 204) {
                setShowLoading(false);
                setChildFeedback('Image already deleted..')
            }


        } catch (error) {
            console.log(error)
            if (!error?.response?.data) {
                setShowLoading(false)
                setChildFeedback('Network challenges...')
            }
            else {
                if (error?.response?.status === 401) {
                    GotoRefreshEndPoint(auth).then((results) => {
                        if (results?.status === 200) {
                            Delete();
                        } else {
                            navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/sign-out`);
                        }
                    })
                }
                else {
                    setShowLoading(false)
                    setStatuscodeErrorMessage(error?.response?.status, setChildFeedback)
                }
            }
        }
    }


    return (
        <>
            {showLoading && <Loading />}
            <main className="image-viewer-container">
                <div className="close-button-container">
                    <button onClick={(e) => { e.preventDefault(); setSelectedImage("") }}>X</button>
                </div>
                <div className="feedback-conatiner">
                    <div className="feedback">{childFeedback}</div>
                </div>
                <div className="image-container">
                    <img alt="" src={addedImages[iterator]?.image}></img>
                </div>
                <div className="navigation-buttons">
                    <button onClick={(e) => { e.preventDefault(); Previous() }} ref={PreviousButtonRef}>Previous</button>
                    {showDeleteButton && <button onClick={(e) => { e.preventDefault(); Delete() }}>Delete</button>}
                    <button onClick={(e) => { e.preventDefault(); Next() }} ref={NextButtonRef}>Next</button>
                </div>
            </main>

        </>
    )
}
export default ImageViewer;