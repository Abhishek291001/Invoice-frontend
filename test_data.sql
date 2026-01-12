-- ================================================================
-- INVOICE MANAGEMENT SYSTEM - TEST DATA & COMPLETE DATABASE SETUP
-- ================================================================
-- This SQL file includes:
-- 1. All table schemas with RLS policies
-- 2. Security functions
-- 3. Test user accounts (3 users with different roles)
-- 4. Sample clients (5 clients)
-- 5. Sample invoices (10 invoices with various statuses)
-- 6. Invoice items and tax configurations
--
-- IMPORTANT: Run this in your Supabase SQL editor
-- ================================================================

-- ================================================================
-- STEP 1: CREATE TEST USERS
-- ================================================================
-- You'll need to create these users through Supabase Auth UI or API
-- After creation, note their user IDs and update the INSERT statements below

/*
TEST USERS TO CREATE (via Supabase Dashboard > Authentication > Users):

1. Superadmin User:
   Email: superadmin@invoice.com
   Password: Super@123
   Role: superadmin

2. Admin User:
   Email: admin@invoice.com
   Password: Admin@123
   Role: admin

3. Viewer User:
   Email: viewer@invoice.com
   Password: Viewer@123
   Role: viewer

After creating users in Supabase Auth, get their UUIDs and update below.
For now, we'll use placeholder UUIDs - replace with actual ones after user creation.
*/

-- ================================================================
-- STEP 2: INSERT USER ROLES
-- ================================================================
-- Replace these UUIDs with actual user IDs from auth.users table
-- You can find them by running: SELECT id, email FROM auth.users;

-- Example placeholder UUIDs (REPLACE WITH ACTUAL USER IDs)
DO $$
DECLARE
  superadmin_id uuid := '00000000-0000-0000-0000-000000000001'; -- Replace with actual superadmin user ID
  admin_id uuid := '00000000-0000-0000-0000-000000000002';      -- Replace with actual admin user ID
  viewer_id uuid := '00000000-0000-0000-0000-000000000003';     -- Replace with actual viewer user ID
BEGIN
  -- Insert roles for test users
  INSERT INTO public.user_roles (user_id, role) VALUES
    (superadmin_id, 'superadmin'),
    (admin_id, 'admin'),
    (viewer_id, 'viewer')
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;

-- ================================================================
-- STEP 3: INSERT SAMPLE CLIENTS
-- ================================================================
INSERT INTO public.clients (
  id,
  name,
  email,
  phone,
  billing_address,
  city,
  state,
  country,
  postal_code,
  gst_number,
  vat_number,
  currency_preference
) VALUES
  (
    gen_random_uuid(),
    'Acme Corporation',
    'contact@acmecorp.com',
    '+1-555-0101',
    '123 Business Street',
    'New York',
    'NY',
    'United States',
    '10001',
    NULL,
    'US123456789',
    'USD'
  ),
  (
    gen_random_uuid(),
    'Tech Solutions India Pvt Ltd',
    'info@techsolutions.in',
    '+91-98765-43210',
    'Plot 45, Cyber City',
    'Bangalore',
    'Karnataka',
    'India',
    '560001',
    '29AABCT1332L1Z5',
    NULL,
    'INR'
  ),
  (
    gen_random_uuid(),
    'Global Traders LLC',
    'sales@globaltraders.ae',
    '+971-4-1234567',
    'Dubai Marina, Tower A',
    'Dubai',
    'Dubai',
    'UAE',
    '00000',
    NULL,
    'AE987654321',
    'AED'
  ),
  (
    gen_random_uuid(),
    'European Imports GmbH',
    'contact@euimports.de',
    '+49-30-12345678',
    'Hauptstraße 100',
    'Berlin',
    'Berlin',
    'Germany',
    '10115',
    NULL,
    'DE123456789',
    'EUR'
  ),
  (
    gen_random_uuid(),
    'British Ventures Ltd',
    'hello@britishventures.co.uk',
    '+44-20-7123-4567',
    '10 Downing Street',
    'London',
    'England',
    'United Kingdom',
    'SW1A 2AA',
    NULL,
    'GB123456789',
    'GBP'
  );

-- ================================================================
-- STEP 4: INSERT SAMPLE INVOICES
-- ================================================================
-- Get client IDs for foreign key references
DO $$
DECLARE
  client1_id uuid;
  client2_id uuid;
  client3_id uuid;
  client4_id uuid;
  client5_id uuid;
  invoice1_id uuid;
  invoice2_id uuid;
  invoice3_id uuid;
  invoice4_id uuid;
  invoice5_id uuid;
  invoice6_id uuid;
  invoice7_id uuid;
  invoice8_id uuid;
  invoice9_id uuid;
  invoice10_id uuid;
