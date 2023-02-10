import axios from "axios";
import { useState , useCallback, useEffect} from "react";
import { API_BASE_URL } from "../Resources/BaseURL";
import Loading from "./micro-components/loading";
import { Link } from "react-router-dom";
import setStatuscodeErrorMessage from "../FNS/setStatuscodeErrorMessage";
import GotoRefreshEndPoint from "../FNS/GoToRefreshEndPoint";
import useAuth from "../customHooks/useAuth";
import { AiFillCopy } from "react-icons/ai";


import './css/website-created.css';
const WebsiteCreated =({setFeedback, setBools, bools, setCurrentContent, content})=>{

    const {auth} = useAuth();
    const [data, setData] = useState([]);
    const [CopiedToClipbord, SetCopiedToClipbord] = useState("")
    
    const getSubmittedDetails= useCallback(async()=>{
        try {
            setBools(p=>{return {...p, showloading : true}})
            let response = await axios.post(`${API_BASE_URL}/create-website`, {user : auth?.id, clientOrigin : window.location?.origin} , {withCredentials: true});

            if(response?.status ===200){
                setData([{url: `${ new URL(response?.data?.websiteUrl)?.href}` }])
                setBools(p=>{return {...p, showloading : false}});
                setCurrentContent(content?.createsite)
            }
        } catch (error) {
            console.log(error)
            if(!error?.response?.data){
                setBools(p=>{return {...p, showloading : false}});
                setFeedback('Network error...')
            }
            else{
                if(error?.response?.status ===401){
                    GotoRefreshEndPoint(auth).then(()=>{
                        getSubmittedDetails();
                    })
                }
                else{
                    setStatuscodeErrorMessage(error?.response?.status, setFeedback)
                    setBools(p=>{return {...p, showloading : false}});
                }
            }
        }
    },[auth, content?.createsite, setBools,setCurrentContent, setFeedback])

    useEffect(()=>{
        getSubmittedDetails();
    }, [getSubmittedDetails])


    const CopyToClipBoard =()=>{
        if(data?.length>0){
            let text = data[0]?.url;
            
            //check for permissions
            try {
                    navigator?.permissions?.query({name : 'clipboard-write'}).then(async(results)=>{
                        if(results?.state && results?.state !=='denied'){
                            await navigator?.clipboard?.writeText(text).then(results=>{
                                navigator.clipboard.readText().then(res=>{
                                    SetCopiedToClipbord('Copied to clipboard');
                                })
                            });
                        }
                    })
            } catch (error) {
                console?.log(error);
                window?.prompt('Error occured, could not copy...')
            }
        }
    }

    useEffect(()=>{
        if(CopiedToClipbord){
            setTimeout(() => {
                SetCopiedToClipbord("");
            }, 3000);
        }
    })

    return (<>
            { bools?.showloading && <Loading/>}
                <main className="website-created">
                    
                    {data && data?.length>0 ?
                    <section>
                        <div className="note">You website is ready</div>

                        <div className="website-url-container">
                                <div>{data[0]?.url?.slice(0, 30)+"...."} </div>
                                <button className="copy-icon" onClick={(e)=>{e.preventDefault(); CopyToClipBoard()}}><AiFillCopy className="icon" size={"15px"}/></button>
                            </div>

                        {CopiedToClipbord !=="" && <div className="copied-to-Clipboard">{CopiedToClipbord}</div>}
                        <div className="visit-website-btn-container"><button onClick={()=>(window.open(data[0]?.url, "_blank"))}>Visit website</button></div>
                    
                        <div className="go-to-dashboard">Go to  <Link to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}`}>dashboard</Link> to manage your website</div>
                    
                    </section> :

                    <section>
                       <Loading/>
                    </section>
                }
        </main>
       
    </>)
}

export default WebsiteCreated;