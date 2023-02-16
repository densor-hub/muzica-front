import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import GotoRefreshEndPoint from "../../FNS/GoToRefreshEndPoint";
import { API_BASE_URL } from "../../Resources/BaseURL";
import useAuth from "../../customHooks/useAuth";
import setStatuscodeErrorMessage from "../../FNS/setStatuscodeErrorMessage";
import Loading from "../micro-components/loading";
import { Link } from "react-router-dom";
import DeleteImage from "./sub-components/delete-image-modal";
import ImageViewer from "./sub-components/image-Viewer-modal";
import { useNavigate } from "react-router-dom";

import './CSS/added-images.css'


const AddedImages = () => {

    const { auth } = useAuth();
    const navigateTo = useNavigate();
    const [addedImages, setAddedImages] = useState([]);
    const [feedback, setFeedback] = useState("")
    const [bools, setBools] = useState({ showloading: false, showImageViewer: false });
    const [selectedImage, setSelectedImage] = useState("");

    const getData = useCallback(
        async () => {
            setBools(p => { return { ...p, showloading: true } });

            try {
                let response = await axios.get(`${API_BASE_URL}/get-added-images`, { withCredentials: true });

                if (response?.status === 200) {
                    setAddedImages(response?.data?.addedItems);
                    setBools(p => { return { ...p, showloading: false } });
                }
                else if (response?.status === 204) {
                    setAddedImages([]);
                    setBools(p => { return { ...p, showloading: false } });
                    setFeedback('No images found...')
                }
            } catch (error) {
                if (!error?.response?.data) {
                    setFeedback('Network challenges...')
                }
                else {
                    if (error?.response?.status === 401) {
                        GotoRefreshEndPoint(auth).then((r) => {
                            if (r.status === 200) {
                                getData();
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
        getData()
    }, [getData]);


    useEffect(() => {
    }, [selectedImage])


    const setAndDisplayImageViewer = () => {
        if (addedImages?.length === 0) {
            return false
        }
        else {
            setBools(p => { return { ...p, showImageViewer: true } });
        }
    }

    //feedback clearing
    useEffect(() => {
        if (feedback) {
            setTimeout(() => {
                setFeedback('');
            }, 3000);
        }
    }, [feedback])


    return (
        <>
            {bools?.showloading && <Loading />}
            {bools?.showDeleteModal && <DeleteImage getData={getData} setBools={setBools} bools={bools} selectedImage={selectedImage} setFeedback={setFeedback} feedback={feedback} />}

            {selectedImage && <ImageViewer addedImages={addedImages} selectedImageUrl={selectedImage?.image} setSelectedImage={setSelectedImage} setParentFeedback={setFeedback} showDeleteButton={true} />}
            <main className=" added-images" style={{ paddingTop: "40px" }}>
                <div className="page-heading">ADDED <i><b>IMAGES</b></i></div>

                <div className="feedback-container" style={!feedback ? { backgroundColor: "transparent" } : {}}>
                    <div className="feeback">{!bools?.showDeleteModal && feedback}<span style={{ visibility: "hidden" }}>.</span></div>

                </div>

                <div className="add-new-button-container" style={{ textAlign: "center", marginBottom: "15px" }}>
                    {auth?.websiteCreated ? <Link to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/add-image`}>Add new</Link> : <Link to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/createwebsite`}>Create website</Link>}
                </div>

                <div >

                    {<div className="list-of-individual-items" style={addedImages?.length === 0 ? { backgroundColor: "transparent", borderTop: "2px solid white", borderLeft: "0px", borderBottom: "0px", borderRight: "0px", overflow: "hidden", width: "70vw", margin: "0 auto" } : {}}>{addedImages?.length > 0 && addedImages?.map((elements) => {
                        return (<div key={elements?._id} className='indivial-item for-images'>
                            <div className="image-container">
                                <div>
                                    <img src={elements?.image} alt='' onClick={() => {
                                        setSelectedImage(elements); setTimeout(() => {
                                            setAndDisplayImageViewer();
                                        }, 10);
                                    }}></img>
                                </div>

                            </div>

                        </div>)
                    })}</div>}


                    {!bools.showloading && addedImages?.length === 0 && <div style={{ textAlign: "center" }}>
                        No results found
                    </div>}

                </div>
            </main>
        </>
    )
}

export default AddedImages;

