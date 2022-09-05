import { InputMaybe } from "../../types/graphql";
import { point as turfPoint, polygon } from "@turf/helpers";
import booleanWithin from '@turf/boolean-within'
import { CoordinateError } from "../errors/CoordinateError";

const NA_BOUNDARY_POLYGON = polygon([
    [
      [-98.9,2.9],
      [-106.7,13.6],
      [-136,47.9],
      [-166.1,48.8],
      [-169.,59.9],
      [-170.9,71.9],
      [-138.2,72.5],
      [-98.9,83.2],
      [-51.5,84.3],
      [-5.8,83.7],
      [-19.3,69.7],
      [-46.7,53.4],
      [-59.5,21.4],
      [-98.9,2.9],
    ]
  ])




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





export const validateCoords = (lnglat: number[]): boolean | Error => {
    if(lnglat.length !== 2){
        throw new CoordinateError('INVALID_COORDINATES')
    }
    const lng = lnglat[0]
    const lat = lnglat[1]
    if(lng < -180 || lng > 180){
        throw new CoordinateError('INVALID_LONGITUDE')
    }
    if(lat > 90 || lat < -90){
        throw new CoordinateError('INVALID_LATITUDE')
    }
    const point = turfPoint([lng, lat])
    if(booleanWithin(point, NA_BOUNDARY_POLYGON)){
        return true;
    }else{
        return false;
    }
} 
