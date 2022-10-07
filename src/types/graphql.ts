import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { IUser } from './User';
import { ICatch, ICatchMedia } from './Catch';
import { ILocation, ILocationMedia } from './Location';
import { IWaterbody, IWaterbodyMedia, IWaterbodyReview } from './Waterbody';
import { Context } from './context';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AccountNumber: any;
  BigInt: any;
  Byte: any;
  CountryCode: any;
  Cuid: any;
  Currency: any;
  DID: any;
  Date: any;
  DateTime: any;
  Duration: any;
  EmailAddress: any;
  GUID: any;
  Geometry: any;
  GeometryCollection: any;
  HSL: any;
  HSLA: any;
  HexColorCode: any;
  Hexadecimal: any;
  IBAN: any;
  IPv4: any;
  IPv6: any;
  ISBN: any;
  ISO8601Duration: any;
  JSON: any;
  JSONObject: any;
  JWT: any;
  Latitude: any;
  LineString: any;
  LocalDate: any;
  LocalEndTime: any;
  LocalTime: any;
  Locale: any;
  Long: any;
  Longitude: any;
  MAC: any;
  MultiLineString: any;
  MultiPolygon: any;
  NegativeFloat: any;
  NegativeInt: any;
  NonEmptyString: any;
  NonNegativeFloat: any;
  NonNegativeInt: any;
  NonPositiveFloat: any;
  NonPositiveInt: any;
  ObjectID: any;
  PhoneNumber: any;
  Point: any;
  Polygon: any;
  Port: any;
  PositiveFloat: any;
  PositiveInt: any;
  PostalCode: any;
  RGB: any;
  RGBA: any;
  RoutingNumber: any;
  SafeInt: any;
  Time: any;
  TimeZone: any;
  Timestamp: any;
  URL: any;
  USCurrency: any;
  UUID: any;
  UnsignedFloat: any;
  UnsignedInt: any;
  UtcOffset: any;
  Void: any;
};

export enum AdminOneEnum {
  Aguascalientes = 'aguascalientes',
  Alabama = 'alabama',
  Alaska = 'alaska',
  Alberta = 'alberta',
  Arizona = 'arizona',
  Arkansas = 'arkansas',
  BajaCalifornia = 'bajaCalifornia',
  BajaCaliforniaSur = 'bajaCaliforniaSur',
  BritishColumbia = 'britishColumbia',
  California = 'california',
  Campeche = 'campeche',
  Chiapas = 'chiapas',
  Chihuahua = 'chihuahua',
  Coahuila = 'coahuila',
  Colima = 'colima',
  Colorado = 'colorado',
  Connecticut = 'connecticut',
  Delaware = 'delaware',
  DistrictOfColumbia = 'districtOfColumbia',
  DistritoFederal = 'distritoFederal',
  Durango = 'durango',
  Florida = 'florida',
  Georgia = 'georgia',
  Guanajuato = 'guanajuato',
  Guerrero = 'guerrero',
  Hawaii = 'hawaii',
  Hidalgo = 'hidalgo',
  Idaho = 'idaho',
  Illinois = 'illinois',
  Indiana = 'indiana',
  Iowa = 'iowa',
  Jalisco = 'jalisco',
  Kansas = 'kansas',
  Kentucky = 'kentucky',
  KommuneKujalleq = 'kommuneKujalleq',
  KommuneqarfikSermersooq = 'kommuneqarfikSermersooq',
  Louisiana = 'louisiana',
  Maine = 'maine',
  Manitoba = 'manitoba',
  Maryland = 'maryland',
  Massachusetts = 'massachusetts',
  Mexico = 'mexico',
  Michigan = 'michigan',
  Michoacan = 'michoacan',
  Minnesota = 'minnesota',
  Mississippi = 'mississippi',
  Missouri = 'missouri',
  Montana = 'montana',
  Morelos = 'morelos',
  Nationalparken = 'nationalparken',
  Nayarit = 'nayarit',
  Nebraska = 'nebraska',
  Nevada = 'nevada',
  NewBrunswick = 'newBrunswick',
  NewHampshire = 'newHampshire',
  NewJersey = 'newJersey',
  NewMexico = 'newMexico',
  NewYork = 'newYork',
  NewfoundlandAndLabrador = 'newfoundlandAndLabrador',
  NorthCarolina = 'northCarolina',
  NorthDakota = 'northDakota',
  NorthwestTerritories = 'northwestTerritories',
  NovaScotia = 'novaScotia',
  NuevoLeon = 'nuevoLeon',
  Nunavat = 'nunavat',
  Nunavut = 'nunavut',
  Oaxaca = 'oaxaca',
  Ohio = 'ohio',
  Oklahoma = 'oklahoma',
  Ontario = 'ontario',
  Oregon = 'oregon',
  Pennsylvania = 'pennsylvania',
  Pituffik = 'pituffik',
  PrinceEdwardIsland = 'princeEdwardIsland',
  Puebla = 'puebla',
  QaasuitsupKommunia = 'qaasuitsupKommunia',
  QeqqataKommunia = 'qeqqataKommunia',
  Quebec = 'quebec',
  Queretaro = 'queretaro',
  QuintanaRoo = 'quintanaRoo',
  RhodeIsland = 'rhodeIsland',
  SanLuisPotosi = 'sanLuisPotosi',
  Saskatchewan = 'saskatchewan',
  Sinaloa = 'sinaloa',
  Sonora = 'sonora',
  SouthCarolina = 'southCarolina',
  SouthDakota = 'southDakota',
  Tabasco = 'tabasco',
  Tamaulipas = 'tamaulipas',
  Tennesse = 'tennesse',
  Tennessee = 'tennessee',
  Texas = 'texas',
  Tlaxcala = 'tlaxcala',
  Utah = 'utah',
  Veracruz = 'veracruz',
  Vermont = 'vermont',
  Virginia = 'virginia',
  Washington = 'washington',
  WestVirginia = 'westVirginia',
  Wisconsin = 'wisconsin',
  Wyoming = 'wyoming',
  Yucatan = 'yucatan',
  Yukon = 'yukon',
  Zacatecas = 'zacatecas'
}

export type AnyMedia = {
  __typename?: 'AnyMedia';
  created_at: Scalars['DateTime'];
  id: Scalars['Int'];
  key: Scalars['String'];
  url: Scalars['String'];
  user?: Maybe<User>;
};

export type Catch = {
  __typename?: 'Catch';
  created_at?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  geom?: Maybe<Scalars['Point']>;
  id: Scalars['Int'];
  is_favorited?: Maybe<Scalars['Boolean']>;
  length?: Maybe<Scalars['Float']>;
  map_image?: Maybe<CatchMapImage>;
  media?: Maybe<Array<Maybe<CatchMedia>>>;
  rig?: Maybe<Scalars['String']>;
  species?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  total_favorites?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['DateTime']>;
  user: User;
  waterbody?: Maybe<Waterbody>;
  weight?: Maybe<Scalars['Float']>;
};


export type CatchMediaArgs = {
  limit?: InputMaybe<Scalars['Int']>;
};

export type CatchDetails = {
  description?: InputMaybe<Scalars['String']>;
  length?: InputMaybe<Scalars['Float']>;
  rig?: InputMaybe<Scalars['String']>;
  species?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  weight?: InputMaybe<Scalars['Float']>;
};

