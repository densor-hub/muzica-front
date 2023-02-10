import { Link } from 'react-router-dom';
import './landing-home.css'
const Home =()=>{
    return(
        <>
            <main className='landing-home-container'>
                <div className='header'>
                    <Link to={'/register'}>Sign up</Link>
                    <Link to={'/login'}>Sign in</Link>
                </div>
                <article>
                    <header>WELCOME</header>
                    <p>Here at Muzica, our aim is to enable musicians create professional websites for their brands with little to no stress for free</p>
                    <p>Just signin to complete our website-creator form and it's a done deal.</p>
                    
                </article>

                <Link to={'/login'} className={"get-started"}>Get started</Link>
            </main>

          
        </>
    )
}

export default Home;