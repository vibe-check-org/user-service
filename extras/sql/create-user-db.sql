CREATE ROLE user_db_user LOGIN PASSWORD 'VibeCheck10.05.2025';

CREATE DATABASE user_db;

GRANT ALL ON DATABASE user_db TO user_db_user;

CREATE TABLESPACE userspace OWNER user_db_user LOCATION '/var/lib/postgresql/tablespace/user';