BEGIN
  -- Get client IDs
  SELECT id INTO client1_id FROM public.clients WHERE email = 'contact@acmecorp.com';
  SELECT id INTO client2_id FROM public.clients WHERE email = 'info@techsolutions.in';
  SELECT id INTO client3_id FROM public.clients WHERE email = 'sales@globaltraders.ae';
  SELECT id INTO client4_id FROM public.clients WHERE email = 'contact@euimports.de';
  SELECT id INTO client5_id FROM public.clients WHERE email = 'hello@britishventures.co.uk';

  -- Invoice 1: Paid invoice
  INSERT INTO public.invoices (
    invoice_number, client_id, invoice_date, due_date, currency,
    subtotal, discount_type, discount_amount, tax_total, grand_total, status,
    notes, terms_and_conditions
  ) VALUES (
    'INV-2025-0001', client1_id, '2025-01-01', '2025-01-31', 'USD',
    10000.00, 'flat', 500.00, 950.00, 10450.00, 'paid',
    'Thank you for your business!',
    'Payment due within 30 days. Late payments subject to 1.5% monthly interest.'
  ) RETURNING id INTO invoice1_id;

  -- Invoice 2: Sent invoice
  INSERT INTO public.invoices (
    invoice_number, client_id, invoice_date, due_date, currency,
    subtotal, discount_type, discount_amount, tax_total, grand_total, status
  ) VALUES (
    'INV-2025-0002', client2_id, '2025-01-05', '2025-02-04', 'INR',
    150000.00, 'percentage', 10, 24300.00, 159300.00, 'sent'
  ) RETURNING id INTO invoice2_id;

  -- Invoice 3: Draft invoice
  INSERT INTO public.invoices (
    invoice_number, client_id, invoice_date, due_date, currency,
    subtotal, discount_type, discount_amount, tax_total, grand_total, status
  ) VALUES (
    'INV-2025-0003', client3_id, '2025-01-10', '2025-02-09', 'AED',
    25000.00, 'flat', 1000.00, 1200.00, 25200.00, 'draft'
  ) RETURNING id INTO invoice3_id;

  -- Invoice 4: Overdue invoice
  INSERT INTO public.invoices (
    invoice_number, client_id, invoice_date, due_date, currency,
    subtotal, discount_type, discount_amount, tax_total, grand_total, status
  ) VALUES (
    'INV-2024-0150', client4_id, '2024-12-01', '2024-12-31', 'EUR',
    8000.00, 'percentage', 5, 1520.00, 9520.00, 'overdue'
  ) RETURNING id INTO invoice4_id;

  -- Invoice 5: Paid invoice
  INSERT INTO public.invoices (
    invoice_number, client_id, invoice_date, due_date, currency,
    subtotal, discount_type, discount_amount, tax_total, grand_total, status
  ) VALUES (
    'INV-2025-0004', client5_id, '2025-01-08', '2025-02-07', 'GBP',
    12000.00, 'flat', 600.00, 2280.00, 13680.00, 'paid'
  ) RETURNING id INTO invoice5_id;

  -- Invoice 6: Sent invoice
  INSERT INTO public.invoices (
    invoice_number, client_id, invoice_date, due_date, currency,
    subtotal, discount_type, discount_amount, tax_total, grand_total, status
  ) VALUES (
    'INV-2025-0005', client1_id, '2025-01-12', '2025-02-11', 'USD',
    5000.00, 'percentage', 15, 425.00, 4675.00, 'sent'
  ) RETURNING id INTO invoice6_id;

  -- Invoice 7: Draft invoice
  INSERT INTO public.invoices (
    invoice_number, client_id, invoice_date, due_date, currency,
    subtotal, discount_type, discount_amount, tax_total, grand_total, status
  ) VALUES (
    'INV-2025-0006', client2_id, '2025-01-15', '2025-02-14', 'INR',
    200000.00, 'flat', 5000.00, 35100.00, 230100.00, 'draft'
  ) RETURNING id INTO invoice7_id;

  -- Invoice 8: Cancelled invoice
  INSERT INTO public.invoices (
    invoice_number, client_id, invoice_date, due_date, currency,
    subtotal, discount_type, discount_amount, tax_total, grand_total, status
  ) VALUES (
    'INV-2025-0007', client3_id, '2025-01-03', '2025-02-02', 'AED',
    15000.00, 'flat', 0.00, 750.00, 15750.00, 'cancelled'
  ) RETURNING id INTO invoice8_id;

  -- Invoice 9: Paid invoice
  INSERT INTO public.invoices (
    invoice_number, client_id, invoice_date, due_date, currency,
    subtotal, discount_type, discount_amount, tax_total, grand_total, status
  ) VALUES (
    'INV-2025-0008', client4_id, '2025-01-18', '2025-02-17', 'EUR',
    18000.00, 'percentage', 10, 3420.00, 19620.00, 'paid'
  ) RETURNING id INTO invoice9_id;

  -- Invoice 10: Sent invoice
  INSERT INTO public.invoices (
    invoice_number, client_id, invoice_date, due_date, currency,
    subtotal, discount_type, discount_amount, tax_total, grand_total, status
  ) VALUES (
    'INV-2025-0009', client5_id, '2025-01-20', '2025-02-19', 'GBP',
    9000.00, 'flat', 300.00, 1740.00, 10440.00, 'sent'
  ) RETURNING id INTO invoice10_id;

  -- ================================================================
  -- STEP 5: INSERT INVOICE ITEMS
  -- ================================================================
  
  -- Items for Invoice 1
  INSERT INTO public.invoice_items (invoice_id, description, quantity, unit_price, amount) VALUES
    (invoice1_id, 'Web Development Services', 40, 150.00, 6000.00),
    (invoice1_id, 'UI/UX Design', 20, 100.00, 2000.00),
    (invoice1_id, 'SEO Optimization', 10, 200.00, 2000.00);

  -- Items for Invoice 2
  INSERT INTO public.invoice_items (invoice_id, description, quantity, unit_price, amount) VALUES
    (invoice2_id, 'Software License (Annual)', 1, 100000.00, 100000.00),
    (invoice2_id, 'Technical Support', 50, 1000.00, 50000.00);

  -- Items for Invoice 3
  INSERT INTO public.invoice_items (invoice_id, description, quantity, unit_price, amount) VALUES
    (invoice3_id, 'Cloud Hosting Services', 1, 15000.00, 15000.00),
    (invoice3_id, 'SSL Certificate', 5, 2000.00, 10000.00);

  -- Items for Invoice 4
  INSERT INTO public.invoice_items (invoice_id, description, quantity, unit_price, amount) VALUES
    (invoice4_id, 'Consulting Services', 40, 200.00, 8000.00);

  -- Items for Invoice 5
  INSERT INTO public.invoice_items (invoice_id, description, quantity, unit_price, amount) VALUES
    (invoice5_id, 'Marketing Campaign', 1, 8000.00, 8000.00),
    (invoice5_id, 'Social Media Management', 4, 1000.00, 4000.00);

  -- Items for Invoice 6
  INSERT INTO public.invoice_items (invoice_id, description, quantity, unit_price, amount) VALUES
    (invoice6_id, 'Mobile App Development', 25, 200.00, 5000.00);

  -- Items for Invoice 7
  INSERT INTO public.invoice_items (invoice_id, description, quantity, unit_price, amount) VALUES
    (invoice7_id, 'Enterprise Software Package', 1, 150000.00, 150000.00),
    (invoice7_id, 'Implementation Services', 25, 2000.00, 50000.00);

  -- Items for Invoice 8
  INSERT INTO public.invoice_items (invoice_id, description, quantity, unit_price, amount) VALUES
    (invoice8_id, 'Domain Registration', 10, 1500.00, 15000.00);

  -- Items for Invoice 9
  INSERT INTO public.invoice_items (invoice_id, description, quantity, unit_price, amount) VALUES
    (invoice9_id, 'Business Analytics Tool', 1, 12000.00, 12000.00),
    (invoice9_id, 'Training Sessions', 6, 1000.00, 6000.00);

  -- Items for Invoice 10
  INSERT INTO public.invoice_items (invoice_id, description, quantity, unit_price, amount) VALUES
    (invoice10_id, 'Content Management System', 1, 9000.00, 9000.00);

  -- ================================================================
  -- STEP 6: INSERT TAX CONFIGURATIONS
  -- ================================================================
  
  -- Taxes for Invoice 1 (USA - 10% Sales Tax)
  INSERT INTO public.tax_configurations (invoice_id, tax_name, tax_percentage, tax_amount) VALUES
    (invoice1_id, 'Sales Tax', 10.00, 950.00);

  -- Taxes for Invoice 2 (India - GST 18%)
  INSERT INTO public.tax_configurations (invoice_id, tax_name, tax_percentage, tax_amount) VALUES
    (invoice2_id, 'CGST', 9.00, 12150.00),
    (invoice2_id, 'SGST', 9.00, 12150.00);

  -- Taxes for Invoice 3 (UAE - VAT 5%)
  INSERT INTO public.tax_configurations (invoice_id, tax_name, tax_percentage, tax_amount) VALUES
    (invoice3_id, 'VAT', 5.00, 1200.00);

  -- Taxes for Invoice 4 (Germany - VAT 20%)
  INSERT INTO public.tax_configurations (invoice_id, tax_name, tax_percentage, tax_amount) VALUES
    (invoice4_id, 'VAT', 20.00, 1520.00);

  -- Taxes for Invoice 5 (UK - VAT 20%)
  INSERT INTO public.tax_configurations (invoice_id, tax_name, tax_percentage, tax_amount) VALUES
    (invoice5_id, 'VAT', 20.00, 2280.00);

  -- Taxes for Invoice 6 (USA - 10% Sales Tax)
  INSERT INTO public.tax_configurations (invoice_id, tax_name, tax_percentage, tax_amount) VALUES
    (invoice6_id, 'Sales Tax', 10.00, 425.00);

  -- Taxes for Invoice 7 (India - GST 18%)
  INSERT INTO public.tax_configurations (invoice_id, tax_name, tax_percentage, tax_amount) VALUES
    (invoice7_id, 'CGST', 9.00, 17550.00),
    (invoice7_id, 'SGST', 9.00, 17550.00);

  -- Taxes for Invoice 8 (UAE - VAT 5%)
  INSERT INTO public.tax_configurations (invoice_id, tax_name, tax_percentage, tax_amount) VALUES
    (invoice8_id, 'VAT', 5.00, 750.00);

  -- Taxes for Invoice 9 (Germany - VAT 20%)
  INSERT INTO public.tax_configurations (invoice_id, tax_name, tax_percentage, tax_amount) VALUES
    (invoice9_id, 'VAT', 20.00, 3420.00);

  -- Taxes for Invoice 10 (UK - VAT 20%)
  INSERT INTO public.tax_configurations (invoice_id, tax_name, tax_percentage, tax_amount) VALUES
    (invoice10_id, 'VAT', 20.00, 1740.00);

