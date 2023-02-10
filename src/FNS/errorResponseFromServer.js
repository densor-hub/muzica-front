import GotoRefreshEndPoint from "./GoToRefreshEndPoint";

const errorResponsefromServer =async (error, recallFetch, Auth )=>{
    let returnee;
    console.log(error);
    //for add employee fetch sake
    if(!((error.response.data)) ||(error.response.data ===undefined)){
        returnee= undefined
    }else{
        if(error.response.status===401){
            await GotoRefreshEndPoint(Auth).then((results)=>{
                if(results.status===200){
                    recallFetch();
                    returnee = true
                }else {
                    returnee= false;
                }
            });
        }
        else{
            returnee = error.response.status;
        }
    }
    return returnee;

}

export default errorResponsefromServer;