export type CatchMapImage = {
  __typename?: 'CatchMapImage';
  catch?: Maybe<Catch>;
  created_at: Scalars['DateTime'];
  id: Scalars['Int'];
  key: Scalars['String'];
  url: Scalars['String'];
  user?: Maybe<User>;
};

export type CatchMedia = {
  __typename?: 'CatchMedia';
  catch?: Maybe<Catch>;
  created_at: Scalars['DateTime'];
  id: Scalars['Int'];
  key: Scalars['String'];
  url: Scalars['String'];
  user?: Maybe<User>;
};

export enum CatchQuery {
  Coordinates = 'COORDINATES',
  Following = 'FOLLOWING',
  User = 'USER',
  Waterbody = 'WATERBODY'
}

export enum CatchSort {
  CreatedAtNewest = 'CREATED_AT_NEWEST',
  CreatedAtOldest = 'CREATED_AT_OLDEST',
  LengthLargest = 'LENGTH_LARGEST',
  Nearest = 'NEAREST',
  WeightLargest = 'WEIGHT_LARGEST'
}

export type CatchStatistics = {
  __typename?: 'CatchStatistics';
  largest_catch?: Maybe<Catch>;
  species_counts?: Maybe<Array<SpeciesCount>>;
  top_species?: Maybe<Scalars['String']>;
  top_waterbody?: Maybe<Waterbody>;
  total_catches: Scalars['Int'];
  total_species: Scalars['Int'];
  total_waterbodies: Scalars['Int'];
  waterbody_counts?: Maybe<Array<WaterbodyCount>>;
};

export enum ClassificationEnum {
  Bay = 'bay',
  Bayou = 'bayou',
  Beach = 'beach',
  Creek = 'creek',
  Lagoon = 'lagoon',
  Lake = 'lake',
  Pond = 'pond',
  Reservoir = 'reservoir',
  River = 'river',
  Strait = 'strait',
  Stream = 'stream'
}

export type Coordinates = {
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
};

export type DateRange = {
  max?: InputMaybe<Scalars['DateTime']>;
  min?: InputMaybe<Scalars['DateTime']>;
};

export type Location = {
  __typename?: 'Location';
  created_at?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  geom?: Maybe<Scalars['Geometry']>;
  hexcolor?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  is_favorited?: Maybe<Scalars['Boolean']>;
  is_saved?: Maybe<Scalars['Boolean']>;
  map_image?: Maybe<LocationMapImage>;
  media?: Maybe<Array<Maybe<LocationMedia>>>;
  nearest_place?: Maybe<Scalars['String']>;
  privacy: Privacy;
  title?: Maybe<Scalars['String']>;
  total_favorites?: Maybe<Scalars['Int']>;
  user: User;
  waterbody?: Maybe<Waterbody>;
};

export type LocationMapImage = {
  __typename?: 'LocationMapImage';
  created_at: Scalars['DateTime'];
  id: Scalars['Int'];
  key: Scalars['String'];
  location?: Maybe<Location>;
  url: Scalars['String'];
  user?: Maybe<User>;
};

export type LocationMedia = {
  __typename?: 'LocationMedia';
  created_at: Scalars['DateTime'];
  id: Scalars['Int'];
  key: Scalars['String'];
  location?: Maybe<Location>;
  url: Scalars['String'];
  user?: Maybe<User>;
};

export enum LocationQuery {
  User = 'USER',
  UserSaved = 'USER_SAVED',
  Waterbody = 'WATERBODY'
}

export enum LocationSort {
  CreatedAtNewest = 'CREATED_AT_NEWEST',
  CreatedAtOldest = 'CREATED_AT_OLDEST',
  MostRecommended = 'MOST_RECOMMENDED',
  Nearest = 'NEAREST'
}

export type LocationStatistics = {
  __typename?: 'LocationStatistics';
  total_locations: Scalars['Int'];
  waterbody_counts?: Maybe<Array<WaterbodyCount>>;
};

export type LocationUpdate = {
  description?: InputMaybe<Scalars['String']>;
  hexcolor?: InputMaybe<Scalars['String']>;
  map_image?: InputMaybe<MediaInput>;
  point?: InputMaybe<Scalars['Point']>;
  polygon?: InputMaybe<Scalars['Polygon']>;
  privacy?: InputMaybe<Privacy>;
  title?: InputMaybe<Scalars['String']>;
};

export type Media = AnyMedia | CatchMedia | LocationMedia | WaterbodyMedia;

export type MediaInput = {
  key: Scalars['String'];
  url: Scalars['String'];
};

export enum MediaType {
  Catch = 'CATCH',
  Location = 'LOCATION',
  MapCatch = 'MAP_CATCH',
  MapLocation = 'MAP_LOCATION',
  Waterbody = 'WATERBODY'
}

export type Mutation = {
  __typename?: 'Mutation';
  addCatchMedia?: Maybe<Array<Maybe<CatchMedia>>>;
  addLocationMedia?: Maybe<Array<Maybe<LocationMedia>>>;
  addWaterbodyMedia?: Maybe<Array<Maybe<WaterbodyMedia>>>;
  addWaterbodyReview?: Maybe<WaterbodyReview>;
  createCatch?: Maybe<Catch>;
  createLocation?: Maybe<Location>;
  deleteCatch?: Maybe<Catch>;
  deleteLocation?: Maybe<Scalars['Int']>;
  deleteWaterbodyReview?: Maybe<Scalars['Int']>;
  editWaterbodyReview?: Maybe<WaterbodyReview>;
  followUser?: Maybe<Scalars['Int']>;
  removeCatchMedia?: Maybe<CatchMedia>;
  removeLocationMedia?: Maybe<LocationMedia>;
  toggleFavoriteCatch?: Maybe<Scalars['Boolean']>;
  toggleFavoriteLocation?: Maybe<Scalars['Boolean']>;
  toggleSaveLocation?: Maybe<Scalars['Boolean']>;
  toggleSaveWaterbody?: Maybe<Scalars['Boolean']>;
  unfollowUser?: Maybe<Scalars['Int']>;
  updateCatchDetails?: Maybe<Catch>;
  updateCatchLocation?: Maybe<Catch>;
  updateLocation?: Maybe<Location>;
  updateUserAvatar?: Maybe<Scalars['String']>;
  updateUserDetails?: Maybe<User>;
};


export type MutationAddCatchMediaArgs = {
  id: Scalars['Int'];
  media: Array<MediaInput>;
};


export type MutationAddLocationMediaArgs = {
  id: Scalars['Int'];
  media: Array<MediaInput>;
};


export type MutationAddWaterbodyMediaArgs = {
  id: Scalars['Int'];
  media: Array<MediaInput>;
};


export type MutationAddWaterbodyReviewArgs = {
  input: NewReviewInput;
};


export type MutationCreateCatchArgs = {
  newCatch: NewCatch;
};


export type MutationCreateLocationArgs = {
  location: NewLocation;
};


export type MutationDeleteCatchArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteLocationArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteWaterbodyReviewArgs = {
  id: Scalars['Int'];
};


export type MutationEditWaterbodyReviewArgs = {
  input: ReviewUpdate;
};


export type MutationFollowUserArgs = {
  id: Scalars['Int'];
};


export type MutationRemoveCatchMediaArgs = {
  id: Scalars['Int'];
};


export type MutationRemoveLocationMediaArgs = {
  id: Scalars['Int'];
};


export type MutationToggleFavoriteCatchArgs = {
  id: Scalars['Int'];
};


export type MutationToggleFavoriteLocationArgs = {
  id: Scalars['Int'];
};


