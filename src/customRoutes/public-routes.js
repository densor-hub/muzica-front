import { Navigate, Outlet } from "react-router-dom";
import GotoRefreshEndPoint from "../FNS/GoToRefreshEndPoint";
import { useEffect, useCallback } from "react";
import useAuth from "../customHooks/useAuth";


const PublicRoute = () => {
    const { auth, setAuth } = useAuth();

    const checkWhtherUserIsSignedIn = useCallback(async () => {
        if (!window?.location?.search || window?.location?.search?.code) {
            try {
                GotoRefreshEndPoint().then(results => {
                    if (results?.status === 200) {
                        setAuth(results?.data)
                    }
                })

            } catch (error) {
                //response will be 401 when user is not loggedIn
                console.log('Error')
            }
        }
    }, [setAuth]
    )


    useEffect(() => {
        checkWhtherUserIsSignedIn()
    }, [checkWhtherUserIsSignedIn]);


    if (auth?.stagenameInUrl && !window?.location?.search) {
        return <Navigate to={auth?.stagenameInUrl}></Navigate >
    }
    else {
        return <Outlet />
    }

}
export default PublicRoute;