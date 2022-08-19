import * as AuthControllers from './auth'
import * as UploadControllers from './upload'

export default {
    ...AuthControllers,
    ...UploadControllers
}