export type MutationToggleSaveLocationArgs = {
  id: Scalars['Int'];
};


export type MutationToggleSaveWaterbodyArgs = {
  id: Scalars['Int'];
};


export type MutationUnfollowUserArgs = {
  id: Scalars['Int'];
};


export type MutationUpdateCatchDetailsArgs = {
  details: CatchDetails;
  id: Scalars['Int'];
};


export type MutationUpdateCatchLocationArgs = {
  id: Scalars['Int'];
  image?: InputMaybe<MediaInput>;
  point?: InputMaybe<Scalars['Point']>;
};


export type MutationUpdateLocationArgs = {
  id: Scalars['Int'];
  location: LocationUpdate;
};


export type MutationUpdateUserAvatarArgs = {
  avatar?: InputMaybe<MediaInput>;
};


export type MutationUpdateUserDetailsArgs = {
  details: UserDetails;
};

export type NewCatch = {
  description?: InputMaybe<Scalars['String']>;
  length?: InputMaybe<Scalars['Float']>;
  map_image?: InputMaybe<MediaInput>;
  media?: InputMaybe<Array<MediaInput>>;
  point?: InputMaybe<Scalars['Point']>;
  rig?: InputMaybe<Scalars['String']>;
  species?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  waterbody?: InputMaybe<Scalars['Int']>;
  weight?: InputMaybe<Scalars['Float']>;
};

export type NewLocation = {
  description?: InputMaybe<Scalars['String']>;
  hexcolor?: InputMaybe<Scalars['String']>;
  map_image?: InputMaybe<MediaInput>;
  media?: InputMaybe<Array<MediaInput>>;
  point?: InputMaybe<Scalars['Point']>;
  polygon?: InputMaybe<Scalars['Polygon']>;
  privacy: Privacy;
  title?: InputMaybe<Scalars['String']>;
  waterbody: Scalars['Int'];
};

export type NewReviewInput = {
  rating: Scalars['Float'];
  text: Scalars['String'];
  waterbody: Scalars['Int'];
};

export enum Privacy {
  Friends = 'friends',
  Private = 'private',
  Public = 'public'
}

export type Query = {
  __typename?: 'Query';
  activityFeed?: Maybe<Array<Maybe<Catch>>>;
  catch?: Maybe<Catch>;
  catches?: Maybe<Array<Maybe<Catch>>>;
  location?: Maybe<Location>;
  locations?: Maybe<Array<Maybe<Location>>>;
  me?: Maybe<User>;
  media?: Maybe<Media>;
  user?: Maybe<User>;
  waterbodies?: Maybe<Array<Maybe<Waterbody>>>;
  waterbody?: Maybe<Waterbody>;
  waterbodyReviews?: Maybe<Array<Maybe<WaterbodyReview>>>;
};


export type QueryActivityFeedArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryCatchArgs = {
  id: Scalars['Int'];
};


export type QueryCatchesArgs = {
  coordinates?: InputMaybe<Coordinates>;
  id?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<CatchSort>;
  type: CatchQuery;
  within?: InputMaybe<Scalars['Int']>;
};


export type QueryLocationArgs = {
  id: Scalars['Int'];
};


export type QueryLocationsArgs = {
  coordinates?: InputMaybe<Coordinates>;
  id?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<LocationSort>;
  type: LocationQuery;
};


export type QueryMediaArgs = {
  id: Scalars['Int'];
  type: MediaType;
};


export type QueryUserArgs = {
  id: Scalars['Int'];
};


export type QueryWaterbodiesArgs = {
  adminOne?: InputMaybe<Array<AdminOneEnum>>;
  classifications?: InputMaybe<Array<ClassificationEnum>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  queryLocation?: InputMaybe<QueryLocation>;
  sort?: InputMaybe<Sort>;
  value?: InputMaybe<Scalars['String']>;
};


export type QueryWaterbodyArgs = {
  id: Scalars['Int'];
};


export type QueryWaterbodyReviewsArgs = {
  id: Scalars['Int'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<ReviewSort>;
};

export type QueryLocation = {
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  withinMeters: Scalars['Int'];
};

export type Range = {
  max?: InputMaybe<Scalars['PositiveInt']>;
  min?: InputMaybe<Scalars['PositiveInt']>;
};

export type RatingCounts = {
  __typename?: 'RatingCounts';
  five: Scalars['Int'];
  four: Scalars['Int'];
  one: Scalars['Int'];
  three: Scalars['Int'];
  two: Scalars['Int'];
};

export enum ReviewSort {
  CreatedAtNewest = 'CREATED_AT_NEWEST',
  CreatedAtOldest = 'CREATED_AT_OLDEST',
  RatingHighest = 'RATING_HIGHEST',
  RatingLowest = 'RATING_LOWEST'
}

export type ReviewUpdate = {
  id: Scalars['Int'];
  rating?: InputMaybe<Scalars['Float']>;
  text?: InputMaybe<Scalars['String']>;
};

export enum Sort {
  Distance = 'distance',
  Rank = 'rank'
}

export type SpeciesCount = {
  __typename?: 'SpeciesCount';
  count: Scalars['Int'];
  species: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  am_following: Scalars['Boolean'];
  avatar?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  catch_statistics?: Maybe<CatchStatistics>;
  catches?: Maybe<Array<Maybe<Catch>>>;
  city?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  firstname?: Maybe<Scalars['String']>;
  followers?: Maybe<Array<Maybe<User>>>;
  following?: Maybe<Array<Maybe<User>>>;
  follows_me: Scalars['Boolean'];
  fullname?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  lastname?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  location_statistics?: Maybe<LocationStatistics>;
  locations?: Maybe<Array<Maybe<Location>>>;
  media?: Maybe<Array<Maybe<AnyMedia>>>;
  saved_locations?: Maybe<Array<Maybe<Location>>>;
  saved_waterbodies?: Maybe<Array<Maybe<Waterbody>>>;
  state?: Maybe<Scalars['String']>;
  total_catches: Scalars['Int'];
  total_followers: Scalars['Int'];
  total_following: Scalars['Int'];
  total_locations: Scalars['Int'];
  total_media: Scalars['Int'];
  total_reviews: Scalars['Int'];
  total_saved_locations: Scalars['Int'];
  total_saved_waterbodies: Scalars['Int'];
  updated_at: Scalars['DateTime'];
  username: Scalars['String'];
  waterbody_reviews?: Maybe<Array<Maybe<WaterbodyReview>>>;
};


export type UserCatchesArgs = {
  date?: InputMaybe<DateRange>;
  length?: InputMaybe<Range>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  species?: InputMaybe<Array<Scalars['String']>>;
  waterbody?: InputMaybe<Array<Scalars['Int']>>;
  weight?: InputMaybe<Range>;
};


export type UserFollowersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type UserFollowingArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type UserLocationsArgs = {
  date?: InputMaybe<DateRange>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  privacy?: InputMaybe<Array<Privacy>>;
  waterbody?: InputMaybe<Array<Scalars['Int']>>;
};


export type UserMediaArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type UserSaved_LocationsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type UserSaved_WaterbodiesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type UserWaterbody_ReviewsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<ReviewSort>;
};

export type UserDetails = {
  bio?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  firstname?: InputMaybe<Scalars['String']>;
  lastname?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
};

