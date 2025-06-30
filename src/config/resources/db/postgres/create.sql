CREATE TABLE IF NOT EXISTS "user" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vorname TEXT NOT NULL,
  nachname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  geburtsdatum DATE,
  profilbild_url TEXT,
  rolle TEXT NOT NULL DEFAULT 'BEWERBER',
  organisation TEXT,
  erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  aktualisiert_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  username TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS adresse (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  strasse TEXT NOT NULL,
  plz TEXT NOT NULL,
  ort TEXT NOT NULL,
  land TEXT,
  user_id UUID REFERENCES "user"(id) ON DELETE CASCADE
);
