import MotherPage from "../components/Public-sites/MotherWebPage";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Page404 from "../components/404";



const VerifyWebsite =()=>{
    const urlSearch = window?.location?.search;
    const location = useLocation();
    const [verifiedPathname ,setVerifiedPathname] = useState('');

    useEffect(()=>{
        setVerifiedPathname(location?.pathname?.slice(1, location?.pathname?.length));
    },[location?.pathname])
 
    return  verifiedPathname !== undefined && urlSearch ? <MotherPage pathname={verifiedPathname}/> : <Page404/>
}

export default VerifyWebsite;