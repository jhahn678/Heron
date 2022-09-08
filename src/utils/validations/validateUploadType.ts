const acceptedMimeTypes: string[] = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp']

export const validateUploadType = (mimetype: string): Boolean => {
    return acceptedMimeTypes.includes(mimetype)
}