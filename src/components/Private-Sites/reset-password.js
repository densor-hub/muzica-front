import { useState, useRef, useEffect, useCallback } from "react"
import GotoRefreshEndPoint from "../../FNS/GoToRefreshEndPoint";
import setStatuscodeErrorMessage from "../../FNS/setStatuscodeErrorMessage";
import axios from "axios";
import Loading from "../micro-components/loading";
import useAuth from "../../customHooks/useAuth";
import { includeNumbers, includesSymbols, includesUpperCase, includesLowerCase } from "../../FNS/includes";
import {BsFillUnlockFill, BsFillLockFill} from 'react-icons/bs';
import { useNavigate } from "react-router-dom";

import './CSS/settings.css'
import { API_BASE_URL } from "../../Resources/BaseURL";

const ResetPasswordPrivate =()=>{
    const [feeback, setFeedback] = useState('');
    const [inputValues, setInputValues] = useState({previousPassword:"", newPassword: "", confirmNewPassword: "", gender :""});
    const [bools, setBools]= useState({showloading : false, showpassword : false, showPreviosPassword: false, showNewPassword: false, showconfirmNewPassword : false});
    const {auth} = useAuth();
    const navigateTo = useNavigate();
    const themeColors ={valid : 'white', error: "rgb(255, 71, 86)"};
    const [LoginWithNoPassword, setLoginWithNoPassword] = useState(false);

    const inputRefs= useRef([]);
    const addToInputRefs = (element)=>{
        if(element && ! (inputRefs?.current?.includes(element))){
            inputRefs?.current?.push(element)
        }
        else{
            inputRefs?.current?.pop(element)
        }
    }

    const CheckWhetherSignedInWithGoogle = useCallback(
        async()=>{
            try {
                setBools(p=>{return{...p, showloading: true}})
                let response = await axios.get(`${API_BASE_URL}/reset-password`, {withCredentials: true});
    
                console.log(response)
                if(response?.status===200){
                    setBools(p=>{return{...p, showloading: false}})
                    setLoginWithNoPassword(response?.data?.loginWithNoPassword)
                }
            } catch (error) {
                if(error?.response?.status===401){
                    GotoRefreshEndPoint(auth).then((results)=>{
                        if(results?.status===200){
                            CheckWhetherSignedInWithGoogle();
                        }
                        else{
                            navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/sign-out`)
                        }
                    })
                }
                else{
                    setBools((p)=>{return {...p, showloading : false}})
                    setStatuscodeErrorMessage(error?.response?.status, setFeedback)
                }
            }
        },[navigateTo, auth]
    )

    useEffect(()=>{
        CheckWhetherSignedInWithGoogle();
    },[CheckWhetherSignedInWithGoogle])

    const saveNewPassword=async()=>{
        let invalid = [];

       inputRefs?.current?.forEach((element)=>{ 
        console.log(element)
        if(element?.value ===""){
            setFeedback('Enter all fields');
            element.style.borderBottom =`3px solid ${themeColors?.error}`;
            invalid?.push(element);
        }

        if(element?.value !==""){
            if( element?.value?.length<8){
                element.style.borderBottom = `3px solid ${themeColors?.error}`;
                invalid?.push(element);
                setFeedback('Invalid entry')
            }
            else{
                if(! ( (includeNumbers(element?.value) && includesUpperCase(element?.value) && includesLowerCase(element?.value))
                ||(includesSymbols(element?.value) && includesUpperCase(element?.value) && includesLowerCase(element?.value))
                || (includeNumbers(element?.value) && includesUpperCase(element?.value) && includesLowerCase(element?.value) && includesSymbols(element?.value)))){
                    setFeedback('password incorrect')
                }
                else{
                   element.style.borderBottom = `3px solid ${themeColors?.valid}`;
                }
            }
        }
        else{
            element.style.borderBottom = `3px solid ${themeColors?.error}`;
            invalid?.push(element);
        }
       });


       //finalze
       if(invalid?.length===0){
        let allSet = false;
        if(!LoginWithNoPassword){

            if(inputRefs?.current[0]?.value=== inputRefs?.current[1]?.value){
                setFeedback('Previous and new passwords are the same');
                inputRefs.current[0].style.borderBottom =`3px solid ${themeColors?.error}`;
                inputRefs.current[1].style.borderBottom =`3px solid ${themeColors?.error}`;
            }
            else if(inputRefs?.current[1]?.value !== inputRefs?.current[2]?.value){
                setFeedback('Password mismatch');
                inputRefs.current[1].style.borderBottom =`3px solid ${themeColors?.error}`;
                inputRefs.current[2].style.borderBottom =`3px solid ${themeColors?.error}`;
            }
            else{
                allSet = true;
            }
        }else{
            if(inputRefs?.current[0]?.value !== inputRefs?.current[1]?.value){
                setFeedback('Password mismatch');
                inputRefs.current[0].style.borderBottom =`3px solid ${themeColors?.error}`;
                inputRefs.current[1].style.borderBottom =`3px solid ${themeColors?.error}`;
            }
            else{
                allSet = true;
            }
            
        }
        
        

         try {

            let response; 
            if(!LoginWithNoPassword && allSet ){
                setBools((p)=>{return {...p, showloading : true}});

              response = await axios.post(`${API_BASE_URL}/reset-password`,{previousPassword : inputRefs?.current[0]?.value, newPassword : inputRefs?.current[1]?.value, confirmNewPassword : inputRefs?.current[2]?.value}, {withCredentials: true});

            }else if(LoginWithNoPassword && allSet){
                setBools((p)=>{return {...p, showloading : true}});
                response = await axios.post(`${API_BASE_URL}/reset-password`,{newPassword : inputRefs?.current[0]?.value, confirmNewPassword : inputRefs?.current[1]?.value},
                {withCredentials: true})
            }


             if(response?.status===200){
                setBools((p)=>{return {...p, showloading : false}});
                setFeedback('Password changed successfully');
                inputRefs.current.forEach(element=>{element.value=""; element.style.borderBottom= `3px solid ${themeColors?.valid}`});
                

             }
             else if(response?.status===204){
                setBools((p)=>{return {...p, showloading : false}});
                setFeedback('Invalid previous password');
             }
         } catch (error) {
            console?.log(error)

            if(!error?.response?.data){
                setBools((p)=>{return {...p, showloading : false}});
                setFeedback('Network challenges...');
            }
            else if(error?.response?.status ===502){
                setBools((p)=>{return {...p, showloading : false}});
                setFeedback('Could not send code, try again later')
            }
            else if(error?.response?.status===406){
                setBools((p)=>{return {...p, showloading : false}});
                setFeedback('Add phone number and gender first')
            }
            else{
                if(error?.response?.status===401){
                    GotoRefreshEndPoint(auth).then((results)=>{
                        if(results?.status===200){
                            saveNewPassword();
                        }
                        else{
                            navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/sign-out`)
                        }
                    })
                }
                else{
                    setBools((p)=>{return {...p, showloading : false}})
                    setStatuscodeErrorMessage(error?.response?.status, setFeedback)
                }
            }
            
       }
    }
    }


    //feedback clearner
    useEffect(()=>{
        if(feeback){
            setTimeout(() => {
                setFeedback('')
            }, 3000);
        }
    })


    return(
        <>
            {bools?.showloading && <Loading/>}
            <main className="settings" style={{paddingTop:"40px"}}>

                <div className="feedback-container" style={! feeback ? {backgroundColor: "transparent", margin:"0px"}: {margin:"0px"}}>
                   <div className="feedback"><span style={{visibility: "hidden"}}>.</span>{feeback}</div>
                </div>
                <div className="reset-password-heading">Reset Password</div>
               
               <div></div>
                <section className="general-settings reset-password">
                    
                    <form>
                        {!LoginWithNoPassword && <div>
                            <div className="label">Current password</div>

                            <div className="input-container">
                                <input className="previous-password" ref={addToInputRefs} onChange={(e)=>{setInputValues(p=>{return{...p, previousPassword: e?.target?.value}})}} placeholder={'Current password'} type={'password'} autoComplete={"current-password"}></input>
                                <span>
                                    {!bools?.showPreviosPassword ?<button onClick={(e)=>{e.preventDefault(); setBools(p=>{return{...p, showPreviosPassword: true}}); inputRefs.current[0].type ='text' }}><BsFillLockFill/></button>:

                                    <button onClick={(e)=>{e.preventDefault(); setBools(p=>{return{...p, showPreviosPassword: false}}); inputRefs.current[0].type ='password' }}><BsFillUnlockFill/></button>}
                                </span>    
                            </div>
                        </div>}
                    {/* {inputValues?.previousPassword?.length>0 && <div className="directive">
                    {  ( inputValues?.previousPassword?.length <8 ) &&<section className="inputDirectives">- 8 or more characters</section>}
                        { (!(includesSymbols( inputValues?.previousPassword) || (includeNumbers(inputValues?.previousPassword))))&& <section>- Must include symbols or numbers</section> }
                        {(!includesLowerCase( inputValues?.previousPassword) || !includesUpperCase( inputValues?.previousPassword)) && <section>- Must contain lowercase and uppercase</section> }
                    </div>} */}


                    <div className="label">New password</div>
                    <div className="input-container">
                        <input className="new-password" ref={addToInputRefs} onChange={(e)=>{setInputValues(p=>{return{...p, newPassword: e?.target?.value}})}}placeholder={'new password'} type={"password"} autoComplete={'current-password'}></input>
                        <span>
                            {!bools?.showNewPassword ? <button onClick={(e)=>{e.preventDefault(); setBools(p=>{return{...p, showNewPassword: true}}); inputRefs.current[1].type ='text' }}><BsFillLockFill/></button>:

                            <button onClick={(e)=>{e.preventDefault(); setBools(p=>{return{...p, showNewPassword: false}}); inputRefs.current[1].type ='password' }}><BsFillUnlockFill/></button>}
                        </span>
                    </div>
                    {inputValues?.newPassword?.length>0 &&  <div className="directive">
                    {  ( inputValues?.newPassword?.length <8 ) &&<section className="inputDirectives">- 8 or more characters</section>}
                        { (!(includesSymbols( inputValues?.newPassword) || (includeNumbers(inputValues?.newPassword))))&& <section>- Must include symbols or numbers</section> }
                        {(!includesLowerCase( inputValues?.newPassword) || !includesUpperCase( inputValues?.newPassword)) && <section>- Must contain lowercase and uppercase</section> }
                    </div>}

                    <div className="label">Confirm new password</div>
                    <div className="input-container">
                        <input className="confirm-password" onChange={(e)=>{setInputValues(p=>{return{...p, confirmNewPassword: e?.target?.value}})}} placeholder={'confirm new password'} ref={addToInputRefs} type={"password"} autoComplete={'current-password'}></input>
                        <span>
                            {!bools?.showconfirmNewPassword ? <button onClick={(e)=>{e.preventDefault(); setBools(p=>{return{...p, showconfirmNewPassword: true}}); inputRefs.current[2].type ='text' }}><BsFillLockFill/></button>:

                            <button onClick={(e)=>{e.preventDefault(); setBools(p=>{return{...p, showconfirmNewPassword: false}}); inputRefs.current[2].type ='password' }}><BsFillUnlockFill/></button>}
                        </span>
                    </div>
                    {inputValues?.confirmNewPassword.length>0 && <div className="directive">
                    {  (inputValues?.confirmNewPassword.length>0 && inputValues?.newPassword !== inputValues?.confirmNewPassword ) &&<section className="inputDirectives">- Must match new password</section>}
                    </div>}

                    <div className="decision-buttons-container">
                        <button onClick={(e)=>{e.preventDefault(); saveNewPassword()}}>Save</button>
                        <button onClick={(e)=>{e.preventDefault(); inputRefs?.current?.forEach(element=>{element.value=""; element.style.borderBottom=`3px solid ${themeColors?.valid}` })}}>Cancel</button>
                    </div>
                    </form>
                </section>
            </main>
        </>
    )
}

export default ResetPasswordPrivate;