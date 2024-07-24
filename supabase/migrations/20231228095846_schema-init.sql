-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
CREATE TYPE "DocumentType" AS ENUM (
  'Social Security Card',
  'Drivers License',
  'Medical Record',
  'Birth Certificate',
  'Passport'
);
CREATE TYPE "SessionStatus" AS ENUM ('Planned', 'Scheduled', 'Completed', 'Canceled');
CREATE TYPE "ConnectInvitationStatus" AS ENUM ('Invited', 'Expired', 'Redeemed');
CREATE TYPE "CoachPaymentPaymentGateway" AS ENUM ('Automated (Stripe)', 'Manual');
CREATE TYPE "Timezone" AS ENUM (
  'Africa/Abidjan',
  'Africa/Accra',
  'Africa/Addis_Ababa',
  'Africa/Algiers',
  'Africa/Asmera',
  'Africa/Bamako',
  'Africa/Bangui',
  'Africa/Banjul',
  'Africa/Bissau',
  'Africa/Blantyre',
  'Africa/Brazzaville',
  'Africa/Bujumbura',
  'Africa/Cairo',
  'Africa/Casablanca',
  'Africa/Ceuta',
  'Africa/Conakry',
  'Africa/Dakar',
  'Africa/Dar_es_Salaam',
  'Africa/Djibouti',
  'Africa/Douala',
  'Africa/El_Aaiun',
  'Africa/Freetown',
  'Africa/Gaborone',
  'Africa/Harare',
  'Africa/Johannesburg',
  'Africa/Juba',
  'Africa/Kampala',
  'Africa/Khartoum',
  'Africa/Kigali',
  'Africa/Kinshasa',
  'Africa/Lagos',
  'Africa/Libreville',
  'Africa/Lome',
  'Africa/Luanda',
  'Africa/Lubumbashi',
  'Africa/Lusaka',
  'Africa/Malabo',
  'Africa/Maputo',
  'Africa/Maseru',
  'Africa/Mbabane',
  'Africa/Mogadishu',
  'Africa/Monrovia',
  'Africa/Nairobi',
  'Africa/Ndjamena',
  'Africa/Niamey',
  'Africa/Nouakchott',
  'Africa/Ouagadougou',
  'Africa/Porto-Novo',
  'Africa/Sao_Tome',
  'Africa/Tripoli',
  'Africa/Tunis',
  'Africa/Windhoek',
  'America/Adak',
  'America/Anchorage',
  'America/Anguilla',
  'America/Antigua',
  'America/Araguaina',
  'America/Argentina/La_Rioja',
  'America/Argentina/Rio_Gallegos',
  'America/Argentina/Salta',
  'America/Argentina/San_Juan',
  'America/Argentina/San_Luis',
  'America/Argentina/Tucuman',
  'America/Argentina/Ushuaia',
  'America/Aruba',
  'America/Asuncion',
  'America/Bahia',
  'America/Bahia_Banderas',
  'America/Barbados',
  'America/Belem',
  'America/Belize',
  'America/Blanc-Sablon',
  'America/Boa_Vista',
  'America/Bogota',
  'America/Boise',
  'America/Buenos_Aires',
  'America/Cambridge_Bay',
  'America/Campo_Grande',
  'America/Cancun',
  'America/Caracas',
  'America/Catamarca',
  'America/Cayenne',
  'America/Cayman',
  'America/Chicago',
  'America/Chihuahua',
  'America/Ciudad_Juarez',
  'America/Coral_Harbour',
  'America/Cordoba',
  'America/Costa_Rica',
  'America/Creston',
  'America/Cuiaba',
  'America/Curacao',
  'America/Danmarkshavn',
  'America/Dawson',
  'America/Dawson_Creek',
  'America/Denver',
  'America/Detroit',
  'America/Dominica',
  'America/Edmonton',
  'America/Eirunepe',
  'America/El_Salvador',
  'America/Fort_Nelson',
  'America/Fortaleza',
  'America/Glace_Bay',
  'America/Godthab',
  'America/Goose_Bay',
  'America/Grand_Turk',
  'America/Grenada',
  'America/Guadeloupe',
  'America/Guatemala',
  'America/Guayaquil',
  'America/Guyana',
  'America/Halifax',
  'America/Havana',
  'America/Hermosillo',
  'America/Indiana/Knox',
  'America/Indiana/Marengo',
  'America/Indiana/Petersburg',
  'America/Indiana/Tell_City',
  'America/Indiana/Vevay',
  'America/Indiana/Vincennes',
  'America/Indiana/Winamac',
  'America/Indianapolis',
  'America/Inuvik',
  'America/Iqaluit',
  'America/Jamaica',
  'America/Jujuy',
  'America/Juneau',
  'America/Kentucky/Monticello',
  'America/Kralendijk',
  'America/La_Paz',
  'America/Lima',
  'America/Los_Angeles',
  'America/Louisville',
  'America/Lower_Princes',
  'America/Maceio',
  'America/Managua',
  'America/Manaus',
  'America/Marigot',
  'America/Martinique',
  'America/Matamoros',
  'America/Mazatlan',
  'America/Mendoza',
  'America/Menominee',
  'America/Merida',
  'America/Metlakatla',
  'America/Mexico_City',
  'America/Miquelon',
  'America/Moncton',
  'America/Monterrey',
  'America/Montevideo',
  'America/Montreal',
  'America/Montserrat',
  'America/Nassau',
  'America/New_York',
  'America/Nipigon',
  'America/Nome',
  'America/Noronha',
  'America/North_Dakota/Beulah',
  'America/North_Dakota/Center',
  'America/North_Dakota/New_Salem',
  'America/Ojinaga',
  'America/Panama',
  'America/Pangnirtung',
  'America/Paramaribo',
  'America/Phoenix',
  'America/Port-au-Prince',
  'America/Port_of_Spain',
  'America/Porto_Velho',
  'America/Puerto_Rico',
  'America/Punta_Arenas',
  'America/Rainy_River',
  'America/Rankin_Inlet',
  'America/Recife',
  'America/Regina',
  'America/Resolute',
  'America/Rio_Branco',
  'America/Santa_Isabel',
  'America/Santarem',
  'America/Santiago',
  'America/Santo_Domingo',
  'America/Sao_Paulo',
  'America/Scoresbysund',
  'America/Sitka',
  'America/St_Barthelemy',
  'America/St_Johns',
  'America/St_Kitts',
  'America/St_Lucia',
  'America/St_Thomas',
  'America/St_Vincent',
  'America/Swift_Current',
  'America/Tegucigalpa',
  'America/Thule',
  'America/Thunder_Bay',
  'America/Tijuana',
  'America/Toronto',
  'America/Tortola',
  'America/Vancouver',
  'America/Whitehorse',
  'America/Winnipeg',
  'America/Yakutat',
  'America/Yellowknife',
  'Antarctica/Casey',
  'Antarctica/Davis',
  'Antarctica/DumontDUrville',
  'Antarctica/Macquarie',
  'Antarctica/Mawson',
  'Antarctica/McMurdo',
  'Antarctica/Palmer',
  'Antarctica/Rothera',
  'Antarctica/Syowa',
  'Antarctica/Troll',
  'Antarctica/Vostok',
  'Arctic/Longyearbyen',
  'Asia/Aden',
  'Asia/Almaty',
  'Asia/Amman',
  'Asia/Anadyr',
  'Asia/Aqtau',
  'Asia/Aqtobe',
  'Asia/Ashgabat',
  'Asia/Atyrau',
  'Asia/Baghdad',
  'Asia/Bahrain',
  'Asia/Baku',
  'Asia/Bangkok',
  'Asia/Barnaul',
  'Asia/Beirut',
  'Asia/Bishkek',
  'Asia/Brunei',
  'Asia/Calcutta',
  'Asia/Chita',
  'Asia/Choibalsan',
  'Asia/Colombo',
  'Asia/Damascus',
  'Asia/Dhaka',
  'Asia/Dili',
  'Asia/Dubai',
  'Asia/Dushanbe',
  'Asia/Famagusta',
  'Asia/Gaza',
  'Asia/Hebron',
  'Asia/Hong_Kong',
  'Asia/Hovd',
  'Asia/Irkutsk',
  'Asia/Jakarta',
  'Asia/Jayapura',
  'Asia/Jerusalem',
  'Asia/Kabul',
  'Asia/Kamchatka',
  'Asia/Karachi',
  'Asia/Katmandu',
  'Asia/Khandyga',
  'Asia/Krasnoyarsk',
  'Asia/Kuala_Lumpur',
  'Asia/Kuching',
  'Asia/Kuwait',
  'Asia/Macau',
  'Asia/Magadan',
  'Asia/Makassar',
  'Asia/Manila',
  'Asia/Muscat',
  'Asia/Nicosia',
  'Asia/Novokuznetsk',
  'Asia/Novosibirsk',
  'Asia/Omsk',
  'Asia/Oral',
  'Asia/Phnom_Penh',
  'Asia/Pontianak',
  'Asia/Pyongyang',
  'Asia/Qatar',
  'Asia/Qostanay',
  'Asia/Qyzylorda',
  'Asia/Rangoon',
  'Asia/Riyadh',
  'Asia/Saigon',
  'Asia/Sakhalin',
  'Asia/Samarkand',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Srednekolymsk',
  'Asia/Taipei',
  'Asia/Tashkent',
  'Asia/Tbilisi',
  'Asia/Tehran',
  'Asia/Thimphu',
  'Asia/Tokyo',
  'Asia/Tomsk',
  'Asia/Ulaanbaatar',
  'Asia/Urumqi',
  'Asia/Ust-Nera',
  'Asia/Vientiane',
  'Asia/Vladivostok',
  'Asia/Yakutsk',
  'Asia/Yekaterinburg',
  'Asia/Yerevan',
  'Atlantic/Azores',
  'Atlantic/Bermuda',
  'Atlantic/Canary',
  'Atlantic/Cape_Verde',
  'Atlantic/Faeroe',
  'Atlantic/Madeira',
  'Atlantic/Reykjavik',
  'Atlantic/South_Georgia',
  'Atlantic/St_Helena',
  'Atlantic/Stanley',
  'Australia/Adelaide',
  'Australia/Brisbane',
  'Australia/Broken_Hill',
  'Australia/Currie',
  'Australia/Darwin',
  'Australia/Eucla',
  'Australia/Hobart',
  'Australia/Lindeman',
  'Australia/Lord_Howe',
  'Australia/Melbourne',
  'Australia/Perth',
  'Australia/Sydney',
  'Europe/Amsterdam',
  'Europe/Andorra',
  'Europe/Astrakhan',
  'Europe/Athens',
  'Europe/Belgrade',
  'Europe/Berlin',
  'Europe/Bratislava',
  'Europe/Brussels',
  'Europe/Bucharest',
  'Europe/Budapest',
  'Europe/Busingen',
  'Europe/Chisinau',
  'Europe/Copenhagen',
  'Europe/Dublin',
  'Europe/Gibraltar',
  'Europe/Guernsey',
  'Europe/Helsinki',
  'Europe/Isle_of_Man',
  'Europe/Istanbul',
  'Europe/Jersey',
  'Europe/Kaliningrad',
  'Europe/Kiev',
  'Europe/Kirov',
  'Europe/Lisbon',
  'Europe/Ljubljana',
  'Europe/London',
  'Europe/Luxembourg',
  'Europe/Madrid',
  'Europe/Malta',
  'Europe/Mariehamn',
  'Europe/Minsk',
  'Europe/Monaco',
  'Europe/Moscow',
  'Europe/Oslo',
  'Europe/Paris',
  'Europe/Podgorica',
  'Europe/Prague',
  'Europe/Riga',
  'Europe/Rome',
  'Europe/Samara',
  'Europe/San_Marino',
  'Europe/Sarajevo',
  'Europe/Saratov',
  'Europe/Simferopol',
  'Europe/Skopje',
  'Europe/Sofia',
  'Europe/Stockholm',
  'Europe/Tallinn',
  'Europe/Tirane',
  'Europe/Ulyanovsk',
  'Europe/Uzhgorod',
  'Europe/Vaduz',
  'Europe/Vatican',
  'Europe/Vienna',
  'Europe/Vilnius',
  'Europe/Volgograd',
  'Europe/Warsaw',
  'Europe/Zagreb',
  'Europe/Zaporozhye',
  'Europe/Zurich',
  'Indian/Antananarivo',
  'Indian/Chagos',
  'Indian/Christmas',
  'Indian/Cocos',
  'Indian/Comoro',
  'Indian/Kerguelen',
  'Indian/Mahe',
  'Indian/Maldives',
  'Indian/Mauritius',
  'Indian/Mayotte',
  'Indian/Reunion',
  'Pacific/Apia',
  'Pacific/Auckland',
  'Pacific/Bougainville',
  'Pacific/Chatham',
  'Pacific/Easter',
  'Pacific/Efate',
  'Pacific/Enderbury',
  'Pacific/Fakaofo',
  'Pacific/Fiji',
  'Pacific/Funafuti',
  'Pacific/Galapagos',
  'Pacific/Gambier',
  'Pacific/Guadalcanal',
  'Pacific/Guam',
  'Pacific/Honolulu',
  'Pacific/Johnston',
  'Pacific/Kiritimati',
  'Pacific/Kosrae',
  'Pacific/Kwajalein',
  'Pacific/Majuro',
  'Pacific/Marquesas',
  'Pacific/Midway',
  'Pacific/Nauru',
  'Pacific/Niue',
  'Pacific/Norfolk',
  'Pacific/Noumea',
  'Pacific/Pago_Pago',
  'Pacific/Palau',
  'Pacific/Pitcairn',
  'Pacific/Ponape',
  'Pacific/Port_Moresby',
  'Pacific/Rarotonga',
  'Pacific/Saipan',
  'Pacific/Tahiti',
  'Pacific/Tarawa',
  'Pacific/Tongatapu',
  'Pacific/Truk',
  'Pacific/Wake',
  'Pacific/Wallis'
);
CREATE TYPE "FamilyPartnerStatus" AS ENUM (
  'Prospect',
  'Invited',
  'Onboarding',
  'Active',
  'Delinquent',
  'Inactive'
);
CREATE TYPE "FamilyBillingMethod" AS ENUM ('Self', 'Partner', 'Scholarship', 'TFM Team');
CREATE TYPE "FamilyReasonForInactive" AS ENUM (
  'Waiting for Approval',
  'Non-responsive',
  'Completed',
  'Delinquent'
);
CREATE TYPE "FamilyMemberType" AS ENUM ('Head of Household', 'Child', 'Pet');
CREATE TYPE "RelationshipStatus" AS ENUM (
  'Single',
  'Committed Relationship - Not Living Together',
  'Committed Relationship - Living Together',
  'Married',
  'Divorced',
  'Widowed',
  'Separated'
);
CREATE TYPE "SessionListingStatus" AS ENUM ('Draft', 'Preview', 'Active', 'Archived');
CREATE TYPE "TotalFamilyFramework" AS ENUM (
  'Family vs. Unknown',
  'Family vs. Known',
  'Family vs. Others',
  'Family vs. Family'
);
CREATE TYPE "PetType" AS ENUM ('Cat', 'Dog', 'Reptile', 'Bird', 'Fish', 'Other');
CREATE TYPE "Role" AS ENUM (
  'Admin',
  'Coach Admin',
  'Coach',
  'Partner Admin',
  'Partner Advisor',
  'Head of Household',
  'Child'
);
-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  birth_date DATE,
  phone TEXT,
  avatar_url TEXT,
  allow_sms BOOL DEFAULT true,
  occupation TEXT,
  CONSTRAINT user_profiles_email_not_null_if_user_id_not_null CHECK (
    (
      user_id IS NOT NULL
      AND email IS NOT NULL
    )
    OR (user_id IS NULL)
  ),
  CONSTRAINT user_profiles_email_key UNIQUE (email)
);
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role "Role" NOT NULL
);
CREATE TABLE sessions (
  number INT8 NOT NULL,
  slug TEXT NOT NULL,
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  status "SessionListingStatus" NOT NULL,
  description TEXT NOT NULL,
  total_family_framework "TotalFamilyFramework",
  subtitle TEXT,
  image_url TEXT,
  presentation_url TEXT
);
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  county TEXT,
  state TEXT,
  pincode TEXT
);
CREATE TABLE public.values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE,
  description TEXT
);
CREATE TABLE life_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL
);
CREATE TABLE coaches (
  id UUID PRIMARY KEY REFERENCES user_roles(id) ON DELETE RESTRICT,
  short_bio TEXT,
  enable_payouts BOOL DEFAULT false,
  stripe_connected_account_id TEXT,
  payout_rate NUMERIC,
  working_hours JSON,
  timezone "Timezone",
  minimum_notice INT8,
  default_calendar_id TEXT,
  selected_calendar_ids JSON,
  status "FamilyPartnerStatus" NOT NULL DEFAULT 'Inactive'
);
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status "FamilyPartnerStatus" NOT NULL,
  company_legal_name TEXT NOT NULL,
  anniversary DATE NOT NULL,
  billing_address_id UUID REFERENCES addresses(id),
  segment TEXT,
  industry TEXT,
  website TEXT,
  annual_review_date DATE,
  backstory TEXT,
  company_logo_url TEXT,
  assets_under_management TEXT NULL,
  total_clients TEXT NULL,
  stripe_customer_id TEXT
);
CREATE TABLE partner_members (
  id UUID PRIMARY KEY REFERENCES user_roles(id),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE
);
CREATE TABLE calendar_quarters (
  id TEXT GENERATED ALWAYS AS (year::TEXT || ' - Q' || quarter::TEXT) STORED PRIMARY KEY,
  quarter INT2 NOT NULL CHECK (
    quarter BETWEEN 1 AND 4
  ),
  year INT2 NOT NULL,
  starts_on DATE NOT NULL,
  ends_on DATE NOT NULL
);
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_name TEXT NOT NULL,
  status "FamilyPartnerStatus" NOT NULL,
  billing_method "FamilyBillingMethod" NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  life_phase_id UUID REFERENCES life_phases(id),
  primary_address_id UUID REFERENCES addresses(id),
  partner_id UUID REFERENCES partners(id),
  assigned_coach_id UUID REFERENCES coaches(id),
  inactive_reason "FamilyReasonForInactive",
  family_mantra TEXT,
  acknowledged_waiver_on DATE,
  family_photo_url TEXT,
  client_context TEXT
);
CREATE TABLE family_session_credits(
  id UUID PRIMARY KEY REFERENCES families(id) ON DELETE CASCADE,
  balance INT2 NOT NULL
);
CREATE TABLE family_members (
  id UUID PRIMARY KEY REFERENCES user_roles(id) ON DELETE RESTRICT,
  is_child BOOLEAN NOT NULL,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE RESTRICT,
  relationship_status "RelationshipStatus",
  partner_spouse_id UUID REFERENCES family_members(id),
  relationship_anniversary DATE,
  child_living_at_home BOOL,
  CONSTRAINT family_members_id_family_id_unique UNIQUE (id, family_id)
);
CREATE TABLE family_member_roles (
  -- id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  family_member_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  completed_on DATE NOT NULL,
  roles JSON NOT NULL,
  CONSTRAINT family_member_roles_pkey PRIMARY KEY (family_member_id, completed_on)
);
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  family_member_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  quote TEXT NOT NULL,
  date DATE NOT NULL
);
CREATE TABLE quote_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL UNIQUE
);
CREATE TABLE quote_quote_themes (
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  quote_theme_id UUID NOT NULL REFERENCES quote_themes(id),
  PRIMARY KEY (quote_id, quote_theme_id)
);
CREATE TABLE time_wises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  family_member_id UUID NOT NULL REFERENCES family_members(id) ON DELETE RESTRICT,
  completed_on DATE NOT NULL,
  family_hours INT2,
  sleep_hours INT2,
  career_hours INT2,
  personal_hours INT2,
  health_hours INT2
);
-- TODO: 
-- CREATE TABLE
--   documents (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     document_type "DocumentType",
--     file_url TEXT NOT NULL,
--     family_member_id UUID REFERENCES family_members(id),
--     document_number TEXT,
--     issued_country TEXT,
--     issued_on DATE,
--     expires_on DATE
--   );
CREATE TABLE IF NOT EXISTS family_values (
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  completed_on DATE NOT NULL,
  actions JSON NOT NULL,
  CONSTRAINT family_values_pkey PRIMARY KEY (family_id, completed_on)
);
CREATE TABLE session_life_phases (
  life_phase_id UUID NOT NULL REFERENCES life_phases(id),
  session_id UUID NOT NULL REFERENCES sessions(id),
  PRIMARY KEY (life_phase_id, session_id)
);
CREATE TABLE view_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  route TEXT NOT NULL
);
-- TODO: make invitee_first_name and invitee_email not null
CREATE TABLE connect_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  invitee_first_name TEXT,
  invitee_email TEXT,
  expires_on DATE NOT NULL,
  invite_code TEXT NOT NULL,
  invite_url TEXT NOT NULL,
  status "ConnectInvitationStatus",
  partner TEXT,
  redeemed_by TEXT
);
CREATE TABLE calendar_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES coaches(id),
  refresh_token TEXT NOT NULL,
  calendar_ids JSON NOT NULL
);
CREATE TABLE family_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_id TEXT NOT NULL UNIQUE,
  family_id UUID NOT NULL REFERENCES families(id),
  session_id UUID NOT NULL REFERENCES sessions(id),
  status "SessionStatus" NOT NULL,
  planned_quarter_id TEXT REFERENCES calendar_quarters(id),
  coach_id UUID REFERENCES coaches(id),
  scheduled_time TIMESTAMP,
  cancellation_reason TEXT,
  conferencing_instructions TEXT,
  google_event_id TEXT,
  conferencing_join_url TEXT,
  primary_email TEXT,
  cc_emails TEXT,
  call_summary TEXT,
  coach_insights TEXT,
  coach_suggestions TEXT,
  notes TEXT,
  attendees JSON,
  _frappe_id TEXT,
  last_reminder_in_hours INT2
);
CREATE TABLE coach_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES coaches(id),
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  paid BOOLEAN DEFAULT false,
  session_id UUID REFERENCES family_sessions(id),
  stripe_transfer_id TEXT
);
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  birth_date date,
  type "PetType",
  breed TEXT,
  avatar_url TEXT
);

