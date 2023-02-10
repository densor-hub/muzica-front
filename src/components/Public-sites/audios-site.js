import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../Resources/BaseURL";
import SpecificAudioModal from "../micro-components/specificAudioModal";
import { CovertMonthNumbersToAlphabets } from "../../FNS/MonthNumberToAlphabets";
import { Link } from "react-router-dom";

import {BsYoutube} from 'react-icons/bs';
import {ImSoundcloud, ImSpotify} from 'react-icons/im';
import {FaItunesNote} from 'react-icons/fa';
import {SiAudiomack} from 'react-icons/si';
import {ImMusic} from 'react-icons/im';

import './CSS/audios-site.css';


const AudiosSite=({ addedAudios,setAddedAudios,setAddedVideos,setAddedImages, setAddedUpcoming,setAddedNews,setAddedBio, setAddedSocials, setValidAPIEndPoint, setBools})=>{
    const [showSpecificAudioModal, setShowSpecificAudioModal] = useState(false);
    const [selectedAudio, setSelectedAudio] = useState([]);
    const searchInputRef = useRef();
    const [toggler, setToggler] = useState(false);

//FETCH DATA(added audios) FROM API
    const getData= useCallback(async()=>{
        try{
            let response = await axios.get(`${API_BASE_URL}${window?.location?.pathname}${window?.location?.search}`);

            if(response?.status===200){
                setAddedAudios(response?.data?.websiteData[0]?.value);
                setAddedVideos(response?.data?.websiteData[1]?.value);
                setAddedImages(response?.data?.websiteData[2]?.value);
                setAddedUpcoming(response?.data?.websiteData[3]?.value);
                setAddedNews(response?.data?.websiteData[4]?.value);
                setAddedBio(response?.data?.websiteData[5]?.value);
                setAddedSocials(response?.data?.websiteData[6]?.value);
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
   },[ setAddedAudios,setAddedVideos,setAddedImages, setAddedUpcoming,setAddedNews,setAddedBio, setAddedSocials, setValidAPIEndPoint, setBools])

   useEffect(()=>{
    if(addedAudios){
        if(addedAudios?.length ===0){
           getData();
        }
    }
},[getData, addedAudios])


// const search=async()=>{
//    if(! searchInputRef?.current?.value){
//     setFeedback('Enter song title')
//    }
//    else{
//     try{
//         let response = await axios.post(`${API_BASE_URL}${window?.location?.pathname}${window?.location?.search}`,{searchFor : searchInputRef?.current?.value});

//         console.log(response)
//         if(response?.status===200){
//             setSearchResults(response?.data?.searchedItems);
//             setShowAudios(true)
//         }
//         else{
//             if(response?.status === 204){
//                 setShowAudios(false)
//                 setFeedback('No audio found')
                
//             }
//         }
//         }catch(error){
//             console.log(error)
//             if(error?.response?.status ===404){
//                 setBools(p=>{return {...p, show404: true, show500: false}});
//             }else{
//                 if(! error?.response?.data){
//                     setBools(p=>{return{...p, show500: true, show404: false}});
//                 }
//             }
//         }
//    }
// }

    return(
        <>
            {showSpecificAudioModal && <SpecificAudioModal audio={selectedAudio} setShowModal={setShowSpecificAudioModal}></SpecificAudioModal>}
            <main className="audios-site">
            <div className="cover">
                <section className="large-icon">
                    <div><ImMusic className="icon"></ImMusic></div>
                </section>
                <section className="search">
                    <div className="feedback-container"><span style={{visibility:"hidden"}}>.</span>
                        {searchInputRef?.current?.value && addedAudios.filter((elements)=>{ return elements?.title?.toLowerCase().includes( searchInputRef?.current?.value?.toLowerCase())})?.length===0 ? <span>No items found</span> :""}</div>
                    <div className="input-container">
                        <input ref={searchInputRef} type={'text'} placeholder={"Search"} onChange={()=>{setToggler(!toggler)}}></input>
                    </div>
                    <button onClick={(e)=>{e.preventDefault();}}>Enter song title to search</button>
                </section>

                { addedAudios?.length>0 &&   <section className="items-container">
                    {addedAudios?.sort((a,b)=>{ return new Date(b?.datereleased) - new Date(a.datereleased)})
                    .filter((elements)=>{
                        if(searchInputRef?.current?.value.length>0 ){ return elements?.title?.toLowerCase().includes( searchInputRef?.current?.value?.toLowerCase())} 
                        return elements
                    }).map((elements)=>{ return (
                        <div key={elements?._id} className="individual-item" onClick={(e)=>{e.preventDefault(); setSelectedAudio({audio : elements}); setShowSpecificAudioModal(true)}}>
                            <img alt={elements?.title[0]?.toUpperCase() + elements?.title?.slice(1, elements?.title?.length)?.toLowerCase()} src={elements?.coverart}></img>
                            <div className="title">{elements?.title[0]?.toUpperCase() + elements?.title?.slice(1, elements?.title?.length)?.toLowerCase()}</div>

                            <div className="details-conatiner">
                                    <div className="date-released" style={{color:"black", backgroundColor:"white"}}>Released</div>
                                    <div className="date-released" style={{marginBottom:"5px"}}> {CovertMonthNumbersToAlphabets(elements?.datereleased)}</div>
                                    <div  className="date-released" style={{color:`${"wheat"}`}}>Platforms</div>
                                    <div className="added-streaming-platforms">
                                        <section className="platforms">
                                            <div>{elements?.youtube !=="" &&<Link onClick={(e)=>{e.preventDefault(); window?.open(elements?.youtube, '_blank')}} to={""}><BsYoutube size={'15PX'}/></Link>}</div>

                                            <div>{elements?.audiomack !=="" &&<Link to={""} onClick={(e)=>{e.preventDefault(); window?.open(elements?.audiomack, '_blank')}}><SiAudiomack size={'15px'}/></Link>}</div>

                                            <div>{elements?.spotify !=="" &&<Link to={""} onClick={(e)=>{e.preventDefault(); window?.open(elements?.spotify, '_blank')}}><ImSpotify size={'15PX'}/></Link>}</div>

                                            <div>{elements?.applemusic !=="" && <Link to={""} onClick={(e)=>{e.preventDefault(); window?.open(elements?.applemusic, '_blank')}}><FaItunesNote size={'15PX'}/></Link>}</div>

                                            <div>{elements?.soundcloud !=="" &&<Link to={""} onClick={(e)=>{e.preventDefault(); window?.open(elements?.soundcloud, '_blank')}}><ImSoundcloud size={'15PX'}/></Link>}</div>
                                        </section>
                                    </div>
                                    </div>
                        </div>
                    )})}
                </section>}

                {/* {searchResults?.length>0  &&   <section className="items-container">
                    <div className="close-button"><button onClick={()=>setSearchResults([])}>X</button></div>
                    {searchResults?.sort((a,b)=>{ return new Date(b?.datereleased) - new Date(a.datereleased)}).
                    map((elements)=>{ return (
                        <div key={elements?._id} className="individual-item" onClick={(e)=>{e.preventDefault(); setSelectedAudio({audio : elements}); setShowSpecificAudioModal(true)}}>
                            <img alt={elements?.title[0]?.toUpperCase() + elements?.title?.slice(1, elements?.title?.length)?.toLowerCase()} src={elements?.coverart}></img>
                            <div>{elements?.title[0]?.toUpperCase() + elements?.title?.slice(1, elements?.title?.length)?.toLowerCase()}</div>
                        </div>
                    )})}
                </section>} */}

                </div>
            </main>
        </>
    )
}

export default AudiosSite;