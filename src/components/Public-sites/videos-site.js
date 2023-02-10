import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../Resources/BaseURL";
import {RiVideoDownloadFill} from 'react-icons/ri';
import {BsYoutube} from 'react-icons/bs';



import './CSS/videos-site.css'


const VideosSite=({setAddedAudios, addedVideos,setAddedVideos, setAddedImages, setAddedUpcoming,setAddedNews ,setAddedBio, setAddedSocials, setValidAPIEndPoint, setBools})=>{

    const searchInputRef = useRef();
    const [toggler, setToggler] = useState(false)

    
    //called when added videos are empty
    const getData= useCallback(async()=>{
        try{
            let response = await axios.get(`${API_BASE_URL}${window?.location?.pathname}${window?.location?.search}`);

            if(response?.status===200){
                console.log(response);

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
   },[setAddedAudios, setAddedBio, setAddedImages, setAddedNews, setAddedSocials, setAddedUpcoming, setAddedVideos, setBools, setValidAPIEndPoint])

   useEffect(()=>{
    if(addedVideos){
        if(addedVideos?.length ===0){
           getData();
        }
    }
},[ getData, addedVideos])


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
//             setShowVideos(true)
//         }
//         else{
//             if(response?.status === 204){
//                 setShowVideos(false)
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
            <main className="video-site">
                <div className="cover">
                <section className="large-icon">
                    <div><RiVideoDownloadFill className="icon"/></div>
                </section>
                <section className="search">
                    <div className="feedback-container" style={{color:"white", textAlign:"center"}}><span style={{visibility:"hidden"}}>.</span>{searchInputRef?.current?.value && addedVideos?.length>0 && addedVideos.filter((elements)=>{ return elements?.title?.toLowerCase()?.includes(searchInputRef?.current?.value?.toLowerCase())})?.length<=0 && <span><b>No items found</b></span>}</div>
                    
                    <div className="input-container">
                        <input ref={searchInputRef} type={'text'} placeholder={"Search"} onChange={()=>{setToggler(!toggler)}}></input>
                    </div>
                    <button onClick={(e)=>{e.preventDefault(); }}>Enter video title to search</button>
                </section>

                

                {addedVideos?.length>0  && <section className="items-container">
                    {addedVideos?.sort((a,b)=>{ return new Date(b?.datereleased) - new Date(a.datereleased)})
                    .filter((elements)=>{ 
                        if(searchInputRef?.current?.value){
                            return elements?.title?.toLowerCase()?.includes(searchInputRef?.current?.value?.toLowerCase())
                        }
                        return elements
                    } )
                    .map((elements)=>{ return (
                        <a href={elements?.link} target={'_blank'} rel={'noreferrer'} key={elements?._id}  className="individual-item">
                            <div className="iframe-container">
                                <iframe title={elements.title} src={elements?.link}></iframe>

                            </div>
                            <div className='title'>Watch {elements?.title[0]?.toUpperCase() + elements?.title?.slice(1, elements?.title?.length)?.toLowerCase()} on youtube <span><BsYoutube size={"20px"}/></span></div>

                        </a>
                    )})}
                </section>}

                {/* {searchResults?.length>0  &&  showVideos && <section className="items-container">
                    <div className="close-button"><button onClick={(e)=>{e.preventDefault(); setSearchResults([])}}>X</button></div>
                    {searchResults?.sort((a,b)=>{ return new Date(b?.datereleased) - new Date(a.datereleased)}).
                    map((elements)=>{ return (
                        <div key={elements?._id} className="individual-item" onClick={(e)=>{e.preventDefault(); }}>
                            <div className="iframe-container">
                                <iframe title={elements.title} ></iframe>
                            </div>
                            <dv className='title'>{elements?.title[0]?.toUpperCase() + elements?.title?.slice(1, elements?.title?.length)?.toLowerCase()}</dv>
                        </div>
                    )})}
                </section>}

                <div>{!showVideos && feedback}</div> */}
            </div>
            </main>
        </>
    )
}

export default VideosSite;