CREATE TABLE session_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_session_id UUID NOT NULL REFERENCES family_sessions(id) ON DELETE RESTRICT,
  user_id UUID REFERENCES auth.users(id),
  rating NUMERIC NOT NULL,
  feedback TEXT
);
CREATE TABLE family_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_role TEXT NOT NULL
);
CREATE TABLE public.conversations (
  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  from_user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE
  SET NULL,
    assigned_to_user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE
  SET NULL,
    family UUID REFERENCES public.families(id) ON DELETE
  SET NULL,
    status TEXT,
    subject TEXT,
    category TEXT
);
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id BIGINT NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE
  SET NULL,
    source TEXT,
    attachments JSONB,
    is_internal BOOLEAN DEFAULT false,
    notification_failed BOOLEAN DEFAULT false,
    html_content TEXT
);
CREATE TABLE public.conversation_ccs (
  id UUID PRIMARY KEY default gen_random_uuid(),
  user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  conversation_id BIGINT REFERENCES public.conversations(id) ON DELETE CASCADE
);
CREATE TABLE public.conversation_read_statuses (
  user_profile_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  conversation_id BIGINT NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  CONSTRAINT conversation_read_statuses_pkey PRIMARY KEY (user_profile_id, conversation_id)
);
CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  type TEXT,
  file_path TEXT,
  published BOOLEAN DEFAULT false,
  target_roles JSONB DEFAULT '[]'::JSONB,
  cover_image TEXT
);
CREATE TABLE public.client_session_notes (
  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE
  SET NULL,
    family_session_id UUID REFERENCES family_sessions(id) ON DELETE CASCADE,
    note TEXT
);
create table public.guide_categories (
  id uuid not null default gen_random_uuid (),
  title character varying(255) not null,
  slug character varying(255) not null,
  slug_path text null,
  content text null,
  seo_description text null,
  parent_id uuid null,
  "order" integer not null,
  author_id uuid null,
  constraint guide_categories_pkey primary key (id),
  constraint guide_categories_slug_parent_id_key unique (slug, parent_id),
  constraint fk_author_id foreign key (author_id) references user_profiles (id),
  constraint fk_parent_id foreign key (parent_id) references guide_categories (id) on delete cascade
) tablespace pg_default;
create table public.guide_articles (
  id uuid not null default gen_random_uuid (),
  category_id uuid not null,
  title character varying(255) not null,
  slug character varying(255) not null,
  slug_path text null,
  content text not null,
  seo_description text null,
  created_at timestamp without time zone null default (now() at time zone 'utc'::text),
  updated_at timestamp without time zone null default (now() at time zone 'utc'::text),
  author_id uuid null,
  is_published boolean not null default false,
  "order" integer not null,
  constraint guide_articles_pkey primary key (id),
  constraint guide_articles_slug_category_id_key unique (slug, category_id),
  constraint fk_author_id foreign key (author_id) references user_profiles (id),
  constraint fk_category_id foreign key (category_id) references guide_categories (id) on delete cascade
) tablespace pg_default;
-- -----------------------------------------------------------------------------
-- Views
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW user_profiles_view WITH (security_invoker = true) AS
SELECT user_profiles.id AS user_profile_id,
  user_profiles.user_id,
  user_profiles.email,
  user_profiles.first_name,
  user_profiles.last_name,
  user_profiles.birth_date,
  user_profiles.phone,
  user_profiles.avatar_url,
  user_profiles.occupation,
  user_roles.id AS id,
  user_roles.role AS role,
  user_profiles.allow_sms,
  family_members.is_child,
  family_members.family_id,
  family_members.relationship_status,
  family_members.partner_spouse_id,
  family_members.relationship_anniversary,
  family_members.child_living_at_home,
  coaches.short_bio,
  coaches.enable_payouts,
  coaches.stripe_connected_account_id,
  coaches.payout_rate,
  coaches.working_hours,
  coaches.timezone,
  coaches.minimum_notice,
  coaches.default_calendar_id,
  coaches.selected_calendar_ids,
  partner_members.partner_id
