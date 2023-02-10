import useAuth from "../customHooks/useAuth";
import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../Resources/BaseURL";
import axios from "axios";
import Loading from "../components/micro-components/loading";
import { useNavigate } from "react-router-dom";

const HomeRoute=()=>{
    const {setAuth} = useAuth();
    const [loading, setLoading] = useState(false);
    const navigateTo = useNavigate();

    const VerifyUser = useCallback(
        async()=>{
            try {
                setLoading(true);
                let response = await axios?.get(`${API_BASE_URL}/user-verified`, {withCredentials: true});
    
                if(response?.status===200){
                    setAuth(response?.data);
                    navigateTo(`/${response?.data?.stagenameInUrl}`);
                }else{
                    navigateTo(`/login`);
                }
                
            } catch (error) {
                navigateTo('/login')
            }  
        },[setAuth, navigateTo]
    )

    useEffect(()=>{
        VerifyUser();              
    },[VerifyUser])

    
    return(<>
        {loading && <Loading/>}
    </>)
}


export default  HomeRoute;