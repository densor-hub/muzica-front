import useAuth from "../customHooks/useAuth";
import Loading from "../components/micro-components/loading";
import Page404 from "../components/404";
import { useCallback, useEffect, useState } from "react";
import GotoRefreshEndPoint from "../FNS/GoToRefreshEndPoint";

const NoRouteFound = () => {

    const { setAuth } = useAuth();
    const [show404, setShow404] = useState(false);


    const checkWhtherUserIsSignedIn = useCallback(async () => {
        if (!window?.location?.search || window?.location?.search?.code) { //code is for password resseting
            try {
                GotoRefreshEndPoint().then(results => {
                    console.log(results)
                    if (results?.status === 200) {
                        setAuth(results?.data)
                        setShow404(true);
                    } else {
                        setShow404(true)
                    }
                })

            } catch (error) {
                //response will be 401 when user is not loggedIn
                if (error?.response?.status === 401) {
                    setShow404(true);
                } else {
                    setShow404(true)
                }
            }
        }
    }, [setAuth]
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