import { useCallback, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../Resources/BaseURL";
import { ImNewspaper} from 'react-icons/im';



import './CSS/news-site.css';

const NewsSite=({ addedNews,setAddedAudios,setAddedVideos,addedImages, setAddedImages, setAddedUpcoming,setAddedNews,setAddedBio, setAddedSocials, setValidAPIEndPoint, setBools})=>{

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
   },[setAddedAudios,setAddedVideos, setAddedImages, setAddedUpcoming,setAddedNews,setAddedBio, setAddedSocials, setValidAPIEndPoint, setBools])

   useEffect(()=>{
    if(addedNews){
        if(addedNews?.length ===0|| addedNews===""){
           getData();
        }
    }
},[addedNews, getData])


// const search=async()=>{
//    if(! searchInputRef?.current?.value){
//     setFeedback('Enter phrase or word')
//    }
//    else{
//     try{
//         let response = await axios.post(`${API_BASE_URL}${window?.location?.pathname}${window?.location?.search}`,{searchFor : searchInputRef?.current?.value});

//         console.log(response)
//         if(response?.status===200){
//             setSearchResults(response?.data?.searchedItems);
//             setShowNews(true)
//         }
//         else{
//             if(response?.status === 204){
//                 setShowNews(false)
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
            
            <main className="news-site">
                <div className="cover">
                <section className="large-icon">
                    <div><ImNewspaper className="icon"/></div>
                </section>
                

                {addedNews?.length>0 && addedImages?.length>0 && <section className="items-container">
                    {addedNews?.sort((a,b)=>{ return new Date(b?.date) - new Date(a.date)})
                    .map((elements, index)=>{
                         return (
                        <div key={elements?._id} className="news" onClick={(e)=>{e.preventDefault()}}>
                                <div className="headline">{elements?.headline?.toUpperCase()}</div>
                                <div className="details">
                                <span className="image-container">
                                        <img alt="" style={index%2 !==0 ?{float:"left"}:{float:"right"}} src={`${addedImages[Math?.floor(Math?.random()* addedImages?.length)]?.image}`}></img>
                                    </span>
                                    {elements?.details}

                                    

                                </div>
                        </div>
                    )})}
                </section>}

                {/* {searchResults?.length>0  &&  showNews && <section className="items-container">
                    <div className="close-button"><button onClick={()=>setSearchResults([])}>X</button></div>
                    {searchResults?.sort((a,b)=>{ return new Date(b?.datereleased) - new Date(a.datereleased)}).
                    map((elements)=>{ return (
                        <div key={elements?._id} className="individual-item" onClick={(e)=>{e.preventDefault(); setSelectedNews({news : elements}); setShowSelectedNewsModal(true)}}>
                            
                        </div>
                    )})}
                </section>} */}

                {/* <div>{!showNews && feedback}</div> */}
                </div>
            </main>
        </>
    )
}

export default NewsSite;