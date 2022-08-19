import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { IUser, IPendingContact } from './User';
import { ICatch } from './Catch';
import { ILocation } from './Location';
import { IWaterbody } from './Waterbody';
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
  LocalDate: any;
  LocalEndTime: any;
  LocalTime: any;
  Locale: any;
  Long: any;
  Longitude: any;
  MAC: any;
  NegativeFloat: any;
  NegativeInt: any;
  NonEmptyString: any;
  NonNegativeFloat: any;
  NonNegativeInt: any;
  NonPositiveFloat: any;
  NonPositiveInt: any;
  ObjectID: any;
  PhoneNumber: any;
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

export type Catch = {
  __typename?: 'Catch';
  created_at?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  length?: Maybe<Scalars['Float']>;
  length_unit?: Maybe<LengthUnit>;
  location?: Maybe<Point>;
  media?: Maybe<Array<Maybe<CatchMedia>>>;
  rig?: Maybe<Scalars['String']>;
  species?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['DateTime']>;
  user: User;
  waterbody?: Maybe<Waterbody>;
  weight?: Maybe<Scalars['Float']>;
  weight_unit?: Maybe<WeightUnit>;
};

export type CatchDetails = {
  description?: InputMaybe<Scalars['String']>;
  length?: InputMaybe<LengthInput>;
  rig?: InputMaybe<Scalars['String']>;
  species?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  weight?: InputMaybe<WeightInput>;
};

export type CatchMedia = Media & {
  __typename?: 'CatchMedia';
  catch: Scalars['Int'];
  created_at: Scalars['DateTime'];
  id: Scalars['Int'];
  url: Scalars['String'];
  user: Scalars['Int'];
};

export type Geojson = {
  __typename?: 'Geojson';
  geometry?: Maybe<Geometry>;
  type?: Maybe<Scalars['String']>;
};

export type Geometry = Point | Polygon;

export type LengthInput = {
  unit: LengthUnit;
  value: Scalars['Float'];
};

export enum LengthUnit {
  Cm = 'CM',
  In = 'IN'
}

export type Location = {
  __typename?: 'Location';
  description?: Maybe<Scalars['String']>;
  geojson?: Maybe<Geojson>;
  media?: Maybe<Array<Maybe<LocationMedia>>>;
  title?: Maybe<Scalars['String']>;
  user: User;
  waterbody?: Maybe<Waterbody>;
};