export type Waterbody = {
  __typename?: 'Waterbody';
  admin_one?: Maybe<Array<Maybe<Scalars['String']>>>;
  admin_two?: Maybe<Array<Maybe<Scalars['String']>>>;
  all_species?: Maybe<Array<SpeciesCount>>;
  average_rating?: Maybe<Scalars['Float']>;
  catches?: Maybe<Array<Maybe<Catch>>>;
  ccode?: Maybe<Scalars['String']>;
  classification?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  distance?: Maybe<Scalars['Float']>;
  geometries?: Maybe<Scalars['Geometry']>;
  id?: Maybe<Scalars['Int']>;
  is_saved?: Maybe<Scalars['Boolean']>;
  locations?: Maybe<Array<Maybe<Location>>>;
  media?: Maybe<Array<Maybe<WaterbodyMedia>>>;
  most_caught_species?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  rank?: Maybe<Scalars['Float']>;
  rating_counts?: Maybe<RatingCounts>;
  reviews?: Maybe<Array<Maybe<WaterbodyReview>>>;
  subregion?: Maybe<Scalars['String']>;
  total_catches?: Maybe<Scalars['Int']>;
  total_locations?: Maybe<Scalars['Int']>;
  total_media?: Maybe<Scalars['Int']>;
  total_reviews?: Maybe<Scalars['Int']>;
  total_species?: Maybe<Scalars['Int']>;
};


export type WaterbodyCatchesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<CatchSort>;
};


export type WaterbodyLocationsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type WaterbodyMediaArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type WaterbodyReviewsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<ReviewSort>;
};

export type WaterbodyCount = {
  __typename?: 'WaterbodyCount';
  count: Scalars['Int'];
  waterbody: Waterbody;
};

export type WaterbodyMedia = {
  __typename?: 'WaterbodyMedia';
  created_at: Scalars['DateTime'];
  id: Scalars['Int'];
  key: Scalars['String'];
  url: Scalars['String'];
  user?: Maybe<User>;
  waterbody?: Maybe<Waterbody>;
};

