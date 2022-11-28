export interface AutocompleteQuery {
    /** Query value */
    value: string,
    /** Comma seperated longitude,latitude */
    lnglat?: string
    /** @Default 8 */
    limit?: number
}