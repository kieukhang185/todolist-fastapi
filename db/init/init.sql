-- Create users table for auth service
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(200) NOT NULL,
    uer_role VARCHAR(100) NOT NULL,
    is_superuser BOOLEAN DEFAULT FALSE
);

-- Insert a superuser (password is just a placeholder hash here!)
INSERT INTO users (username, hashed_password, is_superuser)
VALUES ('admin', '$2b$12$demoSuperSecretHashForTesting', TRUE)
ON CONFLICT (username) DO NOTHING;

-- Create todos table for backend service
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    reporter VARCHAR(100) NOT NULL,
    assign VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- (Optional) Insert a sample todo
INSERT INTO todos (title, description, status, reporter, assign)
VALUES ('Test Todo', 'This is a demo task', 'pending', 'admin', 'admin')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    todo_id INTEGER REFERENCES todos(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a sample comment for the sample todo (assuming id=1)
-- INSERT INTO comments (todo_id, content, author)
-- VALUES
--   (1, 'First comment on this todo!', 'alice'),
--   (1, 'Second comment from bob.', 'bob');
