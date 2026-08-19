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

-- Enable Row Level Security (RLS)
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- 2. Create public access policies for family members
CREATE POLICY "Allow public read access to family_members" 
ON public.family_members FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert/update/delete to family_members" 
ON public.family_members FOR ALL 
USING (true);

-- 3. Insert Initial Seed Data (Optional sample family tree)
INSERT INTO public.family_members (id, surname, given_name, gender, birth_date, is_deceased, generation, is_verified, photo_url, notes)
VALUES
  ('m_patriarch', 'Li', 'Jianhua', 'male', '1960-03-15', FALSE, 1, TRUE, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Senior Scholar of the Imperial Lineage'),
  ('m_matriarch', 'Wang', 'Xiu Ying', 'female', '1962-08-22', FALSE, 1, TRUE, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 'Archival Custodian'),
  ('m_subject', 'Li', 'Wei', 'male', '1994-04-07', FALSE, 2, TRUE, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Head of Branch (Gen 2)'),
  ('m_spouse', 'Chen', 'Ting', 'female', '1995-02-18', FALSE, 2, TRUE, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 'Partner in Lineage Record')
ON CONFLICT (id) DO NOTHING;

-- Link relationships for initial seed data
UPDATE public.family_members SET spouse_id = 'm_matriarch' WHERE id = 'm_patriarch';
UPDATE public.family_members SET spouse_id = 'm_patriarch' WHERE id = 'm_matriarch';
UPDATE public.family_members SET father_id = 'm_patriarch', mother_id = 'm_matriarch', spouse_id = 'm_spouse' WHERE id = 'm_subject';
UPDATE public.family_members SET spouse_id = 'm_subject' WHERE id = 'm_spouse';
