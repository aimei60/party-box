CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    currency CHAR(3) DEFAULT 'GBP',
    active BOOLEAN DEFAULT TRUE,
    etsy_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by_admin_id INTEGER REFERENCES admins(id),
    updated_by_admin_id INTEGER REFERENCES admins(id)
);

CREATE TABLE IF NOT EXISTS product_images (
    iD SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INTEGER NOT NULL,
    is_primary BOOLEAN,
    created_at TIMESTAMP DEFAULT NOW()
);

