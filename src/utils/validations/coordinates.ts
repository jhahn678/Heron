import { InputMaybe } from "../../types/graphql";
/** Validates coordinates as a */
export const validatePointCoordinates = (
    coords: number[] | InputMaybe<number>[]
) => ( 
    Array.isArray(coords) && coords.length === 2 &&
    typeof coords[0] === 'number' &&
    typeof coords[1] === 'number' &&
    coords[0] > -180 && coords[0] < 180 &&
    coords[1] > -90 && coords[1] < 90
) ? true : false;