export type LocationDetails = {
  description?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type LocationMedia = Media & {
  __typename?: 'LocationMedia';
  created_at: Scalars['DateTime'];
  id: Scalars['Int'];
  location: Scalars['Int'];
  url: Scalars['String'];
  user: Scalars['Int'];
};

export type Media = {
  created_at: Scalars['DateTime'];
  id: Scalars['Int'];
  url: Scalars['String'];
  user: Scalars['Int'];
};

export type MediaInput = {
  key: Scalars['String'];
  url: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptPendingContact?: Maybe<PendingContact>;
  addCatchMedia?: Maybe<Array<Maybe<CatchMedia>>>;
  addLocationMedia?: Maybe<Array<Maybe<LocationMedia>>>;
  addWaterbodyMedia?: Maybe<Array<Maybe<WaterbodyMedia>>>;
  bookmarkWaterbody?: Maybe<Waterbody>;
  createCatch?: Maybe<Catch>;
  createLocationPoint?: Maybe<Location>;
  createLocationPolygon?: Maybe<Location>;
  createPendingContact?: Maybe<PendingContact>;
  deleteCatch?: Maybe<Catch>;
  deleteContact?: Maybe<Scalars['Int']>;
  deleteLocation?: Maybe<Location>;
  deletePendingContact?: Maybe<PendingContact>;
  rejectPendingContact?: Maybe<PendingContact>;
  removeCatchMedia?: Maybe<CatchMedia>;
  removeLocationMedia?: Maybe<LocationMedia>;
  updateCatchDetails?: Maybe<Catch>;
  updateCatchLocation?: Maybe<Catch>;
  updateGeojsonPoint?: Maybe<Location>;
  updateGeojsonPolygon?: Maybe<Location>;
  updateLocationDetails?: Maybe<Location>;
  updateUserAvatar?: Maybe<User>;
  updateUserDetails?: Maybe<User>;
};


export type MutationAcceptPendingContactArgs = {
  id: Scalars['Int'];
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
  id: Scalars['ID'];
  media: Array<MediaInput>;
};


export type MutationBookmarkWaterbodyArgs = {
  id: Scalars['ID'];
};


export type MutationCreateCatchArgs = {
  newCatch: NewCatch;
};


export type MutationCreateLocationPointArgs = {
  location: NewLocationPoint;
};


export type MutationCreateLocationPolygonArgs = {
  location: NewLocationPolygon;
};


export type MutationCreatePendingContactArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteCatchArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteContactArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteLocationArgs = {
  id: Scalars['Int'];
};


export type MutationDeletePendingContactArgs = {
  id: Scalars['Int'];
};


export type MutationRejectPendingContactArgs = {
  id: Scalars['Int'];
};


export type MutationRemoveCatchMediaArgs = {
  id: Scalars['Int'];
};


export type MutationRemoveLocationMediaArgs = {
  id: Scalars['Int'];
};


export type MutationUpdateCatchDetailsArgs = {
  details: CatchDetails;
  id: Scalars['Int'];
};


export type MutationUpdateCatchLocationArgs = {
  coords: Array<InputMaybe<Scalars['Float']>>;
  id: Scalars['Int'];
};


export type MutationUpdateGeojsonPointArgs = {
  id: Scalars['Int'];
  point: PointUpdate;
};


export type MutationUpdateGeojsonPolygonArgs = {
  id: Scalars['Int'];
  polygon: PolygonUpdate;
};


export type MutationUpdateLocationDetailsArgs = {
  details: LocationDetails;
  id: Scalars['Int'];
};


export type MutationUpdateUserAvatarArgs = {
  url: Scalars['String'];
};


export type MutationUpdateUserDetailsArgs = {
  details: UserDetails;
};

export type NewCatch = {
  coordinates?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  description?: InputMaybe<Scalars['String']>;
  length?: InputMaybe<LengthInput>;
  media?: InputMaybe<Array<MediaInput>>;
  rig?: InputMaybe<Scalars['String']>;
  species?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  waterbody: Scalars['ID'];
  weight?: InputMaybe<WeightInput>;
};

export type NewLocationPoint = {
  coordinates: Array<InputMaybe<Scalars['Float']>>;
  description?: InputMaybe<Scalars['String']>;
  hexcolor?: InputMaybe<Scalars['String']>;
  media?: InputMaybe<Array<MediaInput>>;
  title?: InputMaybe<Scalars['String']>;
  waterbody: Scalars['ID'];
};

export type NewLocationPolygon = {
  coordinates: Array<Array<Array<Scalars['Float']>>>;
  description?: InputMaybe<Scalars['String']>;
  hexcolor?: InputMaybe<Scalars['String']>;
  media?: InputMaybe<Array<MediaInput>>;
  title?: InputMaybe<Scalars['String']>;
  waterbody: Scalars['ID'];
};

export type PendingContact = {
  __typename?: 'PendingContact';
  sent_at?: Maybe<Scalars['DateTime']>;
  status?: Maybe<Status>;
  user: User;
};

export type PendingContactInput = {
  user: Scalars['ID'];
};

export type Point = {
  __typename?: 'Point';
  coordinates: Array<Maybe<Scalars['Float']>>;
  type: Scalars['String'];
};

export type Polygon = {
  __typename?: 'Polygon';
  coordinates: Array<Maybe<Array<Maybe<Scalars['Float']>>>>;
  type: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getCatch?: Maybe<Catch>;
  getCatches?: Maybe<Array<Maybe<Catch>>>;
  getLocation?: Maybe<Location>;
  getUser?: Maybe<User>;
  getUsers?: Maybe<Array<Maybe<User>>>;
  getWaterbodies?: Maybe<Array<Maybe<Waterbody>>>;
  getWaterbody?: Maybe<Waterbody>;
};


export type QueryGetCatchArgs = {
  id: Scalars['Int'];
};


export type QueryGetCatchesArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};


export type QueryGetLocationArgs = {
  id: Scalars['Int'];
};


export type QueryGetUserArgs = {
  id: Scalars['Int'];
};


export type QueryGetUsersArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};


export type QueryGetWaterbodiesArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryGetWaterbodyArgs = {
  id: Scalars['ID'];
};

