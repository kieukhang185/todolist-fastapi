-- Create todo_types table with name as primary key
CREATE TABLE IF NOT EXISTS todo_types (
    name VARCHAR(100) PRIMARY KEY,
    description TEXT
);

-- Insert default types (safe if already present)
INSERT INTO todo_types (name, description) VALUES
  ('task', 'Standard task'),
  ('sub-task', 'A sub-task'),
  ('bug', 'Bug or defect'),
  ('epic', 'Epic/large feature')
ON CONFLICT (name) DO NOTHING;

-- Create todos table, referencing todo_types by name
CREATE TABLE IF NOT EXISTS todos (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    reporter VARCHAR(100) NOT NULL,
    assign VARCHAR(100),
    type_name VARCHAR(100) NOT NULL REFERENCES todo_types(name),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create comments table, referencing todos by id
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    todo_id VARCHAR(100) REFERENCES todos(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- (Optional) Insert a sample todo
INSERT INTO todos (id, title, description, status, reporter, assign, type_name)
VALUES ('task-1', 'Test Todo', 'This is a demo task', 'pending', 'admin', 'admin', 'task')
ON CONFLICT (id) DO NOTHING;

-- (Optional) Insert a sample comment
INSERT INTO comments (todo_id, content, author)
VALUES ('task-1', 'First comment on this todo!', 'alice');