FROM user_profiles
  FULL JOIN user_roles ON user_profiles.id = user_roles.user_profile_id
  FULL JOIN family_members ON user_roles.id = family_members.id
  FULL JOIN coaches ON user_roles.id = coaches.id
  FULL JOIN partner_members ON user_roles.id = partner_members.id;
-- -----------------------------------------------------------------------------
-- Storage Buckets
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true),
  ('files', 'files', true) ON CONFLICT(id) DO
UPDATE
SET name = EXCLUDED.name,
  public = EXCLUDED.public;
CREATE POLICY "images can be uploaded only by authenticated user" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'images');
CREATE POLICY "files can be uploaded only by authenticated user" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'files');
-- -----------------------------------------------------------------------------
-- Permissions
-- -----------------------------------------------------------------------------
GRANT ALL on SCHEMA auth to service_role;
GRANT SELECT ON auth.users to authenticated;
-- -----------------------------------------------------------------------------
-- Procedure: Add created_at, created_by, updated_at and updated_by columns to all tables
-- -----------------------------------------------------------------------------
DO $$
DECLARE row record;
BEGIN FOR row IN (
  SELECT tablename
  FROM pg_tables
  WHERE schemaname = 'public'
) LOOP EXECUTE format(
  'ALTER TABLE %I ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();',
  row.tablename
);
EXECUTE format(
  'ALTER TABLE %I ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;',
  row.tablename
);
EXECUTE format(
  'ALTER TABLE %I ADD COLUMN IF NOT EXISTS created_by uuid DEFAULT auth.uid();',
  row.tablename
);
EXECUTE format(
  'ALTER TABLE %I ADD COLUMN IF NOT EXISTS updated_by uuid;',
  row.tablename
);
END LOOP;
END;
$$ LANGUAGE plpgsql;
-- -----------------------------------------------------------------------------
-- Function: has_role
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.has_roles(_roles "Role" []) RETURNS BOOLEAN AS $$
BEGIN 
  RETURN EXISTS(
    SELECT 1
    FROM user_roles
    WHERE user_profile_id = (
        SELECT id
        FROM user_profiles
        WHERE user_id = auth.uid()
      )
      AND role = ANY(_roles)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- Function: has_role
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.has_role(_role "Role") RETURNS BOOLEAN AS $$ BEGIN RETURN has_roles(ARRAY [_role]);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- -----------------------------------------------------------------------------
-- Function: onboard_new_family (security definer function)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION onboard_new_family(
    user_profile_id UUID,
    family_name TEXT,
    life_phase_id UUID
  ) RETURNS void AS $$
DECLARE new_family_id UUID;
new_role_id UUID;
BEGIN -- Create a new family
INSERT INTO public.families (
    family_name,
    life_phase_id,
    status,
    billing_method
  )
VALUES (family_name, life_phase_id, 'Prospect', 'Self')
RETURNING id INTO new_family_id;
-- Create a new user role
INSERT INTO public.user_roles (user_profile_id, role)
VALUES (user_profile_id, 'Head of Household')
RETURNING id INTO new_role_id;
-- Create a new family member
INSERT INTO public.family_members (id, family_id, is_child)
VALUES (new_role_id, new_family_id, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- Function: invite_new_family (security definer function)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION invite_new_family(
    first_name1 TEXT,
    last_name1 TEXT,
    email1 TEXT,
    family_name TEXT,
    life_phase_id UUID,
    billing_method "FamilyBillingMethod",
    partner_id UUID DEFAULT NULL,
    first_name2 TEXT DEFAULT NULL,
    last_name2 TEXT DEFAULT NULL,
    email2 TEXT DEFAULT NULL
) RETURNS TABLE(new_family_id UUID, user_profile_id1 UUID, user_profile_id2 UUID) AS $$
DECLARE
    new_family_id UUID;
    user_profile_id1 UUID;
    user_profile_id2 UUID;
    new_role_id1 UUID;
    new_role_id2 UUID;
BEGIN
    -- Create a new family
    INSERT INTO public.families (
        family_name,
        life_phase_id,
        status,
        billing_method,
        partner_id
    )
    VALUES (
        family_name,
        life_phase_id,
        'Invited',
        billing_method,
        CASE WHEN billing_method = 'Partner' THEN partner_id ELSE NULL END
    )
    RETURNING id INTO new_family_id;

    -- Create user profile and role for the first head of household
    INSERT INTO public.user_profiles (first_name, last_name, email)
    VALUES (first_name1, last_name1, email1)
    RETURNING id INTO user_profile_id1;

    INSERT INTO public.user_roles (user_profile_id, role)
    VALUES (user_profile_id1, 'Head of Household')
    RETURNING id INTO new_role_id1;

    -- Create a new family member for the first head of household
    INSERT INTO public.family_members (id, family_id, is_child)
    VALUES (new_role_id1, new_family_id, false);

    -- Check if second head of household details are provided
    IF first_name2 IS NOT NULL AND last_name2 IS NOT NULL AND email2 IS NOT NULL THEN
        -- Create user profile and role for the second head of household
        INSERT INTO public.user_profiles (first_name, last_name, email)
        VALUES (first_name2, last_name2, email2)
        RETURNING id INTO user_profile_id2;

        INSERT INTO public.user_roles (user_profile_id, role)
        VALUES (user_profile_id2, 'Head of Household')
        RETURNING id INTO new_role_id2;

        -- Create a new family member for the second head of household
        INSERT INTO public.family_members (id, family_id, is_child)
        VALUES (new_role_id2, new_family_id, false);
    END IF;

    RETURN QUERY SELECT new_family_id, user_profile_id1, user_profile_id2;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- Function: onboard_new_partner (security definer function)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION onboard_new_partner(
    user_profile_id UUID,
    company_legal_name TEXT,
    website TEXT,
    segment TEXT,
    total_clients TEXT,
    assets_under_management TEXT,
    company_logo_url TEXT
  ) RETURNS void AS $$
DECLARE new_partner_id UUID;
new_role_id UUID;
BEGIN -- Create a new partner
INSERT INTO public.partners (
    company_legal_name,
    website,
    segment,
    total_clients,
    assets_under_management,
    company_logo_url,
    status,
    anniversary
  )
VALUES (
    company_legal_name,
    website,
    segment,
    total_clients,
    assets_under_management,
    company_logo_url,
    'Prospect',
    CURRENT_DATE
  )
RETURNING id INTO new_partner_id;
-- Create a new user role
INSERT INTO public.user_roles (user_profile_id, role)
VALUES (user_profile_id, 'Partner Admin')
RETURNING id INTO new_role_id;
-- Create a new partner member
INSERT INTO public.partner_members (id, partner_id)
VALUES (new_role_id, new_partner_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- -----------------------------------------------------------------------------
-- Function: gen_short_id(uuid_input uuid) RETURNS text
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION gen_short_id(uuid_input uuid) RETURNS TEXT AS $$
DECLARE candidate_short_id text;
hash_full text;
random_start integer;
BEGIN hash_full := md5(uuid_input::text);
-- The MD5 hash is 32 characters, so the start position must be between 1 and 25 to create an 8-character substring.
random_start := floor(random() * (25 - 1 + 1))::integer + 1;
-- Extract an 8-character substring from the hash starting at the random position
RETURN substring(hash_full, random_start, 8);
END;
$$ LANGUAGE plpgsql;
-- -----------------------------------------------------------------------------
-- TRIGGER: Create or update user profile when a new user signs up via Supabase Auth
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$ BEGIN -- Check if a user profile already exists with the same email
  IF EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE email = new.email
  ) THEN -- Update existing user profile with new user's ID
UPDATE public.user_profiles
SET user_id = new.id
WHERE email = new.email;
END IF;
RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_new_user
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
-- -----------------------------------------------------------------------------
-- TRIGGER: Keep user meta in sync with user profile when user_id is updated
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_user_id_update() RETURNS trigger AS $$ BEGIN IF NEW.user_id IS NOT NULL THEN -- Set new email
SELECT email INTO NEW.email
FROM auth.users
WHERE id = NEW.user_id;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_user_profile_updated BEFORE
UPDATE ON public.user_profiles FOR EACH ROW EXECUTE PROCEDURE public.handle_user_id_update();
-- -----------------------------------------------------------------------------
-- TRIGGER: update updated_at and updated_by for all tables
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_meta_columns() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
NEW.updated_by = auth.uid();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DO $$
DECLARE row record;
BEGIN FOR row IN (
  SELECT tablename
  FROM pg_tables
  WHERE schemaname = 'public'
) LOOP EXECUTE format(
  'CREATE OR REPLACE TRIGGER update_%s_meta_columns BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION update_meta_columns()',
  row.tablename,
  row.tablename
);
END LOOP;
END;
$$ LANGUAGE plpgsql;
-- -----------------------------------------------------------------------------
-- TRIGGER: set_short_id for family_sessions
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_short_id() RETURNS TRIGGER AS $$ BEGIN NEW.short_id := public.gen_short_id(NEW.id);
LOOP EXIT
WHEN NOT EXISTS(
  SELECT 1
  FROM public.family_sessions
  WHERE short_id = NEW.short_id
);
NEW.short_id := public.gen_short_id(NEW.id);
END LOOP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trigger_set_short_id BEFORE
INSERT ON family_sessions FOR EACH ROW EXECUTE FUNCTION set_short_id();
-- -----------------------------------------------------------------------------
-- Function: has_access_to_family (security definer function)
-- TODO: move this to private schema
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.has_access_to_family(_user_id UUID, _family_id UUID) RETURNS BOOLEAN AS $$
DECLARE profile record;
has_access BOOLEAN := false;
BEGIN FOR profile IN (
  SELECT *
  FROM user_profiles_view
  WHERE user_id = _user_id
) LOOP IF profile.role in ('Admin', 'Coach Admin') THEN has_access := true;
EXIT;
ELSIF profile.role = 'Coach' THEN has_access := EXISTS(
  SELECT 1
  FROM families
  WHERE id = _family_id
    AND (
      assigned_coach_id = profile.id
      OR id IN (
        SELECT family_id
        FROM family_sessions
        WHERE coach_id = profile.id
      )
    )
);
IF has_access THEN EXIT;
END IF;
ELSIF profile.role IN ('Partner Admin', 'Partner Advisor') THEN has_access := EXISTS(
  SELECT 1
  FROM families
  WHERE id = _family_id
    AND partner_id = profile.partner_id
);
IF has_access THEN EXIT;
END IF;
ELSIF profile.role IN ('Head of Household', 'Child') THEN has_access := EXISTS(
  SELECT 1
  FROM families
  WHERE id = _family_id
    AND id = profile.family_id
);
IF has_access THEN EXIT;
END IF;
END IF;
END LOOP;
RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- -----------------------------------------------------------------------------
-- Function: can_update_profile (security definer function)
-- TODO: move this to private schema
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.can_update_profile(_role_id UUID) RETURNS BOOLEAN AS $$
DECLARE profile record;
my_profile record;
BEGIN -- Attempt to fetch the profile associated with the given role ID
SELECT * INTO profile
FROM user_profiles_view
WHERE id = _role_id;
-- Ensure a profile was found
IF NOT FOUND THEN RETURN false;
END IF;
-- If the user is updating their own profile
IF profile.user_id = auth.uid() THEN RETURN true;
END IF;
-- Attempt to fetch the profile of the user making the request
SELECT * INTO my_profile
FROM user_profiles_view
WHERE user_id = auth.uid();
-- Ensure a profile for the requester was found
IF NOT FOUND THEN RETURN false;
END IF;
-- Check if the user is an Admin
IF my_profile.role IN ('Admin', 'Coach Admin') THEN RETURN true;
-- Check if the user is a 'Head of Household' and compare family IDs
ELSIF my_profile.role = 'Head of Household' THEN RETURN profile.family_id = my_profile.family_id;
END IF;
-- Default deny if none of the conditions above are met
RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- -----------------------------------------------------------------------------
-- Function: has_access_to_partner (security definer function)
-- TODO: move this to private schema
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.has_access_to_partner(_partner_id UUID) RETURNS BOOLEAN AS $$
DECLARE profile record;
BEGIN FOR profile IN (
  SELECT *
  from user_profiles_view
  WHERE user_id = auth.uid()
) LOOP IF profile.role in ('Admin', 'Coach Admin') THEN RETURN true;
ELSIF profile.role = 'Partner Admin'
OR profile.role = 'Partner Advisor' THEN RETURN profile.partner_id = _partner_id;
ELSE -- handle other roles
END IF;
END LOOP;
RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- -----------------------------------------------------------------------------
-- RLS Policy: Enable RLS for all tables and only allow authenticated users to access them
-- -----------------------------------------------------------------------------
DO $$
DECLARE row record;
BEGIN FOR row IN
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public' LOOP EXECUTE format(
    'ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;',
    row.tablename
  );
-- Create a policy for only admin users to allow all actions
-- Create a policy to access all owned records for all other users (identified by created_by and updated_by)
EXECUTE format(
  $f$ CREATE POLICY "Admin full access" ON public.%I FOR ALL TO authenticated USING (
    created_by = auth.uid()
    OR updated_by = auth.uid()
    OR public.has_role('Admin')
  ) WITH CHECK (
    created_by = auth.uid()
    OR updated_by = auth.uid()
    OR public.has_role('Admin')
  );
$f$,
row.tablename
);
-- TODO: This is a temporary fix to allow all authenticated users to access all tables
-- Remove this policy and add more specific policies for each table
-- EXECUTE
--   format(
--     $f$
--           CREATE POLICY "All authenticated users can view all tables" ON public.%I
--           FOR ALL
--           TO authenticated
--           USING (true);
--       $f$,
--     row.tablename
--   );
END LOOP;
END;
$$ LANGUAGE plpgsql;
-- -----------------------------------------------------------------------------
-- Procedure: Create RLS policies for tables which are accessible by all authenticated users
-- -----------------------------------------------------------------------------
DO $$
DECLARE tablename VARCHAR;
BEGIN FOREACH tablename IN ARRAY ARRAY ['life_phases',
  'session_life_phases',
  'values',
  'family_roles',
  'quote_themes',
  'calendar_quarters'] LOOP EXECUTE format(
  'CREATE POLICY "All authenticated users can select %s" ON public.%I FOR SELECT TO authenticated USING (true);',
  tablename,
  tablename
);
END LOOP;
END;
$$ LANGUAGE plpgsql;
-- -----------------------------------------------------------------------------
-- RLS Policy: sessions
-- -----------------------------------------------------------------------------
-- All authenticated users can select all sessions
CREATE POLICY "All authenticated users can select all sessions" ON public.sessions FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Coach Admin can update any session" ON public.sessions FOR
UPDATE TO authenticated USING (public.has_role('Coach Admin'));
-- -----------------------------------------------------------------------------
-- RLS Policy: families
-- -----------------------------------------------------------------------------
CREATE POLICY "User can select their own families based on role" ON public.families FOR
SELECT TO authenticated USING (public.has_access_to_family(auth.uid(), id));
-- CREATE POLICY
--   "Authenticated user can insert family" ON public.families FOR
-- INSERT
--   TO authenticated
-- WITH
--   CHECK (true);
CREATE POLICY "Coach Admin and Head of Household  can update own families" ON public.families FOR
UPDATE TO authenticated USING (
    public.has_access_to_family(auth.uid(), id)
    AND (
      public.has_roles(
        ARRAY ['Head of Household'::"Role", 'Coach Admin':: "Role"]
      )
    )
  );
-- -----------------------------------------------------------------------------
-- RLS Policy: family_session_credits
-- -----------------------------------------------------------------------------
CREATE POLICY "User can select their own families based on role" ON public.family_session_credits FOR
SELECT TO authenticated USING (public.has_access_to_family(auth.uid(), id));
-- -----------------------------------------------------------------------------
-- RLS Policy: family_sessions
-- -----------------------------------------------------------------------------
CREATE POLICY "User can select their own family sessions" ON public.family_sessions FOR
SELECT TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM families
      WHERE id = family_id
    )
  );
