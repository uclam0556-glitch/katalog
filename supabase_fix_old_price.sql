-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Add 'oldPrice' column if it doesn't exist
-- We use quoted identifier "oldPrice" to match the JavaScript camelCase property exactly.
-- This ensures Supabase finds the column when we send { oldPrice: 123 }.

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS "oldPrice" NUMERIC;

-- 2. Also ensure 'price' is numeric (just in case)
-- ALTER TABLE products ALTER COLUMN price TYPE NUMERIC;
