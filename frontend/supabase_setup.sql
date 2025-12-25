-- 1. Create Resumes Table
CREATE TABLE IF NOT EXISTS resumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    content JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Allow users to view only their own resumes
CREATE POLICY "Users can view their own resumes" 
ON resumes FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to insert their own resumes
CREATE POLICY "Users can insert their own resumes" 
ON resumes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own resumes
CREATE POLICY "Users can update their own resumes" 
ON resumes FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow users to delete their own resumes
CREATE POLICY "Users can delete their own resumes" 
ON resumes FOR DELETE 
USING (auth.uid() = user_id);

-- 4. Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
