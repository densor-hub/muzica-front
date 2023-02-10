import { Navigate, Outlet } from "react-router-dom";
import GotoRefreshEndPoint from "../FNS/GoToRefreshEndPoint";
import { useEffect, useState } from "react";
import useAuth from "../customHooks/useAuth";


const PublicRoute=()=>{
    const [stagenameInUrl, setStagenameInUrl] = useState('');
    const {auth} = useAuth();
    useEffect(()=>{
        if(!auth.goToGoogle){
            GotoRefreshEndPoint().then((results)=>{
               if(results?.status ===200){
                    setStagenameInUrl(results?.data?.stagenameInUrl);
               }
            })
        }
    })

    if(stagenameInUrl && ! window?.location?.search){
        return <Navigate to={stagenameInUrl}></Navigate>
    }
    else{
        return <Outlet/>
    }

}
export default PublicRoute;