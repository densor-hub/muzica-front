import useAuth from "../../../customHooks/useAuth";
import GotoRefreshEndPoint from "../../../FNS/GoToRefreshEndPoint";
import setStatuscodeErrorMessage from "../../../FNS/setStatuscodeErrorMessage";
import axios from "axios";
import { useState } from "react";
import { API_BASE_URL } from "../../../Resources/BaseURL";
import Loading from "../../micro-components/loading";
import { useNavigate } from "react-router-dom";

import '../CSS/delete-audio-modal.css';

const DeleteProfilePictureModal =({setLogics, setFeedback, getData, feedback})=>{
    const {auth, setAuth} = useAuth();
    const [bools, setBools ] = useState({showloading : false});
    const navigateTo = useNavigate();

    const DeleteDP =async()=>{
        if(!auth?.profilePicture || auth?.profilePicture===""){
            setFeedback("No Display picture available");
        }
        else{
            try {
                setBools(p=>{return{...p, showloading: true}});
                let response = await axios?.put(`${API_BASE_URL}/user`,{action: 'DP'}, {withCredentials: true});

                if(response?.status===200){
                    setAuth(response?.data);
                    getData().then(()=>{
                        setLogics(p=>{return{...p, showloading: false, showDeleteProfilePicturModal: false}});
                        setFeedback('Display picture deleted successfully')
                    })
                }
            } catch (error) {
                console?.log(error)
                if(!error?.response?.data){
                    setBools((p)=>{return {...p, showloading : false}})
                    setFeedback('Network challenges...')
                }
                else{
                    if(error?.response?.status===401){
                        GotoRefreshEndPoint(auth).then((results)=>{
                            if(results?.status===200){
                                DeleteDP();
                            }else{
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
return(<>

        {bools?.showloading && <Loading/>}
        

        <main className="modal-container">

            <div className="feedback-container"  style={!feedback ? {backgroundColor: "transparent"} :{} }>
                <div className="feedback">{feedback}<span style={{visibility:"hidden"}}>.</span></div>
            </div>

            <div className="content-container">
                <div className="close-button-container"><button className="close-Icon" onClick={(e)=>{e.preventDefault(); setLogics(p=>{ return {...p, showDeleteProfilePicturModal: false}})}}>X</button></div>
                <div className="content">
                    <div>Surely delete display picture ?</div>
                
                    <div className="decision-buttons-container">
                        <button onClick={(e)=>{e.preventDefault(); DeleteDP()}}>Yes</button>
                        <button onClick={()=>{setLogics(p=>{ return {...p, showDeleteProfilePicturModal: false}})}}>Cancel</button>
                    </div>
                </div>
            </div>
        </main>
    </>)
}

export default DeleteProfilePictureModal;