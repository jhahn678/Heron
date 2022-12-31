export interface AutocompleteQuery {
    /** Query value */
    value: string,
    /** Comma seperated longitude,latitude */
    lnglat?: string
    /** @Default 8 */
    limit?: number
}

export interface AutocompletePlaces {
    /** Query value */
    value: string,
    /** Comma seperated longitude,latitude */
    lnglat?: string
    /** @Default 8 */
    limit?: number
    /** Comma seperated fclass values.
     * 
     * Options: 
     * - P (Places, cities, villages, etc.)
     * - L (Land, parks, areas, etc.)
     * - A (Administrative, country, state, county, etc.)
    */
    fclass?: string
}

export enum Fclass {
    /** Places, cities, villages, etc. */
    P = 'P',
    /** Land, parks, areas, etc. */
    L = 'L',
    /** Administrative, country, state, county, etc. */
    A = 'A'
}