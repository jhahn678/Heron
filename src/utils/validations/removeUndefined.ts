//@ts-ignore
export const removeUndefined = (obj) => {
    const copy = { ...obj };
    for(let x of Object.keys(obj)){
        if(typeof obj[x] === 'undefined'){
            delete copy[x];
        }
    }
    return copy;
}