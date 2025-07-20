import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTimeISO: { input: any; output: any; }
};

export type AccessHistory = {
  __typename?: 'AccessHistory';
  ipAddress: Scalars['String']['output'];
  location?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['DateTimeISO']['output'];
  userAgent: Scalars['String']['output'];
};

export type AddConfigInput = {
  boolVal?: InputMaybe<Scalars['Boolean']['input']>;
  numVal?: InputMaybe<Scalars['Float']['input']>;
  textVal?: InputMaybe<Scalars['String']['input']>;
  type: ConfigTypeEnum;
  valueType: ConfigValueEnum;
};

export type AddStateInput = {
  abbreviation: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type AddTimezoneInput = {
  gmtOffset: Scalars['Float']['input'];
  value: Scalars['String']['input'];
};

export type AddressInfo = {
  __typename?: 'AddressInfo';
  _id: Scalars['ID']['output'];
  addressLine1: Scalars['String']['output'];
  addressLine2?: Maybe<Scalars['String']['output']>;
  city: Scalars['String']['output'];
  coordinate?: Maybe<LocationCommon>;
  place?: Maybe<Places>;
  state: StateData;
  zipcode: Scalars['Float']['output'];
};

export type AddressInfoInput = {
  addressLine1: Scalars['String']['input'];
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  coordinate?: InputMaybe<LocationCommonInput>;
  place?: InputMaybe<PlaceInput>;
  state: StateDataInput;
  zipcode: Scalars['Float']['input'];
};

export type Admin = {
  __typename?: 'Admin';
  _id: Scalars['ID']['output'];
  accessHistory?: Maybe<Array<AccessHistory>>;
  blockedBy?: Maybe<Admin>;
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy?: Maybe<Admin>;
  email: Scalars['String']['output'];
  lastLoggedIn?: Maybe<Scalars['DateTimeISO']['output']>;
  lastLoggedOut?: Maybe<Scalars['DateTimeISO']['output']>;
  name: Scalars['String']['output'];
  role: AdminRole;
  status: AdminStatus;
  unBlockedBy?: Maybe<Admin>;
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy?: Maybe<Admin>;
};

export type AdminLoginVerificationInput = {
  email: Scalars['String']['input'];
  otp: Scalars['String']['input'];
  otpId: Scalars['String']['input'];
};

/** Types of Admin Roles */
export enum AdminRole {
  Admin = 'ADMIN',
  Master = 'MASTER',
  Support = 'SUPPORT'
}

/** Status types for admin accounts */
export enum AdminStatus {
  Active = 'ACTIVE',
  Blocked = 'BLOCKED',
  Pending = 'PENDING'
}

export type AgencyProfile = {
  __typename?: 'AgencyProfile';
  _id: Scalars['ID']['output'];
  agencyName: Scalars['String']['output'];
  contactEmail?: Maybe<Scalars['String']['output']>;
  contactPhone?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  serviceTypes: Array<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
  user: User;
  websiteUrl?: Maybe<Scalars['String']['output']>;
};

/** Status of artist application or host offer */
export enum ApplicationStatus {
  Accepted = 'ACCEPTED',
  Cancelled = 'CANCELLED',
  Expired = 'EXPIRED',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Withdrawn = 'WITHDRAWN'
}

export type Artist = {
  __typename?: 'Artist';
  _id?: Maybe<Scalars['ID']['output']>;
  address?: Maybe<AddressInfo>;
  agencyProfileId?: Maybe<AgencyProfile>;
  artistType?: Maybe<Array<Maybe<ArtistType>>>;
  bio?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  experience?: Maybe<ExperienceLevel>;
  firstName: Scalars['String']['output'];
  genres?: Maybe<Array<Genres>>;
  hoizrBookingUrl?: Maybe<Scalars['String']['output']>;
  hourRate?: Maybe<Scalars['Float']['output']>;
  hourRateCurrency?: Maybe<Currency>;
  isDiscoverable?: Maybe<Scalars['Boolean']['output']>;
  lastName: Scalars['String']['output'];
  portfolio?: Maybe<Array<ArtistPortfolio>>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  rejectedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  rejectedBy?: Maybe<Scalars['String']['output']>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  socialLinks?: Maybe<SocialLinks>;
  stageName?: Maybe<Scalars['String']['output']>;
  status?: Maybe<ProfileStatus>;
  testimonials?: Maybe<Array<Testimonial>>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  user?: Maybe<User>;
  websiteUrl?: Maybe<Scalars['String']['output']>;
};

export type ArtistApplication = {
  __typename?: 'ArtistApplication';
  appliedAt: Scalars['DateTimeISO']['output'];
  artist: Artist;
  artistAddress?: Maybe<AddressInfo>;
  artistGenres?: Maybe<Array<Genres>>;
  artistName?: Maybe<Scalars['String']['output']>;
  artistProfilePicture?: Maybe<Scalars['String']['output']>;
  artistSocialLinks?: Maybe<SocialLinks>;
  artistStageName?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  status: ApplicationStatus;
};

export type ArtistApplyToEventInput = {
  eventId: Scalars['String']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
};

export type ArtistLoginVerificationInput = {
  email: Scalars['String']['input'];
  otp: Scalars['String']['input'];
  otpId: Scalars['String']['input'];
};

export type ArtistOnboardingInput = {
  address?: InputMaybe<AddressInfoInput>;
  artistType?: InputMaybe<Array<ArtistType>>;
  bio?: InputMaybe<Scalars['String']['input']>;
  experience?: InputMaybe<ExperienceLevel>;
  genres?: InputMaybe<Array<Genres>>;
  hourRate?: InputMaybe<Scalars['Float']['input']>;
  hourRateCurrency?: InputMaybe<Currency>;
  isDiscoverable?: InputMaybe<Scalars['Boolean']['input']>;
  portfolio?: InputMaybe<Array<ArtistPortfolioInput>>;
  profilePicture?: InputMaybe<Scalars['String']['input']>;
  socialLinks?: InputMaybe<SocialLinksInput>;
  stageName?: InputMaybe<Scalars['String']['input']>;
  testimonials?: InputMaybe<Array<TestimonialInput>>;
  websiteUrl?: InputMaybe<Scalars['String']['input']>;
};

export type ArtistPaginatedResponse = {
  __typename?: 'ArtistPaginatedResponse';
  items: Array<Artist>;
  total: Scalars['Float']['output'];
};

export type ArtistPortfolio = {
  __typename?: 'ArtistPortfolio';
  _id?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  type: PortfolioType;
  uploadedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  url: Scalars['String']['output'];
};

export type ArtistPortfolioInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  type: PortfolioType;
  url: Scalars['String']['input'];
};

/** Type of artist (Dj, Band, or Solo Musician) */
export enum ArtistType {
  Anchor = 'ANCHOR',
  Band = 'BAND',
  Dancer = 'DANCER',
  Dj = 'DJ',
  Influencer = 'INFLUENCER',
  LiveAct = 'LIVE_ACT',
  Mc = 'MC',
  Poet = 'POET',
  Producer = 'PRODUCER',
  SoloMusician = 'SOLO_MUSICIAN',
  Speaker = 'SPEAKER',
  StandUpComedian = 'STAND_UP_COMEDIAN',
  TheaterArtist = 'THEATER_ARTIST',
  Vj = 'VJ'
}

