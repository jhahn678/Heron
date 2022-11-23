const acceptedMimeTypes: string[] = ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml', 'image/webp']

export const validateUploadType = (mimetype: string): Boolean => {
    return acceptedMimeTypes.includes(mimetype)
}