export type WaterbodyReview = {
  __typename?: 'WaterbodyReview';
  created_at?: Maybe<Scalars['DateTime']>;
  id: Scalars['Int'];
  rating: Scalars['Int'];
  text?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  waterbody?: Maybe<Waterbody>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AccountNumber: ResolverTypeWrapper<Scalars['AccountNumber']>;
  AdminOneEnum: AdminOneEnum;
  AnyMedia: ResolverTypeWrapper<Omit<AnyMedia, 'user'> & { user?: Maybe<ResolversTypes['User']> }>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Byte: ResolverTypeWrapper<Scalars['Byte']>;
  Catch: ResolverTypeWrapper<ICatch>;
  CatchDetails: CatchDetails;
  CatchMapImage: ResolverTypeWrapper<ICatchMedia>;
  CatchMedia: ResolverTypeWrapper<ICatchMedia>;
  CatchQuery: CatchQuery;
  CatchSort: CatchSort;
  CatchStatistics: ResolverTypeWrapper<Omit<CatchStatistics, 'largest_catch' | 'top_waterbody' | 'waterbody_counts'> & { largest_catch?: Maybe<ResolversTypes['Catch']>, top_waterbody?: Maybe<ResolversTypes['Waterbody']>, waterbody_counts?: Maybe<Array<ResolversTypes['WaterbodyCount']>> }>;
  ClassificationEnum: ClassificationEnum;
  Coordinates: Coordinates;
  CountryCode: ResolverTypeWrapper<Scalars['CountryCode']>;
  Cuid: ResolverTypeWrapper<Scalars['Cuid']>;
  Currency: ResolverTypeWrapper<Scalars['Currency']>;
  DID: ResolverTypeWrapper<Scalars['DID']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DateRange: DateRange;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Duration: ResolverTypeWrapper<Scalars['Duration']>;
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  GUID: ResolverTypeWrapper<Scalars['GUID']>;
  Geometry: ResolverTypeWrapper<Scalars['Geometry']>;
  GeometryCollection: ResolverTypeWrapper<Scalars['GeometryCollection']>;
  HSL: ResolverTypeWrapper<Scalars['HSL']>;
  HSLA: ResolverTypeWrapper<Scalars['HSLA']>;
  HexColorCode: ResolverTypeWrapper<Scalars['HexColorCode']>;
  Hexadecimal: ResolverTypeWrapper<Scalars['Hexadecimal']>;
  IBAN: ResolverTypeWrapper<Scalars['IBAN']>;
  IPv4: ResolverTypeWrapper<Scalars['IPv4']>;
  IPv6: ResolverTypeWrapper<Scalars['IPv6']>;
  ISBN: ResolverTypeWrapper<Scalars['ISBN']>;
  ISO8601Duration: ResolverTypeWrapper<Scalars['ISO8601Duration']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']>;
  JWT: ResolverTypeWrapper<Scalars['JWT']>;
  Latitude: ResolverTypeWrapper<Scalars['Latitude']>;
  LineString: ResolverTypeWrapper<Scalars['LineString']>;
  LocalDate: ResolverTypeWrapper<Scalars['LocalDate']>;
  LocalEndTime: ResolverTypeWrapper<Scalars['LocalEndTime']>;
  LocalTime: ResolverTypeWrapper<Scalars['LocalTime']>;
  Locale: ResolverTypeWrapper<Scalars['Locale']>;
  Location: ResolverTypeWrapper<ILocation>;
  LocationMapImage: ResolverTypeWrapper<ILocationMedia>;
  LocationMedia: ResolverTypeWrapper<ILocationMedia>;
  LocationQuery: LocationQuery;
  LocationSort: LocationSort;
  LocationStatistics: ResolverTypeWrapper<Omit<LocationStatistics, 'waterbody_counts'> & { waterbody_counts?: Maybe<Array<ResolversTypes['WaterbodyCount']>> }>;
  LocationUpdate: LocationUpdate;
  Long: ResolverTypeWrapper<Scalars['Long']>;
  Longitude: ResolverTypeWrapper<Scalars['Longitude']>;
  MAC: ResolverTypeWrapper<Scalars['MAC']>;
  Media: ResolversTypes['AnyMedia'] | ResolversTypes['CatchMedia'] | ResolversTypes['LocationMedia'] | ResolversTypes['WaterbodyMedia'];
  MediaInput: MediaInput;
  MediaType: MediaType;
  MultiLineString: ResolverTypeWrapper<Scalars['MultiLineString']>;
  MultiPolygon: ResolverTypeWrapper<Scalars['MultiPolygon']>;
  Mutation: ResolverTypeWrapper<{}>;
  NegativeFloat: ResolverTypeWrapper<Scalars['NegativeFloat']>;
  NegativeInt: ResolverTypeWrapper<Scalars['NegativeInt']>;
  NewCatch: NewCatch;
  NewLocation: NewLocation;
  NewReviewInput: NewReviewInput;
  NonEmptyString: ResolverTypeWrapper<Scalars['NonEmptyString']>;
  NonNegativeFloat: ResolverTypeWrapper<Scalars['NonNegativeFloat']>;
  NonNegativeInt: ResolverTypeWrapper<Scalars['NonNegativeInt']>;
  NonPositiveFloat: ResolverTypeWrapper<Scalars['NonPositiveFloat']>;
  NonPositiveInt: ResolverTypeWrapper<Scalars['NonPositiveInt']>;
  ObjectID: ResolverTypeWrapper<Scalars['ObjectID']>;
  PhoneNumber: ResolverTypeWrapper<Scalars['PhoneNumber']>;
  Point: ResolverTypeWrapper<Scalars['Point']>;
  Polygon: ResolverTypeWrapper<Scalars['Polygon']>;
  Port: ResolverTypeWrapper<Scalars['Port']>;
  PositiveFloat: ResolverTypeWrapper<Scalars['PositiveFloat']>;
  PositiveInt: ResolverTypeWrapper<Scalars['PositiveInt']>;
  PostalCode: ResolverTypeWrapper<Scalars['PostalCode']>;
  Privacy: Privacy;
  Query: ResolverTypeWrapper<{}>;
  QueryLocation: QueryLocation;
  RGB: ResolverTypeWrapper<Scalars['RGB']>;
  RGBA: ResolverTypeWrapper<Scalars['RGBA']>;
  Range: Range;
  RatingCounts: ResolverTypeWrapper<RatingCounts>;
  ReviewSort: ReviewSort;
  ReviewUpdate: ReviewUpdate;
  RoutingNumber: ResolverTypeWrapper<Scalars['RoutingNumber']>;
  SafeInt: ResolverTypeWrapper<Scalars['SafeInt']>;
  Sort: Sort;
  SpeciesCount: ResolverTypeWrapper<SpeciesCount>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Time: ResolverTypeWrapper<Scalars['Time']>;
  TimeZone: ResolverTypeWrapper<Scalars['TimeZone']>;
  Timestamp: ResolverTypeWrapper<Scalars['Timestamp']>;
  URL: ResolverTypeWrapper<Scalars['URL']>;
  USCurrency: ResolverTypeWrapper<Scalars['USCurrency']>;
  UUID: ResolverTypeWrapper<Scalars['UUID']>;
  UnsignedFloat: ResolverTypeWrapper<Scalars['UnsignedFloat']>;
  UnsignedInt: ResolverTypeWrapper<Scalars['UnsignedInt']>;
  User: ResolverTypeWrapper<IUser>;
  UserDetails: UserDetails;
  UtcOffset: ResolverTypeWrapper<Scalars['UtcOffset']>;
  Void: ResolverTypeWrapper<Scalars['Void']>;
  Waterbody: ResolverTypeWrapper<IWaterbody>;
  WaterbodyCount: ResolverTypeWrapper<Omit<WaterbodyCount, 'waterbody'> & { waterbody: ResolversTypes['Waterbody'] }>;
  WaterbodyMedia: ResolverTypeWrapper<IWaterbodyMedia>;
  WaterbodyReview: ResolverTypeWrapper<IWaterbodyReview>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AccountNumber: Scalars['AccountNumber'];
  AnyMedia: Omit<AnyMedia, 'user'> & { user?: Maybe<ResolversParentTypes['User']> };
  BigInt: Scalars['BigInt'];
  Boolean: Scalars['Boolean'];
  Byte: Scalars['Byte'];
  Catch: ICatch;
  CatchDetails: CatchDetails;
  CatchMapImage: ICatchMedia;
  CatchMedia: ICatchMedia;
  CatchStatistics: Omit<CatchStatistics, 'largest_catch' | 'top_waterbody' | 'waterbody_counts'> & { largest_catch?: Maybe<ResolversParentTypes['Catch']>, top_waterbody?: Maybe<ResolversParentTypes['Waterbody']>, waterbody_counts?: Maybe<Array<ResolversParentTypes['WaterbodyCount']>> };
  Coordinates: Coordinates;
  CountryCode: Scalars['CountryCode'];
  Cuid: Scalars['Cuid'];
  Currency: Scalars['Currency'];
  DID: Scalars['DID'];
  Date: Scalars['Date'];
  DateRange: DateRange;
  DateTime: Scalars['DateTime'];
  Duration: Scalars['Duration'];
  EmailAddress: Scalars['EmailAddress'];
  Float: Scalars['Float'];
  GUID: Scalars['GUID'];
  Geometry: Scalars['Geometry'];
  GeometryCollection: Scalars['GeometryCollection'];
  HSL: Scalars['HSL'];
  HSLA: Scalars['HSLA'];
  HexColorCode: Scalars['HexColorCode'];
  Hexadecimal: Scalars['Hexadecimal'];
  IBAN: Scalars['IBAN'];
  IPv4: Scalars['IPv4'];
  IPv6: Scalars['IPv6'];
  ISBN: Scalars['ISBN'];
  ISO8601Duration: Scalars['ISO8601Duration'];
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  JSONObject: Scalars['JSONObject'];
  JWT: Scalars['JWT'];
  Latitude: Scalars['Latitude'];
  LineString: Scalars['LineString'];
  LocalDate: Scalars['LocalDate'];
  LocalEndTime: Scalars['LocalEndTime'];
  LocalTime: Scalars['LocalTime'];
  Locale: Scalars['Locale'];
  Location: ILocation;
  LocationMapImage: ILocationMedia;
  LocationMedia: ILocationMedia;
  LocationStatistics: Omit<LocationStatistics, 'waterbody_counts'> & { waterbody_counts?: Maybe<Array<ResolversParentTypes['WaterbodyCount']>> };
  LocationUpdate: LocationUpdate;
  Long: Scalars['Long'];
  Longitude: Scalars['Longitude'];
  MAC: Scalars['MAC'];
  Media: ResolversParentTypes['AnyMedia'] | ResolversParentTypes['CatchMedia'] | ResolversParentTypes['LocationMedia'] | ResolversParentTypes['WaterbodyMedia'];
  MediaInput: MediaInput;
  MultiLineString: Scalars['MultiLineString'];
  MultiPolygon: Scalars['MultiPolygon'];
  Mutation: {};
  NegativeFloat: Scalars['NegativeFloat'];
  NegativeInt: Scalars['NegativeInt'];
  NewCatch: NewCatch;
  NewLocation: NewLocation;
  NewReviewInput: NewReviewInput;
  NonEmptyString: Scalars['NonEmptyString'];
  NonNegativeFloat: Scalars['NonNegativeFloat'];
  NonNegativeInt: Scalars['NonNegativeInt'];
  NonPositiveFloat: Scalars['NonPositiveFloat'];
  NonPositiveInt: Scalars['NonPositiveInt'];
  ObjectID: Scalars['ObjectID'];
  PhoneNumber: Scalars['PhoneNumber'];
  Point: Scalars['Point'];
  Polygon: Scalars['Polygon'];
  Port: Scalars['Port'];
  PositiveFloat: Scalars['PositiveFloat'];
  PositiveInt: Scalars['PositiveInt'];
  PostalCode: Scalars['PostalCode'];
  Query: {};
  QueryLocation: QueryLocation;
  RGB: Scalars['RGB'];
  RGBA: Scalars['RGBA'];
  Range: Range;
  RatingCounts: RatingCounts;
  ReviewUpdate: ReviewUpdate;
  RoutingNumber: Scalars['RoutingNumber'];
  SafeInt: Scalars['SafeInt'];
  SpeciesCount: SpeciesCount;
  String: Scalars['String'];
  Time: Scalars['Time'];
  TimeZone: Scalars['TimeZone'];
  Timestamp: Scalars['Timestamp'];
  URL: Scalars['URL'];
  USCurrency: Scalars['USCurrency'];
  UUID: Scalars['UUID'];
  UnsignedFloat: Scalars['UnsignedFloat'];
  UnsignedInt: Scalars['UnsignedInt'];
  User: IUser;
  UserDetails: UserDetails;
  UtcOffset: Scalars['UtcOffset'];
  Void: Scalars['Void'];
  Waterbody: IWaterbody;
  WaterbodyCount: Omit<WaterbodyCount, 'waterbody'> & { waterbody: ResolversParentTypes['Waterbody'] };
  WaterbodyMedia: IWaterbodyMedia;
  WaterbodyReview: IWaterbodyReview;
}>;

