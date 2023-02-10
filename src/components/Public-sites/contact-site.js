import {  useCallback, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../Resources/BaseURL";
import {SiTiktok} from 'react-icons/si';
import {BsInstagram} from 'react-icons/bs';
import {AiOutlineTwitter,AiOutlineMail} from 'react-icons/ai';
import {FaFacebook} from 'react-icons/fa';
import {FiPhoneCall} from 'react-icons/fi'; 


import './CSS/contact-site.css'

const ContactSite=({ addedAudios,setAddedAudios,setAddedVideos,setAddedImages, setAddedUpcoming,setAddedNews,setAddedBio,  addedSocials, setAddedSocials, setValidAPIEndPoint, setBools, setAddedBookingsInfo, addedBookingsInfo})=>{


    const getData= useCallback(async()=>{
        try{
            let response = await axios.get(`${API_BASE_URL}${window?.location?.pathname}${window?.location?.search}`);
            console.log(response)
            if(response?.status===200){
                console.log(response);

                setAddedAudios(response?.data?.websiteData[0]?.value);
                setAddedVideos(response?.data?.websiteData[1]?.value);
                setAddedImages(response?.data?.websiteData[2]?.value);
                setAddedUpcoming(response?.data?.websiteData[3]?.value);
                setAddedNews(response?.data?.websiteData[4]?.value);
                setAddedBio(response?.data?.websiteData[5]?.value);
                setAddedSocials(response?.data?.websiteData[6]?.value);
                setAddedBookingsInfo(response?.data?.websiteData[7]?.value);
                setValidAPIEndPoint(response?.data?.validAPI_EndPoints);
            }
        }catch(error){
            console.log(error)
            if(error?.response?.status ===404){
                setBools(p=>{return {...p, show404: true, show500: false}});
            }else{
                if(! error?.response?.data){
                    setBools(p=>{return{...p, show500: true, show404: false}});
                }
            }
        }
   },[setAddedAudios,setAddedVideos,setAddedImages, setAddedUpcoming,setAddedNews,setAddedBio, setAddedSocials, setValidAPIEndPoint, setBools, setAddedBookingsInfo])

   useEffect(()=>{

    if(addedSocials){
        if(addedAudios?.length ===0){
           getData();
        }
    }
},[addedSocials, addedAudios?.length, getData])


    return(
        <>
            <main className="contact-site">
                <section className="cover">

                  <div className="socials-container" >
                    <div className="heading" style={{textAlign:"center"}}>Let's Link Via</div>
                    {addedSocials?.length>0 && 
                    <div className="socials">{addedSocials[0].platforms?.platforms?.map((elements)=>{
                        return(
                        <div key={elements?.id} className='icon-link-container'>
                            <a href={elements?.profilelink} rel='noreferrer' target={"_blank"}>
                               { elements?.socialmedia==='facebook' && <i ><FaFacebook size={"20px"} className="icon" /> {elements?.socialmedia}</i>}
                               { elements?.socialmedia==='instagram' && <i ><BsInstagram size={"20px"} className="icon"/> {elements?.socialmedia}</i>}
                               { elements?.socialmedia==='twitter' && <i  ><AiOutlineTwitter size={"20px"} className="icon"/> {elements?.socialmedia}</i>}
                               { elements?.socialmedia==='tiktok' && <i ><SiTiktok size={'20px'} className="icon"/> {elements?.socialmedia}</i>}
                               
                                </a>
                        </div>)
                    })}</div>}

                  </div>

                   
                   {addedBookingsInfo?.length>0 && <div className="bookings">
                    <div className="heading" style={{textAlign:"center"}}>Book Me</div>
                    <div className="phone"><span className="icon"><FiPhoneCall size={"20px"} style={{position:"relative", top:"7px"}}/></span>{addedBookingsInfo[0]?.phone}</div>
                    <div className="email"><span className="icon"><AiOutlineMail size={"20px"}  style={{position:"relative", top:"7px"}}/></span>{addedBookingsInfo[0]?.email}</div>
                    </div>}
                </section>
                
            


            </main>
        </>
    )
}

export default ContactSite;