CREATE POLICY "Coach and Coach Admin can insert family sessions" ON public.family_sessions FOR
INSERT TO authenticated WITH CHECK (
    public.has_roles(ARRAY ['Coach'::"Role", 'Coach Admin'::"Role"])
  );
CREATE POLICY "Coach and Coach Admin can update their family sessions" ON public.family_sessions FOR
UPDATE TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM families
      WHERE id = family_id
    )
    AND (
      public.has_roles(ARRAY ['Coach'::"Role", 'Coach Admin'::"Role"])
    )
  );
CREATE POLICY "Coach and Coach Admin can delete their family sessions" ON public.family_sessions FOR DELETE TO authenticated USING (
  EXISTS(
    SELECT 1
    FROM families
    WHERE id = family_id
  )
  AND (
    public.has_roles(ARRAY ['Coach'::"Role", 'Coach Admin'::"Role"])
  )
);
-- -----------------------------------------------------------------------------
-- RLS Policy: session_reviews
-- -----------------------------------------------------------------------------
CREATE POLICY "User can select session reviews for their session" ON public.session_reviews FOR
SELECT TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM family_sessions
      WHERE id = family_session_id
    )
  );
CREATE POLICY "Any can insert session reviews for their session" ON public.session_reviews FOR
INSERT TO public WITH CHECK (true);
-- -----------------------------------------------------------------------------
-- RLS Policy: family_session_notes
-- -----------------------------------------------------------------------------
CREATE POLICY "User can select their own family session notes" ON public.client_session_notes FOR
SELECT TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM family_sessions
      WHERE id = family_session_id
    )
  );
