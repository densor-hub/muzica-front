import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../Resources/BaseURL';
import { Link } from 'react-router-dom'
import { CovertMonthNumbersToAlphabets } from '../../FNS/MonthNumberToAlphabets'
import SpecificAudioModal from '../micro-components/specificAudioModal';
import { equal_To_Or_Bigger_Than_Toadys_Date } from '../../FNS/DurationValidator';
import { SiTiktok } from 'react-icons/si';
import { BsInstagram } from 'react-icons/bs';
import { AiOutlineTwitter, AiOutlineCopyright } from 'react-icons/ai';
import { FaFacebook } from 'react-icons/fa';
import { BsYoutube } from 'react-icons/bs';
import { ImSoundcloud, ImSpotify } from 'react-icons/im';
import { FaItunesNote } from 'react-icons/fa';
import { SiAudiomack } from 'react-icons/si';


import './CSS/website.css';

const Website = ({ addedAudios, setAddedAudios, addedVideos, setAddedVideos, addedImages, setAddedImages, addedUpcoming, setAddedUpcoming, addedNews, setAddedNews, addedBio, setAddedBio, addedSocials, setAddedSocials, validAPIEndPoint, setValidAPIEndPoint, setBools }) => {

    const [showSpecificAudioModal, setShowSpecificAudioModal] = useState(false);
    const [selectedAudio, setSelectedAudio] = useState([]);
    const [readMoreAboutMe, setReadMoreAboutMe] = useState(false);

    const getData = useCallback(async () => {
        try {
            let response = await axios.get(`${API_BASE_URL}${window?.location?.pathname}${window?.location?.search}`, {});

            console.log(response?.data)

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
        getData();
    }, [getData])

    let randomlySelectedNews = Math.floor(Math.random() * addedNews?.length);
    let randomlySelectedImage = Math.floor(Math.random() * addedImages?.length);


    console.log(addedUpcoming)
    return (
        <>
            {<main className="homepage">
                <section className="topImage" >
                    <div className='imageContainer'></div>
                    <div className='galleryBTNcontainer'><Link to={`/${validAPIEndPoint[2]?.split('/')[3]}`}><b>Gallery</b></Link></div>
                </section>

                <section className='mid-section'>
                    <div className="upcoming">
                        <div className='heading'>UPCOMING</div>
                        {addedUpcoming?.length > 0 &&
                            addedUpcoming.sort((a, b) => { return new Date(a?.date) - new Date(b?.date) })
                                .filter((element) => {
                                    return (equal_To_Or_Bigger_Than_Toadys_Date(String(element?.date)));
                                })
                                .map(elements => {
                                    let dateInAlphabets = CovertMonthNumbersToAlphabets(elements?.date);
                                    return (<div key={elements._id}>{
                                        <section className='data'>
                                            <div className='date-container'>
                                                <div className="date">
                                                    <div className="day">{dateInAlphabets?.split('-')[2]}</div>
                                                    <div className="month">{dateInAlphabets?.split('-')[1]}</div>
                                                    <div className="year">{dateInAlphabets?.split('-')[0]}</div>
                                                </div>
                                            </div>

                                            <div className='details-container'>
                                                <div className='details'>
                                                    <div className='type'>{elements?.type}</div>
                                                    {elements?.type === 'New release' && <div className='location'> {elements?.specifics[0]?.toUpperCase() + elements?.specifics?.slice(1, elements?.specifics?.length)?.toLowerCase()}</div>}
                                                    {elements?.type === 'Tour' && <div className='location'> Location : {elements?.specifics[0]?.toUpperCase() + elements?.specifics?.slice(1, elements?.specifics?.length)?.toLowerCase()}</div>}
                                                    {elements?.type === 'Event' && <div className='location'>Venue : {elements?.specifics[0]?.toUpperCase() + elements?.specifics?.slice(1, elements?.specifics?.length)?.toLowerCase()}</div>}
                                                    <div className='description'>{elements?.description}</div>
                                                </div>
                                            </div>

                                        </section>

                                    } </div>)


                                })}

                        {addedUpcoming?.filter((element) => {
                            return (equal_To_Or_Bigger_Than_Toadys_Date((element?.date)));
                        })?.length === 0 && <div style={{ width: "80%", textAlign: "center", margin: "0 auto", marginBottom: "10px" }}> <i>Check here from time to time for my upcoming stuff</i>
                            </div>}
                    </div>


                    <div className="about-me">
                        <div className='heading'>ABOUT ME</div>
                        <div className='bio'>{
                            addedBio?.length > 0 &&

                            <div>
                                {!readMoreAboutMe && <div>
                                    {addedBio[0]?.biography.slice(0, 300)}<span className='more'><i>{addedBio[0]?.biography.length > 300 && <Link to={''} onClick={(e) => { e.preventDefault(); setReadMoreAboutMe(true) }}>{'...read more'}</Link>}</i></span>
                                </div>}
                                {readMoreAboutMe && <div>
                                    {addedBio[0]?.biography}
                                    <span className='more'><i><Link to={''} onClick={(e) => { e.preventDefault(); setReadMoreAboutMe(false) }}>{'...fold up'}</Link></i></span>
                                </div>}
                            </div>

                        }</div>
                        {addedImages?.length > 0 && <img alt='' src={`${addedImages[randomlySelectedImage]?.image}`}></img>}

                    </div>

                    <div className='songs'>
                        <div className='heading'>RECENT SONGS</div>
                        <div className='recent-songs'>
                            {addedAudios?.length > 0 && addedAudios.sort((a, b) => { return new Date(b?.datereleased) - new Date(a?.datereleased) })
                                .filter((element, index) => { return index < 2 })
                                .map(elements => {
                                    return <div className='individual-song' key={elements?._id}>
                                        <section onClick={(e) => { e.preventDefault(); setSelectedAudio({ audio: elements }); setShowSpecificAudioModal(true) }}>
                                            <img alt='' src={`${elements?.coverart}`}></img>
                                            <div>{elements?.title[0].toUpperCase() + elements?.title?.slice(1, elements?.title?.length).toLowerCase()}</div>

                                            <div className="details-conatiner">
                                                <div className="date-released" style={{ color: "wheat", fontSize: "small" }}>Released</div>
                                                <div className="date-released" style={{ marginBottom: "5px" }}> {CovertMonthNumbersToAlphabets(elements?.datereleased)}</div>
                                                <div className="date-released" style={{ color: "wheat", fontSize: "small" }}>Platforms</div>
                                                <div className="added-streaming-platforms">
                                                    <section className="platforms">
                                                        <div>{elements?.youtube !== "" && <Link onClick={(e) => { e.preventDefault(); window?.open(elements?.youtube, '_blank') }} to={""}><BsYoutube size={'15PX'} /></Link>}</div>

                                                        <div>{elements?.audiomack !== "" && <Link to={""} onClick={(e) => { e.preventDefault(); window?.open(elements?.audiomack, '_blank') }}><SiAudiomack size={'15px'} /></Link>}</div>

                                                        <div>{elements?.spotify !== "" && <Link to={""} onClick={(e) => { e.preventDefault(); window?.open(elements?.spotify, '_blank') }}><ImSpotify size={'15PX'} /></Link>}</div>

                                                        <div>{elements?.applemusic !== "" && <Link to={""} onClick={(e) => { e.preventDefault(); window?.open(elements?.applemusic, '_blank') }}><FaItunesNote size={'15PX'} /></Link>}</div>

                                                        <div>{elements?.soundcloud !== "" && <Link to={""} onClick={(e) => { e.preventDefault(); window?.open(elements?.soundcloud, '_blank') }}><ImSoundcloud size={'15PX'} /></Link>}</div>
                                                    </section>
                                                </div>
                                            </div>
                                        </section>

                                    </div>
                                })}
                        </div>
                        {addedAudios?.length > 2 && <div className='more'><i><Link to={`/${validAPIEndPoint[0]?.split('/')[3]}`}>...get more songs</Link></i></div>}

                    </div>
                </section>

                <section className='bottom-section'>
                    <div className='latest-videos'>
                        <div className='heading'>VIDEOS</div>
                        <div className='videos'>
                            {addedVideos.sort((a, b) => { return new Date(b.dateReleased) - new Date(a?.dateReleased) })
                                .filter((element, index) => { return index < 3 })
                                .map(elements => {
                                    return (
                                        <a key={elements?._id} target={'_blank'} href={elements?.link} rel={"noreferrer"} style={{ color: "white" }}>
                                            <div className='individual-video'>
                                                <iframe src={new URL(elements?.link)?.search !== "" ? `https://youtube.com/embed/${new URL(elements?.link)?.search?.split('=')[1]}?autoplay=1&mute=1&controls=0&loop=1` :
                                                    `https://youtube.com/embed${new URL(elements?.link)?.pathname}?autoplay=1&mute=1&controls=0&loop=1`}

                                                    title={elements?.title}></iframe>
                                                <div>{elements?.title[0]?.toUpperCase() + elements?.title?.slice(1, elements?.length)?.toLowerCase()}</div>
                                            </div>
                                        </a>
                                    )
                                })}
                        </div>
                        {addedVideos?.length > 3 && <div className='more' style={{ marginTop: "10px" }}><i> <Link to={`/${validAPIEndPoint[1]?.split('/')[3]}`}>...get more videos</Link></i></div>}
                    </div>

                    <div className='news'>
                        <div className='heading'>NEWS</div>

                        <div className='headline'>{addedNews.length > 0 && addedNews[randomlySelectedNews]?.headline.toUpperCase()}</div>

                        <div className='news-container'>
                            <div className='news-details'>{addedNews.length > 0 && addedNews[randomlySelectedNews]?.details?.length > 300 ? addedNews[randomlySelectedNews]?.details.slice(0, 200)[0].toUpperCase() + addedNews[randomlySelectedNews]?.details?.slice(0, 200).slice(1, addedNews[randomlySelectedNews]?.details?.slice(0, 200)?.length)?.toLowerCase() : addedNews?.length > 0 && addedNews[randomlySelectedNews]?.details[0].toUpperCase() + addedNews[randomlySelectedNews]?.details?.slice(0, addedNews[randomlySelectedNews]?.details?.length)}<span>{addedNews[randomlySelectedNews]?.details?.length > 300 && <i>...</i>}</span></div>

                            <div className='image'>
                                <div className='cover'></div>
                            </div>
                            <span className='more'>{addedNews[randomlySelectedNews]?.details?.length > 300 && <i><Link to={'/news' + window?.location?.search}>...read more here</Link></i>}</span>
                        </div>
                    </div>

                    <div className='social-media'>
                        <div className='gallery'>
                            <div className='heading'>GALLERY</div>
                            <div className='img'>
                                <div className='cover'><Link to={`/${validAPIEndPoint[2]?.split('/')[3]}`}>My gallery</Link></div>
                            </div>
                        </div>


                        <div className='socials'>
                            <div className='heading'>LET'S CONNECT</div>
                            {addedSocials?.length > 0 && addedSocials[0]?.platforms?.platforms?.map(elements => {
                                return (<div className='individual-social-media' key={elements?.id}>
                                    <Link to={``} onClick={(e) => { e.preventDefault(); window?.open(elements?.profilelink, '_blank') }}>
                                        <div className='gridder'>
                                            <span>{
                                                elements?.socialmedia === 'facebook' ? <span><FaFacebook size={"20px"} /></span> :
                                                    elements?.socialmedia === 'instagram' ? <span><BsInstagram size={'20px'} /></span> :
                                                        elements?.socialmedia === 'twitter' ? <span><AiOutlineTwitter size={"20px"} /></span> :
                                                            elements?.socialmedia === 'tiktok' ? <span><SiTiktok size={"20px"} /></span> : ""}
                                            </span>

                                            <span>{elements?.socialmedia[0]?.toUpperCase() + elements?.socialmedia?.slice(1, elements?.socialmedia?.length)?.toLowerCase()}</span>
                                        </div>
                                    </Link>
                                </div>)
                            })}
                        </div>


                    </div>

                </section>

                <section className='footer'><span> </span> <AiOutlineCopyright size={'20PX'} /> <span style={{ position: "relative", left: "10px" }}>{+new Date()?.getFullYear() + " GoldCoast University"}</span>
                </section>
            </main>}

            {showSpecificAudioModal && <SpecificAudioModal audio={selectedAudio} setShowModal={setShowSpecificAudioModal}></SpecificAudioModal>}
        </>
    )
}

export default Website;