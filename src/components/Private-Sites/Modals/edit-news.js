import axios from "axios";
import { useCallback, useRef, useState, useEffect } from "react";
import { API_BASE_URL } from "../../../Resources/BaseURL";
import GotoRefreshEndPoint from "../../../FNS/GoToRefreshEndPoint";
import setStatuscodeErrorMessage from "../../../FNS/setStatuscodeErrorMessage";
import useAuth from "../../../customHooks/useAuth";
import Loading from "../../micro-components/loading";
import { useNavigate } from "react-router-dom";

import '../../micro-components/add-news.css';
import '../CSS/added.css';

const EditNews =()=>{
    const themeColor ={valid: "white", error:"rgb(255, 71, 86)"}
    const {auth} = useAuth();
    const  navigateTo = useNavigate();
    const [bools, setBools]= useState({showloading :false});
    const [feedback, setFeedback] = useState('');
    const inputRefs = useRef([]);
    const [selectedToedit, setSelectedToEdit]= useState([]);
    const addToInputRefs = (element)=>{
        if(element && !inputRefs.current.includes(element)){
            inputRefs.current.push(element)
        }
        else{
            inputRefs.current.pop(element);
        }
    }



    const getSelectedItem = useCallback(
        async()=>{
            try {
                let response = await axios.get(`${API_BASE_URL}/get-news:${window.location.pathname?.split(':')[1]}`, {withCredentials: true});
                
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

    const saveNews= async()=>{
        const newsObject ={ headline : inputRefs.current[0].value, details : inputRefs.current[1].value};
        let requiredButEmpty = false;

        inputRefs?.current.forEach(element=>{
            if(element?.value===""){
                element.style.borderBottom =`3px solid ${themeColor?.error}`;
                requiredButEmpty = true;
            }
            else{
                element.style.borderBottom =`3px solid ${themeColor?.valid}`
            }
        })
    
        if(requiredButEmpty ){
            setFeedback("Enter all fields")
        }
        else{
                setBools(p=>{return {...p, showloading : true}});

            try {
                let response = await axios.patch(`${API_BASE_URL}/update-news:${window.location.pathname?.split(':')[1]}`, newsObject, {withCredentials: true});
    
                if(response.status===200){
                   
                    //setBools(p=>{return {...p, showloading : false}});
                    //setSelectedToEdit([]);
                    //setFeedback('Saved successfully, redirecting...');

                    //setTimeout(()=>{
                        navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-news`)
                    //},2000)
                }
            } catch (error) {
                if(!error?.response?.data){
                    console.log(error);
                    setBools(p=>{return {...p, showloading : false}});
                    setFeedback('Network error...')
                }
                else{
                    if(error?.response?.status ===401){
                        GotoRefreshEndPoint(auth).then((r)=>{
                            if(r.status===200){
                                saveNews();
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

    // const clearNews=()=>{
    //     inputRefs.current.forEach((element)=>{
    //         element.value ="";
    //         element.style.borderBottom = `3px solid ${themeColor?.valid}`
    //     })
    // }

    return (
        <>
            {bools?.showloading && <Loading/> }
            {
                <main >
                    <div className="feedback-container" style={!feedback ? {backgroundColor: "transparent"} :{} }>
                        <div className="feeback"> <span style={{visibility:"hidden"}}>.</span>{!bools?.showDeleteModal &&  feedback}</div>
                    </div>

                    <div className="page-heading">EDIT <i><b>NEWS</b></i></div>
                    <section className="add-news" >
                    <form>
                        <table>
                            <tbody>
                                <tr>
                                    <td className="label"><label>Headline</label><span>*</span></td>
                                    <td><input type={'text'} ref={addToInputRefs} defaultValue={selectedToedit?.headline} placeholder={'News headline'}></input></td>
                                </tr>

                                <tr>
                                    <td className="label"><label>Details</label> <span>*</span></td>
                                    <td><textarea ref={addToInputRefs} defaultValue={selectedToedit.details} placeholder={'Description'}></textarea></td>
                                </tr>

                                <tr style={{textAlign:"center"}}>
                                    <td><button onClick={(e)=>{e.preventDefault(); saveNews(); }}>Save</button></td>
                                    <td><button onClick={(e)=>{e.preventDefault(); navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-news`)}}>Cancel</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </section>

                </main>}

        </>
    )
}

export default EditNews;