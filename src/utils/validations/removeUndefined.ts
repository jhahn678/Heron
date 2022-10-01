type AnyObj = { [key: string]: any }

export const removeUndefined = <T extends AnyObj>(obj: T) => {
    const result: AnyObj = {};
    for(let x of Object.keys(obj)){
        if(obj[x] !== undefined) result[x] = obj[x]
    }
    return result;
}