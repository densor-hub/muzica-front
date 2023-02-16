import axios from "axios";
import { useState, useEffect, useRef, useCallback } from "react";
import GotoRefreshEndPoint from "../../FNS/GoToRefreshEndPoint";
import { API_BASE_URL } from "../../Resources/BaseURL";
import useAuth from "../../customHooks/useAuth";
import setStatuscodeErrorMessage from "../../FNS/setStatuscodeErrorMessage";
import Loading from "../micro-components/loading";
import { useNavigate, Link } from "react-router-dom";
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { formatEmail } from '../../FNS/formatString';
import { SiTiktok } from 'react-icons/si';
import { BsInstagram } from 'react-icons/bs';
import { AiOutlineTwitter, AiOutlineMail } from 'react-icons/ai';
import { FaFacebook } from 'react-icons/fa';
import { FiPhoneCall } from 'react-icons/fi';

import './CSS/added.css'
import './CSS/added-socials-booking.css';

const AddedSocials = () => {
    const themeColrs = { error: "rgb(255, 71, 86)", valid: 'white' };
    const { auth } = useAuth();
    const navigateTo = useNavigate();
    const [addedSocials, setAddedSocials] = useState("");
    const [bookingsInfo, setBookingsInfo] = useState('');
    const [feedback, setFeedback] = useState("");
    const [bookingsFeedback, setBookingsFeedback] = useState('');
    const [bools, setBools] = useState({ showloading: false, showEditSocials: false, toggle: false, showEditBookings: false });
    const [phoneNumber, setPhoneNumber] = useState();

    const socialmediaPlatforms = { facebook: "facebook", twitter: "twitter", instagram: "instagram", tiktok: "tiktok" }
    const socialMediaRefs = useRef([]);
    const addToSocialMediaRefs = (element) => {
        if (element && !socialMediaRefs.current.includes(element)) {
            socialMediaRefs.current.push(element)
        }
        else {
            socialMediaRefs.current.pop(element)
        }
    }

    const BookingsInfoRefs = useRef([]);
    const addToBookingsInfoRefs = (element) => {
        if (element && !BookingsInfoRefs?.current?.includes(element)) {
            BookingsInfoRefs?.current?.push(element)
        }
        else {
            BookingsInfoRefs?.current?.pop(element);
        }
    }

    const SaveSocials = async () => {
        setFeedback('')
        setBookingsFeedback('');

        let optionalButSomeRequired = [];
        let invalidUrlprovided = false;
        let iterator = 0;
        let addeValidSocials = [];

        socialMediaRefs.current?.forEach(element => {
            iterator = iterator + 1;

            //////////////////////////???****************************************************************************************************
            if (element?.value !== "") {
                if (element?.value?.startsWith('https://')) {
                    try {
                        new URL(element?.value?.trim())?.origin?.toLowerCase().endsWith(element?.className?.toLowerCase() + ".com");
                    } catch (error) {
                        invalidUrlprovided = true;
                        setFeedback(`Invalid ${element?.className} URL`);
                        element.style.borderBottom = `3px solid ${themeColrs?.error}`;
                    }

                    if (!invalidUrlprovided) {
                        if (element?.value !== "") {
                            element.style.borderBottom = `3px solid ${themeColrs?.valid}`;
                            addeValidSocials?.push({ id: Math.random() * new Date().getMilliseconds(), socialmedia: element?.className, profilelink: element?.value })
                        }
                    }
                } else {
                    invalidUrlprovided = true;
                    setFeedback(`Invalid ${element?.className} URL`);
                    element.style.borderBottom = `3px solid ${themeColrs?.error}`;
                }
            }
        })

        if (optionalButSomeRequired?.length === socialMediaRefs?.current?.length) {
            setFeedback('Submit at least one social media profile')
        }

        else if (optionalButSomeRequired?.length !== socialMediaRefs?.current?.length && !invalidUrlprovided && iterator === socialMediaRefs?.current?.length && addeValidSocials?.length !== 0) {

            try {
                setBools(p => { return { ...p, showloading: true } })
                let response = await axios.post(`${API_BASE_URL}/save-social-media-platforms`, { platforms: addeValidSocials, not_current_content: true }, { withCredentials: true });

                if (response.status === 200) {

                    cancelOperation();
                    getData().then(() => {
                        setBools(p => { return { ...p, showloading: false, showEditSocials: false } });
                        setFeedback("Saved successfully");;
                    })
                }
                else if (response?.status === 204) {

                    cancelOperation();
                    getData().then(() => {
                        setBools(p => { return { ...p, showloading: false, showEditSocials: false } });
                        setFeedback("No match found");
                    })
                }
            } catch (error) {
                console.log(error)
                if (!error?.response?.data) {
                    setBools(p => { return { ...p, showloading: false } });
                    setFeedback('Network error...')
                }
                else {
                    if (error?.response?.status === 401) {
                        GotoRefreshEndPoint(auth).then((r) => {
                            if (r.status === 200) {
                                SaveSocials();
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


    const getData = useCallback(
        async () => {

            try {
                setBools(p => { return { ...p, showloading: true } });
                let response = await axios.get(`${API_BASE_URL}/get-added-socialmedia`, { withCredentials: true });

                if (response?.status === 200) {
                    setAddedSocials(response?.data?.addedItems[0]);
                    setBookingsInfo(response?.data.bookings);
                    setPhoneNumber(response?.data?.bookings?.phone);
                    setBools(p => { return { ...p, showloading: false } });
                }
                else if (response?.status === 204) {
                    setAddedSocials([]);
                    setBools(p => { return { ...p, showloading: false } });
                    setFeedback('No contact info found...')
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


    const cancelOperation = () => {
        setAddedSocials([]);
        socialMediaRefs?.current?.forEach(element => {
            element.value = "";
            element.style.borderBottom = `3px solid ${themeColrs?.valid}`;
        })
    }

    const SaveBookingsInfo = async () => {
        setFeedback('')
        setBookingsFeedback('');
        let atLeastOneRequired = [];
        let validPhoneNumber = true;
        let validEmail = true;

        BookingsInfoRefs?.current?.forEach(element => {
            if (element?.value !== "") {
                if (element?.className === 'PhoneInputInput') {
                    if (!isValidPhoneNumber(phoneNumber)) {
                        setBookingsFeedback('Invalid phone number');
                        validPhoneNumber = false;
                    }
                }

                if (element?.className === 'email') {
                    if (!formatEmail(element?.value)) {
                        setBookingsFeedback("Invalid email");
                        validEmail = false;
                    }
                }
            }
            else {
                atLeastOneRequired?.push(element)
            }

            if (atLeastOneRequired?.length === BookingsInfoRefs?.current?.length) {
                setBookingsFeedback('Enter at least one booking info');
            }
        })

        if (atLeastOneRequired?.length !== BookingsInfoRefs?.current?.length && validEmail && validPhoneNumber) {

            setBools(p => { return { ...p, showloading: true } });

            try {
                let response = await axios.post(`${API_BASE_URL}/save-bookings`, { phone: phoneNumber, email: BookingsInfoRefs?.current[1]?.value, not_current_content: true }, { withCredentials: true });

                if (response?.status === 200) {
                    getData().then(() => {
                        setBools(p => { return { ...p, showloading: false, showEditBookings: false } });
                        setBookingsFeedback('Saved successfully')

                    });
                }
                else if (response?.status === 204) {
                    setAddedSocials([]);
                }
            } catch (error) {
                if (!error?.response?.data) {
                    setBools((p) => { return { ...p, showloading: false } })
                    setFeedback('Network challenges...');
                }
                else {
                    if (error?.response?.status === 401) {
                        GotoRefreshEndPoint(auth).then((r) => {
                            if (r.status === 200) {
                                SaveBookingsInfo();
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
        }

    }

    //cleaing feedback 
    useEffect(() => {
        if (feedback || bookingsFeedback) {
            setTimeout(() => {
                if (feedback) {
                    setFeedback("")
                }
                if (bookingsFeedback) {
                    setBookingsFeedback('')
                }

            }, 3000);
        }
    }, [feedback, bookingsFeedback])
    return (
        <>
            {bools?.showloading && <Loading />}
            <main >

                <div className="page-heading" style={{ paddingTop: "40px" }}>ADDED <i><b>CONTACT</b></i></div>

                <div className="feedback-container" style={!feedback ? { backgroundColor: "transparent" } : {}}>
                    <div className="feeback">{feedback}<span style={{ visibility: "hidden" }}>.</span></div>
                </div>

                {addedSocials?.length === 0 && <div style={{ textAlign: "center", marginBottom: "15px" }}><Link to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/createwebsite`}>Create website</Link></div>}


                {<section className="added-social-media" style={addedSocials?.length === 0 ? { borderTop: '1px solid white', width: "70vw", height: "1px", padding: "0px", overflow: "hidden" } : {}}>
                    {addedSocials?.length !== 0 &&
                        !bools.showEditSocials ? <div className="added-socials-in-icons">
                        <div className="heading">Added Social Media</div>
                        <div className="icons">
                            {addedSocials !== undefined && addedSocials?.platforms?.platforms.find(element => { return element.socialmedia === socialmediaPlatforms.facebook }) !== undefined && <span><FaFacebook size={"20px"} /></span>}
                            {addedSocials !== undefined && addedSocials?.platforms?.platforms.find(element => { return element.socialmedia === socialmediaPlatforms.instagram }) !== undefined && <span><BsInstagram size={"20px"} /></span>}
                            {addedSocials !== undefined && addedSocials?.platforms?.platforms.find(element => { return element.socialmedia === socialmediaPlatforms.twitter }) !== undefined && <span><AiOutlineTwitter size={"20px"} /></span>}
                            {addedSocials !== undefined && addedSocials?.platforms?.platforms.find(element => { return element.socialmedia === socialmediaPlatforms.tiktok }) !== undefined && <span><SiTiktok size={"20px"} /></span>}

                        </div>
                        <div className="btn-container">
                            <button onClick={(e) => { e.preventDefault(); setBools(p => { return { ...p, showEditSocials: true } }) }}>Edit</button>
                        </div>
                    </div> :

                        <form>
                            <table>
                                <tbody>
                                    {addedSocials !== undefined && addedSocials?.platforms?.platforms?.map((element) => {
                                        return (
                                            <tr key={element?.id}>
                                                <td><label>{element?.socialmedia[0]?.toUpperCase() + element?.socialmedia?.slice(1, element?.socialmedia?.length)?.toLowerCase()}</label></td>
                                                <td><input className={`${element?.socialmedia}`} ref={addToSocialMediaRefs} defaultValue={element?.profilelink}></input></td>
                                            </tr>
                                        )

                                    })}

                                    {addedSocials?.platforms?.platforms.find(element => { return element.socialmedia === socialmediaPlatforms.facebook }) === undefined &&
                                        <tr>
                                            <td> <label>Facebook</label></td>
                                            <td><input ref={addToSocialMediaRefs} className="facebook"></input></td>
                                        </tr>}


                                    {addedSocials?.platforms?.platforms.find(element => { return element.socialmedia === socialmediaPlatforms.instagram }) === undefined &&
                                        <tr>
                                            <td> <label>Instagram</label></td>
                                            <td><input ref={addToSocialMediaRefs} className='instagram'></input></td>
                                        </tr>}


                                    {addedSocials?.platforms?.platforms.find(element => { return element.socialmedia === socialmediaPlatforms.twitter }) === undefined &&
                                        <tr>
                                            <td> <label>Twitter</label></td>
                                            <td><input ref={addToSocialMediaRefs} className={'twitter'}></input></td>
                                        </tr>}


                                    {addedSocials?.platforms?.platforms.find(element => { return element.socialmedia === socialmediaPlatforms.tiktok }) === undefined &&
                                        <tr>
                                            <td> <label>Tiktok</label></td>
                                            <td><input ref={addToSocialMediaRefs} className='tiktok'></input></td>
                                        </tr>}

                                    <tr>
                                        <td><button onClick={(e) => { e.preventDefault(); SaveSocials() }}>Save</button></td>
                                        <td><button onClick={(e) => { e.preventDefault(); setBools(p => { return { ...p, showEditSocials: false } }) }}>Cancel</button></td>
                                    </tr>

                                </tbody>
                            </table>
                        </form>
                    }
                </section>}


                {addedSocials?.length !== 0 && <section>

                    <div className="feedback-container" style={!bookingsFeedback ? { backgroundColor: "transparent" } : {}}>
                        <div className="feeback">{!bools?.showDeleteModal && bookingsFeedback}</div>
                    </div>
                    {bookingsInfo === null || bools?.showEditBookings ? <section className="bookings">

                        <div className="heading">Add booking info</div>
                        <form>
                            <table>
                                <tbody>
                                    <tr>
                                        <td><label>Phone</label></td>
                                        <td><PhoneInput type={'text'} value={phoneNumber} onChange={setPhoneNumber} defaultCountry={'GH'} className="phone" ref={addToBookingsInfoRefs}></PhoneInput></td>
                                    </tr>

                                    <tr>
                                        <td><label>Email</label></td>
                                        <td><input type={'text'} className='email' ref={addToBookingsInfoRefs} defaultValue={bookingsInfo?.email}></input></td>
                                    </tr>

                                    <tr>
                                        <td><button onClick={(e) => { e.preventDefault(); SaveBookingsInfo() }}>Save</button></td>
                                        <td><button onClick={(e) => { e.preventDefault(); setBools(p => { return { ...p, showEditBookings: false } }) }}>Cancel</button></td>
                                    </tr>

                                </tbody>

                            </table>
                        </form>

                    </section> :

                        <section className="bookings">

                            <div className="heading">Bookings Info</div>
                            <div style={{ textAlign: "center" }}><FiPhoneCall size={'20px'} /></div>
                            <div style={{ textAlign: "center" }}>{bookingsInfo?.phone}</div>
                            <div style={{ textAlign: "center" }}><AiOutlineMail size={"20px"} /></div>
                            <div style={{ textAlign: "center" }}>{bookingsInfo?.email}</div>

                            <div className="btn-container" style={{ textAlign: "center", marginTop: "10px" }}>
                                <button onClick={(e) => { e.preventDefault(); setBools(p => { return { ...p, showEditBookings: true } }) }}>Edit</button>
                            </div>

                        </section>}
                </section>}

                {!bools?.showloading && addedSocials?.length === 0 && bookingsInfo?.length === 0 && <div style={{ textAlign: "center" }}>No results found</div>}

            </main>
        </>
    )
}

export default AddedSocials;