export enum Status {
  From = 'FROM',
  To = 'TO'
}

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  catches?: Maybe<Array<Maybe<Catch>>>;
  contacts?: Maybe<Array<Maybe<User>>>;
  created_at?: Maybe<Scalars['DateTime']>;
  firstname?: Maybe<Scalars['String']>;
  fullname?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  lastname?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  locations?: Maybe<Array<Maybe<Location>>>;
  pending_contacts?: Maybe<Array<Maybe<PendingContact>>>;
  total_catches?: Maybe<Scalars['Int']>;
  total_contacts?: Maybe<Scalars['Int']>;
  total_locations?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['DateTime']>;
  username: Scalars['String'];
};

export type UserDetails = {
  bio?: InputMaybe<Scalars['String']>;
  firstname?: InputMaybe<Scalars['String']>;
  lastname?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<Scalars['String']>;
};

export type Waterbody = {
  __typename?: 'Waterbody';
  catches?: Maybe<Array<Maybe<Catch>>>;
  ccode?: Maybe<Scalars['String']>;
  classification?: Maybe<Scalars['String']>;
  counties?: Maybe<Array<Maybe<Scalars['String']>>>;
  country?: Maybe<Scalars['String']>;
  locations?: Maybe<Array<Maybe<Location>>>;
  media?: Maybe<Array<Maybe<WaterbodyMedia>>>;
  name?: Maybe<Scalars['String']>;
  states?: Maybe<Array<Maybe<Scalars['String']>>>;
  subregion?: Maybe<Scalars['String']>;
};

export type WaterbodyMedia = Media & {
  __typename?: 'WaterbodyMedia';
  created_at: Scalars['DateTime'];
  id: Scalars['Int'];
  url: Scalars['String'];
  user: Scalars['Int'];
  waterbody: Scalars['String'];
};

export type WeightInput = {
  unit: WeightUnit;
  value: Scalars['Float'];
};

export enum WeightUnit {
  G = 'G',
  Kg = 'KG',
  Lb = 'LB',
  Oz = 'OZ'
}

export type PointUpdate = {
  coordinates: Array<Scalars['Float']>;
  hexcolor?: InputMaybe<Scalars['String']>;
};

