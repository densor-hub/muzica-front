import { useRef, useState } from "react";
import { API_BASE_URL } from '../../Resources/BaseURL';
import GotoRefreshEndPoint from '../../FNS/GoToRefreshEndPoint';
import Loading from './loading';
import setStatuscodeErrorMessage from '../../FNS/setStatuscodeErrorMessage';
import useAuth from '../../customHooks/useAuth';
import axios from "axios";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { formatEmail } from "../../FNS/formatString";
import { useNavigate } from "react-router-dom";

import './add-social-media.css';

const AddSocialMediaProfileLinks = ({ setFeedback, setCurrentContent, currentContent, content, bools, setBools, submitted }) => {

    const themeColrs = { error: "rgb(255, 71, 86)", valid: 'white' };
    const { auth } = useAuth();
    const navigateTo = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState();
    const [addedSocials, setAddedSocials] = useState([]);

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



    const Add = (PassedsocialmediaPlatform) => {
        let submittedSocialMidea = socialMediaRefs.current.find(element => { return (element?.className === PassedsocialmediaPlatform && element?.value !== "") });

        if (submittedSocialMidea !== undefined) {
            let invalidUrlprovided = false;

            if (!(new URL(submittedSocialMidea?.value?.trim())?.origin?.toLowerCase().endsWith(submittedSocialMidea?.className?.toLowerCase() + ".com"))) {
                setFeedback(`Invalid ${submittedSocialMidea?.className} url provided`);
                invalidUrlprovided = true;
            }
            else {
                try {
                    new URL(submittedSocialMidea?.value);
                } catch (error) {
                    invalidUrlprovided = true;
                    setFeedback(`Invalid ${submittedSocialMidea?.className} URL`)
                    submittedSocialMidea.style.borderBottom = `3px solid ${themeColrs?.error}`
                }

                if (!invalidUrlprovided) {
                    setAddedSocials(p => { return [...p, { id: Math.random() * new Date().getMilliseconds(), socialmedia: submittedSocialMidea?.className, profilelink: submittedSocialMidea?.value }] });
                }
            }
        }
        else {
            setFeedback('Enter link of your profile');
        }
    }


    const SaveSocialMedia = async () => {

        try {
            setBools(P => { return { ...P, showloading: true } });
            let response = await axios.post(`${API_BASE_URL}/save-social-media-platforms`, { platforms: addedSocials }, { withCredentials: true });

            if (response.status === 200) {
                if (!submitted.includes(currentContent)) {
                    submitted?.push(currentContent)
                }
                setBools(P => { return { ...P, showloading: false } });
                cancelOperation();
                setCurrentContent(content?.createsite);
                setFeedback("Added successfully")
                Next()
            }
            else if (response.status === 204) {
                setCurrentContent(content?.socials);
                setBools(P => { return { ...P, showloading: false } });
                setFeedback("Could not save, try again")
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
                            SaveSocialMedia();
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


    const changeLink = (ID) => {
        let filtered = addedSocials.filter(element => { return element.id !== ID });
        setAddedSocials(filtered);
    }

    const cancelOperation = () => {
        setAddedSocials([]);
        socialMediaRefs?.current?.forEach(element => {
            element.value = "";
            element.style.borderBottom = `3px solid ${themeColrs?.valid}`;
        })
    }


    const Back = async () => {
        try {
            setBools(p => { return { ...p, showloading: true } });
            let response = await axios.post(`${API_BASE_URL}/current-content`, { content: content?.news }, { withCredentials: true });

            if (response?.status === 200) {
                setBools(p => { return { ...p, showloading: false } });
                setFeedback("")
                setCurrentContent(content?.biography);
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
            let response = await axios.post(`${API_BASE_URL}/current-content`, { content: content?.createsite }, { withCredentials: true });

            if (response?.status === 200) {
                setFeedback("");
                setCurrentContent(currentContent?.createsite);
                // let submitWebsiteCreated = await axios.post(`${API_BASE_URL}/website-created`,{auth: auth} ,{withCredentials: true})
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

    const SaveBookingsInfo = async () => {
        setFeedback('')
        let atLeastOneRequired = [];
        let validPhoneNumber = true;
        let validEmail = true;

        BookingsInfoRefs?.current?.forEach(element => {
            if (element?.value !== "") {
                if (element?.className === 'PhoneInputInput') {
                    if (!isValidPhoneNumber(phoneNumber)) {
                        setFeedback('Invalid phone number');
                        validPhoneNumber = false;
                    }
                }

                if (element?.className === 'email') {
                    if (!formatEmail(element?.value)) {
                        setFeedback("Invalid email");
                        validEmail = false;
                    }
                }
            }
            else {
                atLeastOneRequired?.push(element)
            }

            if (atLeastOneRequired?.length === BookingsInfoRefs?.current?.length) {
                setFeedback('Enter at least one booking info');
            }
        })

        if (atLeastOneRequired?.length !== BookingsInfoRefs?.current?.length && validEmail && validPhoneNumber) {

            setBools(p => { return { ...p, showloading: true } });

            try {
                let response = await axios.post(`${API_BASE_URL}/save-bookings`, { phone: phoneNumber, email: BookingsInfoRefs?.current[1]?.value }, { withCredentials: true });

                if (response?.status === 200) {
                    if (!submitted.includes('bookings')) {
                        submitted?.push('bookings')
                    }
                    setBools(p => { return { ...p, showloading: false } });
                }
                else if (response?.status === 204) {
                    setAddedSocials([]);
                }
            } catch (error) {
                if (!error?.response?.data) {
                    setFeedback('Network challenges...')
                }
                else {
                    if (error?.response?.status === 401) {
                        GotoRefreshEndPoint(auth).then((r) => {
                            if (r.status === 200) {
                                SaveBookingsInfo();
                            } else {
                                console.log('loggggoouutttt')
                                // navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/sign-out`);
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



    return (
        <>
            {bools?.showloading && <Loading />}
            <main style={bools.showloading ? { height: "0PX", width: "0px", overflow: "hidden", opacity: "0" } : {}}>
                <section className="add-social-media">

                    {(!submitted?.includes('bookings')) ? <section className="bookings-info-form-container">
                        <div className="form-heading">Add booking info</div>
                        <form className="form1">
                            <table>
                                <tbody>
                                    <tr>
                                        <td><label>Phone</label></td>
                                        <td><PhoneInput type={'text'} value={phoneNumber} onChange={setPhoneNumber} defaultCountry={'GH'} className="phone" ref={addToBookingsInfoRefs}></PhoneInput></td>
                                    </tr>

                                    <tr>
                                        <td><label>Email</label></td>
                                        <td><input type={'text'} className='email' ref={addToBookingsInfoRefs} ></input></td>
                                    </tr>

                                    <tr>
                                        <td><button onClick={(e) => { e.preventDefault(); SaveBookingsInfo() }}>Save</button></td>
                                        <td><button onClick={(e) => { e.preventDefault(); setBools(p => { return { ...p, showEditBookings: false } }) }}>Cancel</button></td>
                                    </tr>

                                </tbody>

                            </table>
                        </form>
                    </section> :


                        <section className="social-media-form-container">
                            <div className="form-heading">Add social media</div>
                            {<form className="form2">
                                <table>
                                    <tbody>
                                        {addedSocials.find(element => { return element.socialmedia === socialmediaPlatforms.facebook }) === undefined && <tr>
                                            <td><label>FB</label></td>
                                            <td><input className={`${socialmediaPlatforms.facebook}`} ref={addToSocialMediaRefs} placeholder={'Facebook'}></input> <button onClick={(e) => { e.preventDefault(); Add(socialmediaPlatforms.facebook) }}>Add</button></td>
                                        </tr>}

                                        <tr style={{ border: "1px solid red", height: "0px", width: "0px", }}>
                                            <td style={{ border: "1px solid red", height: "0px", width: "0px", display: "none" }}></td>
                                            <td style={{ border: "1px solid red", height: "0px", width: "0px", display: "none" }}><input></input></td>
                                        </tr>

                                        {addedSocials.find(element => { return element.socialmedia === socialmediaPlatforms.instagram }) === undefined && <tr>
                                            <td><label>IG </label></td>
                                            <td><input className={`${socialmediaPlatforms.instagram}`} ref={addToSocialMediaRefs} placeholder={'Instagram'}></input> <button onClick={(e) => { e.preventDefault(); Add(socialmediaPlatforms.instagram) }}>Add</button></td>
                                        </tr>}

                                        {addedSocials.find(element => { return element.socialmedia === socialmediaPlatforms.twitter }) === undefined && <tr>
                                            <td><label>TW</label></td>
                                            <td><input className={`${socialmediaPlatforms.twitter}`} ref={addToSocialMediaRefs} placeholder={'Twitter'}></input> <button onClick={(e) => { e.preventDefault(); Add(socialmediaPlatforms.twitter) }}>Add</button></td>
                                        </tr>}

                                        {addedSocials.find(element => { return element.socialmedia === socialmediaPlatforms.tiktok }) === undefined && <tr>
                                            <td><label>tK</label></td>
                                            <td><input className={`${socialmediaPlatforms.tiktok}`} ref={addToSocialMediaRefs} placeholder={'Tiktok'}></input> <button onClick={(e) => { e.preventDefault(); Add(socialmediaPlatforms.tiktok) }}>Add</button></td>
                                        </tr>}
                                        <tr>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>}
                        </section>}



                    <div className="next-skip-back-buttons">
                        <button onClick={(e) => { e.preventDefault(); Back() }}>Back to biography</button>

                        {((bools?.showNextButton)) && <button type="submit" onClick={(e) => { e.preventDefault(); Next() }}>Next</button>}
                    </div>
                </section>

                {addedSocials?.length > 0 && <section className="added-socials">
                    <main >
                        <div className="heading">Added Social Media</div>
                        <section className="added-socialss">
                            {addedSocials.map(element => {
                                return <div className="individual-social-media" key={element.id}><span>I</span> <span>{element.socialmedia[0].toUpperCase() + element.socialmedia.slice(1, element?.socialmedia?.length)}</span> <span>{element?.profilelink?.length > 30 ? element.profilelink?.slice(0, 25) + `...` : element?.profilelink}</span> <span><button onClick={(e) => { e.preventDefault(); changeLink(element.id) }}>Change link</button></span></div>
                            })}
                        </section>



                    </main>

                    {addedSocials?.length > 0 && <div className="next-skip-back-buttons">
                        <button onClick={(e) => { e.preventDefault(); SaveSocialMedia() }}>Save </button>
                    </div>}
                </section>}
            </main>
        </>
    )
}

export default AddSocialMediaProfileLinks;