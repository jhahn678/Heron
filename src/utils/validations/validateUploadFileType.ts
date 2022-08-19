const acceptedFormats: string[] = ['png', 'jpg', 'jpeg', 'gif']

export const validateUploadFileType = (filetype: string): Boolean => {
    const split = filetype.split('/')
    if(split.length !== 2) return false;
    const [type, format] = split;
    if(type !== 'image') return false;
    if(!acceptedFormats.includes(format)) return false;
    return true;
}