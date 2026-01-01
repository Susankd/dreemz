-- Dreemz Database Schema

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    content_url TEXT NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Viewed Posts (The core of the logic)
CREATE TABLE IF NOT EXISTS user_viewed_posts (
    user_id INTEGER REFERENCES users(id),
    post_id INTEGER REFERENCES posts(id),
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, post_id)
);

-- 4. User Feed State
CREATE TABLE IF NOT EXISTS user_feed_state (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    cycle_version INTEGER DEFAULT 0,
    last_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Devices
CREATE TABLE IF NOT EXISTS devices (
    user_id INTEGER REFERENCES users(id),
    fcm_token TEXT NOT NULL,
    platform VARCHAR(20) DEFAULT 'ios',
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (user_id, fcm_token)
);


-- Users
INSERT INTO users (username, timezone, last_active_at) VALUES
('alice', 'America/New_York', NOW()),
('bob', 'Europe/London', NOW()),
('active_charlie', 'Asia/Tokyo', NOW()),
('inactive_dave', 'America/Los_Angeles', NOW() - INTERVAL '2 days')
ON CONFLICT (username) DO NOTHING;

-- Posts (Generate 20 dummy posts)
INSERT INTO posts (content_url, category) 
SELECT 
    'https://cdn.dreemz.io/v/' || i || '.mp4', 
    CASE WHEN i % 2 = 0 THEN 'comedy' ELSE 'lifestyle' END
FROM generate_series(1, 20) AS i
ON CONFLICT DO NOTHING;
