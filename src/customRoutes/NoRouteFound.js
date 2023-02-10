import useAuth from "../customHooks/useAuth";
import Loading from "../components/micro-components/loading";
import Page404 from "../components/404";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../Resources/BaseURL";


const NoRouteFound = () => {
    const { setAuth } = useAuth();
    const [show404, setShow404] = useState(false);
    const navigateTo = useNavigate();


    const checkWhtherUserIsSignedIn = useCallback(async () => {
        console.log('visiting refresh')
        if (!window?.location?.search || window?.location?.search?.code) {
            try {
                let response = await axios?.get(`${API_BASE_URL}/refresh`, { withCredentials: true });

                if (response?.status === 200) {
                    setAuth(response?.data);
                    setShow404(true);
                }

            } catch (error) {
                navigateTo('/')
            }
        }
    }, [setAuth, navigateTo]
    )


    useEffect(() => {
        checkWhtherUserIsSignedIn()
    }, [checkWhtherUserIsSignedIn]);


    if (!show404) {
        return <Loading />
    }
    else {
        return <Page404 />
    }
}

export default NoRouteFound;