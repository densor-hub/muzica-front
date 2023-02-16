import { Outlet, Link, useNavigate } from "react-router-dom";
import useAuth from "../customHooks/useAuth";
import ProfileIconAndMenu from "../components/Private-Sites/sub-components/profile-icon-and-menu";
import { HiMenuAlt1 } from 'react-icons/hi'

import '../components/Private-Sites/CSS/added.css';
import { useRef } from "react";

const PrivateRoute = () => {
    const { auth } = useAuth();

    const NavBarRef = useRef();
    const navigateTo = useNavigate();

    if (auth?.stagenameInUrl && auth?.accessToken) {

        if (window?.location?.href?.includes(auth?.stagenameInUrl)) {
            return (
                <>
                    <main className={!(window?.location?.pathname?.endsWith('createwebsite') || window?.location?.pathname?.endsWith('createwebsite/')) ? "added-items" : "added-items"}>

                        <div className="forMobileDevicesMenu">
                            <div className="menu-icon-container">
                                <button onClick={(e) => { e.preventDefault(); NavBarRef?.current?.classList.toggle('show') }}>
                                    <HiMenuAlt1 size={"28px"} />
                                </button>
                            </div>
                        </div>
                        <section className="content-cover">
                            {<div className="profile-icon-container">
                                <ProfileIconAndMenu />
                            </div>}
                            <section style={{/*! (window?.location?.pathname?.endsWith(auth?.stagenameInUrl)||window?.location?.pathname?.endsWith(`${auth?.stagenameInUrl}/`))   ?{paddingTop :"40PX"}:{}*/ }}>
                                {<header className="loggedinheader" style={(window?.location?.pathname?.endsWith('createwebsite') || window?.location?.pathname?.endsWith('createwebsite/')) ? { margin: 0 } : {}} ref={NavBarRef}>
                                    <div>
                                        <Link
                                            style={window?.location?.pathname === (`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}`) ? { backgroundColor: "rgb(255, 71, 86)", color: "white" } : {}}
                                            to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}`}
                                            onClick={() => { window?.innerWidth <= 495 && NavBarRef?.current?.classList.toggle('show') }}>
                                            Home
                                        </Link>

                                        <Link
                                            style={
                                                window?.location?.pathname === (`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-audios`) ||
                                                    window?.location?.pathname === (`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/add-audio`) ||
                                                    window?.location?.pathname?.includes(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/edit-audio`) ? { backgroundColor: "rgb(255, 71, 86)", color: "white" } : {}
                                            }
                                            to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-audios`}
                                            onClick={() => { window?.innerWidth <= 495 && NavBarRef?.current?.classList.toggle('show') }}>
                                            Audios
                                        </Link>

                                        <Link
                                            style={
                                                window?.location?.pathname === (`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-videos`) ||
                                                    window?.location?.pathname === (`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/add-video`) ||
                                                    window?.location?.pathname?.includes(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/edit-video`) ? { backgroundColor: "rgb(255, 71, 86)", color: "white" } : {}
                                            }
                                            to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-videos`}
                                            onClick={() => { window?.innerWidth <= 495 && NavBarRef?.current?.classList.toggle('show') }}>
                                            Videos
                                        </Link>

                                        <Link
                                            style={
                                                window?.location?.pathname === (`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-images`) ||
                                                    window?.location?.pathname === (`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/add-image`) ||
                                                    window?.location?.pathname?.includes(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/edit-image`) ? { backgroundColor: "rgb(255, 71, 86)", color: "white" } : {}
                                            }
                                            to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-images`}
                                            onClick={() => { window?.innerWidth <= 495 && NavBarRef?.current?.classList.toggle('show') }}>
                                            Images
                                        </Link>
                                    </div>

                                    <div>
                                        <Link
                                            style={
                                                window?.location?.pathname === (`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-upcoming`) ||
                                                    window?.location?.pathname === (`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/add-upcoming`) ||
                                                    window?.location?.pathname?.includes(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/edit-upcoming`) ? { backgroundColor: "rgb(255, 71, 86)", color: "white" } : {}
                                            }
                                            to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-upcoming`}
                                            onClick={() => { window?.innerWidth <= 495 && NavBarRef?.current?.classList.toggle('show') }}>
                                            Upcoming
                                        </Link>

                                        <Link
                                            style={
                                                window?.location?.pathname === (`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-news`) ||
                                                    window?.location?.pathname === (`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/add-news`) ||
                                                    window?.location?.pathname?.includes(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/edit-news`) ? { backgroundColor: "rgb(255, 71, 86)", color: "white" } : {}
                                            }
                                            to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-news`}
                                            onClick={() => { window?.innerWidth <= 495 && NavBarRef?.current?.classList.toggle('show') }}>
                                            News
                                        </Link>

                                        <Link
                                            style={
                                                window?.location?.pathname === (`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-biography`) ||
                                                    window?.location?.pathname === (`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/add-biography`) ||
                                                    window?.location?.pathname?.includes(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/edit-biography`) ? { backgroundColor: "rgb(255, 71, 86)", color: "white" } : {}
                                            }
                                            to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-biography`}
                                            onClick={() => { window?.innerWidth <= 495 && NavBarRef?.current?.classList.toggle('show') }}>
                                            Biography
                                        </Link>

                                        <Link
                                            style={
                                                window?.location?.pathname === (`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-contact`) ||
                                                    window?.location?.pathname === (`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/add-contact`) ||
                                                    window?.location?.pathname?.includes(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/edit-contact`) ? { backgroundColor: "rgb(255, 71, 86)", color: "white" } : {}
                                            }
                                            to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-contact`}
                                            onClick={() => { window?.innerWidth <= 495 && NavBarRef?.current?.classList.toggle('show') }}>Contact</Link>
                                    </div>
                                </header>}

                                <Outlet />
                            </section>
                        </section>
                    </main>
                </>
            )
        }
    } else {
        navigateTo('')
    }

}

export default PrivateRoute;