export type PolygonUpdate = {
  coordinates: Array<Array<Array<Scalars['Float']>>>;
  hexcolor?: InputMaybe<Scalars['String']>;
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
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Byte: ResolverTypeWrapper<Scalars['Byte']>;
  Catch: ResolverTypeWrapper<ICatch>;
  CatchDetails: CatchDetails;
  CatchMedia: ResolverTypeWrapper<CatchMedia>;
  CountryCode: ResolverTypeWrapper<Scalars['CountryCode']>;
  Cuid: ResolverTypeWrapper<Scalars['Cuid']>;
  Currency: ResolverTypeWrapper<Scalars['Currency']>;
  DID: ResolverTypeWrapper<Scalars['DID']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Duration: ResolverTypeWrapper<Scalars['Duration']>;
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  GUID: ResolverTypeWrapper<Scalars['GUID']>;
  Geojson: ResolverTypeWrapper<Omit<Geojson, 'geometry'> & { geometry?: Maybe<ResolversTypes['Geometry']> }>;
  Geometry: ResolversTypes['Point'] | ResolversTypes['Polygon'];
  HSL: ResolverTypeWrapper<Scalars['HSL']>;
  HSLA: ResolverTypeWrapper<Scalars['HSLA']>;
  HexColorCode: ResolverTypeWrapper<Scalars['HexColorCode']>;
  Hexadecimal: ResolverTypeWrapper<Scalars['Hexadecimal']>;
  IBAN: ResolverTypeWrapper<Scalars['IBAN']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  IPv4: ResolverTypeWrapper<Scalars['IPv4']>;
  IPv6: ResolverTypeWrapper<Scalars['IPv6']>;
  ISBN: ResolverTypeWrapper<Scalars['ISBN']>;
  ISO8601Duration: ResolverTypeWrapper<Scalars['ISO8601Duration']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']>;
  JWT: ResolverTypeWrapper<Scalars['JWT']>;
  Latitude: ResolverTypeWrapper<Scalars['Latitude']>;
  LengthInput: LengthInput;
  LengthUnit: LengthUnit;
  LocalDate: ResolverTypeWrapper<Scalars['LocalDate']>;
  LocalEndTime: ResolverTypeWrapper<Scalars['LocalEndTime']>;
  LocalTime: ResolverTypeWrapper<Scalars['LocalTime']>;
  Locale: ResolverTypeWrapper<Scalars['Locale']>;
  Location: ResolverTypeWrapper<ILocation>;
  LocationDetails: LocationDetails;
  LocationMedia: ResolverTypeWrapper<LocationMedia>;
  Long: ResolverTypeWrapper<Scalars['Long']>;
  Longitude: ResolverTypeWrapper<Scalars['Longitude']>;
  MAC: ResolverTypeWrapper<Scalars['MAC']>;
  Media: ResolversTypes['CatchMedia'] | ResolversTypes['LocationMedia'] | ResolversTypes['WaterbodyMedia'];
  MediaInput: MediaInput;
  Mutation: ResolverTypeWrapper<{}>;
  NegativeFloat: ResolverTypeWrapper<Scalars['NegativeFloat']>;
  NegativeInt: ResolverTypeWrapper<Scalars['NegativeInt']>;
  NewCatch: NewCatch;
  NewLocationPoint: NewLocationPoint;
  NewLocationPolygon: NewLocationPolygon;
  NonEmptyString: ResolverTypeWrapper<Scalars['NonEmptyString']>;
  NonNegativeFloat: ResolverTypeWrapper<Scalars['NonNegativeFloat']>;
  NonNegativeInt: ResolverTypeWrapper<Scalars['NonNegativeInt']>;
  NonPositiveFloat: ResolverTypeWrapper<Scalars['NonPositiveFloat']>;
  NonPositiveInt: ResolverTypeWrapper<Scalars['NonPositiveInt']>;
  ObjectID: ResolverTypeWrapper<Scalars['ObjectID']>;
  PendingContact: ResolverTypeWrapper<IPendingContact>;
  PendingContactInput: PendingContactInput;
  PhoneNumber: ResolverTypeWrapper<Scalars['PhoneNumber']>;
  Point: ResolverTypeWrapper<Point>;
  Polygon: ResolverTypeWrapper<Polygon>;
  Port: ResolverTypeWrapper<Scalars['Port']>;
  PositiveFloat: ResolverTypeWrapper<Scalars['PositiveFloat']>;
  PositiveInt: ResolverTypeWrapper<Scalars['PositiveInt']>;
  PostalCode: ResolverTypeWrapper<Scalars['PostalCode']>;
  Query: ResolverTypeWrapper<{}>;
  RGB: ResolverTypeWrapper<Scalars['RGB']>;
  RGBA: ResolverTypeWrapper<Scalars['RGBA']>;
  RoutingNumber: ResolverTypeWrapper<Scalars['RoutingNumber']>;
  SafeInt: ResolverTypeWrapper<Scalars['SafeInt']>;
  Status: Status;
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
  WaterbodyMedia: ResolverTypeWrapper<WaterbodyMedia>;
  WeightInput: WeightInput;
  WeightUnit: WeightUnit;
  pointUpdate: PointUpdate;
  polygonUpdate: PolygonUpdate;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AccountNumber: Scalars['AccountNumber'];
  BigInt: Scalars['BigInt'];
  Boolean: Scalars['Boolean'];
  Byte: Scalars['Byte'];
  Catch: ICatch;
  CatchDetails: CatchDetails;
  CatchMedia: CatchMedia;
  CountryCode: Scalars['CountryCode'];
  Cuid: Scalars['Cuid'];
  Currency: Scalars['Currency'];
  DID: Scalars['DID'];
  Date: Scalars['Date'];
  DateTime: Scalars['DateTime'];
  Duration: Scalars['Duration'];
  EmailAddress: Scalars['EmailAddress'];
  Float: Scalars['Float'];
  GUID: Scalars['GUID'];
  Geojson: Omit<Geojson, 'geometry'> & { geometry?: Maybe<ResolversParentTypes['Geometry']> };
  Geometry: ResolversParentTypes['Point'] | ResolversParentTypes['Polygon'];
  HSL: Scalars['HSL'];
  HSLA: Scalars['HSLA'];
  HexColorCode: Scalars['HexColorCode'];
  Hexadecimal: Scalars['Hexadecimal'];
  IBAN: Scalars['IBAN'];
  ID: Scalars['ID'];
  IPv4: Scalars['IPv4'];
  IPv6: Scalars['IPv6'];
  ISBN: Scalars['ISBN'];
  ISO8601Duration: Scalars['ISO8601Duration'];
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  JSONObject: Scalars['JSONObject'];
  JWT: Scalars['JWT'];
  Latitude: Scalars['Latitude'];
  LengthInput: LengthInput;
  LocalDate: Scalars['LocalDate'];
  LocalEndTime: Scalars['LocalEndTime'];
  LocalTime: Scalars['LocalTime'];
  Locale: Scalars['Locale'];
  Location: ILocation;
  LocationDetails: LocationDetails;
  LocationMedia: LocationMedia;
  Long: Scalars['Long'];
  Longitude: Scalars['Longitude'];
  MAC: Scalars['MAC'];
  Media: ResolversParentTypes['CatchMedia'] | ResolversParentTypes['LocationMedia'] | ResolversParentTypes['WaterbodyMedia'];
  MediaInput: MediaInput;
  Mutation: {};
  NegativeFloat: Scalars['NegativeFloat'];
  NegativeInt: Scalars['NegativeInt'];
  NewCatch: NewCatch;
  NewLocationPoint: NewLocationPoint;
  NewLocationPolygon: NewLocationPolygon;
  NonEmptyString: Scalars['NonEmptyString'];
  NonNegativeFloat: Scalars['NonNegativeFloat'];
  NonNegativeInt: Scalars['NonNegativeInt'];
  NonPositiveFloat: Scalars['NonPositiveFloat'];
  NonPositiveInt: Scalars['NonPositiveInt'];
  ObjectID: Scalars['ObjectID'];
  PendingContact: IPendingContact;
  PendingContactInput: PendingContactInput;
  PhoneNumber: Scalars['PhoneNumber'];
  Point: Point;
  Polygon: Polygon;
  Port: Scalars['Port'];
  PositiveFloat: Scalars['PositiveFloat'];
  PositiveInt: Scalars['PositiveInt'];
  PostalCode: Scalars['PostalCode'];
  Query: {};
  RGB: Scalars['RGB'];
  RGBA: Scalars['RGBA'];
  RoutingNumber: Scalars['RoutingNumber'];
  SafeInt: Scalars['SafeInt'];
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
  WaterbodyMedia: WaterbodyMedia;
  WeightInput: WeightInput;
  pointUpdate: PointUpdate;
  polygonUpdate: PolygonUpdate;
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

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface ByteScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Byte'], any> {
  name: 'Byte';
}

