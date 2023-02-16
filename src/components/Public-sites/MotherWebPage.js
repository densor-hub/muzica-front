import { useState, useEffect, useCallback } from 'react'
import axios from 'axios';
import { API_BASE_URL } from '../../Resources/BaseURL';
import Page404 from '../404';
import Page500 from '../500';
import { lazy } from 'react';
import { Link } from 'react-router-dom';

import './CSS/mother-page.css'
import Loading from '../micro-components/loading';

const WebsiteLandingPage = lazy(() => { return import("./website") });
const AudiosPage = lazy(() => { return import('./audios-site') });
const VideoPage = lazy(() => { return import('./videos-site') });
const ImagesPage = lazy(() => { return import('./images-site') });
const UpcomingPage = lazy(() => { return import('./upcoming-site') });
const NewsPage = lazy(() => { return import('./news-site') });
const ContactPage = lazy(() => { return import('./contact-site') });

//pathname comes from verify website custom route
const MotherPage = ({ pathname }) => {
    const [addedAudios, setAddedAudios] = useState([]);
    const [addedVideos, setAddedVideos] = useState([]);
    const [addedImages, setAddedImages] = useState([]);
    const [addedUpcoming, setAddedUpcoming] = useState([]);
    const [addedNews, setAddedNews] = useState("");
    const [addedBio, setAddedBio] = useState("");
    const [addedSocials, setAddedSocials] = useState([]);
    const [addedBookingsInfo, setAddedBookingsInfo] = useState([]);
    const [bools, setBools] = useState({ show404: false, show500: false });
    const [validAPIEndPoint, setValidAPIEndPoint] = useState([]);

    let correspondingPathname = ['audios', "videos", "images", "upcoming", "news", "biography", "contact", 'home',];

    const getData = useCallback(async () => {
        try {
            console.log('get settt')
            let response = await axios.get(`${API_BASE_URL}${window?.location?.pathname}${window?.location?.search}`, {});
            console.log(response)
            if (response?.status === 200) {
                setAddedAudios(response?.data?.websiteData[0]?.value);
                setAddedVideos(response?.data?.websiteData[1]?.value);
                setAddedImages(response?.data?.websiteData[2]?.value);
                setAddedUpcoming(response?.data?.websiteData[3]?.value);
                setAddedNews(response?.data?.websiteData[4]?.value);
                setAddedBio(response?.data?.websiteData[5]?.value);
                setAddedSocials(response?.data?.websiteData[6]?.value);
                setAddedBookingsInfo(response?.data?.websiteData[7]?.value);
                setValidAPIEndPoint(response?.data?.validAPI_EndPoints)
            }
        } catch (error) {
            console.log(error)
            if (error?.response?.status === 404 || error?.response?.status === 401) {
                setBools(p => { return { ...p, show404: true, show500: false } });
            } else {
                if (!error?.response?.data) {
                    setBools(p => { return { ...p, show500: true, show404: false } });
                }
            }
        }
    }, [])

    useEffect(() => {
        getData();
        console.log('GETTTINGGG')
    }, [getData])


    console.log("motherPAGEEEE")

    return (
        <>
            {!bools?.show404 && !bools?.show500 ?
                <main className='mother'>
                    <section className="header">
                        <div className="navigations">
                            {<Link to={window?.location?.href?.split('home?artiste')?.length === 2 ? window?.location?.href?.slice(window?.location?.origin?.length, window?.location?.href?.length) :
                                (window?.location?.origin + '/home' + window?.location?.search)?.slice(window?.location?.origin?.length, (window?.location?.origin + '/home' + window?.location?.search)?.length)
                            } style={String(pathname)?.endsWith(correspondingPathname[7]) || String(pathname)?.endsWith(correspondingPathname[7] + '/') ? { backgroundColor: 'rgb(54, 41, 41)' } : {}}>Home</Link>}


                            <Link to={`/${validAPIEndPoint[0]?.split('/')[3]}`} style={String(pathname)?.endsWith(correspondingPathname[0]) || String(pathname)?.endsWith(correspondingPathname[0] + '/') ? { backgroundColor: 'rgb(54, 41, 41)' } : {}}>Audios</Link>

                            <Link to={`/${validAPIEndPoint[1]?.split('/')[3]}`} style={String(pathname)?.endsWith(correspondingPathname[1]) || String(pathname)?.endsWith(correspondingPathname[1] + '/') ? { backgroundColor: 'rgb(54, 41, 41)' } : {}}>Videos</Link>

                            <Link to={`/${validAPIEndPoint[4]?.split('/')[3]}`} style={String(pathname)?.endsWith(correspondingPathname[4]) || String(pathname)?.endsWith(correspondingPathname[4] + '/') ? { backgroundColor: "rgb(54, 41, 41)" } : {}}>News</Link>

                            <Link to={`/${validAPIEndPoint[6]?.split('/')[3]}`} style={String(pathname)?.endsWith(correspondingPathname[6]) || String(pathname)?.endsWith(correspondingPathname[6] + '/') ? { backgroundColor: "rgb(54,41,41)" } : {}}>Contact</Link>
                        </div>
                    </section>

                    {String(pathname)?.endsWith(correspondingPathname[7]) || String(pathname)?.endsWith(correspondingPathname[7] + '/') ? <WebsiteLandingPage
                        addedAudios={addedAudios}
                        setAddedAudios={setAddedAudios}
                        addedVideos={addedVideos}
                        setAddedVideos={setAddedVideos}
                        addedImages={addedImages}
                        setAddedImages={setAddedImages}
                        addedUpcoming={addedUpcoming}
                        setAddedUpcoming={setAddedUpcoming}
                        addedNews={addedNews}
                        setAddedNews={setAddedNews}
                        addedBio={addedBio}
                        setAddedBio={setAddedBio}
                        addedSocials={addedSocials}
                        setAddedSocials={setAddedSocials}
                        validAPIEndPoint={validAPIEndPoint}
                        setValidAPIEndPoint={setValidAPIEndPoint}
                        bools={bools}
                        setBools={setBools}
                    /> :

                        String(pathname)?.endsWith(correspondingPathname[0]) || String(pathname)?.endsWith(correspondingPathname[0] + '/') ? <AudiosPage
                            addedAudios={addedAudios}
                            setAddedAudios={setAddedAudios}
                            addedVideos={addedVideos}
                            setAddedVideos={setAddedVideos}
                            addedImages={addedImages}
                            setAddedImages={setAddedImages}
                            addedUpcoming={addedUpcoming}
                            setAddedUpcoming={setAddedUpcoming}
                            addedNews={addedNews}
                            setAddedNews={setAddedNews}
                            addedBio={addedBio}
                            setAddedBio={setAddedBio}
                            addedSocials={addedSocials}
                            setAddedSocials={setAddedSocials}
                            validAPIEndPoint={validAPIEndPoint}
                            setValidAPIEndPoint={setValidAPIEndPoint}
                            bools={bools}
                            setBools={setBools}
                        /> :
                            String(pathname)?.endsWith(correspondingPathname[1]) || String(pathname)?.endsWith(correspondingPathname[1] + '/') ? <VideoPage
                                addedAudios={addedAudios}
                                setAddedAudios={setAddedAudios}
                                addedVideos={addedVideos}
                                setAddedVideos={setAddedVideos}
                                addedImages={addedImages}
                                setAddedImages={setAddedImages}
                                addedUpcoming={addedUpcoming}
                                setAddedUpcoming={setAddedUpcoming}
                                addedNews={addedNews}
                                setAddedNews={setAddedNews}
                                addedBio={addedBio}
                                setAddedBio={setAddedBio}
                                addedSocials={addedSocials}
                                setAddedSocials={setAddedSocials}
                                validAPIEndPoint={validAPIEndPoint}
                                setValidAPIEndPoint={setValidAPIEndPoint}
                                bools={bools}
                                setBools={setBools}
                            /> :

                                String(pathname)?.endsWith(correspondingPathname[2]) || String(pathname)?.endsWith(correspondingPathname[2] + '/') ? <ImagesPage
                                    addedAudios={addedAudios}
                                    setAddedAudios={setAddedAudios}
                                    addedVideos={addedVideos}
                                    setAddedVideos={setAddedVideos}
                                    addedImages={addedImages}
                                    setAddedImages={setAddedImages}
                                    addedUpcoming={addedUpcoming}
                                    setAddedUpcoming={setAddedUpcoming}
                                    addedNews={addedNews}
                                    setAddedNews={setAddedNews}
                                    addedBio={addedBio}
                                    setAddedBio={setAddedBio}
                                    addedSocials={addedSocials}
                                    setAddedSocials={setAddedSocials}
                                    validAPIEndPoint={validAPIEndPoint}
                                    setValidAPIEndPoint={setValidAPIEndPoint}
                                    bools={bools}
                                    setBools={setBools}
                                /> :

                                    String(pathname)?.endsWith(correspondingPathname[3]) || String(pathname)?.endsWith(correspondingPathname[3] + '/') ? <UpcomingPage
                                        addedAudios={addedAudios}
                                        setAddedAudios={setAddedAudios}
                                        addedVideos={addedVideos}
                                        setAddedVideos={setAddedVideos}
                                        addedImages={addedImages}
                                        setAddedImages={setAddedImages}
                                        addedUpcoming={addedUpcoming}
                                        setAddedUpcoming={setAddedUpcoming}
                                        addedNews={addedNews}
                                        setAddedNews={setAddedNews}
                                        addedBio={addedBio}
                                        setAddedBio={setAddedBio}
                                        addedSocials={addedSocials}
                                        setAddedSocials={setAddedSocials}
                                        validAPIEndPoint={validAPIEndPoint}
                                        setValidAPIEndPoint={setValidAPIEndPoint}
                                        bools={bools}
                                        setBools={setBools}
                                    /> :

                                        String(pathname)?.endsWith(correspondingPathname[4]) || String(pathname)?.endsWith(correspondingPathname[4] + '/') ? <NewsPage
                                            addedAudios={addedAudios}
                                            setAddedAudios={setAddedAudios}
                                            addedVideos={addedVideos}
                                            setAddedVideos={setAddedVideos}
                                            addedImages={addedImages}
                                            setAddedImages={setAddedImages}
                                            addedUpcoming={addedUpcoming}
                                            setAddedUpcoming={setAddedUpcoming}
                                            addedNews={addedNews}
                                            setAddedNews={setAddedNews}
                                            addedBio={addedBio}
                                            setAddedBio={setAddedBio}
                                            addedSocials={addedSocials}
                                            setAddedSocials={setAddedSocials}
                                            validAPIEndPoint={validAPIEndPoint}
                                            setValidAPIEndPoint={setValidAPIEndPoint}
                                            bools={bools}
                                            setBools={setBools}
                                        /> :

                                            String(pathname)?.endsWith(correspondingPathname[6]) || String(pathname)?.endsWith(correspondingPathname[6] + '/') ? <ContactPage
                                                addedAudios={addedAudios}
                                                setAddedAudios={setAddedAudios}
                                                addedVideos={addedVideos}
                                                setAddedVideos={setAddedVideos}
                                                addedImages={addedImages}
                                                setAddedImages={setAddedImages}
                                                addedUpcoming={addedUpcoming}
                                                setAddedUpcoming={setAddedUpcoming}
                                                addedNews={addedNews}
                                                setAddedNews={setAddedNews}
                                                addedBio={addedBio}
                                                setAddedBio={setAddedBio}
                                                addedSocials={addedSocials}
                                                setAddedSocials={setAddedSocials}
                                                addedBookingsInfo={addedBookingsInfo}
                                                setAddedBookingsInfo={setAddedBookingsInfo}
                                                validAPIEndPoint={validAPIEndPoint}
                                                setValidAPIEndPoint={setValidAPIEndPoint}
                                                bools={bools}
                                                setBools={setBools}

                                            /> : <Loading />}

                </main> :
                bools?.show404 ? <Page404 /> :

                    bools?.show500 ? <Page500 /> : ""

            }
        </>
    )
}

export default MotherPage;