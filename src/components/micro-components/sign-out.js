import useAuth from "../../customHooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../../Resources/BaseURL";
import axios from "axios";
import Loading from "./loading";


const SignOut = () => {
    const navigateTo = useNavigate();
    const { setAuth } = useAuth();
    const [showLoading, setShowLoading] = useState(false);

    const signout = useCallback(
        async () => {
            try {

                setShowLoading(true);
                await axios.get(`${API_BASE_URL}/sign-out`, { withCredentials: true }).then(() => {
                    setAuth('');
                    navigateTo('/login')
                })

            } catch (error) {
                navigateTo('/login')
            }
        }
        , [setAuth, navigateTo])

    useEffect(() => {

        signout();
    }, [signout])

    return (
        <>
            {!showLoading ? <Loading /> : ""}
        </>
    )
}

export default SignOut;