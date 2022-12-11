import { AuthenticationError } from "apollo-server-core";
import knex, { st } from "../../../configs/knex";
import { MutationResolvers } from "../../../types/graphql";
import { ILocation, NewLocationObj } from "../../../types/Location";
import { CreateLocationError } from "../../../utils/errors/CreateLocationError";
import { UploadError } from "../../../utils/errors/UploadError";
import { validateMediaUrl } from "../../../utils/validations/validateMediaUrl";

export const createLocation: MutationResolvers['createLocation'] = async (_, { location }, { auth }) => {
    if(!auth) throw new AuthenticationError('Authentication Required')
    const { privacy, waterbody, point, polygon, title, 
        description, hexcolor, media, map_image } = location;
    if(!point && !polygon) throw new CreateLocationError('No geometry included')

    const newLocation: NewLocationObj = { user: auth, privacy, waterbody };
    if(title) newLocation['title'] = title
    if(description) newLocation['description'] = description;
    if(hexcolor) newLocation['hexcolor'] = hexcolor;
    if(point) newLocation['geom'] = st.transform(st.geomFromGeoJSON(point), 3857)
    if(polygon) newLocation['geom'] = st.transform(st.geomFromGeoJSON(polygon), 3857)

    const [result] = await knex('locations')
        .insert({
            ...newLocation,
            nearest_place: knex.raw(`(
                select "name" || ', ' || "admin_one"
                from geoplaces order by geoplaces.geom <-> ? limit 1
            )`,[newLocation['geom']])
        })
        .returning(
            knex.raw(`*, st_asgeojson(st_transform(geom, 4326))::json as geom`)
        ) as ILocation[]

    if(map_image){
        if(!validateMediaUrl(map_image.url)) throw new UploadError('INVALID_URL')
        await knex('locationMapImages').insert({ ...map_image, user: auth, location: result.id })
    }

    if(media){
        const valid = media.filter(x => validateMediaUrl(x.url))
        const uploads = valid.map(x => ({ user: auth, location: result.id, ...x }))
        if(uploads.length === 0) throw new UploadError('INVALID_URL')
        await knex('locationMedia').insert(uploads)
    }

    return { 
        ...result, 
        total_favorites: 0 
    };
}