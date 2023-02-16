import useAuth from "../../customHooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../../Resources/BaseURL";
import axios from "axios";
import Loading from "./loading";
import GotoRefreshEndPoint from "../../FNS/GoToRefreshEndPoint";
import setStatuscodeErrorMessage from "../../FNS/setStatuscodeErrorMessage";



const SignOut = () => {

    const navigateTo = useNavigate();
    const { auth, setAuth } = useAuth();
    const [showLoading, setShowLoading] = useState(false);
    const [feeback, setFeedback] = useState('');

    //this signout only runs a useEffect that sign a user out locally
    //in profile-Menu-component( found in private sites sub components), auth0 signout app component is imported to sort out auth0 signout 
    const signout = useCallback(
        async () => {

            try {
                setShowLoading(true);
                let response = await axios.get(`${API_BASE_URL}/logout`, { withCredentials: true });
                console.log(response)
                if (response?.status === 200) {

                    setAuth('');
                    navigateTo('/login')
                }

            } catch (error) {
                if (error?.response?.status === 401) {
                    GotoRefreshEndPoint(auth).then((r) => {
                        if (r.status === 200) {
                            console.log(r.status)
                            signout();
                        } else {
                            navigateTo(`/login`);
                        }
                    })
                }
                else {
                    setStatuscodeErrorMessage(error?.response?.status, setFeedback)
                }

            }
        }
        , [setAuth, navigateTo, auth])

    useEffect(() => {
        signout();
    }, [signout])

    return (
        <>
            {feeback && <div style={{ textAlign: 'center' }}>{feeback}</div>}
            {!showLoading ? <Loading /> : ""}
        </>
    )
}

export default SignOut;