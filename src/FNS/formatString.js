export const formatProperNoun = (wordOrName)=>{
    if(!wordOrName ||wordOrName ==="" || wordOrName===" " || wordOrName === null || wordOrName === undefined){

        if(wordOrName ==="" || wordOrName===" " )  return wordOrName.trim();
        return wordOrName;
    }
    else{
        let formatedNoun;
        let firstLetter;
        let noun = wordOrName;
        for(var i=0; i<=noun.length; i++){
            if(i===0){
                firstLetter = noun[i].toUpperCase();
            }
            else if(i!==noun.length){
               formatedNoun = formatedNoun + noun[i].toLowerCase();
            }
            
            if(i===noun.length){
                if(formatedNoun===undefined){
                    return firstLetter;
                } 
                else{
                    return (firstLetter + formatedNoun.split("undefined")[1]);
                }
            }
        }
    }
}

export const formatFullName=(fullname)=>{
    if( !(fullname ) || fullname === null || fullname === undefined ){
        if(fullname ==="" || fullname===" " )  return fullname.trim();
        return fullname;
    }
    else{
        let formatedFullName ;
        let isNotBlankValue =[];

        if(fullname.split(' ').length<2){
            return false
        }
        else{
            
            for(var i=0; i<fullname.split(' ').length; i++){
                if(fullname.split(' ')[i] !==""){
                    isNotBlankValue.push(fullname.split(' ')[i])
                }
            }

            if(isNotBlankValue.length<2){
                return false;
            }
            else{
                for( i=0; i<=isNotBlankValue.length; i++){
                    if(i!==isNotBlankValue.length){
                        let name = isNotBlankValue[i];
                        let firstCharacter = name.slice(0,1).toUpperCase()
                        let OtherCharacters = name.slice(1, name.length).toLowerCase();
                        let newName = firstCharacter + OtherCharacters
                        
                    formatedFullName = formatedFullName + " "+ newName.trim();
                    }
                    if(i===isNotBlankValue.length){
                        return formatedFullName.split("undefined")[1].trim();
                    }
                }
            }
        }
    }
}


export const formatEmail=(email)=>{
    if(email ===""|| email ===null || email === undefined){
        if(email ==="" || email===" " )  return email.trim();
        return email;
    }
    else{
        if(email.split("@").length!==2){
            return false
        }
        else{
            if((UnallowedEmailSymbols(email.split("@")[1])) || (UnallowedEmailSymbols(email.split("@")[0]))){
                return false
            }
            else{
                if(email.split('@')[1].split(".").length <=1){
                    return false
                }
                else{
                    if(email.split('@')[1].split(".")[1]==="" || email.split('@')[1].split(".")[0]===""){
                        return false
                    }
                    else{
                        if(email.endsWith('.')){
                            return false
                        }
                        else{
                            return true;
                        }
                       
                    }
                    
                }
                
            }
        }
    }
}


 const UnallowedEmailSymbols= (phrase)=>{
    if(phrase.includes("~")||phrase.includes("!") || phrase.includes("#")|| phrase.includes("$")|| phrase.includes("%")||phrase.includes("^")
    ||phrase.includes("&")||phrase.includes("*")|| phrase.includes("(")||phrase.includes(")")|| phrase.includes("_")||phrase.includes("=")
    ||phrase.includes("+")||phrase.includes("?")||phrase.includes("/")||phrase.includes(">")||phrase.includes(",")||phrase.includes("<") 
    ||phrase.includes("|")|| phrase.includes("@")) 
    {
        return true 
        }
        else return false;
}

