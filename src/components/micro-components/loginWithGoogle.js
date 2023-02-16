import { useAuth0 } from '@auth0/auth0-react';
import { FcGoogle } from 'react-icons/fc';
import useAuth from '../../customHooks/useAuth';
import axios from 'axios';
import Loading from './loading';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../Resources/BaseURL';



const GoogleApp = (props) => {
    const [loading, setLoading] = useState(false);
    const { loginWithRedirect, user, isAuthenticated } = useAuth0();
    const { setAuth } = useAuth();
    const navigateTo = useNavigate();

    const goToBackend = useCallback(
        async (user) => {
            try {
                setLoading(true);
                let response = await axios?.post(`${API_BASE_URL}/sign-in/google`, { user: user }, { withCredentials: true });

                if (response?.status === 200) {
                    setAuth(response?.data);
                    navigateTo(`/${response?.data?.stagenameInUrl}`)
                    setLoading(false);
                }

            } catch (error) {
                console?.log(error);
                setLoading(false);
                props?.setFeedback('Network error...')

            }
        }, [setAuth, setLoading, navigateTo, props]
    )


    // useEffect for Redirecting to backend when there is a user
    useEffect(() => {
        setLoading(false)
        if (user) {
            setLoading(true)
            goToBackend(user);
        }
        else {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }, [goToBackend, user, isAuthenticated])

    return (
        <>
            {loading && <Loading />}
            {<div className="sign-in-with-google" style={{ marginTop: "5px" }}>
                <button style={{ textDecoration: "none" }} onClick={(e) => {
                    e.preventDefault();
                    if (!user && !isAuthenticated) {
                        setLoading(true)
                        loginWithRedirect()
                    }
                    else {
                        goToBackend(user)
                    }
                }}>
                    Sign in with
                    <span style={{ background: "transparent", fontWeight: "bold", border: "0PX", position: "relative", left: "5px" }}>
                        <FcGoogle />

                    </span>
                </button>
            </div>}

        </>
    )
}

export default GoogleApp;