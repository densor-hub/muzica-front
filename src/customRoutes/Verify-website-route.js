import MotherPage from "../components/Public-sites/MotherWebPage";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Page404 from "../components/404";



const VerifyWebsite = () => {
    const urlSearch = window?.location?.search;
    const location = useLocation();
    const [verifiedPathname, setVerifiedPathname] = useState('');

    useEffect(() => {
        setVerifiedPathname(location?.pathname?.slice(1, location?.pathname?.length));
    }, [location?.pathname])

    console.log(
        verifiedPathname !== undefined && urlSearch
        && (window?.location?.search?.slice(1, window?.location?.search?.length)?.split('&&')[0]?.split('=')[0]?.trim()?.toLowerCase() === 'a')
        && (window?.location?.search?.slice(1, window?.location?.search?.length)?.split('&&')[1]?.split('=')[0]?.trim()?.toLowerCase() === 'id')

    )


    return verifiedPathname !== undefined && urlSearch
        && (window?.location?.search?.slice(1, window?.location?.search?.length)?.split('&&')[0]?.split('=')[0]?.trim()?.toLowerCase() === 'a')
        && (window?.location?.search?.slice(1, window?.location?.search?.length)?.split('&&')[1]?.split('=')[0]?.trim()?.toLowerCase() === 'id')

        ? <MotherPage pathname={verifiedPathname} /> : <Page404 />
}

export default VerifyWebsite;