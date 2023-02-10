import { useNavigate } from "react-router-dom";

const Page403=()=>{
    const navigateTo = useNavigate();
    return(

        <main style={{backgroundColor:"black",flexDirection:"column", color:"white", minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center"}}>
            <b>Unauthorized</b>
            <b style={{fontSize:'large'}}>404</b>

            <button style={{color: "black", backgroundColor:"white"}} onClick={(e)=>{e.preventDefault(); navigateTo(-1)}}>GO BACK</button>
        </main>
    )
}

export default Page403;