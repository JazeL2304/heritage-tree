-- ========================================================
-- HERITAGE TREE SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Paste this script directly into Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ========================================================

-- 1. Create family_members table
CREATE TABLE IF NOT EXISTS public.family_members (
    id TEXT PRIMARY KEY,
    surname TEXT NOT NULL DEFAULT 'Li',
    given_name TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')) DEFAULT 'male',
    birth_date DATE,
    death_date DATE,
    is_deceased BOOLEAN DEFAULT FALSE,
    photo_url TEXT,
    notes TEXT,
    generation INT DEFAULT 1,
    is_verified BOOLEAN DEFAULT TRUE,
    father_id TEXT REFERENCES public.family_members(id) ON DELETE SET NULL,
    mother_id TEXT REFERENCES public.family_members(id) ON DELETE SET NULL,
    spouse_id TEXT REFERENCES public.family_members(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to family_members" ON public.family_members;
DROP POLICY IF EXISTS "Allow public insert/update/delete to family_members" ON public.family_members;
DROP POLICY IF EXISTS "Allow public all access to family_members" ON public.family_members;

CREATE POLICY "Allow public all access to family_members" 
ON public.family_members FOR ALL 
USING (true) WITH CHECK (true);


-- 2. Create family_archives table
CREATE TABLE IF NOT EXISTS public.family_archives (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'photos',
    date DATE,
    description TEXT,
    image_url TEXT,
    tagged_members TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.family_archives ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all access to family_archives" ON public.family_archives;
CREATE POLICY "Allow public all access to family_archives" 
ON public.family_archives FOR ALL 
USING (true) WITH CHECK (true);


-- 3. Create family_events table
CREATE TABLE IF NOT EXISTS public.family_events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'meeting',
    date DATE,
    time TEXT,
    location TEXT,
    description TEXT,
    organizer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.family_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all access to family_events" ON public.family_events;
CREATE POLICY "Allow public all access to family_events" 
ON public.family_events FOR ALL 
USING (true) WITH CHECK (true);
