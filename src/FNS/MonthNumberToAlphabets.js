export const CovertMonthNumbersToAlphabets= (date)=>{
    const months =["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

    for(var i=0; i <=months.length; i++){
        if((months[i]===months[Number(date.split('-')[1])])){
            return(`${date?.split('-')[0]}-${months[i-1]}-${date?.split('-')[2]}`);
        }
    }
}



export const convertMonthAlphabetsToNumbers =(date)=>{
    let newDate;
    const months =["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    for(var i=0; i <=months.length; i++){
        if((months[i]===date.split('-')[1])){
            newDate = date.replace(date.split('-')[1], i+1);
        }
    }

    if(newDate.split('-')[1].length===1 ){
        return `${newDate.split('-')[0]}-0${newDate.split('-')[1]}-${newDate.split('-')[2]}`
    }
    else return newDate
}