import GotoRefreshEndPoint from "../../FNS/GoToRefreshEndPoint";
import setStatuscodeErrorMessage from "../../FNS/setStatuscodeErrorMessage";
import axios from "axios";
import Loading from "../micro-components/loading";
import { API_BASE_URL } from "../../Resources/BaseURL";
import { useCallback, useEffect, useRef, useState } from "react";
import useAuth from "../../customHooks/useAuth";
import { useNavigate } from "react-router-dom";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { formatEmail, formatFullName } from "../../FNS/formatString";
import DeleteProfilePictureModal from "./sub-components/deleteProfilePictureModal";
import { FaUserCircle } from 'react-icons/fa';



import '../Private-Sites/CSS/added.css';
import '../Private-Sites/CSS/settings.css'


const Settings = () => {
    const { auth, setAuth } = useAuth();
    const navigateTo = useNavigate();
    const [userDetails, setUserDetails] = useState("");
    const [bools, setBools] = useState({ showloading: false, showGenderOptionsBtns: false, editMode: false, showDeleteProfilePicturModal: false });
    const [phoneNumber, setPhoneNumber] = useState('');
    const [feeback, setFeedback] = useState('');
    const [selectedImage, setSelectedImage] = useState('');

    const genderOptions = ['Male', 'Female'];
    const colors = { valid: "white", error: "rgb(255, 71, 86)" }
    const inputRefs = useRef([]);
    const phoneContainerRef = useRef();
    const addToInputRefs = (element) => {
        if (element && !inputRefs?.current?.includes(element)) {
            inputRefs?.current?.push(element)
        }
    }

    //get userDetails
    const getUserDetails = useCallback(
        async () => {
            try {
                setBools(p => { return { ...p, showloading: true } });
                let response = await axios.get(`${API_BASE_URL}/user`, { withCredentials: true });

                if (response?.status === 200) {
                    setUserDetails(response?.data);
                    setPhoneNumber(response?.data?.phone);
                    setBools(p => { return { ...p, showloading: false } });

                    return response?.status;
                }
            } catch (error) {
                console?.log(error)
                if (!error?.response?.data) {
                    setBools((p) => { return { ...p, showloading: false } })
                    setFeedback('Network challenges...')
                }
                else {
                    if (error?.response?.status === 401) {

                        GotoRefreshEndPoint(auth).then((results) => {
                            if (results?.status === 200) {
                                getUserDetails();
                            } else {
                                navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/sign-out`)
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
        getUserDetails();
    }, [getUserDetails]);

    //feedback
    useEffect(() => {
        if (feeback) {
            setTimeout(() => {
                setFeedback('')
            }, 3000);
        }
    }, [feeback]);


    const SaveEdit = async () => {
        let validFullname, validEmail, validStagename, validPhoneNumber, validGender, emailValue = false;

        if (bools?.showGenderOptionsBtns) {
            setFeedback('Select gender')
        }
        else {
            validGender = true;
            inputRefs?.current?.forEach(element => {
                if (element?.className !== "email" && element?.value === "") {
                    setFeedback('Enter required fields');
                }
                if (element?.className === "gender" || element?.className === 'stagename' || element?.className === "fullname") {
                    if (element?.value === "") {
                        element.style.borderBottom = `3px solid ${colors?.error}`;
                    }
                    else {
                        element.style.borderBottom = `3px solid ${colors?.valid}`;
                    }
                }

                if (element?.className === 'fullname') {
                    if (!formatFullName(element?.value)) {
                        setFeedback('Invalid fullname');
                        element.style.borderBottom = `3px solid ${colors?.error}`;
                    }
                    else {
                        element.style.borderBottom = `3px solid ${colors?.valid}`;
                        validFullname = true;
                    }
                }

                if (element?.className === "email") {
                    if (element?.value) {
                        emailValue = true;

                        if (!formatEmail(element?.value)) {
                            element.style.borderBottom = `3px solid ${colors?.error}`;
                            setFeedback('Invalid email');
                        }
                        else {
                            element.style.borderBottom = `3px solid ${colors?.valid}`;
                            validEmail = true;
                        }
                    }
                }

                if (element?.className === 'stagename' && element?.value !== "") {
                    validStagename = true;
                }

            })

            if (!phoneNumber) {
                setFeedback('Enter required fields');
                document.getElementsByClassName('PhoneInput')[0].style.borderBottom = `3px solid ${colors?.error}`;
            }
            else {
                if (!isValidPhoneNumber(phoneNumber)) {
                    setFeedback('Invalid number');
                    document.getElementsByClassName('PhoneInput')[0].style.borderBottom = `3px solid ${colors?.error}`;
                }
                else {
                    console.log(phoneNumber)
                    document.getElementsByClassName('PhoneInput')[0].style.borderBottom = `3px solid ${colors?.valid}`;
                    validPhoneNumber = true;
                }
            }

            if (validFullname && ((!emailValue) || (emailValue && validEmail)) && validStagename && validPhoneNumber && validGender) {

                try {
                    setBools((p) => { return { ...p, showloading: true } });
                    let response = await axios?.post(`${API_BASE_URL}/user`,
                        { fullname: inputRefs?.current[0]?.value.trim(), phone: phoneNumber.trim(), gender: inputRefs?.current[2]?.value.trim(), stagename: inputRefs?.current[3]?.value.trim(), email: inputRefs?.current[4]?.value.trim() },
                        { withCredentials: true });

                    if (response?.status === 200) {
                        setAuth({ accessToken: response?.data?.accessToken ? response?.data?.accessToken : auth?.accessToken, id: auth?.id, stagename: response?.data?.stagename, stagenameInUrl: response?.data?.stagenameInUrl, profilePicture: response?.data?.profilePicture });
                        navigateTo(`/${response?.data?.stagenameInUrl?.trim()?.toLowerCase()}/settings`)
                        inputRefs?.current?.forEach(element => { element.readOnly = true });
                        setBools((p) => { return { ...p, showloading: false, editMode: false } });
                        setFeedback('Saved successfully')

                    }
                    else if (response?.status === 204) {
                        setBools((p) => { return { ...p, showloading: false } });
                        setFeedback('Could not save, try again later')
                    }

                } catch (error) {
                    console?.log(error)
                    if (!error?.response?.data) {
                        setBools((p) => { return { ...p, showloading: false } });
                        setFeedback('Network challenges...');
                    }
                    else {
                        if (error?.response?.status === 401) {
                            GotoRefreshEndPoint(auth).then((results) => {
                                if (results?.status === 200) {
                                    SaveEdit();
                                }
                                else {
                                    navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/sign-out`)
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
    }


    const SaveProfilePicture = () => {
        inputRefs?.current.forEach(async element => {
            if (element.type === 'file') {
                if (element.size > 1024 * 1024 * 3) {
                    setFeedback('Image size too large')
                }
                else {
                    if (element?.files?.length !== 0) {
                        setSelectedImage(prev => {
                            return {
                                ...prev,
                                url: URL.createObjectURL(element.files[0]),
                                image: element.files[0],
                            }
                        })

                        const imageFormDate = new FormData();
                        imageFormDate?.append('file', element?.files[0]);
                        //redundant, does nothin --- next line beow
                        imageFormDate?.append('image', selectedImage);
                        try {
                            setBools((p) => { return { ...p, showloading: true } })
                            let response = await axios?.post(`${API_BASE_URL}/user`, imageFormDate, { withCredentials: true });


                            if (response?.status === 200) {
                                setBools((p) => { return { ...p, showloading: false } });
                                setAuth(p => { return { ...p, profilePicture: response?.data?.profilePicture } });
                                getUserDetails().then((results) => {
                                    if (results === 200) {
                                        setBools(p => { return { ...p, showDeleteProfilePicturModal: false } })
                                        setFeedback('Display picture saved successfully');

                                    }
                                })
                            }
                        } catch (error) {
                            console?.log(error)
                            if (!error?.response?.data) {
                                setBools((p) => { return { ...p, showloading: false } });
                                setFeedback('Network challenges...');
                            }
                            else {
                                if (error?.response?.status === 401) {
                                    GotoRefreshEndPoint(auth).then((results) => {
                                        if (results?.status === 200) {
                                            SaveProfilePicture();
                                        }
                                        else {
                                            navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/sign-out`)
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
            }
        })
    }


    //feedback clearing
    useEffect(() => {
        if (feeback) {
            setTimeout(() => {
                setFeedback('');
            }, 3000);
        }
    }, [feeback])


    return (<>
        {bools?.showloading && <Loading />}
        {bools?.showDeleteProfilePicturModal && <DeleteProfilePictureModal setFeedback={setFeedback} setLogics={setBools} getData={getUserDetails} />}
        <main className="settings" style={{ paddingTop: "40px" }}>
            <div className="reset-password-request-btn">
                {!auth?.profilePicture || auth?.profilePicture === "" ? <button onClick={(e) => { e.preventDefault(); inputRefs?.current?.find(element => { return element?.type === 'file' }).click() }}>Upload DP</button> :

                    <div>
                        <button onClick={(e) => { e.preventDefault(); inputRefs?.current?.find(element => { return element?.type === 'file' }).click() }}>Change DP</button>

                        <button onClick={(e) => { e.preventDefault(); setBools((p) => { return { ...p, showDeleteProfilePicturModal: true } }) }}>Remove DP</button>
                    </div>}
            </div>


            <div className="feedback-container" style={!feeback ? { backgroundColor: "transparent", margin: "0px" } : { margin: "0px", position: "relative", top: "-5px" }}>
                <div className="feedback"><span style={{ visibility: "hidden" }}>.</span>{feeback}</div>
            </div>


            {userDetails?.length !== "" && <section className="general-settings">
                <div className="image-container">
                    {(userDetails?.profilePicture !== "" && userDetails?.profilePicture !== undefined && userDetails?.profilePicture !== null) && <img alt="" src={userDetails?.profilePicture}></img>}
                    {!(userDetails?.profilePicture !== "" && userDetails?.profilePicture !== undefined && userDetails?.profilePicture !== null) && <FaUserCircle size={'30px'} />}
                </div>


                <div className="heading">Account details</div>
                <div className="label">Full name</div>
                <div className="input-container"><input className="fullname" ref={addToInputRefs} defaultValue={userDetails?.fullname} readOnly={true}></input></div>

                <div className="label">Phone</div>
                <div className="input-container" ref={phoneContainerRef}><PhoneInput onChange={setPhoneNumber} defaultCountry={'GH'} ref={addToInputRefs} value={phoneNumber} readOnly={true} /></div>

                <div className="label">Gender</div>
                <div className="input-container">
                    {<input readOnly={true} style={bools?.showGenderOptionsBtns ? { height: '0px', width: "0px", visibility: "hidden", overflow: "hidden", opacity: "0" } : {}} className="gender" ref={addToInputRefs} defaultValue={userDetails?.gender} onChange={(e) => {
                        if (e.key !== 'Tab') {
                            setBools(p => { return { ...p, showGenderOptionsBtns: true } });
                        }
                    }}></input>}
                    {bools?.showGenderOptionsBtns && <div className="genderOptionsBtns-container">
                        {genderOptions?.map((elements, index) => {
                            return <button key={index} onClick={(e) => { e.preventDefault(); setBools(p => { return { ...p, showGenderOptionsBtns: false } }); inputRefs.current[2].value = elements }}>{elements}</button>
                        })}
                    </div>}
                </div>

                <div className="label">Stage name</div>
                <div className="input-container"><input className="stagename" ref={addToInputRefs} defaultValue={userDetails?.stagename} readOnly={true}></input></div>

                <div className="label">Email</div>
                <div className="input-container"><input className="email" ref={addToInputRefs} defaultValue={userDetails?.email} readOnly={true}></input></div>

                {bools?.editMode && <div className="decision-buttons-container">
                    <button onClick={(e) => { e.preventDefault(); SaveEdit() }}>Save</button>
                    <button onClick={(e) => { e.preventDefault(); inputRefs?.current?.forEach(element => { element.readOnly = true }); setBools(p => { return { ...p, editMode: false } }); }}>Cancel</button>
                </div>}

                {!bools?.editMode && <div className="decision-buttons-container"><button onClick={(e) => { e.preventDefault(); inputRefs?.current?.forEach(element => { element.readOnly = false }); setBools(p => { return { ...p, editMode: true } }); inputRefs?.current[0]?.focus() }}>Click here to edit</button></div>}
            </section>}


            <section>
                <div className="input-container" style={{ height: "0px", width: "0px", overflow: "0px", visibility: "hidden", opacity: "0" }}><input type={'file'} ref={addToInputRefs} onChange={(e) => { SaveProfilePicture(e); }} accept={'.jpg,.jpeg,.png'} style={{ height: "0px", width: "0px", overflow: "0px", visibility: "hidden", opacity: "0" }}></input></div>
            </section>
        </main>
    </>)
}

export default Settings;
