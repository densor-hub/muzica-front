import { Link } from "react-router-dom";
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import Loading from './loading'
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from '../../customHooks/useAuth';
import { includeNumbers, includesLowerCase, includesSymbols, includesUpperCase } from "../../FNS/includes";
import axios from 'axios';
import { API_BASE_URL } from "../../Resources/BaseURL";
import setStatuscodeErrorMessage from "../../FNS/setStatuscodeErrorMessage";
import { BsFillUnlockFill, BsFillLockFill } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineCopyright } from 'react-icons/ai'


import './signin.css'

const SignIn = ({ Parentfeedback }) => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [feedback, setFeedback] = useState('');
    const [logics, setLogics] = useState({ showloading: false, showPassword: false });

    const inputRefs = useRef([]);
    const addToInputRefs = (element) => {
        if (element && !inputRefs.current?.includes(element)) {
            inputRefs?.current?.push(element)
        }
        else {
            inputRefs?.current?.pop(element)
        }
    }

    const hidePassword = () => {
        inputRefs.current.find((element) => {
            return element.className === 'password'
        }).type = "password"

        setLogics(p => { return { ...p, showPassword: false } });
    }

    const viewPassword = () => {
        inputRefs.current.find((element) => {
            return element.className === 'password'
        }).type = "text"

        setLogics(p => { return { ...p, showPassword: true } });
    }


    const Login = async () => {
        setFeedback('')
        let password;
        setFeedback('')
        inputRefs.current.forEach(element => {
            if (element.className === "password") {
                password = element?.value;
                if (password) {

                    if (password?.length < 8) {
                        setFeedback('Phone number or password incorrect')
                    }
                    else {
                        if (!((includeNumbers(password) && includesUpperCase(password) && includesLowerCase(password))
                            || (includesSymbols(password) && includesUpperCase(password) && includesLowerCase(password))
                            || (includeNumbers(password) && includesUpperCase(password) && includesLowerCase(password) && includesSymbols(password)))) {
                            setFeedback('Phone number or password incorrect')
                        }
                    }
                }
                else {
                    setFeedback('Enter all fields')
                }
            }

            if (element.className === 'PhoneInputInput') {
                if (!phoneNumber) {
                    setFeedback("Enter all fields");
                }
                else {
                    if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
                        setFeedback('Phone number or password incorrect')
                    }
                }
            }
        })

        if (phoneNumber !== '' && phoneNumber !== undefined && isValidPhoneNumber(phoneNumber) && password !== "" && password !== undefined && ((includeNumbers(password) && includesUpperCase(password) && includesLowerCase(password))
            || (includesSymbols(password) && includesUpperCase(password) && includesLowerCase(password))
            || (includeNumbers(password) && includesUpperCase(password) && includesLowerCase(password) && includesSymbols(password)))) {

            const loginInfo = { username: phoneNumber, password: password };
            setLogics(p => { return { ...p, showloading: true } })


            try {
                const response = await axios.post(`${API_BASE_URL}/sign-in/local`, loginInfo, { withCredentials: true });

                console.log(response)
                if (response?.status === 200) {
                    setAuth(response?.data);
                    setLogics(p => { return { ...p, showloading: false } });
                    navigate(`/${response?.data?.stagenameInUrl?.trim()?.toLowerCase()}`)
                }
            } catch (error) {
                console.log(error)
                setLogics(p => { return { ...p, showloading: false } });
                if (!error?.response?.data) {
                    setFeedback("Network error...");
                }
                else if (error?.response?.status === 405) {
                    setFeedback("Wrong username or password");
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

    const SignInWithGoogle = async () => {
        window?.open(`${API_BASE_URL}/sign-in/google`, '_self');
    }

    return (
        <>
            <main className="signin-container">
                <header>
                    <Link to={'/'}>Home</Link>
                    <Link to={'/register'}>Sign up</Link>
                </header>
                <div className="form-container">
                    <div className="content">
                        <div className="feedback">
                            <span style={{ visibility: "hidden", height: "0px", width: "0px", opacity: "0", overflow: "hidden" }}>.</span>{feedback && feedback} {!feedback && Parentfeedback && Parentfeedback}
                        </div>

                        <form>
                            <div className="form-heading"><b>Sign in</b></div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td><label>Phone</label></td>
                                        <td>
                                            <div>
                                                <PhoneInput ref={addToInputRefs} onChange={setPhoneNumber} value={phoneNumber} defaultCountry={'GH'} />
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td><label>Password</label></td>
                                        <td>
                                            <div className="password">
                                                <input type={"password"} autoComplete={"current-password"} ref={addToInputRefs} className={"password"}></input>
                                                <span>{logics?.showPassword ? <button onClick={(e) => { e.preventDefault(); hidePassword() }}><BsFillUnlockFill /></button> : <button onClick={(e) => { e.preventDefault(); viewPassword() }}>< BsFillLockFill /></button>}</span>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr >
                                        <td style={{ textAlign: "center" }}><button className="submit" type="submit" onClick={(e) => { e.preventDefault(); Login() }}>Sign in</button></td>
                                        <td style={{ textAlign: "center" }}><button className="submit" type="reset" onClick={(e) => { e.preventDefault(); cancel() }}>Cancel</button></td>
                                    </tr>

                                </tbody>
                            </table>
                        </form>

                        <div className="sign-in-with-google"><Link to={'/reset-password'}>Forgot password? </Link></div>
                        <div className="not-having-account">Do not have an account? sign up <Link to={'/register'}>here</Link> </div>
                        <div className="sign-in-with-google" style={{ marginTop: "5px" }}>
                            <button style={{ textDecoration: "none" }} onClick={(e) => { e.preventDefault(); SignInWithGoogle(); setAuth({ goToGoogle: true }) }}>
                                Sign in with
                                <span style={{ background: "transparent", fontWeight: "bold", border: "0PX", position: "relative", left: "5px" }}>
                                    <FcGoogle />
                                    {/* <span className="blue">G</span>
                                <span className="red">o</span>
                                <span className="yellow">o</span>
                                <span className="blue">g</span>
                                <span className="green">l</span>
                                <span className="red">e</span> */}
                                </span>
                            </button>
                        </div>



                    </div>
                </div>

                <footer>  <span style={{ position: "relative", top: "2px" }}><AiOutlineCopyright /></span>  {new Date().getFullYear()} GoldCoast University</footer>
            </main>

            {logics?.showloading && <Loading />}
        </>
    )
}

export default SignIn;