export type ConstraintDirectiveArgs = {
  contains?: Maybe<Scalars['String']>;
  endsWith?: Maybe<Scalars['String']>;
  exclusiveMax?: Maybe<Scalars['Float']>;
  exclusiveMin?: Maybe<Scalars['Float']>;
  format?: Maybe<Scalars['String']>;
  max?: Maybe<Scalars['Float']>;
  maxLength?: Maybe<Scalars['Int']>;
  min?: Maybe<Scalars['Float']>;
  minLength?: Maybe<Scalars['Int']>;
  multipleOf?: Maybe<Scalars['Float']>;
  notContains?: Maybe<Scalars['String']>;
  pattern?: Maybe<Scalars['String']>;
  startsWith?: Maybe<Scalars['String']>;
  uniqueTypeName?: Maybe<Scalars['String']>;
};

export type ConstraintDirectiveResolver<Result, Parent, ContextType = Context, Args = ConstraintDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface AccountNumberScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AccountNumber'], any> {
  name: 'AccountNumber';
}

export type AnyMediaResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AnyMedia'] = ResolversParentTypes['AnyMedia']> = ResolversObject<{
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface ByteScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Byte'], any> {
  name: 'Byte';
}

export type CatchResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Catch'] = ResolversParentTypes['Catch']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  geom?: Resolver<Maybe<ResolversTypes['Point']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  is_favorited?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  length?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  map_image?: Resolver<Maybe<ResolversTypes['CatchMapImage']>, ParentType, ContextType>;
  media?: Resolver<Maybe<Array<Maybe<ResolversTypes['CatchMedia']>>>, ParentType, ContextType, Partial<CatchMediaArgs>>;
  rig?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  species?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  total_favorites?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  waterbody?: Resolver<Maybe<ResolversTypes['Waterbody']>, ParentType, ContextType>;
  weight?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CatchMapImageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CatchMapImage'] = ResolversParentTypes['CatchMapImage']> = ResolversObject<{
  catch?: Resolver<Maybe<ResolversTypes['Catch']>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CatchMediaResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CatchMedia'] = ResolversParentTypes['CatchMedia']> = ResolversObject<{
  catch?: Resolver<Maybe<ResolversTypes['Catch']>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CatchStatisticsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CatchStatistics'] = ResolversParentTypes['CatchStatistics']> = ResolversObject<{
  largest_catch?: Resolver<Maybe<ResolversTypes['Catch']>, ParentType, ContextType>;
  species_counts?: Resolver<Maybe<Array<ResolversTypes['SpeciesCount']>>, ParentType, ContextType>;
  top_species?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  top_waterbody?: Resolver<Maybe<ResolversTypes['Waterbody']>, ParentType, ContextType>;
  total_catches?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total_species?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total_waterbodies?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  waterbody_counts?: Resolver<Maybe<Array<ResolversTypes['WaterbodyCount']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface CountryCodeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['CountryCode'], any> {
  name: 'CountryCode';
}

export interface CuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Cuid'], any> {
  name: 'Cuid';
}

export interface CurrencyScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Currency'], any> {
  name: 'Currency';
}

export interface DidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DID'], any> {
  name: 'DID';
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface DurationScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Duration'], any> {
  name: 'Duration';
}

export interface EmailAddressScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['EmailAddress'], any> {
  name: 'EmailAddress';
}

export interface GuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['GUID'], any> {
  name: 'GUID';
}

export interface GeometryScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Geometry'], any> {
  name: 'Geometry';
}

export interface GeometryCollectionScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['GeometryCollection'], any> {
  name: 'GeometryCollection';
}

export interface HslScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['HSL'], any> {
  name: 'HSL';
}

export interface HslaScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['HSLA'], any> {
  name: 'HSLA';
}

export interface HexColorCodeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['HexColorCode'], any> {
  name: 'HexColorCode';
}

export interface HexadecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Hexadecimal'], any> {
  name: 'Hexadecimal';
}

export interface IbanScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['IBAN'], any> {
  name: 'IBAN';
}

export interface IPv4ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['IPv4'], any> {
  name: 'IPv4';
}

export interface IPv6ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['IPv6'], any> {
  name: 'IPv6';
}

export interface IsbnScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ISBN'], any> {
  name: 'ISBN';
}

export interface Iso8601DurationScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ISO8601Duration'], any> {
  name: 'ISO8601Duration';
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export interface JwtScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JWT'], any> {
  name: 'JWT';
}

export interface LatitudeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Latitude'], any> {
  name: 'Latitude';
}

export interface LineStringScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['LineString'], any> {
  name: 'LineString';
}

export interface LocalDateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['LocalDate'], any> {
  name: 'LocalDate';
}

export interface LocalEndTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['LocalEndTime'], any> {
  name: 'LocalEndTime';
}

export interface LocalTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['LocalTime'], any> {
  name: 'LocalTime';
}

export interface LocaleScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Locale'], any> {
  name: 'Locale';
}

export type LocationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  geom?: Resolver<Maybe<ResolversTypes['Geometry']>, ParentType, ContextType>;
  hexcolor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  is_favorited?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  is_saved?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  map_image?: Resolver<Maybe<ResolversTypes['LocationMapImage']>, ParentType, ContextType>;
  media?: Resolver<Maybe<Array<Maybe<ResolversTypes['LocationMedia']>>>, ParentType, ContextType>;
  nearest_place?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  privacy?: Resolver<ResolversTypes['Privacy'], ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  total_favorites?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  waterbody?: Resolver<Maybe<ResolversTypes['Waterbody']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LocationMapImageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LocationMapImage'] = ResolversParentTypes['LocationMapImage']> = ResolversObject<{
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LocationMediaResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LocationMedia'] = ResolversParentTypes['LocationMedia']> = ResolversObject<{
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LocationStatisticsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LocationStatistics'] = ResolversParentTypes['LocationStatistics']> = ResolversObject<{
  total_locations?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  waterbody_counts?: Resolver<Maybe<Array<ResolversTypes['WaterbodyCount']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface LongScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Long'], any> {
  name: 'Long';
}

export interface LongitudeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Longitude'], any> {
  name: 'Longitude';
}

export interface MacScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['MAC'], any> {
  name: 'MAC';
}

export type MediaResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Media'] = ResolversParentTypes['Media']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AnyMedia' | 'CatchMedia' | 'LocationMedia' | 'WaterbodyMedia', ParentType, ContextType>;
}>;

export interface MultiLineStringScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['MultiLineString'], any> {
  name: 'MultiLineString';
}

