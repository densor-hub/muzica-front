import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../customHooks/useAuth';
import { FaUserCircle } from 'react-icons/fa';
import Auth0SignOutApp from '../../micro-components/auth0signOut.js';

import '../CSS/profile-icon-and-menu.css';
import { Auth0Provider } from '@auth0/auth0-react';

const ProfileIconAndMenu = () => {
    const [bools, setBool] = useState({ showloading: false, showMenu: false });
    const MenuRef = useRef();
    const navigateTo = useNavigate();
    const { auth } = useAuth();

    useEffect(() => {
        const Clicked = (e) => {
            if (MenuRef && !MenuRef?.current?.contains(e.target)) {
                setBool(p => { return { ...p, showMenu: false } })
            }
        }
        document?.addEventListener('click', Clicked);

        return () => {
            document?.removeEventListener('click', Clicked)
        }
    }, [])


    console.log(auth)

    return (
        <main className="profile-icon-and-menu">
            <section className='content' ref={MenuRef}>
                <div className='icon-container'>
                    <button onClick={(e) => { e.preventDefault(); setBool(p => { return { ...p, showMenu: !bools.showMenu } }) }} className={'profile-icon'} style={(auth?.profilePicture !== "" && auth?.profilePicture !== undefined && auth?.profilePicture !== null) ? { backgroundColor: "transparent" } : {}}>
                        {(auth?.profilePicture !== "" && auth?.profilePicture !== undefined && auth?.profilePicture !== null) &&
                            <img alt='' src={auth?.profilePicture}></img>}

                        {!(auth?.profilePicture !== "" && auth?.profilePicture !== undefined && auth?.profilePicture !== null) && <FaUserCircle size={'20px'} />}
                    </button>
                </div>
                {bools.showMenu && <div className="menu" >
                    <div><button onClick={(e) => { e.preventDefault(); navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/settings`); setBool(p => { return { ...p, showMenu: false } }) }}>Profile</button></div>

                    <div> <button onClick={(e) => { e.preventDefault(); navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/change-password`); setBool(p => { return { ...p, showMenu: false } }) }}>Change password</button></div>

                    <div>{!auth?.provider ?
                        <button onClick={(e) => { e.preventDefault(); navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/sign-out`); setBool(p => { return { ...p, showMenu: false } }) }}>Sign out</button> :

                        <Auth0Provider
                            domain={"dev-2xzv1o18pqg48l01.us.auth0.com"}
                            clientId={"W1xixEygVYDTD0xbn2j4PPuzyarPFFwn"}>
                            <Auth0SignOutApp />
                        </Auth0Provider>}
                    </div>
                </div>}
            </section>
        </main>
    )
}

export default ProfileIconAndMenu;