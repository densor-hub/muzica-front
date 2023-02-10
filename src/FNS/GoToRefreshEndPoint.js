import axios from "axios";
import { API_BASE_URL } from "../Resources/BaseURL";
 
const GotoRefreshEndPoint =async(Auth)=>{

//  //delete headers
//  delete axios.defaults.headers.common['Authorization'];
 
//  //go to refresh endpoint
//     try {
//         let RefreshResponse = await axios.post(`${API_BASE_URL}/refresh`,Auth?  { _id: Auth.id} : {}, {withCredentials: true});

//         if(RefreshResponse.status===200){
//             if(RefreshResponse.data.accessToken !==null && RefreshResponse.data.accessToken !==undefined){
//                 //assign new access token
//                 let newAccessToken= RefreshResponse.data.accessToken;
        
//                 //reset deafaut headers of all other requests
//                 axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
       
//                 //retry requests
//                 return {status :RefreshResponse.status, data : RefreshResponse.data};
//             }
//        }
//     } catch (error) {
//         return error.response.status;
//     }
   

    try {
           let response=  await  axios.get(`${API_BASE_URL}/refresh`, {withCredentials: true});
           
            if(response?.status===200){
                return {status : response?.status, data : response?.data}
            }           
    } catch (error) {
        return { status : error?.response?.status}
    }

}


export default GotoRefreshEndPoint;