-- -----------------------------------------------------------------------------
-- RLS Policy: family_members
-- -----------------------------------------------------------------------------
CREATE POLICY "User can select their own family members based on role" ON public.family_members FOR
SELECT TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM families
      WHERE id = family_id
    )
  );
CREATE POLICY "Family Member can update their own or Family's members profile" ON public.family_members FOR
UPDATE TO authenticated USING (public.can_update_profile(id));
-- -----------------------------------------------------------------------------
-- RLS Policy: coaches
-- -----------------------------------------------------------------------------
CREATE POLICY "User can select their coaches" ON public.coaches FOR
SELECT TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM families
      WHERE assigned_coach_id = coaches.id
    )
  );
CREATE POLICY "User can select coaches associated with family_sessions" ON public.coaches FOR
SELECT TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM family_sessions
      WHERE coach_id = coaches.id
    )
  );
CREATE POLICY "Coach can update their own profile" ON public.coaches FOR
UPDATE TO authenticated USING (public.can_update_profile(id));
-- -----------------------------------------------------------------------------
-- RLS Policy: partners
-- -----------------------------------------------------------------------------
CREATE POLICY "User can select partners associated with their families" ON public.partners FOR
SELECT TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM families
      WHERE partner_id = partners.id
    )
  );
CREATE POLICY "User can select partners associated with their partner members" ON public.partners FOR
SELECT TO authenticated USING (public.has_access_to_partner(id));
CREATE POLICY "Partner Admin can update their own profile" ON public.partners FOR UPDATE TO authenticated USING (public.has_access_to_partner(id) AND public.has_roles(ARRAY ['Partner Admin'::"Role"]));
-- -----------------------------------------------------------------------------
-- RLS Policy: partner_members
-- -----------------------------------------------------------------------------
CREATE POLICY "User can select their own partner members" ON public.partner_members FOR
SELECT TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM partners
      WHERE id = partner_id
    )
  );
CREATE POLICY "Partner Members can update their own profile" ON public.partner_members FOR
UPDATE TO authenticated USING (public.can_update_profile(id));
-- -----------------------------------------------------------------------------
-- RLS Policy: user_roles
-- -----------------------------------------------------------------------------
CREATE POLICY "User can select family_members' roles" ON public.user_roles FOR
SELECT TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM family_members
      WHERE id = user_roles.id
    )
  );
CREATE POLICY "User can select coaches' roles" ON public.user_roles FOR
SELECT TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM coaches
      WHERE id = user_roles.id
    )
  );
-- This will cover all the roles that are not covered by the above policies
CREATE POLICY "User can select roles if they have update access" ON public.user_roles FOR
SELECT TO authenticated USING (public.can_update_profile(id));
CREATE POLICY "User can select partner members' roles" ON public.user_roles FOR
SELECT TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM partner_members
      WHERE id = user_roles.id
    )
  );
CREATE POLICY "Authenticated can insert user roles" ON public.user_roles FOR
INSERT TO authenticated WITH CHECK (true);
-- Only Admin can update or delete user roles 
-- -----------------------------------------------------------------------------
-- RLS Policy: user_profiles
-- -----------------------------------------------------------------------------
CREATE POLICY "User can select their own user profile" ON public.user_profiles FOR
SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "User can select profile for user_roles" ON public.user_profiles FOR
SELECT TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM user_roles
      WHERE user_profile_id = user_profiles.id
    )
  );
CREATE POLICY "User can update their own profile" ON public.user_profiles FOR
UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "User can update profile if they can update user roles" ON public.user_profiles FOR
UPDATE TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM user_roles
      WHERE user_profile_id = user_profiles.id
        AND public.can_update_profile(user_roles.id)
    )
  );