export type ArtistUpdateInvitationStatusInput = {
  eventId: Scalars['String']['input'];
  status: Scalars['String']['input'];
};

/** Authentication method used by the user */
export enum AuthType {
  MagicLink = 'MAGIC_LINK',
  Otp = 'OTP'
}

export type BlockUnblockArtistInput = {
  artistId: Scalars['ID']['input'];
  block: Scalars['Boolean']['input'];
};

export type BudgetRange = {
  __typename?: 'BudgetRange';
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
};

export type BudgetRangeInput = {
  max?: InputMaybe<Scalars['Float']['input']>;
  min?: InputMaybe<Scalars['Float']['input']>;
};

export type Config = {
  __typename?: 'Config';
  _id: Scalars['ID']['output'];
  boolVal?: Maybe<Scalars['Boolean']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: Admin;
  numVal?: Maybe<Scalars['Float']['output']>;
  textVal?: Maybe<Scalars['String']['output']>;
  type: ConfigTypeEnum;
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy: Admin;
  valueType: ConfigValueEnum;
};

/** Enum to store the types of master config that can be changed by admins anytime */
export enum ConfigTypeEnum {
  MaxCsvRows = 'MaxCSVRows',
  MonthlySubscription = 'MonthlySubscription',
  ProcessingFee = 'ProcessingFee'
}

/** Enum to store the types of Config Values */
export enum ConfigValueEnum {
  Boolean = 'BOOLEAN',
  Number = 'NUMBER',
  Text = 'TEXT'
}

export type ContactDetails = {
  __typename?: 'ContactDetails';
  email: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
};

/** Supported currency codes for financial transactions */
export enum Currency {
  Aud = 'AUD',
  Brl = 'BRL',
  Cad = 'CAD',
  Chf = 'CHF',
  Cny = 'CNY',
  Eur = 'EUR',
  Gbp = 'GBP',
  Inr = 'INR',
  Jpy = 'JPY',
  Mxn = 'MXN',
  Ngn = 'NGN',
  Usd = 'USD',
  Zar = 'ZAR'
}

