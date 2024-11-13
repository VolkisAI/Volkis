### Database Layout
We are using hte updated supabase/ssr If you need to, please read the @Web @https://supabase.com/docs/guides/auth/server-side @https://supabase.com/docs/guides/auth/server-side/nextjs We are migrating from auth helpers to ssr, the details are here: @https://supabase.com/docs/guides/auth/server-side/migrating-to-ssr-from-auth-helpers

we use the app router for the supabase/ssr package.
Database Schema
├── auth.users (existing table)
│
├── profiles
│   └── id (PK, references auth.users(id))
│   └── tiktok_account_id
│   └── tiktok_auth_data
│
├── tiktok_auth
│   └── user_id (PK, references auth.users(id))
│   └── tiktok_account_id
│   └── access_token
│   └── refresh_token
│   └── expires_at
│   └── created_at
│
├── source_files
│   └── id (PK)
│   └── user_id (references auth.users(id))
│   └── file_path
│   └── file_type ('image' or 'video')
│   └── uploaded_at
│
├── media_sessions
│   └── id (PK)
│   └── user_id (references auth.users(id))
│   └── started_at
│   └── is_active
│   └── frequency
│   └── created_per_day
│   └── last_run_at
│   └── max_per_day
│
├── session_media_items
│   └── id (PK)
│   └── session_id (references media_sessions(id))
│   └── source_file_id (references source_files(id))
│   └── position
│   └── generated_caption
│   └── processed_file_path
│   └── media_type ('image' or 'video')
│
└── user_settings (optional)
    └── user_id (PK, references auth.users(id))
    └── preference


### Database Description
#### profiles

Purpose: Stores additional user information linked to auth.users.
Fields:
id: Primary key, references auth.users(id).
tiktok_account_id: TikTok account identifier.
tiktok_auth_data: JSON field to store additional TikTok data (non-sensitive).

#### tiktok_auth
Purpose: Securely stores TikTok authentication tokens and related data.
Fields:
user_id: Primary key, references auth.users(id).
tiktok_account_id: TikTok account identifier.
access_token: TikTok access token.
refresh_token: TikTok refresh token.
expires_at: Token expiry timestamp.
created_at: Record creation timestamp.
Security Consideration: Sensitive tokens are stored here. Ensure access is properly secured with RLS policies.

#### source_files
Purpose: Stores uploaded source files (both images and videos) for each user.
Fields:
id: Primary key, unique identifier for the file.
user_id: References the user who uploaded the file.
file_path: Path or URL to the stored file.
file_type: Indicates whether the file is an 'image' or 'video'.
uploaded_at: Timestamp of when the file was uploaded.

#### media_sessions
Purpose: Represents content creation sessions where users can schedule the generation of slide groups.
Fields:
id: Primary key, unique identifier for the session.
user_id: References the user who owns the session.
started_at: Timestamp when the session was created.
is_active: Indicates if the session is currently active.
frequency: How many slide groups to create per day (user-defined).
created_per_day: Tracks how many slide groups have been created today.
last_run_at: Timestamp of the last time slides were generated.
max_per_day: Maximum number of creations allowed per day.
Notes: Users can have multiple sessions but only one active at a time.

#### session_media_items
Purpose: Associates media files and captions with a session.
Fields:
id: Primary key.
session_id: References the associated media_sessions.
source_file_id: References the original source file.
position: Ordering of the media within the session.
generated_caption: Caption text generated for this media item.
processed_file_path: Path to the processed media file (e.g., image with overlaid text).
media_type: Indicates whether the media is an 'image' or 'video'.

#### user_settings (Optional)
Purpose: Stores additional user preferences, if needed.
Fields:
user_id: Primary key, references auth.users(id).
preference: JSONB field to store various settings.


### Database SQL:

-- Enable the uuid-ossp extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  tiktok_account_id VARCHAR,
  tiktok_auth_data JSONB
);

CREATE TABLE source_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT CHECK (file_type IN ('image', 'video')) NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE media_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  frequency INTEGER,
  created_per_day INTEGER DEFAULT 0,
  last_run_at TIMESTAMP WITH TIME ZONE,
  max_per_day INTEGER,
  CHECK (frequency > 0)
);

CREATE TABLE session_media_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES media_sessions(id) NOT NULL,
  source_file_id UUID REFERENCES source_files(id),
  position INTEGER,
  generated_caption TEXT,
  processed_file_path TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video')) NOT NULL
);

CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  preference JSONB
);

CREATE TABLE tiktok_auth (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  tiktok_account_id VARCHAR,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiktok_auth ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only access their own profile"
ON profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can only access their own source files"
ON source_files FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own media sessions"
ON media_sessions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own session media items"
ON session_media_items FOR ALL USING (auth.uid() = (SELECT user_id FROM media_sessions WHERE id = session_id));

CREATE POLICY "Users can only access their own settings"
ON user_settings FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own TikTok auth data"
ON tiktok_auth FOR ALL USING (auth.uid() = user_id);

-- Grant usage on these tables to the authenticated role
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON source_files TO authenticated;
GRANT ALL ON media_sessions TO authenticated;
GRANT ALL ON session_media_items TO authenticated;
GRANT ALL ON user_settings TO authenticated;
GRANT ALL ON tiktok_auth TO authenticated;

We added in these additional permisisons:
ALTER TABLE session_media_items
ADD CONSTRAINT session_media_items_unique_constraint
UNIQUE (session_id, source_file_id, position);

We created an exports bucket to place the resulting media items in.
-- Create the "Exports" bucket
INSERT INTO storage.buckets (id, name)
VALUES ('Exports', 'Exports');

-- Enable Row Level Security (RLS) on the bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow authenticated users to upload files to their own folder
CREATE POLICY "Allow users to upload exports"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'Exports' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create a policy to allow authenticated users to read their own files
CREATE POLICY "Allow users to read their exports"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'Exports' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create a policy to allow authenticated users to update their own files
CREATE POLICY "Allow users to update their exports"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'Exports' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create a policy to allow authenticated users to delete their own files
CREATE POLICY "Allow users to delete their exports"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'Exports' AND
  auth.uid()::text = (storage.foldername(name))[1]
);


Added the 'exported_video_path' column is missing from your 'media_sessions' table. :

   ALTER TABLE media_sessions ADD COLUMN exported_video_path TEXT;
### Mapping Endpoints to Database Tables

#### app/api/upload-source-images/route.js
Purpose: Handles uploading of source files.
Database Interaction:
Inserts new records into the source_files table with user_id, file_path, and file_type.

#### app/api/select-images/route.js
Purpose: Allows users to select source files for processing.
Database Interaction:
Retrieves records from source_files where user_id matches the logged-in user.
May also update session information in media_sessions and create entries in session_media_items.

#### app/api/create-video/route.js
Purpose: Processes selected media to create videos or slideshows.
Database Interaction:
May read from session_media_items to get the media items and captions.
Updates processed_file_path in session_media_items once processing is complete.
Updates last_run_at and created_per_day in media_sessions.

#### Additional Notes
User Sessions and Scheduling:
Users can create new sessions (media_sessions) and set parameters like frequency.
The app should enforce that only one session can be active at a time per user, possibly at the application logic level.
Security and Data Access:
RLS policies ensure that each user only interacts with their own data.
Sensitive data like TikTok tokens are stored securely in the tiktok_auth table.
Consider additional security measures like encryption for storing tokens.