import { BsYoutube } from 'react-icons/bs';
import { ImSoundcloud, ImSpotify } from 'react-icons/im';
import { FaItunesNote } from 'react-icons/fa';
import { SiAudiomack } from 'react-icons/si';

import './specific-audio-modal.css';

const SpecificAudioModal = ({ audio, setShowModal }) => {
    return (
        <main className='modal-container'>
            <div className="content">
                <div className='closeBTN-container'><button className='closeBTN' onClick={() => { setShowModal(false) }}>X</button></div>
                <div className='image-container'><img src={`${audio?.audio?.coverart}`} alt=""></img></div>
                <div className='directive'> Stream <span style={{ color: "wheat", fontWeight: "BOLD" }}>{audio?.audio?.title[0].toUpperCase() + audio?.audio?.title?.slice(1, audio?.audio?.title?.length)?.toLowerCase()}</span> on platforms below</div>
                <div className='streaming-links'>
                    <table>
                        <tbody>
                            {audio?.audio?.applemusic && audio?.audio?.applemusic !== "" && <tr>
                                <td className='icon'> <span ><FaItunesNote size={'20px'} /></span></td>
                                <td><span>{<a href={audio?.audio?.applemusic} target={'_blank'} rel="noreferrer">Apple music</a>}</span></td>
                            </tr>}

                            {audio?.audio?.spotify && audio?.audio?.spotify !== "" && <tr>
                                <td className='icon'> <span ><ImSpotify size={'20px'} /></span></td>
                                <td><span>{<a href={audio?.audio?.spotify} target={'_blank'} rel="noreferrer">Spotify</a>}</span></td>
                            </tr>}

                            {audio?.audio?.audiomack && audio?.audio?.audiomack !== "" && <tr>
                                <td className='icon'> <span><SiAudiomack size={'20px'} /></span></td>
                                <td><span>{<a href={audio?.audio?.audiomack} target={'_blank'} rel="noreferrer">Audiomack</a>}</span></td>
                            </tr>}

                            {audio?.audio?.soundcloud && audio?.audio?.soundcloud !== "" && <tr>
                                <td className='icon'> <span><ImSoundcloud size={'20px'} /></span></td>
                                <td><span>{<a href={audio?.audio?.soundcloud} target={'_blank'} rel="noreferrer">Soundcloud</a>}</span></td>
                            </tr>}

                            {audio?.audio?.boomplay && audio?.audio?.boomplay !== "" && <tr>
                                <td className='icon'> <span >I</span></td>
                                <td><span>{<a href={audio?.audio?.boomplay} target={'_blank'} rel="noreferrer">Boomplay</a>}</span></td>
                            </tr>}
                            {audio?.audio?.deezer && audio?.audio?.deezer !== "" && <tr>
                                <td className='icon'> <span >I</span></td>
                                <td><span>{<a href={audio?.audio?.deezer} target={'_blank'} rel="noreferrer">Deezer</a>}</span></td>
                            </tr>}
                            {audio?.audio?.youtube && audio?.audio?.youtube !== "" && <tr>
                                <td className='icon'> <span>{<BsYoutube />}</span></td>
                                <td><span>{<a href={audio?.audio?.youtube} target={'_blank'} rel="noreferrer">YouTube</a>}</span></td>
                            </tr>}

                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    )
}

export default SpecificAudioModal;