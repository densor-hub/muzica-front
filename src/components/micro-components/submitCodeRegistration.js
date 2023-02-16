import { useRef, useState } from "react";
import { includeNumbers, includesLowerCase, includesUpperCase } from "../../FNS/includes";
import Loading from "./loading";
import axios from "axios";
import setStatuscodeErrorMessage from "../../FNS/setStatuscodeErrorMessage";
import { API_BASE_URL } from "../../Resources/BaseURL";
import { useNavigate, Link } from "react-router-dom";

import './signin.css'


const SubmitCodeRegistration = () => {
    const themeColors = { valid: "white", error: 'rgb(255, 71, 86)' };
    const [logics, setLogics] = useState({ showloading: false });
    const [feedback, setFeedback] = useState(`Check your email for verification code`);
    const navigateTo = useNavigate();

    const inputRefs = useRef([]);
    const addToInputRefs = (element) => {
        if (element && !inputRefs.current?.includes(element)) {
            inputRefs?.current?.push(element)
        }
        else {
            inputRefs?.current?.pop(element)
        }
    }

    const divContainingInputRefs = useRef([]);
    const addToDivContainingInputRefs = (element) => {
        if (element && !divContainingInputRefs?.current?.includes(element)) {
            divContainingInputRefs?.current?.push(element)
        }
        else {
            divContainingInputRefs?.current?.pop(element);
        }
    }

    const submitVerficationCode = async () => {
        setFeedback('');
        if (inputRefs?.current[0]?.value?.length < 6 || !includeNumbers(inputRefs?.current[0]?.value) || !includesLowerCase(inputRefs?.current[0]?.value) || !includesUpperCase(inputRefs?.current[0]?.value)) {
            divContainingInputRefs.current[0].style.borderBottom = `3px solid ${themeColors?.error}`;
            setFeedback('Invalid code')
        }
        else {
            divContainingInputRefs.current[0].style.borderBottom = `3px solid ${themeColors?.valid}`;

            try {
                setLogics((p) => { return { ...p, showloading: true } });
                let response = await axios?.post(`${API_BASE_URL}/register`, { code: inputRefs?.current[0]?.value });

                if (response?.status === 200) {
                    cancel();
                    setLogics((p) => { return { ...p, showloading: false, showSignin: true, showCodeForm: false } });
                    setFeedback(`Sign up successfull`);

                    setTimeout(() => {
                        navigateTo('/login')
                    }, 1500);
                }

            } catch (error) {
                setLogics(p => { return { ...p, showloading: false } });
                if (!error?.response?.data) {
                    setFeedback("Network error...")
                }
                else if (error?.response?.status === 405) {
                    setFeedback('Invalid verification code');
                }
                else {
                    setStatuscodeErrorMessage(error?.response?.status, setFeedback);
                }
            }
        }
    }

    const cancel = () => {
        inputRefs.current.forEach(element => {
            element.value = "";
        })

        setFeedback('');
    }

    return (<>

        {logics?.showloading && <Loading />}

        <main className="signin-container">
            <header>
                <Link to={'/'}>Home</Link>
                <Link to={'/login'}>Sign in</Link>
            </header>
            <div className="form-container">
                <div className="content">
                    <div className="feedback"><span style={{ visibility: "hidden", height: "0px", width: "0px", opacity: "0", overflow: "hidden" }}>.</span>{feedback}</div>

                    <form>
                        <div className="form-heading"><b>Sign Up</b></div>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label>Code</label></td>
                                    <td><div ref={addToDivContainingInputRefs} className={"code"}>
                                        <input type={"text"} ref={addToInputRefs} className={'verificationcode'} placeholder={'Verification Code'}></input></div>
                                    </td>
                                </tr>

                                <tr>
                                    <td></td>
                                    <td><button onClick={(e) => { e.preventDefault(); submitVerficationCode() }}>Submit</button></td>
                                </tr>

                            </tbody>
                        </table>
                    </form>

                </div>
            </div>
        </main>

    </>)
}

export default SubmitCodeRegistration;