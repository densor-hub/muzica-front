import { Link, useNavigate } from "react-router-dom";
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import { useEffect, useRef, useState } from "react";
import { includeNumbers, includesLowerCase, includesSymbols, includesUpperCase } from "../../FNS/includes";
import axios from 'axios';
import { API_BASE_URL } from "../../Resources/BaseURL";
import Loading from './loading';
import setStatuscodeErrorMessage from '../../FNS/setStatuscodeErrorMessage';
import { BsFillUnlockFill, BsFillLockFill } from 'react-icons/bs';


import './signin.css'
import { formatEmail } from "../../FNS/formatString";
import { isValidDate } from "../../FNS/DurationValidator";

const SignUp = () => {
    const navigateTo = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [feedback, setFeedback] = useState('');
    const [logics, setLogics] = useState({ showPassword: false, showConfirmPassword: false, showloading: false, showSignin: false, showCodeForm: false })
    const genderOptions = ['Male', 'Female'];
    const [inputValuesForSynchronusRendering, setInpuValuesForSynchronousRendering] = useState({ password: "", confirmPassword: "", gender: "" });

    const themeColors = { valid: "white", error: 'rgb(255, 71, 86)' }
    const [inputDirectives, setInptDirectives] = useState({ fullname: false, gender: false, stagename: false, dateofbirth: false, phonenumber: false, password: false, confirmpassword: false })


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

    const register = async () => {

        const date = new Date();
        let password, confirmpassword, fullname, email, stagename, dateofbirth;

        inputRefs.current.forEach(element => {
            // firstname
            if (element?.className === "fullname extend") {
                fullname = element?.value;

                if (fullname === '') {
                    divContainingInputRefs.current[0].style.borderBottom = `3px solid ${themeColors?.error}`;
                }
                else {
                    divContainingInputRefs.current[0].style.borderBottom = `3px solid ${themeColors?.error}`;
                    if ((includeNumbers(fullname)) || (includesSymbols(fullname))) {
                        divContainingInputRefs.current[0].style.borderBottom = `3px solid ${themeColors?.error}`;
                        setFeedback('Invalid full name');
                    }
                    else {

                        divContainingInputRefs.current[0].style.borderBottom = `3px solid ${themeColors?.valid}`;
                    }
                }
            }


            //stagename
            if (element?.className === "stagename extend") {
                stagename = element?.value;

                if (stagename === '') {
                    divContainingInputRefs.current[2].style.borderBottom = `3px solid ${themeColors?.error}`;
                }
                else {

                    divContainingInputRefs.current[2].style.borderBottom = `3px solid ${themeColors?.valid}`;
                }
            }

            //dateofbirth
            if (element?.className === "dateofbirth extend") {
                dateofbirth = element?.value;

                if (dateofbirth === '') {
                    divContainingInputRefs.current[3].style.borderBottom = `3px solid ${themeColors?.error}`;

                }
                else {
                    if (isValidDate(dateofbirth)) {

                        if (date.getFullYear() - new Date(dateofbirth).getFullYear() >= 5) {
                            divContainingInputRefs.current[3].style.borderBottom = `3px solid ${themeColors?.valid}`;
                        } else {
                            setFeedback('At least you must be 5 years old')
                        }


                    }
                    else {
                        divContainingInputRefs.current[3].style.borderBottom = `3px solid ${themeColors?.error}`;
                        setFeedback('Invalid date of birth');
                    }
                }
            }

            //email
            if (element?.className === "email extend") {
                email = element?.value;

                if (email === "") {
                    divContainingInputRefs.current[4].style.borderBottom = `3px solid ${themeColors?.error}`
                }
                else {
                    if (!formatEmail(email)) {
                        divContainingInputRefs.current[4].style.borderBottom = `3px solid ${themeColors?.error}`
                        setFeedback('Invalid email');
                    }
                    else {
                        divContainingInputRefs.current[4].style.borderBottom = `3px solid ${themeColors?.valid}`

                    }
                }
            }

            //password
            if (element.className === "password") {
                password = element?.value;
                if (password) {

                    if (password?.length < 8) {
                        divContainingInputRefs.current[5].style.borderBottom = `3px solid ${themeColors?.error}`;
                        setFeedback('Invalid password format')
                    }
                    else {
                        if (!((includeNumbers(password) && includesUpperCase(password) && includesLowerCase(password))
                            || (includesSymbols(password) && includesUpperCase(password) && includesLowerCase(password))
                            || (includeNumbers(password) && includesUpperCase(password) && includesLowerCase(password) && includesSymbols(password)))) {

                            divContainingInputRefs.current[5].style.borderBottom = `3px solid ${themeColors?.error}`;
                            setFeedback('Invalid password format')
                        }
                        else {

                            divContainingInputRefs.current[5].style.borderBottom = `3px solid ${themeColors?.valid}`;
                        }
                    }
                }
                else {
                    divContainingInputRefs.current[5].style.borderBottom = `3px solid ${themeColors?.error}`;

                }
            }


            if (element.className === "confirmpassword") {
                confirmpassword = element?.value;
                if (confirmpassword) {
                    if (confirmpassword !== password) {
                        setFeedback('Password mismatch')
                        divContainingInputRefs.current[6].style.borderBottom = `3px solid ${themeColors?.error}`;
                    }
                    else {

                        divContainingInputRefs.current[5].style.borderBottom = `3px solid ${themeColors?.valid}`;
                        divContainingInputRefs.current[6].style.borderBottom = `3px solid ${themeColors?.valid}`;
                    }
                }
                else {
                    divContainingInputRefs.current[6].style.borderBottom = `3px solid ${themeColors?.error}`;
                }
            }
        })

        //gender
        if (!inputValuesForSynchronusRendering?.gender) {
            divContainingInputRefs.current[1].style.borderBottom = `3px solid ${themeColors?.error}`;
            setFeedback('Select gender')
        }
        else {
            if (inputValuesForSynchronusRendering?.gender === genderOptions[0] || inputValuesForSynchronusRendering?.gender === genderOptions[0]) {
                divContainingInputRefs.current[1].style.borderBottom = `3px solid ${themeColors?.valid}`
            } else {
                divContainingInputRefs.current[1].style.borderBottom = `3px solid ${themeColors?.error}`
            }
        }

        //phone cos it proves stubborn when added to collection of refs
        if (!phoneNumber) {
            phonenumnerDivRef.current.style.borderBottom = `3px solid ${themeColors?.error}`;
            setFeedback('Enter all fields')
        }
        else {
            if (!isValidPhoneNumber(phoneNumber)) {
                setFeedback('Invalid phone numebr')
                phonenumnerDivRef.current.style.borderBottom = `3px solid ${themeColors?.error}`
            }
            else {
                phonenumnerDivRef.current.style.borderBottom = `3px solid ${themeColors?.valid}`;
            }
        }

        //check whether any element is empty
        inputRefs?.current?.forEach(element => {
            if (element?.value === "") {
                setFeedback("Enter all fields")
            }
        })


        if ((fullname && !includeNumbers(fullname) && !includesSymbols(fullname))
            && (inputValuesForSynchronusRendering?.gender && (inputValuesForSynchronusRendering?.gender === genderOptions[0] || inputValuesForSynchronusRendering?.gender === genderOptions[1]))
            && (stagename)
            && (isValidDate(dateofbirth) && (date.getFullYear() - new Date(dateofbirth).getFullYear() >= 5))
            && (phoneNumber !== '' && phoneNumber !== undefined && isValidPhoneNumber(phoneNumber))
            && (email !== "" && formatEmail(email))
            && password !== "" && password !== undefined && (confirmpassword === password)
            && ((includeNumbers(password) && includesUpperCase(password) && includesLowerCase(password)) || (includesSymbols(password) && includesUpperCase(password) && includesLowerCase(password)) || (includeNumbers(password) && includesUpperCase(password) && includesLowerCase(password) && includesSymbols(password)))) {


            //set all divs containing inputs to default colors
            divContainingInputRefs?.current?.forEach(element => element.style.borderBottom = `3px solid ${themeColors?.valid}`)

            let signUpInfo = { fullname: fullname, gender: inputValuesForSynchronusRendering?.gender, stagename: stagename, dateofbirth: dateofbirth, phonenumber: phoneNumber, email: email, password: password }
            setLogics((p) => { return { ...p, showloading: true } });

            try {
                const response = await axios?.post(`${API_BASE_URL}/register`, signUpInfo, { withCredentials: true });
                console?.log(response);

                if (response?.status === 200) {
                    cancel();
                    setLogics((p) => { return { ...p, showloading: false } });
                    navigateTo('/submit-verfification-code')
                }
            }
            catch (error) {
                setLogics(p => { return { ...p, showloading: false } });
                if (!error?.response?.data) {
                    setFeedback("Network error...")
                }
                else if (error?.response?.status === 502) {
                    setFeedback('Could not connect, try again later')
                }
                if (error?.response?.status === 409) {
                    setFeedback('Phone number or email taken')
                }
                else {
                    setStatuscodeErrorMessage(error?.response?.status, setFeedback);
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
        phonenumnerDivRef.current.style.borderBottom = `3px solid ${themeColors?.valid}`;
        divContainingInputRefs?.current?.forEach(element => {
            element.style.borderBottom = `3px solid ${themeColors?.valid}`;
        })

        //password and confirm-passwword states are necessary cos of synchronous rendering of directives in the form
        setPhoneNumber(""); setFeedback(''); setInpuValuesForSynchronousRendering((p) => { return { password: "", confirmPassword: "", gender: "" } });
    }


    useEffect(() => {
        setTimeout(() => {
            if (feedback) {
                setFeedback('')
            }
        }, 3000);
    }, [feedback])

    return (
        <>


            <main className="signin-container">
                <header>
                    <Link to={'/'}>Home</Link>
                    <Link to={'/login'}>Sign in</Link>
                </header>
                <div className="form-container">
                    <div className="content">
                        <div className="feedback"><span style={{ visibility: "hidden", height: "0px", width: "0px", opacity: "0", overflow: "hidden" }}>.</span>{feedback}</div>

                        {<form>
                            <div className="form-heading"><b>Sign Up</b></div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td><label>Fullname</label></td>
                                        <td><div ref={addToDivContainingInputRefs} className={"fullname"}>
                                            <input onChange={(e) => {
                                                if (includeNumbers(e?.target?.value) || includesSymbols(e?.target?.value)) { setInptDirectives(p => { return { ...p, fullname: true } }) } else {
                                                    setInptDirectives(p => { return { ...p, fullname: false } })
                                                }
                                            }} type={"text"} ref={addToInputRefs} className={'fullname extend'} placeholder={'Full name'}></input></div></td>
                                    </tr>

                                    {inputDirectives?.fullname && <tr>
                                        <td></td>
                                        <td className="input-directive">- Must not contain symbols or numbers</td>
                                    </tr>}

                                    <tr>
                                        <td><label>Gender</label> </td>
                                        <td><div className={'gender'} ref={addToDivContainingInputRefs}>
                                            {!inputValuesForSynchronusRendering?.gender && genderOptions?.map((elements, index) => {
                                                return <button key={index} className="gender-selector-button" onClick={() => { setInpuValuesForSynchronousRendering(p => { return { ...p, gender: elements } }) }}>{elements}</button>
                                            })}
                                            {inputValuesForSynchronusRendering?.gender && <input type={'text'} className="gender extend" defaultValue={inputValuesForSynchronusRendering?.gender} onChange={() => { setInpuValuesForSynchronousRendering(p => { return { ...p, gender: "" } }) }}></input>}
                                        </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td><label>Stage name</label></td>
                                        <td><div ref={addToDivContainingInputRefs} className={'stagename '}><input type={"text"} ref={addToInputRefs} className={'stagename extend'} placeholder={'Stage name'}></input></div></td>
                                    </tr>

                                    <tr>
                                        <td><label>Date of birth</label></td>
                                        <td><div ref={addToDivContainingInputRefs} className={"dateofbirth"}><input type={"date"} id={'date'} placeholder={'YYYY-MM-DD'} ref={addToInputRefs} className={'dateofbirth extend'}></input></div></td>
                                    </tr>
                                    <tr>
                                        <td><label>Phone</label></td>
                                        <td>
                                            <div ref={phonenumnerDivRef}><PhoneInput onChange={setPhoneNumber} value={phoneNumber} defaultCountry={'GH'} placeholder={'Phone number'} /></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><label>Email</label></td>
                                        <td><div ref={addToDivContainingInputRefs} className={"email"}><input type={"email"} ref={addToInputRefs} placeholder={"Email"} className={'email extend'}></input></div></td>
                                    </tr>

                                    <tr>
                                        <td><label>Password</label></td>
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
                                                }} type={"password"} autoComplete={"current-password"} ref={addToInputRefs} className={"password"} placeholder={'Password'}></input>
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
                                                    type={"password"} autoComplete={"current-password"} ref={addToInputRefs} className={"confirmpassword"} placeholder={'Confirm password'}></input>
                                                <span>{logics?.showConfirmPassword ? <button onClick={(e) => { e.preventDefault(); hideConfirmPassword() }}><BsFillUnlockFill /></button> : <button onClick={(e) => { e.preventDefault(); viewConfirmPassword() }}><BsFillLockFill /></button>}</span>
                                            </div>
                                        </td>
                                    </tr>

                                    {inputDirectives?.confirmpassword && inputValuesForSynchronusRendering?.confirmPassword && <tr>
                                        <td></td>
                                        <td className="input-directive">- Must match with password</td>
                                    </tr>}

                                    <tr >
                                        <td style={{ textAlign: "center" }}><button className="submit" type="submit" onClick={(e) => { e.preventDefault(); register() }}>Sign up</button></td>
                                        <td style={{ textAlign: "center" }}><button className="submit" type="reset" onClick={(e) => { e.preventDefault(); cancel() }}>Cancel</button></td>
                                    </tr>

                                </tbody>
                            </table>
                        </form>}
                        {/* <div className="sign-in-with-google">Sign up with Google</div> */}
                        <div className="not-having-account">Already have an account? sign in <Link to={'/login'}>here</Link> </div>
                        <div className="sign-in-with-google" style={{ marginTop: "5px" }}>
                        </div>


                    </div>
                </div>

                {/* <footer>{` GoldCoast University (C) ` + new Date().getFullYear()}</footer> */}
            </main>
            {logics?.showloading && <Loading />}
        </>
    )
}

export default SignUp;