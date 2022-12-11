import { AuthenticationError } from "apollo-server-core";
import knex, { st } from "../../../configs/knex";
import { NewCatchBuilder } from "../../../types/Catch";
import { MutationResolvers } from "../../../types/graphql";
import { UploadError } from "../../../utils/errors/UploadError";
import { validateMediaUrl } from "../../../utils/validations/validateMediaUrl";

export const createCatch: MutationResolvers['createCatch'] = async (_, { newCatch }, { auth }) => {
    const { 
        point, description, waterbody, 
        map_image, species, weight, length,
        media, title, rig, created_at
    } = newCatch;

    if(!auth) throw new AuthenticationError('Authentication Required')
    const catchObj: NewCatchBuilder = { user: auth }

    if(waterbody) catchObj['waterbody'] = waterbody;
    if(title) catchObj['title'] = title;
    if(description) catchObj['description'] = description;
    if(species) catchObj['species'] = species;
    if(rig) catchObj['rig'] = rig;
    if(weight) catchObj['weight'] = weight;
    if(length) catchObj['length'] = length;
    if(point) catchObj['geom'] = st.transform(st.geomFromGeoJSON(point), 3857)
    if(created_at) catchObj['created_at'] = created_at;

    const [result] = await knex("catches").insert(catchObj, '*')

    if(map_image){
        if(!validateMediaUrl(map_image.url)) throw new UploadError('INVALID_URL')
        await knex('catchMapImages').insert({ ...map_image, user: auth, catch: result.id })
    }
        
    if(media){
        const valid = media.filter(x => validateMediaUrl(x.url))
        const uploads = valid.map(x => ({ user: auth, catch: result.id, ...x}))
        if(uploads.length === 0) throw new UploadError('INVALID_URL')
        await knex('catchMedia').insert(uploads)
    }

    if(!point) return { ...result, total_favorites: 0 };
    return { ...result, geom: point, total_favorites: 0 } 
}