export type DashboardMetric = {
  __typename?: 'DashboardMetric';
  change: Scalars['Float']['output'];
  iconType: Scalars['String']['output'];
  isCurrency?: Maybe<Scalars['Boolean']['output']>;
  isPercentage?: Maybe<Scalars['Boolean']['output']>;
  title: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type Event = {
  __typename?: 'Event';
  _id: Scalars['ID']['output'];
  artistApplications?: Maybe<Array<ArtistApplication>>;
  budget?: Maybe<BudgetRange>;
  createdAt: Scalars['DateTimeISO']['output'];
  currency?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['DateTimeISO']['output']>;
  eventDate?: Maybe<Scalars['DateTimeISO']['output']>;
  eventType?: Maybe<EventType>;
  expectedAudience?: Maybe<Scalars['Float']['output']>;
  firstStepCompleted: Scalars['Boolean']['output'];
  genresPreferred?: Maybe<Array<Genres>>;
  host: HostProfile;
  hostInvitations?: Maybe<Array<HostInvitation>>;
  listingComplete?: Maybe<Scalars['Boolean']['output']>;
  location?: Maybe<AddressInfo>;
  pictures?: Maybe<Array<Scalars['String']['output']>>;
  status?: Maybe<EventStatus>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type EventPaginatedResponse = {
  __typename?: 'EventPaginatedResponse';
  items: Array<Event>;
  total: Scalars['Float']['output'];
};

/** Status of the event lifecycle */
export enum EventStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Draft = 'DRAFT'
}

/** Type of the event visibility */
export enum EventType {
  InviteOnly = 'INVITE_ONLY',
  Private = 'PRIVATE',
  Public = 'PUBLIC',
  Ticketed = 'TICKETED'
}

/** Indicates the artist's experience level */
export enum ExperienceLevel {
  Beginner = 'BEGINNER',
  Expert = 'EXPERT',
  Intermediate = 'INTERMEDIATE',
  Professional = 'PROFESSIONAL',
  Semiprofessional = 'SEMIPROFESSIONAL',
  Veteran = 'VETERAN'
}

/** Enum to store the types of operation for data filtering */
export enum FilterDataEnum {
  Contains = 'Contains',
  Equals = 'Equals',
  GreaterThan = 'GreaterThan',
  LessThan = 'LessThan',
  NotEquals = 'NotEquals'
}

export type FilterDataInput = {
  key: Scalars['String']['input'];
  operation: FilterDataEnum;
  value?: InputMaybe<Scalars['String']['input']>;
  valueArr?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type GenreTrend = {
  __typename?: 'GenreTrend';
  genre: Scalars['String']['output'];
  percentage: Scalars['Float']['output'];
};

/** Various genres of music available for artist or event selection */
export enum Genres {
  Acapella = 'ACAPELLA',
  AlternativeRock = 'ALTERNATIVE_ROCK',
  Ambient = 'AMBIENT',
  Blues = 'BLUES',
  Bollywood = 'BOLLYWOOD',
  Classical = 'CLASSICAL',
  Comedy = 'COMEDY',
  Country = 'COUNTRY',
  DeepHouse = 'DEEP_HOUSE',
  Disco = 'DISCO',
  DrumAndBass = 'DRUM_AND_BASS',
  Dubstep = 'DUBSTEP',
  Edm = 'EDM',
  Eighties = 'EIGHTIES',
  Experimental = 'EXPERIMENTAL',
  Folk = 'FOLK',
  Funk = 'FUNK',
  Fusion = 'FUSION',
  HipHop = 'HIP_HOP',
  House = 'HOUSE',
  Instrumental = 'INSTRUMENTAL',
  Jazz = 'JAZZ',
  Karaoke = 'KARAOKE',
  LiveOrchestra = 'LIVE_ORCHESTRA',
  Local = 'LOCAL',
  Lounge = 'LOUNGE',
  Marathi = 'MARATHI',
  Metal = 'METAL',
  Nineties = 'NINETIES',
  Other = 'OTHER',
  Poetry = 'POETRY',
  Pop = 'POP',
  Punjabi = 'PUNJABI',
  Rap = 'RAP',
  Reggae = 'REGGAE',
  Reggaeton = 'REGGAETON',
  Remixes = 'REMIXES',
  Rnb = 'RNB',
  Rock = 'ROCK',
  SpokenWord = 'SPOKEN_WORD',
  Tamil = 'TAMIL',
  Techno = 'TECHNO',
  Telugu = 'TELUGU',
  Top_40 = 'TOP_40',
  Trance = 'TRANCE',
  Trap = 'TRAP',
  TwoThousands = 'TWO_THOUSANDS',
  Vinyl = 'VINYL'
}

export type HostInvitation = {
  __typename?: 'HostInvitation';
  artist: Artist;
  artistAddress?: Maybe<AddressInfo>;
  artistGenres?: Maybe<Array<Genres>>;
  artistName?: Maybe<Scalars['String']['output']>;
  artistProfilePicture?: Maybe<Scalars['String']['output']>;
  artistSocialLinks?: Maybe<SocialLinks>;
  artistStageName?: Maybe<Scalars['String']['output']>;
  invitedAt: Scalars['DateTimeISO']['output'];
  note?: Maybe<Scalars['String']['output']>;
  status: ApplicationStatus;
};

export type HostInviteArtistInput = {
  artistId: Scalars['String']['input'];
  eventId: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
};

export type HostLoginVerificationInput = {
  email: Scalars['String']['input'];
  otp: Scalars['String']['input'];
  otpId: Scalars['String']['input'];
};

export type HostOnboardingInput = {
  address?: InputMaybe<AddressInfoInput>;
  averageEventSize?: InputMaybe<Scalars['Float']['input']>;
  businessRegistrationNumber?: InputMaybe<Scalars['String']['input']>;
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  frequentCities?: InputMaybe<Array<Scalars['String']['input']>>;
  gstNumber?: InputMaybe<Scalars['String']['input']>;
  hostName?: InputMaybe<Scalars['String']['input']>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  socialLinks?: InputMaybe<SocialLinksInput>;
  venueType?: InputMaybe<VenueType>;
  websiteUrl?: InputMaybe<Scalars['String']['input']>;
};

export type HostProfile = {
  __typename?: 'HostProfile';
  _id: Scalars['ID']['output'];
  address?: Maybe<AddressInfo>;
  averageEventSize?: Maybe<Scalars['Float']['output']>;
  businessRegistrationNumber?: Maybe<Scalars['String']['output']>;
  contactEmail?: Maybe<Scalars['String']['output']>;
  contactPhone?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  frequentCities?: Maybe<Array<Scalars['String']['output']>>;
  gstNumber?: Maybe<Scalars['String']['output']>;
  hostName?: Maybe<Scalars['String']['output']>;
  isDiscoverable: Scalars['Boolean']['output'];
  logoUrl?: Maybe<Scalars['String']['output']>;
  rejectedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  rejectedBy?: Maybe<Scalars['String']['output']>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  socialLinks?: Maybe<SocialLinks>;
  status?: Maybe<ProfileStatus>;
  totalBookingsMade?: Maybe<Scalars['Float']['output']>;
  totalEventsHosted?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
  user: User;
  venueType?: Maybe<VenueType>;
  websiteUrl?: Maybe<Scalars['String']['output']>;
};

export type HostUpdateApplicationStatusInput = {
  artistId: Scalars['String']['input'];
  eventId: Scalars['String']['input'];
  status: Scalars['String']['input'];
};

export type LocationCommon = {
  __typename?: 'LocationCommon';
  coordinates: Array<Scalars['Float']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type LocationCommonInput = {
  coordinates: Array<Scalars['Float']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addConfig: Scalars['Boolean']['output'];
  addState: Scalars['Boolean']['output'];
  addTimezone: Scalars['Boolean']['output'];
  adminLogout: Scalars['Boolean']['output'];
  applyToEvent: Scalars['Boolean']['output'];
  artistLogout: Scalars['Boolean']['output'];
  artistOnboarding: Scalars['Boolean']['output'];
  artistUpdateInvitationStatus: Scalars['Boolean']['output'];
  blockUnblockArtist: Scalars['Boolean']['output'];
  completeEventCreation: Scalars['Boolean']['output'];
  createEvent: Scalars['String']['output'];
  hostInviteArtist: Scalars['Boolean']['output'];
  hostLogout: Scalars['Boolean']['output'];
  hostOnboarding: Scalars['Boolean']['output'];
  hostUpdateApplicationStatus: Scalars['Boolean']['output'];
  rejectArtist: Scalars['Boolean']['output'];
  tokensRefresh: Scalars['Boolean']['output'];
  updateConfig: Scalars['Boolean']['output'];
  updateEvent: UpdateEventResponse;
  updateStateStatus: Scalars['Boolean']['output'];
  updateTimezoneStatus: Scalars['Boolean']['output'];
  verifyArtist: Scalars['Boolean']['output'];
};


export type MutationAddConfigArgs = {
  input: AddConfigInput;
};


export type MutationAddStateArgs = {
  input: AddStateInput;
};


export type MutationAddTimezoneArgs = {
  input: AddTimezoneInput;
};


export type MutationApplyToEventArgs = {
  input: ArtistApplyToEventInput;
};


export type MutationArtistOnboardingArgs = {
  input: ArtistOnboardingInput;
};


export type MutationArtistUpdateInvitationStatusArgs = {
  input: ArtistUpdateInvitationStatusInput;
};


export type MutationBlockUnblockArtistArgs = {
  input: BlockUnblockArtistInput;
};


export type MutationCompleteEventCreationArgs = {
  eventId: Scalars['String']['input'];
  otp: Scalars['String']['input'];
  otpId: Scalars['String']['input'];
};


export type MutationHostInviteArtistArgs = {
  input: HostInviteArtistInput;
};


export type MutationHostOnboardingArgs = {
  input: HostOnboardingInput;
};


export type MutationHostUpdateApplicationStatusArgs = {
  input: HostUpdateApplicationStatusInput;
};


export type MutationRejectArtistArgs = {
  input: RejectArtistInput;
};


export type MutationUpdateConfigArgs = {
  id: Scalars['String']['input'];
  input: UpdateConfigInput;
};


export type MutationUpdateEventArgs = {
  eventId: Scalars['String']['input'];
  input: UpdateEventInput;
  isFinalStep?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationUpdateStateStatusArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateTimezoneStatusArgs = {
  id: Scalars['String']['input'];
};


export type MutationVerifyArtistArgs = {
  input: VerifyArtistInput;
};

export type PaginationInput = {
  pageNumber?: InputMaybe<Scalars['Float']['input']>;
  rowsPerPage?: InputMaybe<RowsPerPageEnum>;
};

export type PlaceDetail = {
  __typename?: 'PlaceDetail';
  address?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  state?: Maybe<Scalars['String']['output']>;
  zipcode?: Maybe<Scalars['String']['output']>;
};

export type PlaceInput = {
  displayName: Scalars['String']['input'];
  placeId: Scalars['String']['input'];
};

export type Places = {
  __typename?: 'Places';
  displayName: Scalars['String']['output'];
  placeId: Scalars['String']['output'];
};

/** Type of portfolio content (Music, Video, Image, Social, Other) */
export enum PortfolioType {
  Image = 'IMAGE',
  Music = 'MUSIC',
  Other = 'OTHER',
  Social = 'SOCIAL',
  Video = 'VIDEO'
}

/** ProfileStatus type enum  */
export enum ProfileStatus {
  Active = 'active',
  Blocked = 'blocked',
  InternalVerificationPending = 'internalVerificationPending',
  OnboardingPending = 'onboardingPending'
}

export type Query = {
  __typename?: 'Query';
  adminLogin: Scalars['String']['output'];
  adminLoginVerification: Scalars['Boolean']['output'];
  allArtists: ArtistPaginatedResponse;
  artistLogin: Scalars['String']['output'];
  artistLoginVerification: Scalars['Boolean']['output'];
  artistOnboardingData?: Maybe<Artist>;
  completeArtistOnboarding: Scalars['Boolean']['output'];
  completeHostOnboarding: Scalars['Boolean']['output'];
  getActiveStates: Array<State>;
  getActiveTimezones: Array<Timezone>;
  getAllArtists: ArtistPaginatedResponse;
  getAllConfigs: Array<Config>;
  getAllEvents: EventPaginatedResponse;
  getAllEventsHost: EventPaginatedResponse;
  getAllStates: Array<State>;
  getAllTimezones: Array<Timezone>;
  getArtistApplicationsForEvent: Array<ArtistApplication>;
  getConfig: Config;
  getDashboardMetricsHost: Array<DashboardMetric>;
  getEventById?: Maybe<Event>;
  getEventsTillNextWeek: Array<Event>;
  getHostInvitationsForEvent: Array<HostInvitation>;
  getNearbyArtists: Array<Artist>;
  getNearbyEvents: Array<Event>;
  getPlaceDetails?: Maybe<PlaceDetail>;
  getPlacesList: Array<Places>;
  getPublicEvents: Array<Event>;
  getTrendingArtists: Array<Artist>;
  getTrendsInsight: Array<GenreTrend>;
  hostLogin: Scalars['String']['output'];
  hostLoginVerification: Scalars['Boolean']['output'];
  hostOnboardingData?: Maybe<HostProfile>;
  meArtist: Artist;
  meContactDetails?: Maybe<ContactDetails>;
  meHost: HostProfile;
  meUser?: Maybe<User>;
  userSignup: Scalars['String']['output'];
  userSignupVerification: Scalars['Boolean']['output'];
};


export type QueryAdminLoginArgs = {
  email: Scalars['String']['input'];
};


export type QueryAdminLoginVerificationArgs = {
  input: AdminLoginVerificationInput;
};


export type QueryAllArtistsArgs = {
  filter?: InputMaybe<Array<FilterDataInput>>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<SortDataInput>;
};


export type QueryArtistLoginArgs = {
  email: Scalars['String']['input'];
};


export type QueryArtistLoginVerificationArgs = {
  input: ArtistLoginVerificationInput;
};


export type QueryGetAllArtistsArgs = {
  filter?: InputMaybe<Array<FilterDataInput>>;
  pagination?: InputMaybe<PaginationInput>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortDataInput>;
};


export type QueryGetAllEventsArgs = {
  filter?: InputMaybe<Array<FilterDataInput>>;
  pagination?: InputMaybe<PaginationInput>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortDataInput>;
};


export type QueryGetAllEventsHostArgs = {
  filter?: InputMaybe<Array<FilterDataInput>>;
  pagination?: InputMaybe<PaginationInput>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortDataInput>;
};


export type QueryGetArtistApplicationsForEventArgs = {
  eventId: Scalars['String']['input'];
};


export type QueryGetConfigArgs = {
  type: ConfigTypeEnum;
};


export type QueryGetEventByIdArgs = {
  eventId: Scalars['String']['input'];
};


export type QueryGetHostInvitationsForEventArgs = {
  eventId: Scalars['String']['input'];
};


export type QueryGetPlaceDetailsArgs = {
  placeId: Scalars['String']['input'];
};


export type QueryGetPlacesListArgs = {
  input: Scalars['String']['input'];
};


export type QueryHostLoginArgs = {
  email: Scalars['String']['input'];
};


export type QueryHostLoginVerificationArgs = {
  input: HostLoginVerificationInput;
};


export type QueryUserSignupArgs = {
  input: UserSignupInput;
};


export type QueryUserSignupVerificationArgs = {
  input: UserSignupVerificationInput;
};

export type RejectArtistInput = {
  artistId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};

/** Enum to store the count of items per page */
export enum RowsPerPageEnum {
  Fifty = 'FIFTY',
  Ten = 'TEN',
  Thirty = 'THIRTY'
}

export type SocialLinks = {
  __typename?: 'SocialLinks';
  bandcamp?: Maybe<Scalars['String']['output']>;
  facebook?: Maybe<Scalars['String']['output']>;
  instagram?: Maybe<Scalars['String']['output']>;
  mixcloud?: Maybe<Scalars['String']['output']>;
  soundcloud?: Maybe<Scalars['String']['output']>;
  spotify?: Maybe<Scalars['String']['output']>;
  twitter?: Maybe<Scalars['String']['output']>;
  youtube?: Maybe<Scalars['String']['output']>;
};

export type SocialLinksInput = {
  bandcamp?: InputMaybe<Scalars['String']['input']>;
  instagram?: InputMaybe<Scalars['String']['input']>;
  mixcloud?: InputMaybe<Scalars['String']['input']>;
  soundcloud?: InputMaybe<Scalars['String']['input']>;
  spotify?: InputMaybe<Scalars['String']['input']>;
  youtube?: InputMaybe<Scalars['String']['input']>;
};

/** Enum to store the types of sorting options data filtering */
export enum SortDataEnum {
  Asc = 'Asc',
  Desc = 'Desc',
  None = 'None'
}

export type SortDataInput = {
  key?: InputMaybe<Scalars['String']['input']>;
  sortType?: InputMaybe<SortDataEnum>;
};

export type State = {
  __typename?: 'State';
  _id: Scalars['ID']['output'];
  abbreviation?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: Admin;
  status: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy: Admin;
  value: Scalars['String']['output'];
};

export type StateData = {
  __typename?: 'StateData';
  stateId: Scalars['String']['output'];
  stateName: Scalars['String']['output'];
};

export type StateDataInput = {
  stateId?: InputMaybe<Scalars['String']['input']>;
  stateName: Scalars['String']['input'];
};

export type Testimonial = {
  __typename?: 'Testimonial';
  _id?: Maybe<Scalars['ID']['output']>;
  content: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  name: Scalars['String']['output'];
  profileImage?: Maybe<Scalars['String']['output']>;
  rating?: Maybe<Scalars['Float']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

export type TestimonialInput = {
  content: Scalars['String']['input'];
  name: Scalars['String']['input'];
  profileImage?: InputMaybe<Scalars['String']['input']>;
  rating?: InputMaybe<Scalars['Float']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

export type Timezone = {
  __typename?: 'Timezone';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: Admin;
  gmtOffset: Scalars['Float']['output'];
  status: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy: Admin;
  value: Scalars['String']['output'];
};

export type UpdateConfigInput = {
  boolVal?: InputMaybe<Scalars['Boolean']['input']>;
  numVal?: InputMaybe<Scalars['Float']['input']>;
  textVal?: InputMaybe<Scalars['String']['input']>;
  valueType: ConfigValueEnum;
};

export type UpdateEventInput = {
  budget?: InputMaybe<BudgetRangeInput>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  eventDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  eventType?: InputMaybe<EventType>;
  expectedAudience?: InputMaybe<Scalars['Float']['input']>;
  firstStepCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  genresPreferred?: InputMaybe<Array<Genres>>;
  location?: InputMaybe<AddressInfoInput>;
  pictures?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEventResponse = {
  __typename?: 'UpdateEventResponse';
  otpKey: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  authType: AuthType;
  createdAt: Scalars['DateTimeISO']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  isVerified: Scalars['Boolean']['output'];
  lastLogin?: Maybe<Scalars['DateTimeISO']['output']>;
  lastName: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  profileId: Scalars['String']['output'];
  status: UserStatus;
  updatedAt: Scalars['DateTimeISO']['output'];
  userType: UserType;
};

export type UserSignupInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  userType: UserType;
};

export type UserSignupVerificationInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  otp: Scalars['String']['input'];
  otpId: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  userType: UserType;
};

/** UserStatus type enum  */
export enum UserStatus {
  Active = 'active',
  Blocked = 'blocked'
}

/** Type of user (artist, agency, or host) */
export enum UserType {
  Agency = 'AGENCY',
  Artist = 'ARTIST',
  Host = 'HOST'
}

/** Type of venue for events */
export enum VenueType {
  Bar = 'BAR',
  Club = 'CLUB',
  ConcertHall = 'CONCERT_HALL',
  Festival = 'FESTIVAL',
  Hotel = 'HOTEL',
  Lounge = 'LOUNGE',
  Outdoor = 'OUTDOOR',
  PrivateEvent = 'PRIVATE_EVENT',
  Restaurant = 'RESTAURANT'
}

export type VerifyArtistInput = {
  artistId: Scalars['ID']['input'];
};

export type GetEventByIdQueryVariables = Exact<{
  eventId: Scalars['String']['input'];
}>;


export type GetEventByIdQuery = { __typename?: 'Query', getEventById?: { __typename?: 'Event', _id: string, title?: string | null, description?: string | null, eventDate?: any | null, endDate?: any | null, eventType?: EventType | null, status?: EventStatus | null, genresPreferred?: Array<Genres> | null, expectedAudience?: number | null, currency?: string | null, listingComplete?: boolean | null, pictures?: Array<string> | null, host: { __typename?: 'HostProfile', _id: string }, location?: { __typename?: 'AddressInfo', _id: string, addressLine1: string, addressLine2?: string | null, city: string, zipcode: number, state: { __typename?: 'StateData', stateId: string, stateName: string }, coordinate?: { __typename?: 'LocationCommon', type?: string | null, coordinates: Array<number> } | null, place?: { __typename?: 'Places', placeId: string, displayName: string } | null } | null, budget?: { __typename?: 'BudgetRange', min?: number | null, max?: number | null } | null } | null };

export type CreateEventMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateEventMutation = { __typename?: 'Mutation', createEvent: string };

export type UpdateEventMutationVariables = Exact<{
  isFinalStep: Scalars['Boolean']['input'];
  input: UpdateEventInput;
  eventId: Scalars['String']['input'];
}>;


export type UpdateEventMutation = { __typename?: 'Mutation', updateEvent: { __typename?: 'UpdateEventResponse', success: boolean, otpKey: string } };

export type ComplcompleteEventCreationetMutationVariables = Exact<{
  otpId: Scalars['String']['input'];
  otp: Scalars['String']['input'];
  eventId: Scalars['String']['input'];
}>;


export type ComplcompleteEventCreationetMutation = { __typename?: 'Mutation', completeEventCreation: boolean };

export type GetAllEventsHostQueryVariables = Exact<{
  search: Scalars['String']['input'];
  sort?: InputMaybe<SortDataInput>;
  filter?: InputMaybe<Array<FilterDataInput> | FilterDataInput>;
  page?: InputMaybe<PaginationInput>;
}>;


export type GetAllEventsHostQuery = { __typename?: 'Query', getAllEventsHost: { __typename?: 'EventPaginatedResponse', total: number, items: Array<{ __typename?: 'Event', _id: string, title?: string | null, description?: string | null, eventDate?: any | null, endDate?: any | null, eventType?: EventType | null, status?: EventStatus | null, genresPreferred?: Array<Genres> | null, expectedAudience?: number | null, currency?: string | null, listingComplete?: boolean | null, host: { __typename?: 'HostProfile', _id: string }, location?: { __typename?: 'AddressInfo', _id: string, addressLine1: string, addressLine2?: string | null, city: string, zipcode: number, state: { __typename?: 'StateData', stateId: string, stateName: string }, coordinate?: { __typename?: 'LocationCommon', type?: string | null, coordinates: Array<number> } | null, place?: { __typename?: 'Places', placeId: string, displayName: string } | null } | null, budget?: { __typename?: 'BudgetRange', min?: number | null, max?: number | null } | null }> } };

export type GetTrendingArtistsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTrendingArtistsQuery = { __typename?: 'Query', getTrendingArtists: Array<{ __typename?: 'Artist', _id?: string | null, firstName: string, lastName: string, artistType?: Array<ArtistType | null> | null, stageName?: string | null, genres?: Array<Genres> | null, status?: ProfileStatus | null, profilePicture?: string | null, bio?: string | null, experience?: ExperienceLevel | null, hourRateCurrency?: Currency | null, websiteUrl?: string | null, isDiscoverable?: boolean | null, hoizrBookingUrl?: string | null, user?: { __typename?: 'User', _id: string } | null, address?: { __typename?: 'AddressInfo', addressLine1: string, addressLine2?: string | null, city: string, zipcode: number, state: { __typename?: 'StateData', stateId: string, stateName: string }, coordinate?: { __typename?: 'LocationCommon', type?: string | null, coordinates: Array<number> } | null, place?: { __typename?: 'Places', placeId: string, displayName: string } | null } | null, socialLinks?: { __typename?: 'SocialLinks', instagram?: string | null, facebook?: string | null, twitter?: string | null, soundcloud?: string | null, spotify?: string | null, youtube?: string | null, mixcloud?: string | null, bandcamp?: string | null } | null, portfolio?: Array<{ __typename?: 'ArtistPortfolio', _id?: string | null, type: PortfolioType, title: string, description?: string | null, url: string }> | null, testimonials?: Array<{ __typename?: 'Testimonial', name: string, role?: string | null, content: string, rating?: number | null, profileImage?: string | null }> | null }> };

export type GetNearbyArtistsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNearbyArtistsQuery = { __typename?: 'Query', getNearbyArtists: Array<{ __typename?: 'Artist', _id?: string | null, firstName: string, lastName: string, artistType?: Array<ArtistType | null> | null, stageName?: string | null, genres?: Array<Genres> | null, status?: ProfileStatus | null, profilePicture?: string | null, bio?: string | null, experience?: ExperienceLevel | null, hourRateCurrency?: Currency | null, websiteUrl?: string | null, isDiscoverable?: boolean | null, hoizrBookingUrl?: string | null, user?: { __typename?: 'User', _id: string } | null, address?: { __typename?: 'AddressInfo', addressLine1: string, addressLine2?: string | null, city: string, zipcode: number, state: { __typename?: 'StateData', stateId: string, stateName: string }, coordinate?: { __typename?: 'LocationCommon', type?: string | null, coordinates: Array<number> } | null, place?: { __typename?: 'Places', placeId: string, displayName: string } | null } | null, socialLinks?: { __typename?: 'SocialLinks', instagram?: string | null, facebook?: string | null, twitter?: string | null, soundcloud?: string | null, spotify?: string | null, youtube?: string | null, mixcloud?: string | null, bandcamp?: string | null } | null, portfolio?: Array<{ __typename?: 'ArtistPortfolio', _id?: string | null, type: PortfolioType, title: string, description?: string | null, url: string }> | null, testimonials?: Array<{ __typename?: 'Testimonial', name: string, role?: string | null, content: string, rating?: number | null, profileImage?: string | null }> | null }> };

export type GetAllArtistsQueryVariables = Exact<{
  search: Scalars['String']['input'];
  sort?: InputMaybe<SortDataInput>;
  filter?: InputMaybe<Array<FilterDataInput> | FilterDataInput>;
  page: PaginationInput;
}>;


export type GetAllArtistsQuery = { __typename?: 'Query', getAllArtists: { __typename?: 'ArtistPaginatedResponse', total: number, items: Array<{ __typename?: 'Artist', _id?: string | null, firstName: string, lastName: string, artistType?: Array<ArtistType | null> | null, stageName?: string | null, genres?: Array<Genres> | null, status?: ProfileStatus | null, profilePicture?: string | null, bio?: string | null, experience?: ExperienceLevel | null, hourRateCurrency?: Currency | null, websiteUrl?: string | null, isDiscoverable?: boolean | null, hoizrBookingUrl?: string | null, user?: { __typename?: 'User', _id: string } | null, address?: { __typename?: 'AddressInfo', addressLine1: string, addressLine2?: string | null, city: string, zipcode: number, state: { __typename?: 'StateData', stateId: string, stateName: string }, coordinate?: { __typename?: 'LocationCommon', type?: string | null, coordinates: Array<number> } | null, place?: { __typename?: 'Places', placeId: string, displayName: string } | null } | null, socialLinks?: { __typename?: 'SocialLinks', instagram?: string | null, facebook?: string | null, twitter?: string | null, soundcloud?: string | null, spotify?: string | null, youtube?: string | null, mixcloud?: string | null, bandcamp?: string | null } | null, portfolio?: Array<{ __typename?: 'ArtistPortfolio', _id?: string | null, type: PortfolioType, title: string, description?: string | null, url: string }> | null, testimonials?: Array<{ __typename?: 'Testimonial', name: string, role?: string | null, content: string, rating?: number | null, profileImage?: string | null }> | null }> } };

export type HostLoginQueryVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type HostLoginQuery = { __typename?: 'Query', hostLogin: string };

export type HostLoginVerificationQueryVariables = Exact<{
  input: HostLoginVerificationInput;
}>;


export type HostLoginVerificationQuery = { __typename?: 'Query', hostLoginVerification: boolean };

export type HostLogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type HostLogoutMutation = { __typename?: 'Mutation', hostLogout: boolean };

export type HostOnboardingMutationVariables = Exact<{
  input: HostOnboardingInput;
}>;


export type HostOnboardingMutation = { __typename?: 'Mutation', hostOnboarding: boolean };

export type HostOnboardingDataQueryVariables = Exact<{ [key: string]: never; }>;


export type HostOnboardingDataQuery = { __typename?: 'Query', hostOnboardingData?: { __typename?: 'HostProfile', _id: string, hostName?: string | null, description?: string | null, websiteUrl?: string | null, logoUrl?: string | null, venueType?: VenueType | null, contactEmail?: string | null, contactPhone?: string | null, status?: ProfileStatus | null, businessRegistrationNumber?: string | null, averageEventSize?: number | null, gstNumber?: string | null, frequentCities?: Array<string> | null, user: { __typename?: 'User', firstName: string, lastName: string }, address?: { __typename?: 'AddressInfo', addressLine1: string, addressLine2?: string | null, city: string, zipcode: number, state: { __typename?: 'StateData', stateId: string, stateName: string }, coordinate?: { __typename?: 'LocationCommon', type?: string | null, coordinates: Array<number> } | null, place?: { __typename?: 'Places', placeId: string, displayName: string } | null } | null, socialLinks?: { __typename?: 'SocialLinks', instagram?: string | null, soundcloud?: string | null, spotify?: string | null, youtube?: string | null, mixcloud?: string | null, bandcamp?: string | null } | null } | null };

export type CompleteHostOnboardingQueryVariables = Exact<{ [key: string]: never; }>;


export type CompleteHostOnboardingQuery = { __typename?: 'Query', completeHostOnboarding: boolean };

export type MeHostQueryVariables = Exact<{ [key: string]: never; }>;


export type MeHostQuery = { __typename?: 'Query', meHost: { __typename?: 'HostProfile', _id: string, hostName?: string | null, description?: string | null, websiteUrl?: string | null, logoUrl?: string | null, venueType?: VenueType | null, contactEmail?: string | null, contactPhone?: string | null, status?: ProfileStatus | null, businessRegistrationNumber?: string | null, averageEventSize?: number | null, gstNumber?: string | null, frequentCities?: Array<string> | null, user: { __typename?: 'User', firstName: string, lastName: string }, address?: { __typename?: 'AddressInfo', addressLine1: string, addressLine2?: string | null, city: string, zipcode: number, state: { __typename?: 'StateData', stateId: string, stateName: string }, coordinate?: { __typename?: 'LocationCommon', type?: string | null, coordinates: Array<number> } | null, place?: { __typename?: 'Places', placeId: string, displayName: string } | null } | null, socialLinks?: { __typename?: 'SocialLinks', instagram?: string | null, soundcloud?: string | null, spotify?: string | null, youtube?: string | null, mixcloud?: string | null, bandcamp?: string | null } | null } };

export type MeCheckHostQueryVariables = Exact<{ [key: string]: never; }>;


export type MeCheckHostQuery = { __typename?: 'Query', meHost: { __typename?: 'HostProfile', _id: string, hostName?: string | null, status?: ProfileStatus | null, user: { __typename?: 'User', firstName: string, lastName: string } } };

export type GetActiveStatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveStatesQuery = { __typename?: 'Query', getActiveStates: Array<{ __typename?: 'State', value: string, abbreviation?: string | null, _id: string }> };

export type MeCheckUserQueryVariables = Exact<{ [key: string]: never; }>;


export type MeCheckUserQuery = { __typename?: 'Query', meUser?: { __typename?: 'User', _id: string, firstName: string, status: UserStatus, userType: UserType, isVerified: boolean } | null };

export type UserSignupQueryVariables = Exact<{
  input: UserSignupInput;
}>;


export type UserSignupQuery = { __typename?: 'Query', userSignup: string };

export type UserSignupVerificationQueryVariables = Exact<{
  input: UserSignupVerificationInput;
}>;


export type UserSignupVerificationQuery = { __typename?: 'Query', userSignupVerification: boolean };

export type MeUserQueryVariables = Exact<{ [key: string]: never; }>;


export type MeUserQuery = { __typename?: 'Query', meUser?: { __typename?: 'User', _id: string, firstName: string, lastName: string, status: UserStatus, email: string, phoneNumber: string, userType: UserType, profileId: string, isVerified: boolean, authType: AuthType } | null };

export type AllPlacesQueryVariables = Exact<{
  input: Scalars['String']['input'];
}>;


export type AllPlacesQuery = { __typename?: 'Query', getPlacesList: Array<{ __typename?: 'Places', placeId: string, displayName: string }> };

export type PlaceDetailsQueryVariables = Exact<{
  placeId: Scalars['String']['input'];
}>;


export type PlaceDetailsQuery = { __typename?: 'Query', getPlaceDetails?: { __typename?: 'PlaceDetail', latitude: number, longitude: number, city?: string | null, state?: string | null, address?: string | null, zipcode?: string | null } | null };


export const GetEventByIdDocument = gql`
    query getEventById($eventId: String!) {
  getEventById(eventId: $eventId) {
    _id
    host {
      _id
    }
    title
    description
    eventDate
    endDate
    location {
      _id
      addressLine1
      addressLine2
      city
      state {
        stateId
        stateName
      }
      zipcode
      coordinate {
        type
        coordinates
      }
      place {
        placeId
        displayName
      }
    }
    eventType
    status
    genresPreferred
    expectedAudience
    budget {
      min
      max
    }
    currency
    listingComplete
    pictures
  }
}
    `;
export const CreateEventDocument = gql`
    mutation createEvent {
  createEvent
}
    `;
export const UpdateEventDocument = gql`
    mutation updateEvent($isFinalStep: Boolean!, $input: UpdateEventInput!, $eventId: String!) {
  updateEvent(isFinalStep: $isFinalStep, input: $input, eventId: $eventId) {
    success
    otpKey
  }
}
    `;
export const ComplcompleteEventCreationetDocument = gql`
    mutation complcompleteEventCreationet($otpId: String!, $otp: String!, $eventId: String!) {
  completeEventCreation(otpId: $otpId, otp: $otp, eventId: $eventId)
}
    `;
export const GetAllEventsHostDocument = gql`
    query getAllEventsHost($search: String!, $sort: SortDataInput, $filter: [FilterDataInput!], $page: PaginationInput) {
  getAllEventsHost(
    search: $search
    sort: $sort
    filter: $filter
    pagination: $page
  ) {
    items {
      _id
      host {
        _id
      }
      title
      description
      eventDate
      endDate
      location {
        _id
        addressLine1
        addressLine2
        city
        state {
          stateId
          stateName
        }
        zipcode
        coordinate {
          type
          coordinates
        }
        place {
          placeId
          displayName
        }
      }
      eventType
      status
      genresPreferred
      expectedAudience
      budget {
        min
        max
      }
      currency
      listingComplete
    }
    total
  }
}
    `;
export const GetTrendingArtistsDocument = gql`
    query getTrendingArtists {
  getTrendingArtists {
    _id
    user {
      _id
    }
    firstName
    lastName
    artistType
    stageName
    genres
    status
    profilePicture
    bio
    address {
      addressLine1
      addressLine2
      city
      state {
        stateId
        stateName
      }
      zipcode
      coordinate {
        type
        coordinates
      }
      place {
        placeId
        displayName
      }
    }
    experience
    hourRateCurrency
    websiteUrl
    socialLinks {
      instagram
      facebook
      twitter
      soundcloud
      spotify
      youtube
      mixcloud
      bandcamp
    }
    isDiscoverable
    portfolio {
      _id
      type
      title
      description
      url
    }
    portfolio {
      _id
      type
      title
      description
      url
    }
    testimonials {
      name
      role
      content
      rating
      profileImage
    }
    hoizrBookingUrl
  }
}
    `;
export const GetNearbyArtistsDocument = gql`
    query getNearbyArtists {
  getNearbyArtists {
    _id
    user {
      _id
    }
    firstName
    lastName
    artistType
    stageName
    genres
    status
    profilePicture
    bio
    address {
      addressLine1
      addressLine2
      city
      state {
        stateId
        stateName
      }
      zipcode
      coordinate {
        type
        coordinates
      }
      place {
        placeId
        displayName
      }
    }
    experience
    hourRateCurrency
    websiteUrl
    socialLinks {
      instagram
      facebook
      twitter
      soundcloud
      spotify
      youtube
      mixcloud
      bandcamp
    }
    isDiscoverable
    portfolio {
      _id
      type
      title
      description
      url
    }
    portfolio {
      _id
      type
      title
      description
      url
    }
    testimonials {
      name
      role
      content
      rating
      profileImage
    }
    hoizrBookingUrl
  }
}
    `;
export const GetAllArtistsDocument = gql`
    query getAllArtists($search: String!, $sort: SortDataInput, $filter: [FilterDataInput!], $page: PaginationInput!) {
  getAllArtists(search: $search, sort: $sort, filter: $filter, pagination: $page) {
    items {
      _id
      user {
        _id
      }
      firstName
      lastName
      artistType
      stageName
      genres
      status
      profilePicture
      bio
      address {
        addressLine1
        addressLine2
        city
        state {
          stateId
          stateName
        }
        zipcode
        coordinate {
          type
          coordinates
        }
        place {
          placeId
          displayName
        }
      }
      experience
      hourRateCurrency
      websiteUrl
      socialLinks {
        instagram
        facebook
        twitter
        soundcloud
        spotify
        youtube
        mixcloud
        bandcamp
      }
      isDiscoverable
      portfolio {
        _id
        type
        title
        description
        url
      }
      portfolio {
        _id
        type
        title
        description
        url
      }
      testimonials {
        name
        role
        content
        rating
        profileImage
      }
      hoizrBookingUrl
    }
    total
  }
}
    `;
export const HostLoginDocument = gql`
    query hostLogin($email: String!) {
  hostLogin(email: $email)
}
    `;
export const HostLoginVerificationDocument = gql`
    query hostLoginVerification($input: HostLoginVerificationInput!) {
  hostLoginVerification(input: $input)
}
    `;
export const HostLogoutDocument = gql`
    mutation hostLogout {
  hostLogout
}
    `;
export const HostOnboardingDocument = gql`
    mutation hostOnboarding($input: HostOnboardingInput!) {
  hostOnboarding(input: $input)
}
    `;
export const HostOnboardingDataDocument = gql`
    query hostOnboardingData {
  hostOnboardingData {
    _id
    user {
      firstName
      lastName
    }
    hostName
    description
    address {
      addressLine1
      addressLine2
      city
      zipcode
      state {
        stateId
        stateName
      }
      coordinate {
        type
        coordinates
      }
      place {
        placeId
        displayName
      }
    }
    websiteUrl
    logoUrl
    venueType
    contactEmail
    contactPhone
    status
    businessRegistrationNumber
    averageEventSize
    gstNumber
    frequentCities
    socialLinks {
      instagram
      soundcloud
      spotify
      youtube
      mixcloud
      bandcamp
    }
  }
}
    `;
export const CompleteHostOnboardingDocument = gql`
    query completeHostOnboarding {
  completeHostOnboarding
}
    `;
export const MeHostDocument = gql`
    query meHost {
  meHost {
    _id
    user {
      firstName
      lastName
    }
    hostName
    description
    address {
      addressLine1
      addressLine2
      city
      zipcode
      state {
        stateId
        stateName
      }
      coordinate {
        type
        coordinates
      }
      place {
        placeId
        displayName
      }
    }
    websiteUrl
    logoUrl
    venueType
    contactEmail
    contactPhone
    status
    businessRegistrationNumber
    averageEventSize
    gstNumber
    frequentCities
    socialLinks {
      instagram
      soundcloud
      spotify
      youtube
      mixcloud
      bandcamp
    }
  }
}
    `;
export const MeCheckHostDocument = gql`
    query meCheckHost {
  meHost {
    _id
    user {
      firstName
      lastName
    }
    hostName
    status
  }
}
    `;
export const GetActiveStatesDocument = gql`
    query getActiveStates {
  getActiveStates {
    value
    abbreviation
    _id
  }
}
    `;
export const MeCheckUserDocument = gql`
    query MeCheckUser {
  meUser {
    _id
    firstName
    status
    userType
    isVerified
  }
}
    `;
export const UserSignupDocument = gql`
    query userSignup($input: UserSignupInput!) {
  userSignup(input: $input)
}
    `;
export const UserSignupVerificationDocument = gql`
    query userSignupVerification($input: UserSignupVerificationInput!) {
  userSignupVerification(input: $input)
}
    `;
export const MeUserDocument = gql`
    query MeUser {
  meUser {
    _id
    firstName
    lastName
    status
    email
    phoneNumber
    userType
    profileId
    isVerified
    authType
    status
  }
}
    `;
export const AllPlacesDocument = gql`
    query AllPlaces($input: String!) {
  getPlacesList(input: $input) {
    placeId
    displayName
  }
}
    `;
export const PlaceDetailsDocument = gql`
    query PlaceDetails($placeId: String!) {
  getPlaceDetails(placeId: $placeId) {
    latitude
    longitude
    city
    state
    address
    zipcode
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getEventById(variables: GetEventByIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetEventByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetEventByIdQuery>({ document: GetEventByIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'getEventById', 'query', variables);
    },
    createEvent(variables?: CreateEventMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateEventMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateEventMutation>({ document: CreateEventDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'createEvent', 'mutation', variables);
    },
    updateEvent(variables: UpdateEventMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateEventMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateEventMutation>({ document: UpdateEventDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'updateEvent', 'mutation', variables);
    },
    complcompleteEventCreationet(variables: ComplcompleteEventCreationetMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ComplcompleteEventCreationetMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ComplcompleteEventCreationetMutation>({ document: ComplcompleteEventCreationetDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'complcompleteEventCreationet', 'mutation', variables);
    },
    getAllEventsHost(variables: GetAllEventsHostQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetAllEventsHostQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAllEventsHostQuery>({ document: GetAllEventsHostDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'getAllEventsHost', 'query', variables);
    },
    getTrendingArtists(variables?: GetTrendingArtistsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetTrendingArtistsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTrendingArtistsQuery>({ document: GetTrendingArtistsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'getTrendingArtists', 'query', variables);
    },
    getNearbyArtists(variables?: GetNearbyArtistsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetNearbyArtistsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetNearbyArtistsQuery>({ document: GetNearbyArtistsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'getNearbyArtists', 'query', variables);
    },
    getAllArtists(variables: GetAllArtistsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetAllArtistsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAllArtistsQuery>({ document: GetAllArtistsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'getAllArtists', 'query', variables);
    },
    hostLogin(variables: HostLoginQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<HostLoginQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<HostLoginQuery>({ document: HostLoginDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'hostLogin', 'query', variables);
    },
    hostLoginVerification(variables: HostLoginVerificationQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<HostLoginVerificationQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<HostLoginVerificationQuery>({ document: HostLoginVerificationDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'hostLoginVerification', 'query', variables);
    },
    hostLogout(variables?: HostLogoutMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<HostLogoutMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<HostLogoutMutation>({ document: HostLogoutDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'hostLogout', 'mutation', variables);
    },
    hostOnboarding(variables: HostOnboardingMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<HostOnboardingMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<HostOnboardingMutation>({ document: HostOnboardingDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'hostOnboarding', 'mutation', variables);
    },
    hostOnboardingData(variables?: HostOnboardingDataQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<HostOnboardingDataQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<HostOnboardingDataQuery>({ document: HostOnboardingDataDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'hostOnboardingData', 'query', variables);
    },
    completeHostOnboarding(variables?: CompleteHostOnboardingQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CompleteHostOnboardingQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CompleteHostOnboardingQuery>({ document: CompleteHostOnboardingDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'completeHostOnboarding', 'query', variables);
    },
    meHost(variables?: MeHostQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<MeHostQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MeHostQuery>({ document: MeHostDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'meHost', 'query', variables);
    },
    meCheckHost(variables?: MeCheckHostQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<MeCheckHostQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MeCheckHostQuery>({ document: MeCheckHostDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'meCheckHost', 'query', variables);
    },
    getActiveStates(variables?: GetActiveStatesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetActiveStatesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetActiveStatesQuery>({ document: GetActiveStatesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'getActiveStates', 'query', variables);
    },
    MeCheckUser(variables?: MeCheckUserQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<MeCheckUserQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MeCheckUserQuery>({ document: MeCheckUserDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'MeCheckUser', 'query', variables);
    },
    userSignup(variables: UserSignupQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UserSignupQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserSignupQuery>({ document: UserSignupDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'userSignup', 'query', variables);
    },
    userSignupVerification(variables: UserSignupVerificationQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UserSignupVerificationQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserSignupVerificationQuery>({ document: UserSignupVerificationDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'userSignupVerification', 'query', variables);
    },
    MeUser(variables?: MeUserQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<MeUserQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MeUserQuery>({ document: MeUserDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'MeUser', 'query', variables);
    },
    AllPlaces(variables: AllPlacesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AllPlacesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllPlacesQuery>({ document: AllPlacesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AllPlaces', 'query', variables);
    },
    PlaceDetails(variables: PlaceDetailsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<PlaceDetailsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PlaceDetailsQuery>({ document: PlaceDetailsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'PlaceDetails', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;