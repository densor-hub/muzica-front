import { Link } from "react-router-dom";
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import { useRef, useState } from "react";
import { includeNumbers, includesLowerCase, includesSymbols, includesUpperCase } from "../../FNS/includes";
import axios from 'axios';
import { API_BASE_URL } from "../../Resources/BaseURL";
import setStatuscodeErrorMessage from '../../FNS/setStatuscodeErrorMessage';
import SignIn from "../micro-components/signin";
import Loading from "../micro-components/loading";
import { useNavigate } from "react-router-dom";
import { BsFillUnlockFill, BsFillLockFill } from 'react-icons/bs';


import '../micro-components/signin.css'

const ResetPassword_Public = () => {
    const navigateTo = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [feedback, setFeedback] = useState('');
    const [logics, setLogics] = useState({ showPassword: false, showConfirmPassword: false, showloading: false, showSignin: false, showCodeForm: false })
    const [inputValuesForSynchronusRendering, setInpuValuesForSynchronousRendering] = useState({ password: "", confirmPassword: "" });

    const themeColors = { valid: "white", error: 'rgb(255, 71, 86)' }
    const [inputDirectives, setInptDirectives] = useState({ password: false, confirmpassword: false })


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
    const phonenumnerDivRef = useRef();
    const addToDivContainingInputRefs = (element) => {
        if (element && !divContainingInputRefs?.current?.includes(element)) {
            divContainingInputRefs?.current?.push(element)
        }
        else {
            divContainingInputRefs?.current?.pop(element);
        }
    }

    const hidePassword = () => {
        inputRefs.current.find((element) => {
            return element.className === 'password'
        }).type = "password"

        setLogics(p => { return { ...p, showPassword: false } })
    }

    const viewPassword = () => {
        inputRefs.current.find((element) => {
            return element.className === 'password'
        }).type = "text"

        setLogics(p => { return { ...p, showPassword: true } })
    }


    const hideConfirmPassword = () => {
        inputRefs.current.find((element) => {
            return element.className === 'confirmpassword'
        }).type = "password"

        setLogics(p => { return { ...p, showConfirmPassword: false } })
    }


    const viewConfirmPassword = () => {
        inputRefs.current.find((element) => {
            return element.className === 'confirmpassword'
        }).type = "text"

        setLogics(p => { return { ...p, showConfirmPassword: true } })
    }

    const submitPhoneNumber = async () => {
        //phone cos it proves stubborn when added to collection of refs
        if (!phoneNumber) {
            phonenumnerDivRef.current.style.borderBottom = `3px solid ${themeColors?.error}`;
            setFeedback('Enter phone number')
        }
        else {
            if (!isValidPhoneNumber(phoneNumber)) {
                phonenumnerDivRef.current.style.borderBottom = `3px solid ${themeColors?.error}`;
                setFeedback('Invalid phone number')
            }
            else {
                phonenumnerDivRef.current.style.borderBottom = `3px solid ${themeColors?.valid}`;


                try {
                    setLogics(p => { return { ...p, showloading: true } });
                    let response = await axios?.post(`${API_BASE_URL}/reset-password`, { username: phoneNumber });

                    if (response?.status === 200) {
                        setLogics(p => { return { ...p, showCodeForm: true, showloading: false } });
                        setFeedback(`Enter verification code sent to your email ${response?.data?.email?.split('@')[0]?.slice(0, 5)}.........${response?.data?.email?.split('@')[0]?.slice(response?.data?.email?.split('@')[0]?.length - 2, response?.data?.email?.split('@')[0]?.length)}@${response?.data?.email?.split('@')[1]}`);
                    }
                    else {
                        setFeedback('Phone number not registered')
                    }

                } catch (error) {
                    setLogics(p => { return { ...p, showloading: false } });
                    if (!error?.response?.data) {
                        setFeedback("Network error...")
                    }
                    if (error?.response.status === 502) {
                        setFeedback('Could not connect, try again later')
                    }
                    else if (error?.response?.status === 406) {
                        setFeedback('Invalid code')
                    }
                    else {
                        setStatuscodeErrorMessage(error?.response?.status, setFeedback);
                    }
                }

            }
        }
    }


    const submitNewPassWord = async () => {

        let password, confirmpassword, code;
        inputRefs.current.forEach(element => {

            console.log(element?.className === 'code')
            //CODE
            if (element?.className === 'code') {
                console.log(element)
                code = element?.value;
                if (code === "") {
                    divContainingInputRefs.current[0].style.borderBottom = `3px solid ${themeColors?.error}`;
                }
                else {
                    divContainingInputRefs.current[0].style.borderBottom = `3px solid ${themeColors?.error}`;
                }
            }

            //password
            if (element.className === "password") {
                password = element?.value;
                if (password) {

                    if (password?.length < 8) {
                        divContainingInputRefs.current[1].style.borderBottom = `3px solid ${themeColors?.error}`;
                    }
                    else {
                        if (!((includeNumbers(password) && includesUpperCase(password) && includesLowerCase(password))
                            || (includesSymbols(password) && includesUpperCase(password) && includesLowerCase(password))
                            || (includeNumbers(password) && includesUpperCase(password) && includesLowerCase(password) && includesSymbols(password)))) {
                            setFeedback('Phone number or password incorrect')
                        }
                        else {
                            divContainingInputRefs.current[1].style.borderBottom = `3px solid ${themeColors?.valid}`;
                        }
                    }
                }
                else {
                    divContainingInputRefs.current[1].style.borderBottom = `3px solid ${themeColors?.error}`;

                }
            }


            if (element.className === "confirmpassword") {
                confirmpassword = element?.value;
                if (confirmpassword) {
                    if (confirmpassword !== password) {
                        divContainingInputRefs.current[2].style.borderBottom = `3px solid ${themeColors?.error}`;
                    }
                    else {
                        divContainingInputRefs.current[1].style.borderBottom = `3px solid ${themeColors?.valid}`;
                        divContainingInputRefs.current[2].style.borderBottom = `3px solid ${themeColors?.valid}`;
                    }
                }
                else {
                    divContainingInputRefs.current[2].style.borderBottom = `3px solid ${themeColors?.error}`;
                }
            }
        })

        //check whether any element is empty
        inputRefs?.current?.forEach(element => {
            if (element?.value === "") {
                setFeedback("Enter all fields")
            }
        })

        if (
            //(phoneNumber !=='' && phoneNumber !==undefined && isValidPhoneNumber(phoneNumber)) 
            (code && code?.length > 0)

            && password !== "" && password !== undefined && (confirmpassword === password)
            && ((includeNumbers(password) && includesUpperCase(password) && includesLowerCase(password)) || (includesSymbols(password) && includesUpperCase(password) && includesLowerCase(password)) || (includeNumbers(password) && includesUpperCase(password) && includesLowerCase(password) && includesSymbols(password)))) {

            //set all divs containing inputs to default colors
            divContainingInputRefs?.current?.forEach(element => element.style.borderBottom = `3px solid ${themeColors?.valid}`)

            setLogics((p) => { return { ...p, showloading: true } });

            try {
                const response = await axios?.post(`${API_BASE_URL}/reset-password`, { code: code, password: password, confirmpassword: confirmpassword });
                console.log(response)

                if (response?.status === 200) {
                    cancel();
                    setLogics((p) => { return { ...p, showloading: false, showSignin: true } });
                    setFeedback(`Password reset successful. Sign in to contiue`);

                }
                else if (response?.status === 204) {
                    setLogics((p) => { return { ...p, showloading: false } });
                    setFeedback(`Invalid code`);
                }
            }
            catch (error) {
                console.log(error);
                setLogics(p => { return { ...p, showloading: false } });
                if (!error?.response?.data) {
                    setFeedback("Network error...")
                }
                else {
                    if (error?.response?.status === 408) {
                        setFeedback('Expired verification code');
                    }
                    else {
                        setStatuscodeErrorMessage(error?.response?.status, setFeedback);
                    }
                }
            }
        }
    }

    const cancel = () => {
        inputRefs?.current?.forEach(element => {
            element.value = "";
        });

        setInptDirectives(p => { return { ...p, fullname: false, gender: false, password: false, confirmpassword: false } });

        //phone div has its own ref cos it misbehaves when added to a collection of refs
        if (phonenumnerDivRef?.current !== null) {
            phonenumnerDivRef.current.style.borderBottom = `3px solid ${themeColors?.valid}`
        }
        divContainingInputRefs?.current?.forEach(element => {
            element.style.borderBottom = `3px solid ${themeColors?.valid}`;
        })

        //password and confirm-passwword states are necessary cos of synchronous rendering of directives in the form
        setPhoneNumber(""); setFeedback(''); setInpuValuesForSynchronousRendering((p) => { return { password: "", confirmPassword: "", gender: "" } });
    }
    return (
        <>
            {logics?.showloading && <Loading />}
            {logics?.showSignin ? <SignIn Parentfeedback={feedback} /> :

                <main className="signin-container">
                    <header>
                        <Link to={'/'}>Home</Link>
                        <Link to={'/login'}>Sign in</Link>
                    </header>
                    <div className="form-container">
                        <div className="content">
                            <div className="feedback"><span style={{ visibility: "hidden", height: "0px", width: "0px", opacity: "0", overflow: "hidden" }}>.</span>{feedback}</div>


                            {!logics?.showCodeForm ? <form>
                                <div className="form-heading"><b>Reset Password</b></div>
                                <table>
                                    <tbody>

                                        <tr>
                                            <td><label>Phone</label></td>
                                            <td>
                                                <div ref={phonenumnerDivRef}><PhoneInput onChange={setPhoneNumber} value={phoneNumber} defaultCountry={'GH'} placeholder={'Phone number'} /></div>
                                            </td>
                                        </tr>


                                        <tr >
                                            <td style={{ textAlign: "center" }}><button className="submit" type="submit" onClick={(e) => { e.preventDefault(); submitPhoneNumber() }}>Submit</button></td>
                                            <td style={{ textAlign: "center" }}><button className="submit" type="reset" onClick={(e) => { e.preventDefault(); cancel(); }}>Cancel</button></td>
                                        </tr>

                                    </tbody>
                                </table>
                            </form> :

                                //CODE FORM*************************************************************************
                                <form>
                                    <div className="form-heading"><b>Reset Password</b></div>
                                    <table>
                                        <tbody>

                                            <tr>
                                                <td><label>Code</label></td>
                                                <td>
                                                    <div ref={addToDivContainingInputRefs}><input className="code" ref={addToInputRefs} placeholder={'Enter code'} type={'text'} /></div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td><label>New password</label></td>
                                                <td>
                                                    <div className="password" ref={addToDivContainingInputRefs}>
                                                        <input onChange={(e) => {
                                                            setInpuValuesForSynchronousRendering(p => { return { ...p, password: e?.target?.value } }); if ((((includeNumbers(e?.target?.value)) || (includesSymbols(e?.target?.value)))) && ((includesLowerCase(e?.target?.value) && includesUpperCase(e?.target?.value)) && e?.target?.value?.length >= 8)) { setInptDirectives(p => { return { ...p, password: false } }) }
                                                            else {
                                                                setInptDirectives(p => { return { ...p, password: true } })
                                                            }
                                                            if (e.target?.value === inputValuesForSynchronusRendering?.confirmPassword) {
                                                                setInptDirectives(p => { return { ...p, confirmpassword: false } })
                                                            }
                                                        }} type={"password"} autoComplete={"current-password"} ref={addToInputRefs} className={"password"} placeholder={'New password'}></input>
                                                        <span>{logics?.showPassword ? <button onClick={(e) => { e.preventDefault(); hidePassword() }}><BsFillUnlockFill /></button> : <button onClick={(e) => { e.preventDefault(); viewPassword() }}><BsFillLockFill /></button>}</span>
                                                    </div>
                                                </td>
                                            </tr>

                                            {inputDirectives?.password && inputValuesForSynchronusRendering?.password && <tr>
                                                <td></td>
                                                <td className="input-directive" style={{ height: "0px" }}>
                                                    {(inputValuesForSynchronusRendering?.password?.length < 8) && <section className="inputDirectives">- 8 or more characters</section>}
                                                    {(!(includesSymbols(inputValuesForSynchronusRendering?.password) || (includeNumbers(inputValuesForSynchronusRendering?.password)))) && <section>- Must include symbols or numbers</section>}
                                                    {(!includesLowerCase(inputValuesForSynchronusRendering?.password) || !includesUpperCase(inputValuesForSynchronusRendering?.password)) && <section>- Must contain lowercase and uppercase</section>}
                                                </td>
                                            </tr>}

                                            <tr>
                                                <td><label>Confirm password</label></td>
                                                <td>
                                                    <div className="confirmpassword" ref={addToDivContainingInputRefs}>
                                                        <input onChange={(e) => {
                                                            setInpuValuesForSynchronousRendering(p => { return { ...p, confirmPassword: (e?.target?.value) } }); if (e?.target?.value !== inputValuesForSynchronusRendering?.password) { setInptDirectives(p => { return { ...p, confirmpassword: true } }) } else {
                                                                setInptDirectives(p => { return { ...p, confirmpassword: false } })
                                                            }
                                                        }}
                                                            type={"password"} autoComplete={"current-password"} ref={addToInputRefs} className={"confirmpassword"} placeholder={'Confirm new password'}></input>
                                                        <span>{logics?.showConfirmPassword ? <button onClick={(e) => { e.preventDefault(); hideConfirmPassword() }}><BsFillUnlockFill></BsFillUnlockFill></button> : <button onClick={(e) => { e.preventDefault(); viewConfirmPassword() }}><BsFillLockFill /></button>}</span>
                                                    </div>
                                                </td>
                                            </tr>

                                            {inputDirectives?.confirmpassword && inputValuesForSynchronusRendering?.confirmPassword && <tr>
                                                <td></td>
                                                <td className="input-directive">- Must match with password</td>
                                            </tr>}

                                            <tr >
                                                <td style={{ textAlign: "center" }}><button className="submit" type="submit" onClick={(e) => { e.preventDefault(); submitNewPassWord() }}>Submit</button></td>
                                                <td style={{ textAlign: "center" }}><button className="submit" type="reset" onClick={(e) => { e.preventDefault(); cancel(); navigateTo('/login') }}>Cancel</button></td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </form>}
                            {/* <div className="sign-in-with-google">Sign up with Google</div> */}



                        </div>
                    </div>

                    <footer>{`Designed by GoldCoast University (C) ` + new Date().getFullYear()}</footer>
                </main>}
        </>
    )
}

export default ResetPassword_Public;