export type CatchResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Catch'] = ResolversParentTypes['Catch']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  length?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  length_unit?: Resolver<Maybe<ResolversTypes['LengthUnit']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['Point']>, ParentType, ContextType>;
  media?: Resolver<Maybe<Array<Maybe<ResolversTypes['CatchMedia']>>>, ParentType, ContextType>;
  rig?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  species?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  waterbody?: Resolver<Maybe<ResolversTypes['Waterbody']>, ParentType, ContextType>;
  weight?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  weight_unit?: Resolver<Maybe<ResolversTypes['WeightUnit']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CatchMediaResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CatchMedia'] = ResolversParentTypes['CatchMedia']> = ResolversObject<{
  catch?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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

export type GeojsonResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Geojson'] = ResolversParentTypes['Geojson']> = ResolversObject<{
  geometry?: Resolver<Maybe<ResolversTypes['Geometry']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GeometryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Geometry'] = ResolversParentTypes['Geometry']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Point' | 'Polygon', ParentType, ContextType>;
}>;

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
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  geojson?: Resolver<Maybe<ResolversTypes['Geojson']>, ParentType, ContextType>;
  media?: Resolver<Maybe<Array<Maybe<ResolversTypes['LocationMedia']>>>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  waterbody?: Resolver<Maybe<ResolversTypes['Waterbody']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LocationMediaResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LocationMedia'] = ResolversParentTypes['LocationMedia']> = ResolversObject<{
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  location?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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
  __resolveType: TypeResolveFn<'CatchMedia' | 'LocationMedia' | 'WaterbodyMedia', ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  acceptPendingContact?: Resolver<Maybe<ResolversTypes['PendingContact']>, ParentType, ContextType, RequireFields<MutationAcceptPendingContactArgs, 'id'>>;
  addCatchMedia?: Resolver<Maybe<Array<Maybe<ResolversTypes['CatchMedia']>>>, ParentType, ContextType, RequireFields<MutationAddCatchMediaArgs, 'id' | 'media'>>;
  addLocationMedia?: Resolver<Maybe<Array<Maybe<ResolversTypes['LocationMedia']>>>, ParentType, ContextType, RequireFields<MutationAddLocationMediaArgs, 'id' | 'media'>>;
  addWaterbodyMedia?: Resolver<Maybe<Array<Maybe<ResolversTypes['WaterbodyMedia']>>>, ParentType, ContextType, RequireFields<MutationAddWaterbodyMediaArgs, 'id' | 'media'>>;
  bookmarkWaterbody?: Resolver<Maybe<ResolversTypes['Waterbody']>, ParentType, ContextType, RequireFields<MutationBookmarkWaterbodyArgs, 'id'>>;
  createCatch?: Resolver<Maybe<ResolversTypes['Catch']>, ParentType, ContextType, RequireFields<MutationCreateCatchArgs, 'newCatch'>>;
  createLocationPoint?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType, RequireFields<MutationCreateLocationPointArgs, 'location'>>;
  createLocationPolygon?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType, RequireFields<MutationCreateLocationPolygonArgs, 'location'>>;
  createPendingContact?: Resolver<Maybe<ResolversTypes['PendingContact']>, ParentType, ContextType, RequireFields<MutationCreatePendingContactArgs, 'id'>>;
  deleteCatch?: Resolver<Maybe<ResolversTypes['Catch']>, ParentType, ContextType, RequireFields<MutationDeleteCatchArgs, 'id'>>;
  deleteContact?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, RequireFields<MutationDeleteContactArgs, 'id'>>;
  deleteLocation?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType, RequireFields<MutationDeleteLocationArgs, 'id'>>;
  deletePendingContact?: Resolver<Maybe<ResolversTypes['PendingContact']>, ParentType, ContextType, RequireFields<MutationDeletePendingContactArgs, 'id'>>;
  rejectPendingContact?: Resolver<Maybe<ResolversTypes['PendingContact']>, ParentType, ContextType, RequireFields<MutationRejectPendingContactArgs, 'id'>>;
  removeCatchMedia?: Resolver<Maybe<ResolversTypes['CatchMedia']>, ParentType, ContextType, RequireFields<MutationRemoveCatchMediaArgs, 'id'>>;
  removeLocationMedia?: Resolver<Maybe<ResolversTypes['LocationMedia']>, ParentType, ContextType, RequireFields<MutationRemoveLocationMediaArgs, 'id'>>;
  updateCatchDetails?: Resolver<Maybe<ResolversTypes['Catch']>, ParentType, ContextType, RequireFields<MutationUpdateCatchDetailsArgs, 'details' | 'id'>>;
  updateCatchLocation?: Resolver<Maybe<ResolversTypes['Catch']>, ParentType, ContextType, RequireFields<MutationUpdateCatchLocationArgs, 'coords' | 'id'>>;
  updateGeojsonPoint?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType, RequireFields<MutationUpdateGeojsonPointArgs, 'id' | 'point'>>;
  updateGeojsonPolygon?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType, RequireFields<MutationUpdateGeojsonPolygonArgs, 'id' | 'polygon'>>;
  updateLocationDetails?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType, RequireFields<MutationUpdateLocationDetailsArgs, 'details' | 'id'>>;
  updateUserAvatar?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpdateUserAvatarArgs, 'url'>>;
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