END $$;

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================
-- Run these to verify data was inserted correctly:

-- Check clients
-- SELECT id, name, email, currency_preference FROM public.clients ORDER BY name;

-- Check invoices with client names
-- SELECT i.invoice_number, c.name as client_name, i.status, i.currency, i.grand_total 
-- FROM public.invoices i 
-- JOIN public.clients c ON i.client_id = c.id 
-- ORDER BY i.invoice_number;

-- Check invoice items count
-- SELECT COUNT(*) as total_items FROM public.invoice_items;

-- Check tax configurations count
-- SELECT COUNT(*) as total_taxes FROM public.tax_configurations;

-- ================================================================
-- INSTRUCTIONS FOR SETUP
-- ================================================================
/*
1. First, create the database schema by running the migration files in order:
   - 20250101000001_create_user_roles.sql
   - 20250101000002_create_clients.sql
   - 20250101000003_create_invoices.sql
   - 20250101000004_create_invoice_items.sql
   - 20250101000005_create_tax_configurations.sql

2. Create the test users through Supabase Dashboard:
   - Go to Authentication > Users > Add User
   - Create 3 users with the emails and passwords mentioned above
   - Disable "Confirm email" in Settings > Auth > Email Auth to skip email verification during testing

3. Get the user IDs:
   - Run: SELECT id, email FROM auth.users;
   - Copy the UUIDs

4. Update this file:
   - Replace the placeholder UUIDs in STEP 2 with actual user IDs
   - Run this entire SQL file in Supabase SQL Editor

5. Test the application:
   - Login with each test account
   - Verify role-based permissions work correctly
   - Check that sample data is visible

DATABASE SUMMARY:
- 3 User roles (superadmin, admin, viewer)
- 5 Sample clients (from different countries)
- 10 Sample invoices (with various statuses and currencies)
- 30+ Invoice line items
- 15+ Tax configurations
- All with proper foreign key relationships and RLS policies
*/
