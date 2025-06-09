CREATE SCHEMA IF NOT EXISTS user_schema AUTHORIZATION user_db_user;

ALTER ROLE user_db_user SET search_path = 'user_schema';