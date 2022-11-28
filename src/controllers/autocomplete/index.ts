import { autocompleteWaterbodies } from "./autocompleteWaterbodies";
import { autocompleteGeoplaces } from "./autocompleteGeoplaces";
import { autocompleteAll } from "./autocompleteAll";
import { nearestGeoplace } from "./ nearestGeoplace";
import { nearestWaterbodies } from "./nearestWaterbodies";
import { searchUsersByUsername } from "./searchUsersByUsername";
import { searchDistinctWaterbodyName } from "./searchDistinctWaterbodyName";

const autocompleteControllers = {
    autocompleteWaterbodies,
    autocompleteGeoplaces,
    autocompleteAll,
    nearestGeoplace,
    nearestWaterbodies,
    searchUsersByUsername,
    searchDistinctWaterbodyName,
}

export default autocompleteControllers;