-- TODO: this doesn't seem to be working...
CREATE POLICY "Authenticated user can insert profile" ON public.user_profiles FOR
INSERT TO authenticated WITH CHECK (true);
-- -----------------------------------------------------------------------------
-- RLS Policy: pets
-- -----------------------------------------------------------------------------
CREATE POLICY "User can select their own pets" ON public.pets FOR
SELECT TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM families
      WHERE id = family_id
    )
  );
CREATE POLICY "User can insert pets for their family" ON public.pets FOR
INSERT TO authenticated WITH CHECK (
    public.has_role('Head of Household')
    AND EXISTS(
      SELECT 1
      FROM families
      WHERE id = family_id
    )
  );
CREATE POLICY "Head of Household can update their family's pets" ON public.pets FOR
UPDATE TO authenticated USING (
    public.has_role('Head of Household')
    AND EXISTS(
      SELECT 1
      FROM families
      WHERE id = family_id
    )
  );
-- -----------------------------------------------------------------------------
-- RLS Policy: quotes
-- -----------------------------------------------------------------------------
CREATE POLICY "User can select their own quotes" ON public.quotes FOR
SELECT TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM family_members
      WHERE id = family_member_id
    )
  );
CREATE POLICY "User can insert quotes for their family" ON public.quotes FOR
INSERT TO authenticated WITH CHECK (
    public.has_roles(
      ARRAY ['Head of Household'::"Role", 'Child'::"Role"]
    )
    AND EXISTS(
      SELECT 1
      FROM family_members
      WHERE id = family_member_id
    )
  );
CREATE POLICY "coaches and admins can insert quotes for any family" ON public.quotes FOR
INSERT TO authenticated WITH CHECK (
    public.has_roles(
      ARRAY ['Coach'::"Role", 'Coach Admin'::"Role", 'Admin'::"Role"]
    )
  );
-- -----------------------------------------------------------------------------
-- RLS Policy: quote_quote_themes
-- -----------------------------------------------------------------------------
CREATE POLICY "User can select their own quote quote themes" ON public.quote_quote_themes FOR
SELECT TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM quotes
      WHERE id = quote_id
    )
  );
CREATE POLICY "User can insert quote quote themes for their family" ON public.quote_quote_themes FOR
INSERT TO authenticated WITH CHECK (
    public.has_roles(
      ARRAY ['Head of Household'::"Role", 'Child'::"Role"]
    )
    AND EXISTS(
      SELECT 1
      FROM quotes
      WHERE id = quote_id
    )
  );
-- -----------------------------------------------------------------------------
-- RLS Policy: quote_themes
-- -----------------------------------------------------------------------------
CREATE POLICY "Family Members can insert quote themes" ON public.quote_themes FOR
INSERT TO authenticated WITH CHECK (
    public.has_roles(
      ARRAY ['Head of Household'::"Role", 'Child'::"Role"]
    )
  );
-- -----------------------------------------------------------------------------
-- RLS Policy: family_member_roles
-- -----------------------------------------------------------------------------
CREATE POLICY "User can select their own family member roles" ON public.family_member_roles FOR
SELECT TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM family_members
      WHERE id = family_member_id
    )
  );
CREATE POLICY "Family Members can insert family member roles for their family" ON public.family_member_roles FOR
INSERT TO authenticated WITH CHECK (
    public.has_roles(
      ARRAY ['Head of Household'::"Role", 'Child'::"Role", 'Coach'::"Role", 'Coach Admin'::"Role"]
    )
    AND EXISTS(
      SELECT 1
      FROM family_members
      WHERE id = family_member_id
    )
  );
CREATE POLICY "Family Members can update family member roles for their family" ON public.family_member_roles FOR
UPDATE TO authenticated USING (
    public.has_roles(
      ARRAY ['Head of Household'::"Role", 'Child'::"Role", 'Coach'::"Role", 'Coach Admin'::"Role"]
    )
    AND EXISTS(
      SELECT 1
      FROM family_members
      WHERE id = family_member_id
    )
  );
-- -----------------------------------------------------------------------------
-- RLS Policy: family_values
-- -----------------------------------------------------------------------------
CREATE POLICY "User can select their own family values" ON public.family_values FOR
SELECT TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM families
      WHERE id = family_id
    )
  );
CREATE POLICY "Family Members can insert family values for their family" ON public.family_values FOR
INSERT TO authenticated WITH CHECK (
    public.has_roles(
      ARRAY ['Head of Household'::"Role", 'Child'::"Role", 'Coach'::"Role", 'Coach Admin'::"Role"]
    )
    AND EXISTS(
      SELECT 1
      FROM families
      WHERE id = family_id
    )
  );
CREATE POLICY "Family Members can update family values for their family" ON public.family_values FOR
UPDATE TO authenticated USING (
    public.has_roles(
      ARRAY ['Head of Household'::"Role", 'Child'::"Role", 'Coach'::"Role", 'Coach Admin'::"Role"]
    )
    AND EXISTS(
      SELECT 1
      FROM families
      WHERE id = family_id
    )
  );
-- -----------------------------------------------------------------------------
-- RLS Policy: time_wises
-- -----------------------------------------------------------------------------
CREATE POLICY "User can select their own time wises" ON public.time_wises FOR
SELECT TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM family_members
      WHERE id = family_member_id
    )
  );
-- -----------------------------------------------------------------------------
-- RLS Policy: calendar_accounts
-- -----------------------------------------------------------------------------
CREATE POLICY "User can select their own calendar accounts" ON public.calendar_accounts FOR
SELECT TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM coaches
      WHERE id = coach_id
    )
  );
CREATE POLICY "Coach can insert calendar account" ON public.calendar_accounts FOR
INSERT TO authenticated WITH CHECK (public.has_roles(ARRAY ['Coach'::"Role", 'Coach Admin'::"Role"]));
CREATE POLICY "Coach can delete calendar account" ON public.calendar_accounts FOR DELETE TO authenticated USING (public.has_roles(ARRAY ['Coach'::"Role", 'Coach Admin'::"Role"]));
-- -----------------------------------------------------------------------------
-- RLS Policy: coach_payments
-- -----------------------------------------------------------------------------
CREATE POLICY "User can select their own coach payments" ON public.coach_payments FOR
SELECT TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM coaches
      WHERE id = coach_id
    )
  );
-- -----------------------------------------------------------------------------
-- RLS Policy: addresses
-- -----------------------------------------------------------------------------
CREATE POLICY "User can select their family addresses" ON public.addresses FOR
SELECT TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM families
      WHERE primary_address_id = addresses.id
    )
  );
CREATE POLICY "User can select their partner addresses" ON public.addresses FOR
SELECT TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM partners
      WHERE billing_address_id = addresses.id
    )
  );
CREATE POLICY "User can select addresses yet to be linked to a family or partner" ON public.addresses FOR
SELECT TO authenticated USING (
    NOT EXISTS(
      SELECT 1
      FROM families
      WHERE primary_address_id = addresses.id
    )
    AND NOT EXISTS(
      SELECT 1
      FROM partners
      WHERE billing_address_id = addresses.id
    )
  );
CREATE POLICY "User can update their family addresses" ON public.addresses FOR
UPDATE TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM families
      WHERE primary_address_id = addresses.id
    )
  );
CREATE POLICY "User can update their partner addresses" ON public.addresses FOR
UPDATE TO authenticated USING (
    EXISTS(
      SELECT 1
      FROM partners
      WHERE billing_address_id = addresses.id
    )
  );
CREATE POLICY "Authenticated users can insert addresses" ON public.addresses FOR
INSERT TO authenticated WITH CHECK (true);
-- -----------------------------------------------------------------------------
-- RLS Policy: life_phases
-- -----------------------------------------------------------------------------
CREATE POLICY "Authenticated users can select life phases" ON public.life_phases FOR
SELECT TO authenticated USING (true);
-- -----------------------------------------------------------------------------
-- New tables: Guide
-- -----------------------------------------------------------------------------
-- Function to update slug_path for guide_categories
CREATE OR REPLACE FUNCTION update_category_slug_path() RETURNS TRIGGER AS $$
DECLARE parent_slug_path TEXT;
BEGIN -- Recursive query to get the full slug_path of the parent category
WITH RECURSIVE slug_paths(id, slug_path) AS (
  SELECT id,
    CAST(slug AS TEXT)
  FROM guide_categories
  WHERE id = NEW.parent_id
  UNION ALL
  SELECT c.id,
    CONCAT(sp.slug_path, '/', c.slug)
  FROM guide_categories c
    INNER JOIN slug_paths sp ON c.parent_id = sp.id
)
SELECT slug_path INTO parent_slug_path
FROM slug_paths
WHERE id = NEW.parent_id;
-- If the parent category has a slug_path, append the new category's slug to it
-- Otherwise, just use the new category's slug
IF parent_slug_path IS NOT NULL THEN NEW.slug_path = CONCAT(parent_slug_path, '/', NEW.slug);
ELSE NEW.slug_path = NEW.slug;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER update_category_slug_path_trigger BEFORE
INSERT
  OR
UPDATE ON guide_categories FOR EACH ROW EXECUTE PROCEDURE update_category_slug_path();
-- Function to update slug_path for guide_articles
CREATE OR REPLACE FUNCTION update_article_slug_path() RETURNS TRIGGER AS $$
DECLARE category_slug_path TEXT;
BEGIN -- Get the slug_path of the category that the article belongs to
SELECT slug_path INTO category_slug_path
FROM guide_categories
WHERE id = NEW.category_id;
-- If the category has a slug_path, append the article's slug to it
-- Otherwise, just use the article's slug
IF category_slug_path IS NOT NULL THEN NEW.slug_path = CONCAT(category_slug_path, '/', NEW.slug);
ELSE NEW.slug_path = NEW.slug;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER update_article_slug_path_trigger BEFORE
INSERT
  OR
