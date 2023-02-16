import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./loading";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../Resources/BaseURL";
import GotoRefreshEndPoint from "../../FNS/GoToRefreshEndPoint";

const Auth0SignOutApp = () => {

    const { logout } = useAuth0();
    const [showLoading, setShowLoading] = useState(false);
    const navigateTo = useNavigate();

    //not using setAuth('') in this approach beacuse it will be redundant and have no effect
    //when the page routes to auth0 logout and returns, it more like refreshes the page hence auth automatically sets to ('')
    //and sice backend cookies have been cleared and refresh tkoen has been set to '', it will hit 403 upon refresh
    const signout = async () => {

        try {
            setShowLoading(true);
            let response = await axios.get(`${API_BASE_URL}/logout`, { withCredentials: true });

            if (response?.status === 200) {
                logout({ logoutParams: {} })
            }
        } catch (error) {

            if (error?.response?.status === 401) {
                GotoRefreshEndPoint().then((r) => {
                    if (r?.status === 200) {
                        signout();
                    }
                    else {
                        window?.alert('Error ocuured, could not log out, try again')
                        navigateTo(-1);
                    }
                })
            }

        }
    }


    return (<>
        {showLoading && <Loading />}
        <button onClick={(e) => { e.preventDefault(); signout() }}>Sign out</button>
    </>)
}

export default Auth0SignOutApp;