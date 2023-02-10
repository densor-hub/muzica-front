import axios from "axios";
import useAuth from "../../customHooks/useAuth";
import GotoRefreshEndPoint from "../../FNS/GoToRefreshEndPoint";
import setStatuscodeErrorMessage from "../../FNS/setStatuscodeErrorMessage";
import { useState  } from "react";
import { API_BASE_URL } from "../../Resources/BaseURL";
import Loading from "./loading";
import { useNavigate } from "react-router-dom";

const AllSetToCreateWebsite =({setFeedback, setBools, bools})=>{

    const {auth} = useAuth();
    const navigateTo =useNavigate();
    const [data, setData] = useState([]);

    const getSubmittedDetails= async()=>{
            
        try {
            setBools(p=>{return {...p, showloading : true}})
            let response = await axios.post(`${API_BASE_URL}/create-website`, {user : auth?.id, clientOrigin : window.location?.origin} , {withCredentials: true});

            if(response?.status ===200){
                setData([{url: `${ new URL(response?.data?.websiteUrl)?.href}` }])
                setBools(p=>{return {...p, showloading : false, showNextButton : true}})
            }
        } catch (error) {
            console.log(error)
            if(!error?.response?.data){
                setBools(p=>{return {...p, showloading : false}});
                setFeedback('Network error...')
            }
            else{
                if(error?.response?.status ===401){
                    GotoRefreshEndPoint(auth).then((r)=>{
                        if(r.status ===200){
                            getSubmittedDetails();
                        }else{
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

    // useEffect(()=>{
    //     getSubmittedDetails();
    // }, [])

    return (<>
            { bools?.showloading && <Loading/>}
                <main>
                    
                    {data && data?.length>0 ?
                    <section>
                        <div className="congrats"> Congratulations</div>
                        <div className="stagename">{auth?.stagename}</div>
                        <div className="sucess">You have successfully cretaed a website for your brand</div>

                        <div className="click-to-copy"><input defaultValue={data[0]?.url}/> <span>I</span></div>

                        <div className="visit-website"><button onClick={()=>(window.open(data[0]?.url), "_blank")}>Visit your web site</button></div>
                    </section> :

                    <section>
                        <Loading/>
                    </section>
                }
        </main>
       
    </>)
}

export default AllSetToCreateWebsite;