UPDATE ON guide_articles FOR EACH ROW EXECUTE PROCEDURE update_article_slug_path();
-- -----------------------------------------------------------------------------
-- RLS Policies for guide
-- -----------------------------------------------------------------------------
-- Public can view categories
CREATE POLICY "Public can view categories" ON public.guide_categories FOR
SELECT USING (true);
-- Public can view published articles
CREATE POLICY "Public can view published articles" ON public.guide_articles FOR
SELECT USING (is_published = true);

-- -----------------------------------------------------------------------------
-- RLS policies for view_logs
-- -----------------------------------------------------------------------------
CREATE POLICY "Authenticated users can insert view logs" ON public.view_logs FOR
INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Coaches and Admins can select view logs" ON public.view_logs FOR
SELECT TO authenticated USING (public.has_roles(ARRAY ['Coach'::"Role", 'Coach Admin'::"Role", 'Admin'::"Role"]));

-- -----------------------------------------------------------------------------
-- Function: upsert_family_member
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION upsert_family_member(
    family_id UUID,
    family_member_id UUID,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    birth_date DATE,
    phone TEXT,
    avatar_url TEXT,
    occupation TEXT,
    is_child BOOLEAN,
    relationship_status TEXT,
    partner_spouse_id UUID,
    relationship_anniversary DATE,
    child_living_at_home BOOLEAN
  ) RETURNS jsonb AS $$
DECLARE _user_profile_id UUID;
_role "Role";
_result jsonb;
BEGIN -- Determine role based on is_child
IF is_child THEN _role := 'Child'::"Role";
ELSE _role := 'Head of Household'::"Role";
END IF;
-- Upsert user_profiles
INSERT INTO user_profiles AS p (
    email,
    first_name,
    last_name,
    birth_date,
    phone,
    avatar_url,
    occupation
  )
VALUES (
    email,
    first_name,
    last_name,
    birth_date,
    phone,
    avatar_url,
    occupation
  ) ON CONFLICT ON CONSTRAINT user_profiles_email_key DO
UPDATE
SET first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  birth_date = EXCLUDED.birth_date,
  phone = EXCLUDED.phone,
  avatar_url = EXCLUDED.avatar_url,
  occupation = EXCLUDED.occupation
RETURNING p.id INTO _user_profile_id;
-- Insert user_roles
IF family_member_id IS NULL THEN
INSERT INTO user_roles (user_profile_id, role)
VALUES (_user_profile_id, _role)
RETURNING id INTO family_member_id;
END IF;
-- Upsert family_members
INSERT INTO family_members (
    id,
    family_id,
    is_child,
    relationship_status,
    partner_spouse_id,
    relationship_anniversary,
    child_living_at_home
  )
VALUES (
    family_member_id,
    family_id,
    is_child,
    relationship_status::"RelationshipStatus",
    partner_spouse_id,
    relationship_anniversary,
    child_living_at_home
  ) ON CONFLICT ON CONSTRAINT family_members_pkey DO
UPDATE
SET relationship_status = EXCLUDED.relationship_status::"RelationshipStatus",
  partner_spouse_id = EXCLUDED.partner_spouse_id,
  relationship_anniversary = EXCLUDED.relationship_anniversary,
  child_living_at_home = EXCLUDED.child_living_at_home;
-- Fetch and return the user_profiles_view record as JSON
SELECT row_to_json(upv.*) INTO _result
FROM user_profiles_view upv
WHERE upv.id = family_member_id;
RETURN _result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- Function: upsert_partner_member
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION upsert_partner_member(
    partner_id UUID,
    partner_member_id UUID,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    occupation TEXT,
    is_admin BOOLEAN
  ) RETURNS jsonb AS $$
DECLARE _user_profile_id UUID;
_role "Role";
_result jsonb;
BEGIN -- Determine role based on is_admin
IF is_admin THEN _role := 'Partner Admin'::"Role";
ELSE _role := 'Partner Member'::"Role";
END IF;
-- Upsert user_profiles
INSERT INTO user_profiles AS p (
    email,
    first_name,
    last_name,
    phone,
    occupation
  )
VALUES (
    email,
    first_name,
    last_name,
    phone,
    occupation
  ) ON CONFLICT ON CONSTRAINT user_profiles_email_key DO
UPDATE
SET first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  occupation = EXCLUDED.occupation
RETURNING p.id INTO _user_profile_id;
-- Insert user_roles
IF partner_member_id IS NULL THEN
INSERT INTO user_roles (user_profile_id, role)
VALUES (_user_profile_id, _role)
RETURNING id INTO partner_member_id;
END IF;
-- Upsert partner_members
INSERT INTO partner_members (
    id,
    partner_id
  )
VALUES (
    partner_member_id,
    partner_id
  ) ON CONFLICT ON CONSTRAINT partner_members_pkey DO
UPDATE
SET partner_id = EXCLUDED.partner_id;
-- Fetch and return the user_profiles_view record as JSON
SELECT row_to_json(upv.*) INTO _result
FROM user_profiles_view upv
WHERE upv.id = family_member_id;
RETURN _result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- Function: upsert_partner_member
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION insert_partner_member(
    partner_id UUID,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    occupation TEXT,
    role "Role"
) RETURNS jsonb AS $$
DECLARE
  _user_profile_id UUID;
  _user_role_id UUID;
  _result jsonb;
BEGIN
  -- Insert into user_profiles and let the database generate the UUID
  INSERT INTO user_profiles (email, first_name, last_name, phone, occupation)
  VALUES (email, first_name, last_name, phone, occupation)
  RETURNING id INTO _user_profile_id;

  -- Insert into user_roles
  INSERT INTO user_roles (user_profile_id, role)
  VALUES (_user_profile_id, role)
  RETURNING id INTO _user_role_id;

  -- Insert into partner_members
  INSERT INTO partner_members (id, partner_id)
  VALUES (_user_role_id, partner_id);

  -- Fetch and return the user_profiles_view record as JSON
  SELECT row_to_json(upv.*) INTO _result
  FROM user_profiles_view upv
  WHERE upv.id = _user_profile_id;

  RETURN _result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to insert into coach_payments when a family_session is completed, ensuring no duplicates and including family_name and session title in the description
CREATE OR REPLACE FUNCTION public.insert_into_coach_payments()
RETURNS TRIGGER AS $$
DECLARE
    coach_payout_rate NUMERIC;
    existing_payment_count INT;
    session_title TEXT;
    family_name TEXT;
    payment_description TEXT;
BEGIN
    -- Check if the status of the family_session is 'Completed'
    IF NEW.status = 'Completed' THEN
        -- Check if a payment already exists for this coach and session
        SELECT COUNT(*) INTO existing_payment_count
        FROM public.coach_payments
        WHERE coach_id = NEW.coach_id AND session_id = NEW.id;
        
        -- If no existing payment, proceed to insert
        IF existing_payment_count = 0 THEN
            -- Retrieve the payout_rate for the coach, session title, and family name
            SELECT c.payout_rate, s.title, f.family_name INTO coach_payout_rate, session_title, family_name
            FROM public.coaches c
            JOIN public.family_sessions fs ON c.id = NEW.coach_id
            JOIN public.sessions s ON fs.session_id = s.id
            JOIN public.families f ON fs.family_id = f.id
            WHERE fs.id = NEW.id;
            
            -- Prepare the payment description
            payment_description := 'Session completed: ' || session_title || ' with The ' || family_name || ' Family';
            
            -- Insert a new row into coach_payments with the detailed description
            INSERT INTO public.coach_payments (coach_id, amount, description, paid, session_id, stripe_transfer_id)
            VALUES (NEW.coach_id, coach_payout_rate, payment_description, FALSE, NEW.id, NULL); -- Adjust the values accordingly
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to assign an active coach to a new family in a round-robin manner and add a welcome session with "Planned" status
CREATE OR REPLACE FUNCTION assign_coach_and_add_welcome_session() RETURNS TRIGGER AS $$
DECLARE
  active_coaches UUID[];
  last_assigned_coach UUID;
  next_coach_id UUID;
  found_index INT;
  welcome_session_id UUID := 'da42eff9-031e-455f-9ccf-6c0fc98c6f63';
BEGIN
  -- Fetch all active coach IDs into an array
  SELECT array_agg(id ORDER BY id) INTO active_coaches FROM coaches WHERE status = 'Active';

  -- Find the last assigned coach from the most recently created family (excluding the current insertion)
  SELECT assigned_coach_id INTO last_assigned_coach FROM families
  WHERE assigned_coach_id IS NOT NULL AND id <> NEW.id
  ORDER BY created_at DESC LIMIT 1;

  -- Determine the next coach to assign
  IF last_assigned_coach IS NULL THEN
    next_coach_id := active_coaches[1];
  ELSE
    found_index := array_position(active_coaches, last_assigned_coach);
    IF found_index = array_length(active_coaches, 1) THEN
      next_coach_id := active_coaches[1];
    ELSE
      next_coach_id := active_coaches[found_index + 1];
    END IF;
  END IF;

  -- Assign the next coach to the new family
  UPDATE families SET assigned_coach_id = next_coach_id WHERE id = NEW.id;

  -- Insert a welcome session for the new family with status "Planned"
  INSERT INTO family_sessions (family_id, session_id, coach_id, status)
  VALUES (NEW.id, welcome_session_id, next_coach_id, 'Planned');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Adjust the trigger name if necessary to reflect the new functionality
CREATE TRIGGER trigger_assign_coach_and_add_welcome_session
AFTER INSERT ON families
FOR EACH ROW
EXECUTE FUNCTION assign_coach_and_add_welcome_session();