export interface MultiPolygonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['MultiPolygon'], any> {
  name: 'MultiPolygon';
}

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addCatchMedia?: Resolver<Maybe<Array<Maybe<ResolversTypes['CatchMedia']>>>, ParentType, ContextType, RequireFields<MutationAddCatchMediaArgs, 'id' | 'media'>>;
  addLocationMedia?: Resolver<Maybe<Array<Maybe<ResolversTypes['LocationMedia']>>>, ParentType, ContextType, RequireFields<MutationAddLocationMediaArgs, 'id' | 'media'>>;
  addWaterbodyMedia?: Resolver<Maybe<Array<Maybe<ResolversTypes['WaterbodyMedia']>>>, ParentType, ContextType, RequireFields<MutationAddWaterbodyMediaArgs, 'id' | 'media'>>;
  addWaterbodyReview?: Resolver<Maybe<ResolversTypes['WaterbodyReview']>, ParentType, ContextType, RequireFields<MutationAddWaterbodyReviewArgs, 'input'>>;
  createCatch?: Resolver<Maybe<ResolversTypes['Catch']>, ParentType, ContextType, RequireFields<MutationCreateCatchArgs, 'newCatch'>>;
  createLocation?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType, RequireFields<MutationCreateLocationArgs, 'location'>>;
  deleteCatch?: Resolver<Maybe<ResolversTypes['Catch']>, ParentType, ContextType, RequireFields<MutationDeleteCatchArgs, 'id'>>;
  deleteLocation?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, RequireFields<MutationDeleteLocationArgs, 'id'>>;
  deleteWaterbodyReview?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, RequireFields<MutationDeleteWaterbodyReviewArgs, 'id'>>;
  editWaterbodyReview?: Resolver<Maybe<ResolversTypes['WaterbodyReview']>, ParentType, ContextType, RequireFields<MutationEditWaterbodyReviewArgs, 'input'>>;
  followUser?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, RequireFields<MutationFollowUserArgs, 'id'>>;
  removeCatchMedia?: Resolver<Maybe<ResolversTypes['CatchMedia']>, ParentType, ContextType, RequireFields<MutationRemoveCatchMediaArgs, 'id'>>;
  removeLocationMedia?: Resolver<Maybe<ResolversTypes['LocationMedia']>, ParentType, ContextType, RequireFields<MutationRemoveLocationMediaArgs, 'id'>>;
  toggleFavoriteCatch?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationToggleFavoriteCatchArgs, 'id'>>;
  toggleFavoriteLocation?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationToggleFavoriteLocationArgs, 'id'>>;
  toggleSaveLocation?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationToggleSaveLocationArgs, 'id'>>;
  toggleSaveWaterbody?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationToggleSaveWaterbodyArgs, 'id'>>;
  unfollowUser?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, RequireFields<MutationUnfollowUserArgs, 'id'>>;
  updateCatchDetails?: Resolver<Maybe<ResolversTypes['Catch']>, ParentType, ContextType, RequireFields<MutationUpdateCatchDetailsArgs, 'details' | 'id'>>;
  updateCatchLocation?: Resolver<Maybe<ResolversTypes['Catch']>, ParentType, ContextType, RequireFields<MutationUpdateCatchLocationArgs, 'id'>>;
  updateLocation?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType, RequireFields<MutationUpdateLocationArgs, 'id' | 'location'>>;
  updateUserAvatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<MutationUpdateUserAvatarArgs>>;
  updateUserDetails?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpdateUserDetailsArgs, 'details'>>;
}>;

export interface NegativeFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NegativeFloat'], any> {
  name: 'NegativeFloat';
}

export interface NegativeIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NegativeInt'], any> {
  name: 'NegativeInt';
}

export interface NonEmptyStringScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NonEmptyString'], any> {
  name: 'NonEmptyString';
}

export interface NonNegativeFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NonNegativeFloat'], any> {
  name: 'NonNegativeFloat';
}

export interface NonNegativeIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NonNegativeInt'], any> {
  name: 'NonNegativeInt';
}

export interface NonPositiveFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NonPositiveFloat'], any> {
  name: 'NonPositiveFloat';
}

export interface NonPositiveIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NonPositiveInt'], any> {
  name: 'NonPositiveInt';
}

export interface ObjectIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ObjectID'], any> {
  name: 'ObjectID';
}

export interface PhoneNumberScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PhoneNumber'], any> {
  name: 'PhoneNumber';
}

export interface PointScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Point'], any> {
  name: 'Point';
}

export interface PolygonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Polygon'], any> {
  name: 'Polygon';
}

export interface PortScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Port'], any> {
  name: 'Port';
}

export interface PositiveFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PositiveFloat'], any> {
  name: 'PositiveFloat';
}

export interface PositiveIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PositiveInt'], any> {
  name: 'PositiveInt';
}

export interface PostalCodeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PostalCode'], any> {
  name: 'PostalCode';
}

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  activityFeed?: Resolver<Maybe<Array<Maybe<ResolversTypes['Catch']>>>, ParentType, ContextType, Partial<QueryActivityFeedArgs>>;
  catch?: Resolver<Maybe<ResolversTypes['Catch']>, ParentType, ContextType, RequireFields<QueryCatchArgs, 'id'>>;
  catches?: Resolver<Maybe<Array<Maybe<ResolversTypes['Catch']>>>, ParentType, ContextType, RequireFields<QueryCatchesArgs, 'type'>>;
  location?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType, RequireFields<QueryLocationArgs, 'id'>>;
  locations?: Resolver<Maybe<Array<Maybe<ResolversTypes['Location']>>>, ParentType, ContextType, RequireFields<QueryLocationsArgs, 'type'>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  media?: Resolver<Maybe<ResolversTypes['Media']>, ParentType, ContextType, RequireFields<QueryMediaArgs, 'id' | 'type'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  waterbodies?: Resolver<Maybe<Array<Maybe<ResolversTypes['Waterbody']>>>, ParentType, ContextType, Partial<QueryWaterbodiesArgs>>;
  waterbody?: Resolver<Maybe<ResolversTypes['Waterbody']>, ParentType, ContextType, RequireFields<QueryWaterbodyArgs, 'id'>>;
  waterbodyReviews?: Resolver<Maybe<Array<Maybe<ResolversTypes['WaterbodyReview']>>>, ParentType, ContextType, RequireFields<QueryWaterbodyReviewsArgs, 'id'>>;
}>;

export interface RgbScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['RGB'], any> {
  name: 'RGB';
}

export interface RgbaScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['RGBA'], any> {
  name: 'RGBA';
}

export type RatingCountsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RatingCounts'] = ResolversParentTypes['RatingCounts']> = ResolversObject<{
  five?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  four?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  one?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  three?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  two?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface RoutingNumberScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['RoutingNumber'], any> {
  name: 'RoutingNumber';
}

export interface SafeIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['SafeInt'], any> {
  name: 'SafeInt';
}

export type SpeciesCountResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SpeciesCount'] = ResolversParentTypes['SpeciesCount']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  species?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface TimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Time'], any> {
  name: 'Time';
}

export interface TimeZoneScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['TimeZone'], any> {
  name: 'TimeZone';
}

export interface TimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Timestamp'], any> {
  name: 'Timestamp';
}

export interface UrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['URL'], any> {
  name: 'URL';
}

export interface UsCurrencyScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['USCurrency'], any> {
  name: 'USCurrency';
}

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export interface UnsignedFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UnsignedFloat'], any> {
  name: 'UnsignedFloat';
}

