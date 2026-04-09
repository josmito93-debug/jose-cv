-- El Creador: Content Engine Database Schema

-- Table to store managed clients (synchronizable with Airtable)
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    business_type TEXT,
    brand_voice TEXT, -- Detailed description of tone/personality
    brief TEXT, -- The business/project brief
    brand_colors TEXT, -- JSON or string of brand colors
    address TEXT, -- Business address
    viral_links JSONB, -- Array of viral video links for inspiration
    drive_folder_id TEXT, -- Connection to Google Drive assets
    notion_db_id TEXT, -- Connection to Notion knowledge base
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table to store content assets (images/videos from vision processing)
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id),
    url TEXT NOT NULL,
    type TEXT, -- 'IMAGE', 'VIDEO', 'REEL'
    vision_description TEXT, -- Output from AI computer vision
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table to store generated social media posts
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id),
    asset_id UUID REFERENCES assets(id),
    platform TEXT, -- 'INSTAGRAM', 'FACEBOOK', 'TIKTOK'
    copy_variants JSONB, -- Array of 3 copy options
    selected_copy TEXT,
    status TEXT DEFAULT 'DRAFT', -- 'DRAFT', 'SCHEDULED', 'PUBLISHED'
    scheduled_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table to store platform-specific KPIs for analytics
CREATE TABLE post_kpis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id),
    platform TEXT,
    reach INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    tracked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for agent feedback/training
CREATE TABLE agent_training (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id),
    feedback_type TEXT, -- 'STYLE_UP', 'STYLE_DOWN'
    reference_post_id UUID REFERENCES posts(id),
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