export type PendingContactResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PendingContact'] = ResolversParentTypes['PendingContact']> = ResolversObject<{
  sent_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['Status']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface PhoneNumberScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PhoneNumber'], any> {
  name: 'PhoneNumber';
}

export type PointResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Point'] = ResolversParentTypes['Point']> = ResolversObject<{
  coordinates?: Resolver<Array<Maybe<ResolversTypes['Float']>>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PolygonResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Polygon'] = ResolversParentTypes['Polygon']> = ResolversObject<{
  coordinates?: Resolver<Array<Maybe<Array<Maybe<ResolversTypes['Float']>>>>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

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
  getCatch?: Resolver<Maybe<ResolversTypes['Catch']>, ParentType, ContextType, RequireFields<QueryGetCatchArgs, 'id'>>;
  getCatches?: Resolver<Maybe<Array<Maybe<ResolversTypes['Catch']>>>, ParentType, ContextType, Partial<QueryGetCatchesArgs>>;
  getLocation?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType, RequireFields<QueryGetLocationArgs, 'id'>>;
  getUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserArgs, 'id'>>;
  getUsers?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType, Partial<QueryGetUsersArgs>>;
  getWaterbodies?: Resolver<Maybe<Array<Maybe<ResolversTypes['Waterbody']>>>, ParentType, ContextType, Partial<QueryGetWaterbodiesArgs>>;
  getWaterbody?: Resolver<Maybe<ResolversTypes['Waterbody']>, ParentType, ContextType, RequireFields<QueryGetWaterbodyArgs, 'id'>>;
}>;