export interface UnsignedIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UnsignedInt'], any> {
  name: 'UnsignedInt';
}

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  am_following?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  catch_statistics?: Resolver<Maybe<ResolversTypes['CatchStatistics']>, ParentType, ContextType>;
  catches?: Resolver<Maybe<Array<Maybe<ResolversTypes['Catch']>>>, ParentType, ContextType, Partial<UserCatchesArgs>>;
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  firstname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  followers?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType, Partial<UserFollowersArgs>>;
  following?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType, Partial<UserFollowingArgs>>;
  follows_me?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  fullname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location_statistics?: Resolver<Maybe<ResolversTypes['LocationStatistics']>, ParentType, ContextType>;
  locations?: Resolver<Maybe<Array<Maybe<ResolversTypes['Location']>>>, ParentType, ContextType, Partial<UserLocationsArgs>>;
  media?: Resolver<Maybe<Array<Maybe<ResolversTypes['AnyMedia']>>>, ParentType, ContextType, Partial<UserMediaArgs>>;
  saved_locations?: Resolver<Maybe<Array<Maybe<ResolversTypes['Location']>>>, ParentType, ContextType, Partial<UserSaved_LocationsArgs>>;
  saved_waterbodies?: Resolver<Maybe<Array<Maybe<ResolversTypes['Waterbody']>>>, ParentType, ContextType, Partial<UserSaved_WaterbodiesArgs>>;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  total_catches?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total_followers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total_following?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total_locations?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total_media?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total_reviews?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total_saved_locations?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total_saved_waterbodies?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  waterbody_reviews?: Resolver<Maybe<Array<Maybe<ResolversTypes['WaterbodyReview']>>>, ParentType, ContextType, Partial<UserWaterbody_ReviewsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UtcOffsetScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UtcOffset'], any> {
  name: 'UtcOffset';
}

export interface VoidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Void'], any> {
  name: 'Void';
}

export type WaterbodyResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Waterbody'] = ResolversParentTypes['Waterbody']> = ResolversObject<{
  admin_one?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  admin_two?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  all_species?: Resolver<Maybe<Array<ResolversTypes['SpeciesCount']>>, ParentType, ContextType>;
  average_rating?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  catches?: Resolver<Maybe<Array<Maybe<ResolversTypes['Catch']>>>, ParentType, ContextType, Partial<WaterbodyCatchesArgs>>;
  ccode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  classification?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  distance?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  geometries?: Resolver<Maybe<ResolversTypes['Geometry']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  is_saved?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  locations?: Resolver<Maybe<Array<Maybe<ResolversTypes['Location']>>>, ParentType, ContextType, Partial<WaterbodyLocationsArgs>>;
  media?: Resolver<Maybe<Array<Maybe<ResolversTypes['WaterbodyMedia']>>>, ParentType, ContextType, Partial<WaterbodyMediaArgs>>;
  most_caught_species?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rank?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  rating_counts?: Resolver<Maybe<ResolversTypes['RatingCounts']>, ParentType, ContextType>;
  reviews?: Resolver<Maybe<Array<Maybe<ResolversTypes['WaterbodyReview']>>>, ParentType, ContextType, Partial<WaterbodyReviewsArgs>>;
  subregion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  total_catches?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  total_locations?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  total_media?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  total_reviews?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  total_species?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WaterbodyCountResolvers<ContextType = Context, ParentType extends ResolversParentTypes['WaterbodyCount'] = ResolversParentTypes['WaterbodyCount']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  waterbody?: Resolver<ResolversTypes['Waterbody'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WaterbodyMediaResolvers<ContextType = Context, ParentType extends ResolversParentTypes['WaterbodyMedia'] = ResolversParentTypes['WaterbodyMedia']> = ResolversObject<{
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  waterbody?: Resolver<Maybe<ResolversTypes['Waterbody']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WaterbodyReviewResolvers<ContextType = Context, ParentType extends ResolversParentTypes['WaterbodyReview'] = ResolversParentTypes['WaterbodyReview']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  waterbody?: Resolver<Maybe<ResolversTypes['Waterbody']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  AccountNumber?: GraphQLScalarType;
  AnyMedia?: AnyMediaResolvers<ContextType>;
  BigInt?: GraphQLScalarType;
  Byte?: GraphQLScalarType;
  Catch?: CatchResolvers<ContextType>;
  CatchMapImage?: CatchMapImageResolvers<ContextType>;
  CatchMedia?: CatchMediaResolvers<ContextType>;
  CatchStatistics?: CatchStatisticsResolvers<ContextType>;
  CountryCode?: GraphQLScalarType;
  Cuid?: GraphQLScalarType;
  Currency?: GraphQLScalarType;
  DID?: GraphQLScalarType;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  Duration?: GraphQLScalarType;
  EmailAddress?: GraphQLScalarType;
  GUID?: GraphQLScalarType;
  Geometry?: GraphQLScalarType;
  GeometryCollection?: GraphQLScalarType;
  HSL?: GraphQLScalarType;
  HSLA?: GraphQLScalarType;
  HexColorCode?: GraphQLScalarType;
  Hexadecimal?: GraphQLScalarType;
  IBAN?: GraphQLScalarType;
  IPv4?: GraphQLScalarType;
  IPv6?: GraphQLScalarType;
  ISBN?: GraphQLScalarType;
  ISO8601Duration?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  JWT?: GraphQLScalarType;
  Latitude?: GraphQLScalarType;
  LineString?: GraphQLScalarType;
  LocalDate?: GraphQLScalarType;
  LocalEndTime?: GraphQLScalarType;
  LocalTime?: GraphQLScalarType;
  Locale?: GraphQLScalarType;
  Location?: LocationResolvers<ContextType>;
  LocationMapImage?: LocationMapImageResolvers<ContextType>;
  LocationMedia?: LocationMediaResolvers<ContextType>;
  LocationStatistics?: LocationStatisticsResolvers<ContextType>;
  Long?: GraphQLScalarType;
  Longitude?: GraphQLScalarType;
  MAC?: GraphQLScalarType;
  Media?: MediaResolvers<ContextType>;
  MultiLineString?: GraphQLScalarType;
  MultiPolygon?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  NegativeFloat?: GraphQLScalarType;
  NegativeInt?: GraphQLScalarType;
  NonEmptyString?: GraphQLScalarType;
  NonNegativeFloat?: GraphQLScalarType;
  NonNegativeInt?: GraphQLScalarType;
  NonPositiveFloat?: GraphQLScalarType;
  NonPositiveInt?: GraphQLScalarType;
  ObjectID?: GraphQLScalarType;
  PhoneNumber?: GraphQLScalarType;
  Point?: GraphQLScalarType;
  Polygon?: GraphQLScalarType;
  Port?: GraphQLScalarType;
  PositiveFloat?: GraphQLScalarType;
  PositiveInt?: GraphQLScalarType;
  PostalCode?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  RGB?: GraphQLScalarType;
  RGBA?: GraphQLScalarType;
  RatingCounts?: RatingCountsResolvers<ContextType>;
  RoutingNumber?: GraphQLScalarType;
  SafeInt?: GraphQLScalarType;
  SpeciesCount?: SpeciesCountResolvers<ContextType>;
  Time?: GraphQLScalarType;
  TimeZone?: GraphQLScalarType;
  Timestamp?: GraphQLScalarType;
  URL?: GraphQLScalarType;
  USCurrency?: GraphQLScalarType;
  UUID?: GraphQLScalarType;
  UnsignedFloat?: GraphQLScalarType;
  UnsignedInt?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  UtcOffset?: GraphQLScalarType;
  Void?: GraphQLScalarType;
  Waterbody?: WaterbodyResolvers<ContextType>;
  WaterbodyCount?: WaterbodyCountResolvers<ContextType>;
  WaterbodyMedia?: WaterbodyMediaResolvers<ContextType>;
  WaterbodyReview?: WaterbodyReviewResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = Context> = ResolversObject<{
  constraint?: ConstraintDirectiveResolver<any, any, ContextType>;
}>;
