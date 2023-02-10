import { useCallback, useRef, useState, useEffect } from "react";
import { API_BASE_URL } from '../../../Resources/BaseURL';
import GotoRefreshEndPoint from '../../../FNS/GoToRefreshEndPoint';
import setStatuscodeErrorMessage from '../../../FNS/setStatuscodeErrorMessage';
import useAuth from '../../../customHooks/useAuth';
import axios from "axios";
import Loading from "../../micro-components/loading";
import {  useNavigate } from "react-router-dom";

import '../../micro-components/add-news.css';
import '../CSS/added.css';

const AddBiograpgy =()=>{ 
        const {auth} = useAuth();
        const navigateTo = useNavigate();
        const themeColrs ={error : "rgb(255, 71, 86)", valid : 'white'};

        const [bools, setBools]= useState({showloading : false})
        const inputRefs = useRef([]);
        const [selectedToEdit, setSelectedToEdit] = useState('');
        const [feedback, setFeedback] = useState("")
        
        const addToInputRefs = (element)=>{
            if(element && !inputRefs.current.includes(element)){
                inputRefs.current.push(element)
            }
            else{
                inputRefs.current.pop(element);
            }
        }
    
        const saveBio=async ()=>{
            inputRefs.current[0].style.borderBottom = `3px solid ${themeColrs?.error}`;
            setSelectedToEdit(inputRefs.current[0].value);

            const bioObject ={ biography :  inputRefs.current[0]?.value}

            if(inputRefs.current[0].value ===""){
                setFeedback("Enter all fields");
            }
            else{
                if(inputRefs.current[0]?.value?.length <100){
                    setFeedback('Enter at least 100 characters')
                }else{
                    inputRefs.current[0].style.borderBottom = `3px solid ${themeColrs?.valid}`;
                    setBools(p=>{return {...p, showloading : true}});

                    try {
                        let response = await axios.post(`${API_BASE_URL}/save-biography`, bioObject, {withCredentials : true});
                        if(response.status===200 || response?.status===204){
                            //setBools(p=>{return {...p, showloading : false}});
                            //setFeedback("Saved successfully, redirecting...")

                            //setTimeout(()=>{
                                navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-biography`)
                            //},2000)
                        }
                        
                    } catch (error) {
                        console.log(error);
                        if(!error?.response?.data){
                            setBools(p=>{return {...p, showloading : false}});
                            setFeedback('Network error...')
                        }
                        else{
                            if(error?.response?.status ===401){
                                GotoRefreshEndPoint(auth).then((r)=>{
                                    if(r.status===200){
                                        saveBio();
                                    } else{
                                        navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/sign-out`);
                                    }
                                 })
                            }
                            else{
                                setStatuscodeErrorMessage(error?.response?.status, setFeedback)
                                setBools(p=>{return {...p, showloading : false}});
                            }
                        }
                    }
                }
            }
        } 
    // const clearBio=()=>{
    //     inputRefs.current[0].value ="";
    //     inputRefs.current[0].style.borderBottom = `3px solid ${themeColrs?.valid}`;
    // }



    const getSelectedItem = useCallback(
        async()=>{
            try {
                let response = await axios.get(`${API_BASE_URL}/get-biography:${window.location.pathname?.split(':')[1]}`, {withCredentials: true});
                
                console.log(response);
                if(response?.status===200){
                    setSelectedToEdit(response?.data?.results);
                }
                
            } catch (error) {
                console.log(error);
                if(!error?.response?.data){
                    setFeedback('Network challenges...')
                }
                else{
                    if(error?.response?.status===401){
                        GotoRefreshEndPoint(auth).then((r)=>{
                            if(r.status===200){
                                getSelectedItem();
                            } else{
                                navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/sign-out`);
                            }
                         })
                    }
                    else{
                        setBools((p)=>{return {...p, showloading : false}})
                        setStatuscodeErrorMessage(error?.response?.status, setFeedback)
                    }
                }
                
            }
        },[auth, navigateTo]
    )

    useEffect(()=>{
        getSelectedItem();
    },[getSelectedItem])

        return (
            <>
            {bools?.showloading &&<Loading/>}
                    <main >
                         <div className="feedback-container" style={!feedback ? {backgroundColor: "transparent"} :{} }>
                         <div className="feeback">{!bools?.showDeleteModal &&  feedback}</div>
                     </div>

                <div className="page-heading">EDIT <i><b>BIO</b></i></div>
                

                        <section className="add-news">
                        <form>
                            <table>
                                <tbody>
                                    <tr>
                                        <td className="label"><label>Biography</label> <span>*</span></td>
                                        <td><textarea ref={addToInputRefs} defaultValue={selectedToEdit?.biography}></textarea></td>
                                    </tr>
    
                                    <tr>
                                        <td><button onClick={(e)=>{e.preventDefault(); saveBio() }}>Save</button></td>
                                        <td><button onClick={(e)=>{e.preventDefault(); navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-biography`)}}>Cancel</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </section>
                    </main>
            </>
        )
      }
 export default AddBiograpgy;