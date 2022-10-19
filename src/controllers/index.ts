import * as AuthControllers from './auth'
import * as UploadControllers from './upload'
import * as AutocompleteControllers from './autocomplete'
import * as SupportControllers from './support'

export default {
    ...AuthControllers,
    ...UploadControllers,
    ...AutocompleteControllers,
    ...SupportControllers
}