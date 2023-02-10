import {  useCallback, useEffect  } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../Resources/BaseURL";
import { CovertMonthNumbersToAlphabets } from "../../FNS/MonthNumberToAlphabets";


const UpcomingSite=({setAddedAudios,setAddedVideos,setAddedImages, addedUpcoming, setAddedUpcoming,setAddedNews,setAddedBio, setAddedSocials, setValidAPIEndPoint, setBools})=>{
    
    const getData= useCallback(async()=>{
        try{
            let response = await axios.get(`${API_BASE_URL}${window?.location?.pathname}${window?.location?.search}`);

          console.log(response)
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
   },[setAddedAudios,setAddedVideos,setAddedImages, setAddedUpcoming,setAddedNews,setAddedBio, setAddedSocials, setValidAPIEndPoint, setBools])

   useEffect(()=>{
    if(addedUpcoming){
        if(addedUpcoming?.length ===0){
           getData();
        }
    }
},[addedUpcoming, getData])

    return(
        <>
            <main className="main-page">

                <section className="page-heading">
                    <div>Upcoming stuff</div>
                </section>
                

                { addedUpcoming?.length>0  && <section className="items-container">
                    {addedUpcoming?.sort((a,b)=>{ return new Date(b?.date) - new Date(a.date)})
                    .map((elements)=>{ 
                        let dateInAlphabets = CovertMonthNumbersToAlphabets(elements?.date);
                        
                        return (
                       <div className="individual-item" key={elements?._id}>
                            <div className="date">
                                <div className="day">{dateInAlphabets?.split('-')[2]}</div>
                                <div className="month">{dateInAlphabets?.split('-')[1]}</div>
                                <div className="year">{dateInAlphabets?.split('-')[0]}</div>
                            </div>
                       </div>
                    )})}
                </section>}
            </main>
        </>
    )
}

export default UpcomingSite;