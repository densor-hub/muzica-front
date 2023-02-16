import { useCallback, useEffect, useMemo, useState } from "react";
import ProgressBar from "./micro-components/progress-bar";
import AddAudios from "./micro-components/add-audio";
import AddVideos from "./micro-components/add-videos";
import AddImages from "./micro-components/add-images";
import AddUpcoming from "./micro-components/add-upcoming";
import AddNews from "./micro-components/add-news";
import AddBiograpgy from "./micro-components/add-bio";
import AddSocialMediaProfileLinks from "./micro-components/add-social-media";
import WebsiteCreated from "./websiteCreated";
import useAuth from "../customHooks/useAuth";
import GotoRefreshEndPoint from "../FNS/GoToRefreshEndPoint";
import setStatuscodeErrorMessage from "../FNS/setStatuscodeErrorMessage";
import Loading from "./micro-components/loading";
import { useNavigate } from "react-router-dom";


import './css/create-website.css'
import axios from "axios";
import { API_BASE_URL } from "../Resources/BaseURL";

const Dashboard = () => {
    const { auth } = useAuth();
    const navigateTo = useNavigate();
    const content = useMemo(() => { return { audio: "audios", video: "videos", images: "images", upcoming: "upcoming", biography: "biography", news: "news", socials: "socials", bookings: "bookings", createsite: "createsite" } }, [])
    const [currentContent, setCurrentContent] = useState("");
    const [submittedContent, setSubmittedContent] = useState('');
    const [feedback, setFeedback] = useState();
    const [bools, setBools] = useState({ showAdded: false, showEdit: false, reload: false, showDropdown: false, showloading: false, submitted: "", show403: false });
    const [addedAudios, setAddedAudios] = useState([]);
    const [addedVideos, setAddedVideos] = useState([]);
    const [addedImages, setAddedImages] = useState([]);
    const [addedUpcoming, setAddedUpcoming] = useState({});
    const [addedNews, setAddedNews] = useState("");
    const [addedBio, setAddedBio] = useState("");
    const [addedSocials, setAddedSocials] = useState([]);

    const submitables = useMemo(() => { return [content?.audio, content?.video, content?.images, content?.upcoming, content?.news, content?.biography, content?.bookings, content?.socials, content?.createsite] }, [content?.audio, content?.video, content?.images, content?.upcoming, content?.news, content?.biography, content?.bookings, content?.socials, content?.createsite]);

    const [submitted, setSubmitted] = useState([]);

    useEffect(() => {
        if (setFeedback) {
            setTimeout(() => {
                setFeedback("")
            }, 5000);
        }
    }, [feedback])


    const getCurrentContentFromDB = useCallback(
        async () => {

            try {
                setBools(p => { return { ...p, showloading: true } });
                let response = await axios.get(`${API_BASE_URL}/current-content`, { withCredentials: true });



                if (response?.status === 200) {
                    submitables.find((element, index) => {
                        if (element?.toLowerCase() === response?.data?.submitted?.toLowerCase()) {
                            for (var i = 0; i <= index; i++) {
                                if (!submitted.includes(submitables[i].toLowerCase())) {
                                    submitted?.push(submitables[i].toLowerCase())
                                }
                            }
                        }

                        return element?.toLowerCase() === response?.data?.submitted?.toLowerCase();
                    })

                    setSubmittedContent(response?.data?.submitted);
                    setCurrentContent(response?.data?.currentContent);
                    setBools(p => { return { ...p, showloading: false } });
                    //return response?.status
                }
                else {
                    if (response?.status === 204) {
                        setBools(p => { return { ...p, showloading: false } });
                        setCurrentContent(content?.audio)
                        //return response?.status
                    }
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
                                getCurrentContentFromDB().then(() => {
                                    setBools(p => { return { ...p, showloading: false } });
                                });
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

        }, [auth, content?.audio, navigateTo, submitables, submitted]
    )


    useEffect(() => {
        getCurrentContentFromDB();
    }, [getCurrentContentFromDB])

    submitted.length > 0 && console.log(submitted)
    return (
        <>
            {bools?.showloading && <Loading />}
            {<main className="dashboard" style={{ marginTop: "" }}>

                <div className="contentt forAddSocialMediaOnly">
                    {currentContent !== content.previewWebSite && <div className="main-directive">Complete all sections below to generate your website</div>}

                    {currentContent !== content.previewWebSite && <ProgressBar currentContent={currentContent} content={content} bools={bools} setBools={setBools} />}
                    {!bools.showAdded && currentContent !== content.previewWebSite &&
                        <section className="directives">
                            {currentContent === content.audio ? <div className="directive"> Minimum of 3 audios recommended</div> :
                                currentContent === content.video ? <div className="directive">Minimum of 3 videos recommended</div> :
                                    currentContent === content.images ? <div className="directive">Minimum of 3 images recommended</div> :
                                        currentContent === content.upcoming ? <div className="directive">Minimum of 3 upcoming recommended</div> : ""}

                            <div className="topics">
                                <span style={{ visibility: "hidden" }}>.</span>
                                {feedback && <span className="feedback">{feedback}</span>}
                                {!feedback && currentContent === content.audio && <span className="pageHeading"><b>ADD YOUR RECENTLY RELEASED <i>AUDIOS</i></b></span>}
                                {!feedback && currentContent === content.video && <span className="pageHeading"><b>ADD YOUR RECENTLY RELEASED <i>VIDEOS</i></b></span>}
                                {!feedback && currentContent === content.images && <span className="pageHeading"><b>ADD ANY OF YOUR DOPE <i>PICTURES</i></b></span>}
                                {!feedback && currentContent === content.upcoming && <span className="pageHeading"><b>ADD RELEVANT <i>UPCOMING STUFF</i></b></span>}
                                {!feedback && currentContent === content.news && <span className="pageHeading"><b>ADD  <i> CATCHY NEWS</i> ABOUT YOU</b></span>}
                                {!feedback && currentContent === content.biography && <span className="pageHeading"><b>TALK ABOUT <i> YOURSELF </i></b></span>}
                            </div>

                        </section>}

                    {<section>
                        {(currentContent === content.audio || currentContent === "") && !auth?.websiteCreated && <AddAudios
                            currentContent={currentContent}
                            content={content}
                            setCurrentContent={setCurrentContent}
                            setAddedAudios={setAddedAudios}
                            addedAudios={addedAudios}
                            bools={bools}
                            setBools={setBools}
                            setFeedback={setFeedback}
                            submitted={submitted}
                            setSubmitted={setSubmitted}
                            submitables={submitables}

                            submittedContent={submittedContent}
                        />}

                        {currentContent === content.video && !auth?.websiteCreated && <AddVideos
                            setBools={setBools}
                            bools={bools}
                            content={content}
                            currentContent={currentContent}
                            setCurrentContent={setCurrentContent}
                            setAddedVideos={setAddedVideos}
                            addedVideos={addedVideos}
                            setFeedback={setFeedback}
                            submitted={submitted}

                        />}

                        {currentContent === content.images && !auth?.websiteCreated && <AddImages
                            setBools={setBools}
                            bools={bools}
                            content={content}
                            currentContent={currentContent}
                            setCurrentContent={setCurrentContent}
                            addedImages={addedImages}
                            setAddedImages={setAddedImages}
                            setFeedback={setFeedback}
                            submitted={submitted}


                        />}

                        {currentContent === content.upcoming && !auth?.websiteCreated && <AddUpcoming
                            setBools={setBools}
                            bools={bools}
                            content={content}
                            currentContent={currentContent}
                            setCurrentContent={setCurrentContent}
                            addedUpcoming={addedUpcoming}
                            setAddedUpcoming={setAddedUpcoming}
                            setFeedback={setFeedback}
                            submitted={submitted}
                        />}


                        {currentContent === content.news && !auth?.websiteCreated && <AddNews
                            setBools={setBools}
                            bools={bools}
                            content={content}
                            currentContent={currentContent}
                            setCurrentContent={setCurrentContent}
                            addedNews={addedNews}
                            setAddedNews={setAddedNews}
                            setFeedback={setFeedback}
                            submitted={submitted}
                        />}

                        {currentContent === content.biography && !auth?.websiteCreated && <AddBiograpgy
                            setBools={setBools}
                            bools={bools}
                            content={content}
                            currentContent={currentContent}
                            setCurrentContent={setCurrentContent}
                            addedBio={addedBio}
                            setAddedBio={setAddedBio}
                            setFeedback={setFeedback}
                            submitted={submitted}
                        />}


                        {currentContent === content.socials && !auth?.websiteCreated && <AddSocialMediaProfileLinks
                            setBools={setBools}
                            bools={bools}
                            setFeedback={setFeedback}
                            setAddedSocials={setAddedSocials}
                            addedSocials={addedSocials}
                            setCurrentContent={setCurrentContent}
                            currentContent={currentContent}
                            content={content}
                            submitted={submitted}
                        />

                        }

                        {((submitted?.length > 0 && submitted?.includes("socials")) || auth?.websiteCreated) && <WebsiteCreated
                            setBools={setBools}
                            bools={bools}
                            setFeedback={setFeedback}
                            setCurrentContent={setCurrentContent}
                            content={content}
                        />
                        }

                    </section>}


                    {currentContent !== content.previewWebSite && <footer> Designed by David Ensor (c) {new Date().getFullYear()}</footer>}
                </div>

            </main>
            }
        </>
    )
}

export default Dashboard;