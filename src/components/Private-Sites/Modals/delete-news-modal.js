import axios from "axios";
import { API_BASE_URL } from "../../../Resources/BaseURL";
import GotoRefreshEndPoint from "../../../FNS/GoToRefreshEndPoint";
import setStatuscodeErrorMessage from "../../../FNS/setStatuscodeErrorMessage";
import useAuth from "../../../customHooks/useAuth";
import { useNavigate } from "react-router-dom";

import '../CSS/delete-audio-modal.css';

const DeleteNews =({getData, selectedNews, setBools, feedback, setFeedback})=>{

    const {auth} = useAuth();
    const navigateTo = useNavigate();

    const deleteNews =async()=>{
        setBools(p=>{ return {...p, showloading : true}});
        try {
        let response = await axios.put( `${API_BASE_URL}/delete-news:${selectedNews?._id}`,{selectedItem : selectedNews?._id},{withCredentials: true}) ;
            if(response?.status===200){
                getData().then(()=>{
                    setBools(p=>{return{...p, showDeleteModal : false}})
                    setFeedback('Deleted successfully...');
                })
            }
            
        } catch (error) {
            console.log(error)
            if(!error?.response?.data){
                setBools(p=>{ return {...p, showloading : false}});
                setFeedback('Network challenges...')
            }
            else{
                if(error?.response?.status===401){
                    GotoRefreshEndPoint(auth).then((results)=>{
                        if(results?.status===200){
                            deleteNews();
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
    return(
        <>
        <main className="modal-container">
            
            <div className="feedback-container"  style={!feedback ? {backgroundColor: "transparent"} :{} }>
                <div className="feedback">{feedback}<span style={{visibility:"hidden"}}>.</span></div>
            </div>  

            <div className="content-container">
                <div className="close-button-container">
                    <button onClick={(e)=>{e.preventDefault(); setBools(p=>{return {...p, showDeleteModal: false}}); setFeedback("")}} className="close-Icon">X</button>
                </div>
                <div className="content">
                    <p>Surely delete <i><b>News</b></i> ?</p>
                    <div className="decision-buttons-container">
                        <button onClick={(e)=>{e.preventDefault(); deleteNews(); }}>Yes</button>
                        <button onClick={(e)=>{e.preventDefault(); setBools(p=>{return {...p, showDeleteModal: false}}); setFeedback("")}}>No</button>
                    </div>
                </div>
            </div>

        </main>
        </>
    )
}

export default DeleteNews;