export interface RgbScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['RGB'], any> {
  name: 'RGB';
}

export interface RgbaScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['RGBA'], any> {
  name: 'RGBA';
}

export interface RoutingNumberScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['RoutingNumber'], any> {
  name: 'RoutingNumber';
}

export interface SafeIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['SafeInt'], any> {
  name: 'SafeInt';
}

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
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  catches?: Resolver<Maybe<Array<Maybe<ResolversTypes['Catch']>>>, ParentType, ContextType>;
  contacts?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  firstname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fullname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  locations?: Resolver<Maybe<Array<Maybe<ResolversTypes['Location']>>>, ParentType, ContextType>;
  pending_contacts?: Resolver<Maybe<Array<Maybe<ResolversTypes['PendingContact']>>>, ParentType, ContextType>;
  total_catches?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  total_contacts?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  total_locations?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UtcOffsetScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UtcOffset'], any> {
  name: 'UtcOffset';
}

export interface VoidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Void'], any> {
  name: 'Void';
}

export type WaterbodyResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Waterbody'] = ResolversParentTypes['Waterbody']> = ResolversObject<{
  catches?: Resolver<Maybe<Array<Maybe<ResolversTypes['Catch']>>>, ParentType, ContextType>;
  ccode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  classification?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  counties?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  locations?: Resolver<Maybe<Array<Maybe<ResolversTypes['Location']>>>, ParentType, ContextType>;
  media?: Resolver<Maybe<Array<Maybe<ResolversTypes['WaterbodyMedia']>>>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  states?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  subregion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WaterbodyMediaResolvers<ContextType = Context, ParentType extends ResolversParentTypes['WaterbodyMedia'] = ResolversParentTypes['WaterbodyMedia']> = ResolversObject<{
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  waterbody?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  AccountNumber?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Byte?: GraphQLScalarType;
  Catch?: CatchResolvers<ContextType>;
  CatchMedia?: CatchMediaResolvers<ContextType>;
  CountryCode?: GraphQLScalarType;
  Cuid?: GraphQLScalarType;
  Currency?: GraphQLScalarType;
  DID?: GraphQLScalarType;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  Duration?: GraphQLScalarType;
  EmailAddress?: GraphQLScalarType;
  GUID?: GraphQLScalarType;
  Geojson?: GeojsonResolvers<ContextType>;
  Geometry?: GeometryResolvers<ContextType>;
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
  LocalDate?: GraphQLScalarType;
  LocalEndTime?: GraphQLScalarType;
  LocalTime?: GraphQLScalarType;
  Locale?: GraphQLScalarType;
  Location?: LocationResolvers<ContextType>;
  LocationMedia?: LocationMediaResolvers<ContextType>;
  Long?: GraphQLScalarType;
  Longitude?: GraphQLScalarType;
  MAC?: GraphQLScalarType;
  Media?: MediaResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NegativeFloat?: GraphQLScalarType;
  NegativeInt?: GraphQLScalarType;
  NonEmptyString?: GraphQLScalarType;
  NonNegativeFloat?: GraphQLScalarType;
  NonNegativeInt?: GraphQLScalarType;
  NonPositiveFloat?: GraphQLScalarType;
  NonPositiveInt?: GraphQLScalarType;
  ObjectID?: GraphQLScalarType;
  PendingContact?: PendingContactResolvers<ContextType>;
  PhoneNumber?: GraphQLScalarType;
  Point?: PointResolvers<ContextType>;
  Polygon?: PolygonResolvers<ContextType>;
  Port?: GraphQLScalarType;
  PositiveFloat?: GraphQLScalarType;
  PositiveInt?: GraphQLScalarType;
  PostalCode?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  RGB?: GraphQLScalarType;
  RGBA?: GraphQLScalarType;
  RoutingNumber?: GraphQLScalarType;
  SafeInt?: GraphQLScalarType;
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
  WaterbodyMedia?: WaterbodyMediaResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = Context> = ResolversObject<{
  constraint?: ConstraintDirectiveResolver<any, any, ContextType>;
}>;
