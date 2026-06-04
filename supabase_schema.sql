-- ==============================================================================
-- Mahathi Tailor Shop - Supabase Schema Creation Script
-- ==============================================================================

-- 1. Create Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  joined_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  notes TEXT,
  
  -- Sizing variables
  chest NUMERIC DEFAULT 0,
  waist NUMERIC DEFAULT 0,
  blouse_length NUMERIC DEFAULT 0,
  shoulder NUMERIC DEFAULT 0,
  front_neck NUMERIC DEFAULT 0,
  back_neck NUMERIC DEFAULT 0,
  sleeve_length NUMERIC DEFAULT 0,
  sleeve_round NUMERIC DEFAULT 0,
  arm_hole NUMERIC DEFAULT 0
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'designer-blouses', 'ready-made-dresses', 'bridal-collections', 
    'party-wear-dresses', 'kids-dresses', 'ethnic-wear', 
    'aari-work-blouses', 'maggam-work-collections', 'sarees', 'boutique-accessories'
  )),
  price NUMERIC NOT NULL CHECK (price >= 0),
  discount INTEGER DEFAULT 0 CHECK (discount BETWEEN 0 AND 100),
  rating NUMERIC(3,2) DEFAULT 5.00 CHECK (rating BETWEEN 0 AND 5),
  description TEXT,
  image TEXT,
  images TEXT[] DEFAULT '{}'::TEXT[],
  sizes TEXT[] DEFAULT '{}'::TEXT[],
  colors TEXT[] DEFAULT '{}'::TEXT[],
  fabric TEXT,
  delivery_days INTEGER DEFAULT 5,
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  reviews JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  stitching_item TEXT NOT NULL,
  neck_style TEXT,
  sleeve_style TEXT,
  embroidery_style TEXT,
  fabric_notes TEXT,
  cost NUMERIC NOT NULL CHECK (cost >= 0),
  advance_paid NUMERIC DEFAULT 0 CHECK (advance_paid >= 0),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN (
    'Pending', 'Measuring', 'Cutting', 'Embroidery', 'Stitching', 'Trial', 'Completed'
  )),
  order_date DATE DEFAULT current_date NOT NULL,
  due_date DATE,
  staff_assigned TEXT,
  inspiration_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'Bridal Consultation', 'Boutique Visit', 'Home Measurement', 'Trial Appointment'
  )),
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN (
    'Pending', 'Confirmed', 'Completed', 'Cancelled'
  )),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Wishlists Table
CREATE TABLE IF NOT EXISTS public.wishlists (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (user_id, product_id)
);

-- 6. Create Addresses Table
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create Staff Table
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  orders_count INTEGER DEFAULT 0 CHECK (orders_count >= 0),
  active BOOLEAN DEFAULT TRUE NOT NULL
);

-- 8. Create Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  likes INTEGER DEFAULT 0 CHECK (likes >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- Row Level Security (RLS) Configuration
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Allow users to read their own profiles" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  )));

CREATE POLICY "Allow users to update their own profiles" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  )));

-- Products Policies
CREATE POLICY "Allow public read access to products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to products" ON public.products
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Orders Policies
CREATE POLICY "Allow users to view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = customer_id OR (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  )));

CREATE POLICY "Allow users to place orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id OR customer_id IS NULL);

CREATE POLICY "Allow only admin updates on orders" ON public.orders
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Appointments Policies
CREATE POLICY "Allow users to view their own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = user_id OR (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  )));

CREATE POLICY "Allow anyone to schedule an appointment" ON public.appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin/owner updates on appointments" ON public.appointments
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Wishlist & Address Private Policies
CREATE POLICY "Allow users access to their own wishlist" ON public.wishlists
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Allow users access to their own addresses" ON public.addresses
  FOR ALL USING (auth.uid() = user_id);

-- Staff & Gallery Policies
CREATE POLICY "Allow public read access to staff" ON public.staff FOR SELECT USING (true);
CREATE POLICY "Allow admin write access to staff" ON public.staff FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Allow public read access to gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Allow admin write access to gallery" ON public.gallery FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Notifications Policy
CREATE POLICY "Allow only admins access to notifications" ON public.notifications
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- ==============================================================================
-- Triggers and Custom Stored Procedures (RPCs)
-- ==============================================================================

-- 1. Auto-Create Profile on User Signup Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Valued Client'),
    new.email,
    'customer'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Stored Procedure to safely increment gallery likes
CREATE OR REPLACE FUNCTION public.like_gallery_item(item_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.gallery
  SET likes = likes + 1
  WHERE id = item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
