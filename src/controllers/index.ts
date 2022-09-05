import * as AuthControllers from './auth'
import * as UploadControllers from './upload'
import * as AutocompleteControllers from './autocomplete'

export default {
    ...AuthControllers,
    ...UploadControllers,
    ...AutocompleteControllers
}