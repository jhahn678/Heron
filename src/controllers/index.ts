import * as AuthControllers from './auth'
import * as UploadControllers from './upload'
import * as AutocompleteControllers from './autocomplete'
import * as SupportControllers from './support'
import * as WaterbodiesControllers from './waterbodies'

export default {
    ...AuthControllers,
    ...UploadControllers,
    ...AutocompleteControllers,
    ...SupportControllers,
    ...WaterbodiesControllers
}