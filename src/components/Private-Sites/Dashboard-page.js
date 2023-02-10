import { Link } from "react-router-dom";
import useAuth from "../../customHooks/useAuth";
import { ImMusic, ImNewspaper } from 'react-icons/im';
import { TfiVideoClapper } from 'react-icons/tfi';
import { BsImages } from 'react-icons/bs';
import { MdUpcoming } from 'react-icons/md';
import { FiUser, FiPhoneCall } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';


import './CSS/dashboard.css'

const ProfilePage = () => {
    const { auth } = useAuth();


    return (
        <main className="profile-page-container" style={{ paddingTop: "40px" }}>

            <section className="profile">
                <div className="topside">

                    <div className="image-container">
                        {auth?.profilePicture !== "" ? <img alt={`${''}`} src={auth?.profilePicture}></img> : <FaUserCircle size={"30px"} />}
                    </div>
                    <div className="upload-button-container">
                        <div className="stage-name">Hello, {auth.stagenameInUrl?.length > 0 ? auth?.stagename[0]?.toUpperCase() + auth?.stagename?.slice(1, auth?.stagename?.length)?.toLowerCase() : ""}</div>
                    </div>
                </div>

                <div className="create-website-link-container">
                    <Link className="create-website-link" to={auth ? `/${auth?.stagenameInUrl?.toLowerCase()}/createwebsite` : ""} onClick={() => { localStorage?.setItem('currentcontent', "") }}>Create Your  Website</Link>
                </div>

                <section className="collections-container">
                    <div className="collections">
                        <div className="added">
                            <Link to={`/${auth?.stagenameInUrl?.trim().toLowerCase()}/added-audios`}>
                                <div ><ImMusic className="icon" /></div>
                                <div className="caption">audios</div>
                            </Link>
                        </div>

                        <div className="added">
                            <Link to={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-videos`}>
                                <div ><TfiVideoClapper className="icon" /></div>
                                <div className="caption">videos</div>
                            </Link>
                        </div>

                        <div className="added">
                            <Link to={`/${auth?.stagenameInUrl?.trim().toLowerCase()}/added-images`}>
                                <div ><BsImages className="icon" /></div>
                                <div className="caption">images</div>
                            </Link>
                        </div>

                        <div className="added">
                            <Link to={`/${auth?.stagenameInUrl?.trim().toLowerCase()}/added-upcoming`}>
                                <div ><MdUpcoming className="icon" /></div>
                                <div className="caption">upcoming</div>
                            </Link>
                        </div>

                        <div className="added">
                            <Link to={`/${auth?.stagenameInUrl?.trim().toLowerCase()}/added-news`}>
                                <div><ImNewspaper className="icon" /></div>
                                <div className="caption">news</div>
                            </Link>
                        </div>
                        <div className="added">
                            <Link to={`/${auth?.stagenameInUrl?.trim().toLowerCase()}/added-biography`}>
                                <div ><FiUser className="icon" /></div>
                                <div className="caption">biography</div>
                            </Link>
                        </div>

                        <div className="added">
                            <Link to={`/${auth?.stagenameInUrl?.trim().toLowerCase()}/added-contact`}>
                                <div><FiPhoneCall className="icon" /></div>
                                <div className="caption">contact</div>
                            </Link>
                        </div>

                    </div>
                </section>
            </section>

        </main>
    )
}

export default ProfilePage;