-- -- POLICES FOR RESOURCES
-- -- Policy for Coach or Coach Admin to view all entries
-- CREATE POLICY access_all_resources_for_coaches ON public.resources
-- FOR SELECT USING (public.has_roles(ARRAY['Coach'::"Role", 'Coach Admin'::"Role"]));
-- -- WITH CHECK (public.has_roles(ARRAY['Coach', 'Coach Admin']));

-- -- Policy for Partner or Partner Admin to view all except those targeting "coach"
-- CREATE POLICY access_resources_for_partners ON public.resources
-- FOR SELECT USING (
--   public.has_roles(ARRAY['Partner', 'Partner Admin'])
--   AND NOT ('coach' = ANY(target_roles))
-- );

-- -- Policy for all other roles to view only entries targeting "family"
-- CREATE POLICY access_family_resources_for_others ON public.resources
-- FOR SELECT USING (
--   'family' = ANY(target_roles)
-- );

-- -- Apply default policy to deny access unless explicitly allowed
-- CREATE POLICY default_deny ON public.resources
-- FOR ALL USING (false);

-- ---------------------------------------------------------
--                NEW TABLES
-- ---------------------------------------------------------


-- -------------------
--        ENUMS
-- -------------------

-- CREATE TYPE "FamilyPhraseCategory" AS ENUM (
--   'Motto',
--   'Principle',
--   'Mission Statement'
-- ); 

-- CREATE TYPE "ObituaryExerciseCategory" AS ENUM (
--   'Relationship',
--   'Achievement',
--   'Legacy'
-- ); 

-- -- -------------------
-- --        Tables
-- -- -------------------

-- CREATE TABLE legacy_letters (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   author_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
--   title TEXT NOT NULL,
--   content TEXT,
--   attachment_url TEXT,
--   scheduled_date timestamp with time zone NOT NULL
-- );

-- CREATE TABLE legacy_letter_recipients (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   legacy_letter_id UUID NOT NULL,
--   family_member_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE
-- );

-- CREATE TABLE family_album_images (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
--   title TEXT NOT NULL,
--   description TEXT NOT NULL,
--   attachment_url TEXT
-- ); 

-- CREATE TABLE stories (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   author_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
--   title TEXT NOT NULL,
--   description TEXT NOT NULL,
--   attachment_url TEXT
-- );

-- CREATE TABLE phrases (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   family_member_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
--   phrase TEXT NOT NULL,
--   category FAMILYPHRASECATEGORY NOT NULL
-- );  

-- CREATE TABLE reflections (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
--   reflection TEXT NOT NULL,
--   category OBITUARYEXERCISECATEGORY NOT NULL
-- );

-- -- -----------------------------------------------------------------------------
-- -- TRIGGER: update updated_at and updated_by for new tables
-- -- -----------------------------------------------------------------------------

-- -- legacy_letters

-- CREATE OR REPLACE FUNCTION update_meta_columns() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
-- NEW.updated_by = auth.uid();
-- RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
-- DO $$
-- DECLARE row record;
-- BEGIN FOR row IN (
--   SELECT tablename
--   FROM pg_tables
--   WHERE schemaname = 'public'
-- ) LOOP EXECUTE format(
--   'CREATE OR REPLACE TRIGGER update_legacy_letters_meta_columns BEFORE UPDATE ON public.legacy_letters FOR EACH ROW EXECUTE FUNCTION update_meta_columns()',
--   row.tablename,
--   row.tablename
-- );
-- END LOOP;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- legacy_letter_recipients

-- CREATE OR REPLACE FUNCTION update_meta_columns() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
-- NEW.updated_by = auth.uid();
-- RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
-- DO $$
-- DECLARE row record;
-- BEGIN FOR row IN (
--   SELECT tablename
--   FROM pg_tables
--   WHERE schemaname = 'public'
-- ) LOOP EXECUTE format(
--   'CREATE OR REPLACE TRIGGER update_legacy_letter_recipients_meta_columns BEFORE UPDATE ON public.legacy_letter_recipients FOR EACH ROW EXECUTE FUNCTION update_meta_columns()',
--   row.tablename,
--   row.tablename
-- );
-- END LOOP;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- family_album_images

-- CREATE OR REPLACE FUNCTION update_meta_columns() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
-- NEW.updated_by = auth.uid();
-- RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
-- DO $$
-- DECLARE row record;
-- BEGIN FOR row IN (
--   SELECT tablename
--   FROM pg_tables
--   WHERE schemaname = 'public'
-- ) LOOP EXECUTE format(
--   'CREATE OR REPLACE TRIGGER update_family_album_images_meta_columns BEFORE UPDATE ON public.family_album_images FOR EACH ROW EXECUTE FUNCTION update_meta_columns()',
--   row.tablename,
--   row.tablename
-- );
-- END LOOP;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- stories

-- CREATE OR REPLACE FUNCTION update_meta_columns() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
-- NEW.updated_by = auth.uid();
-- RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
-- DO $$
-- DECLARE row record;
-- BEGIN FOR row IN (
--   SELECT tablename
--   FROM pg_tables
--   WHERE schemaname = 'public'
-- ) LOOP EXECUTE format(
--   'CREATE OR REPLACE TRIGGER update_stories_meta_columns BEFORE UPDATE ON public.stories FOR EACH ROW EXECUTE FUNCTION update_meta_columns()',
--   row.tablename,
--   row.tablename
-- );
-- END LOOP;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- phrases

-- CREATE OR REPLACE FUNCTION update_meta_columns() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
-- NEW.updated_by = auth.uid();
-- RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
-- DO $$
-- DECLARE row record;
-- BEGIN FOR row IN (
--   SELECT tablename
--   FROM pg_tables
--   WHERE schemaname = 'public'
-- ) LOOP EXECUTE format(
--   'CREATE OR REPLACE TRIGGER update_phrases_meta_columns BEFORE UPDATE ON public.phrases FOR EACH ROW EXECUTE FUNCTION update_meta_columns()',
--   row.tablename,
--   row.tablename
-- );
-- END LOOP;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- reflections

-- CREATE OR REPLACE FUNCTION update_meta_columns() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
-- NEW.updated_by = auth.uid();
-- RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
-- DO $$
-- DECLARE row record;
-- BEGIN FOR row IN (
--   SELECT tablename
--   FROM pg_tables
--   WHERE schemaname = 'public'
-- ) LOOP EXECUTE format(
--   'CREATE OR REPLACE TRIGGER update_reflections_meta_columns BEFORE UPDATE ON public.reflections FOR EACH ROW EXECUTE FUNCTION update_meta_columns()',
--   row.tablename,
--   row.tablename
-- );
-- END LOOP;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- --------------------------------------------------------
-- --              RLS POLICIES FOR NEW TABLES 
-- -- --------------------------------------------------------

-- -- Enable RLS for tables
-- ALTER TABLE public.legacy_letters ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.legacy_letter_recipients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.family_album_images ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.phrases ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;


-- -- Policy to allow only authenticated users to access the new tables

-- CREATE POLICY "Authenticated users can access legacy_letters" ON public.legacy_letters
-- FOR ALL
-- TO authenticated
-- USING (auth.uid() IS NOT NULL)
-- WITH CHECK (auth.uid() IS NOT NULL);

-- CREATE POLICY "Admin full access to legacy_letters" ON public.legacy_letters
-- FOR ALL
-- TO authenticated
-- USING (public.has_roles(ARRAY ['Admin'::"Role"]));

-- CREATE POLICY "Authenticated users can access legacy_letter_recipients" ON public.legacy_letter_recipients
-- FOR ALL
-- TO authenticated
-- USING (auth.uid() IS NOT NULL)
-- WITH CHECK (auth.uid() IS NOT NULL);

-- CREATE POLICY "Admin full access to legacy_letter_recipients" ON public.legacy_letter_recipients
-- FOR ALL
-- TO authenticated
-- USING (public.has_roles(ARRAY ['Admin'::"Role"]));

-- CREATE POLICY "Authenticated users can access family_album_images" ON public.family_album_images
-- FOR ALL
-- TO authenticated
-- USING (auth.uid() IS NOT NULL)
-- WITH CHECK (auth.uid() IS NOT NULL);

-- CREATE POLICY "Admin full access to family_album_images" ON public.family_album_images
-- FOR ALL
-- TO authenticated
-- USING (public.has_roles(ARRAY ['Admin'::"Role"]));

-- CREATE POLICY "Authenticated users can access stories" ON public.stories
-- FOR ALL
-- TO authenticated
-- USING (auth.uid() IS NOT NULL)
-- WITH CHECK (auth.uid() IS NOT NULL);

-- CREATE POLICY "Admin full access to stories" ON public.stories
-- FOR ALL
-- TO authenticated
-- USING (public.has_roles(ARRAY ['Admin'::"Role"]));

-- CREATE POLICY "Authenticated users can access phrases" ON public.phrases
-- FOR ALL
-- TO authenticated
-- USING (auth.uid() IS NOT NULL)
-- WITH CHECK (auth.uid() IS NOT NULL);

-- CREATE POLICY "Admin full access to phrases" ON public.phrases
-- FOR ALL
-- TO authenticated
-- USING (public.has_roles(ARRAY ['Admin'::"Role"]));

-- CREATE POLICY "Authenticated users can access reflections" ON public.reflections
-- FOR ALL
-- TO authenticated
-- USING (auth.uid() IS NOT NULL)
-- WITH CHECK (auth.uid() IS NOT NULL);

-- CREATE POLICY "Admin full access to reflections" ON public.reflections
-- FOR ALL
-- TO authenticated
-- USING (public.has_roles(ARRAY ['Admin'::"Role"]));