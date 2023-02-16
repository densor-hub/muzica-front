import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../Resources/BaseURL";
import ImageViewer from "../Private-Sites/sub-components/image-Viewer-modal";



import './CSS/image-site.css';

const ImagesSite = ({ setAddedAudios, setAddedVideos, addedImages, setAddedImages, setAddedUpcoming, setAddedNews, setAddedBio, setAddedSocials, setValidAPIEndPoint, setBools }) => {

    const [selectedImage, setSelectedImage] = useState([]);
    const [feedback, setFeedback] = useState('');

    //called when added videos are empty
    const getData = useCallback(async () => {
        try {
            let response = await axios.get(`${API_BASE_URL}${window?.location?.pathname}${window?.location?.search}`);

            if (response?.status === 200) {
                setAddedAudios(response?.data?.websiteData[0]?.value);
                setAddedVideos(response?.data?.websiteData[1]?.value);
                setAddedImages(response?.data?.websiteData[2]?.value);
                setAddedUpcoming(response?.data?.websiteData[3]?.value);
                setAddedNews(response?.data?.websiteData[4]?.value);
                setAddedBio(response?.data?.websiteData[5]?.value);
                setAddedSocials(response?.data?.websiteData[6]?.value);
                setValidAPIEndPoint(response?.data?.validAPI_EndPoints);
            }
        } catch (error) {
            console.log(error)
            if (error?.response?.status === 404) {
                setBools(p => { return { ...p, show404: true, show500: false } });
            } else {
                if (!error?.response?.data) {
                    setBools(p => { return { ...p, show500: true, show404: false } });
                }
            }
        }
    }, [setAddedAudios, setAddedVideos, setAddedImages, setAddedUpcoming, setAddedNews, setAddedBio, setAddedSocials, setValidAPIEndPoint, setBools])

    useEffect(() => {
        if (addedImages) {
            if (addedImages?.length === 0) {
                getData();
            }
        }
    }, [addedImages, getData])

    return (
        <>
            <main className="image-site">
                <div className="large-icon">Gallery</div>
                <div className="feedback-container">{feedback}</div>
                {selectedImage?.length === 0 && addedImages?.length > 0 && <section className="items-container">
                    {addedImages?.sort((a, b) => { return new Date(b?.datereleased) - new Date(a.datereleased) })
                        .map((elements) => {
                            return (
                                <div key={elements?._id} className="individual-item" onClick={(e) => { e.preventDefault(); setSelectedImage([elements]) }}>
                                    <img alt={""} src={elements?.image}></img>
                                </div>
                            )
                        })}
                </section>}

                {selectedImage?.length > 0 && <ImageViewer addedImages={addedImages} selectedImageUrl={selectedImage[0]?.image} setSelectedImage={setSelectedImage} setParentFeedback={setFeedback} showDeleteButton={false} />}

            </main>
        </>
    )
}

export default ImagesSite;