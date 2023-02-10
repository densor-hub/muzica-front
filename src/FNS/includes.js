
export const includesUpperCase=(phrase)=>{
  if(
        phrase.includes("A") || phrase.includes("B") || phrase.includes("C") || phrase.includes("D") || phrase.includes("E") ||phrase.includes("F") || phrase.includes("G") ||phrase.includes("H") 
        ||phrase.includes("I") || phrase.includes("J") || phrase.includes("K") ||phrase.includes("L") || phrase.includes("M") || phrase.includes("N") || phrase.includes("O") ||phrase.includes("P") 
        || phrase.includes("Q") ||phrase.includes("R") ||phrase.includes("S") || phrase.includes("T") ||phrase.includes("U") || phrase.includes("V") ||phrase.includes("W") ||phrase.includes("X") 
        ||phrase.includes("Y") ||phrase.includes("Z") 
    ){
        return true
        }
        else return false;
}


export const includesLowerCase=(phrase)=>{
    if(
        phrase.includes("a") || phrase.includes("b") || phrase.includes("c") || phrase.includes("d") || phrase.includes("e") ||phrase.includes("f") || phrase.includes("g") ||phrase.includes("h") 
        ||phrase.includes("i") || phrase.includes("j") || phrase.includes("k") ||phrase.includes("l") || phrase.includes("m") || phrase.includes("n") || phrase.includes("o") ||phrase.includes("p") 
        || phrase.includes("q") ||phrase.includes("r") ||phrase.includes("s") || phrase.includes("t") ||phrase.includes("u") || phrase.includes("v") ||phrase.includes("w") ||phrase.includes("x") 
        ||phrase.includes("y") ||phrase.includes("z") 
    ){
        return true 
        }
        else return false;
}

export const includesSymbols= (phrase)=>{
    if(phrase.includes("~")||phrase.includes("!") || phrase.includes("@") || phrase.includes("#")|| phrase.includes("$")|| phrase.includes("%")||phrase.includes("^")
    ||phrase.includes("&")||phrase.includes("*")|| phrase.includes("(")||phrase.includes(")")|| phrase.includes("-")|| phrase.includes("_")||phrase.includes("=")
    ||phrase.includes("+")||phrase.includes("?")||phrase.includes("/")|| phrase.includes(".")||phrase.includes(">")||phrase.includes(",")||phrase.includes("<") 
    ||phrase.includes("|")|| phrase.includes("£")|| phrase.includes("`")|| phrase.includes("[")|| phrase.includes("{")|| phrase.includes("]")|| phrase.includes("}")
    || phrase.includes("|")) 
    {
        return true 
        }
        else return false;
}

export const includesSymbolsButPeriod= (phrase)=>{
    if(phrase.includes("~")||phrase.includes("!") || phrase.includes("@") || phrase.includes("#")|| phrase.includes("$")|| phrase.includes("%")||phrase.includes("^")
    ||phrase.includes("&")||phrase.includes("*")|| phrase.includes("(")||phrase.includes(")")|| phrase.includes("-")|| phrase.includes("_")||phrase.includes("=")
    ||phrase.includes("+")||phrase.includes("?")||phrase.includes("/")|| phrase.includes(">")||phrase.includes(",")||phrase.includes("<") 
    ||phrase.includes("|")|| phrase.includes("£")|| phrase.includes("`")|| phrase.includes("[")|| phrase.includes("{")|| phrase.includes("]")|| phrase.includes("}")
    || phrase.includes("|")) 
    {
        return true 
        }
        else return false;
}


export const includeNumbers=(phrase)=>{
   if (String(phrase).includes("0")|| String(phrase).includes("1")|| String(phrase).includes("2")|| String(phrase).includes("3") ||  String(phrase).includes("4")
    || String(phrase).includes("5")   || String(phrase).includes("6")  || String(phrase).includes("7")  || String(phrase).includes("8") || String(phrase).includes("9") )
    {
        return true 
        }
        else  return false;

}

