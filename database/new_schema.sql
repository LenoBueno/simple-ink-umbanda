-- MySQL Database Setup for Simple Ink Umbanda (Schema Atualizado)

-- Create the database
CREATE DATABASE IF NOT EXISTS simple_ink_umbanda CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE simple_ink_umbanda;

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS usuarios (
  id VARCHAR(36) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor', 'usuario') NOT NULL DEFAULT 'usuario',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL
);

-- Create historia table
CREATE TABLE IF NOT EXISTS historia (
  id VARCHAR(36) PRIMARY KEY,
  conteudo TEXT NOT NULL,
  autor_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Create playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id VARCHAR(36) PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  subtitulo VARCHAR(255),
  imagem_url VARCHAR(2048) NOT NULL,
  compositor VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  autor_id VARCHAR(36),
  num_pontos INT DEFAULT 0,
  num_followers INT DEFAULT 0,
  num_downloads INT DEFAULT 0,
  FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Create pontos table
CREATE TABLE IF NOT EXISTS pontos (
  id VARCHAR(36) PRIMARY KEY,
  playlist_id VARCHAR(36),
  titulo VARCHAR(255) NOT NULL,
  compositor VARCHAR(255) NOT NULL,
  audio_url VARCHAR(2048) NOT NULL,
  letra TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  autor_id VARCHAR(36),
  FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE SET NULL,
  FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Create comentarios table for user comments on pontos
CREATE TABLE IF NOT EXISTS comentarios (
  id VARCHAR(36) PRIMARY KEY,
  ponto_id VARCHAR(36) NOT NULL,
  usuario_id VARCHAR(36) NOT NULL,
  conteudo TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ponto_id) REFERENCES pontos(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Create favoritos table to track user favorites
CREATE TABLE IF NOT EXISTS favoritos (
  id VARCHAR(36) PRIMARY KEY,
  usuario_id VARCHAR(36) NOT NULL,
  playlist_id VARCHAR(36),
  ponto_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
  FOREIGN KEY (ponto_id) REFERENCES pontos(id) ON DELETE CASCADE,
  CONSTRAINT chk_favorito_tipo CHECK (playlist_id IS NOT NULL OR ponto_id IS NOT NULL),
  CONSTRAINT unq_favorito UNIQUE(usuario_id, playlist_id, ponto_id)
);

-- Create indexes for better performance
CREATE INDEX idx_pontos_playlist_id ON pontos(playlist_id);
CREATE INDEX idx_playlists_titulo ON playlists(titulo);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_comentarios_ponto_id ON comentarios(ponto_id);
CREATE INDEX idx_favoritos_usuario_id ON favoritos(usuario_id);

-- Create a trigger to update num_pontos in playlists when a ponto is added
DELIMITER //
CREATE TRIGGER after_ponto_insert
AFTER INSERT ON pontos
FOR EACH ROW
BEGIN
  IF NEW.playlist_id IS NOT NULL THEN
    UPDATE playlists
    SET num_pontos = (SELECT COUNT(*) FROM pontos WHERE playlist_id = NEW.playlist_id)
    WHERE id = NEW.playlist_id;
  END IF;
END //

-- Create a trigger to update num_pontos in playlists when a ponto is deleted
CREATE TRIGGER after_ponto_delete
AFTER DELETE ON pontos
FOR EACH ROW
BEGIN
  IF OLD.playlist_id IS NOT NULL THEN
    UPDATE playlists
    SET num_pontos = (SELECT COUNT(*) FROM pontos WHERE playlist_id = OLD.playlist_id)
    WHERE id = OLD.playlist_id;
  END IF;
END //

-- Create a trigger to update num_pontos in playlists when a ponto's playlist_id is updated
CREATE TRIGGER after_ponto_update
AFTER UPDATE ON pontos
FOR EACH ROW
BEGIN
  IF OLD.playlist_id IS NOT NULL THEN
    UPDATE playlists
    SET num_pontos = (SELECT COUNT(*) FROM pontos WHERE playlist_id = OLD.playlist_id)
    WHERE id = OLD.playlist_id;
  END IF;
  
  IF NEW.playlist_id IS NOT NULL AND (OLD.playlist_id IS NULL OR OLD.playlist_id != NEW.playlist_id) THEN
    UPDATE playlists
    SET num_pontos = (SELECT COUNT(*) FROM pontos WHERE playlist_id = NEW.playlist_id)
    WHERE id = NEW.playlist_id;
  END IF;
END //
DELIMITER ;

-- Insert a default admin user
INSERT INTO usuarios (id, nome, email, senha, role) 
VALUES (UUID(), 'Administrador', 'admin@simpleinkumbanda.com', '$2a$12$1InE3SxRGRPWbzlpQYv81.YvVhwZjYJ9/g6z5mHvFew.C0UkO4zJe', 'admin');

-- Insert a default record into historia table
INSERT INTO historia (id, conteudo, autor_id) 
VALUES (UUID(), 'Conteúdo padrão da história da Umbanda.', (SELECT id FROM usuarios WHERE email = 'admin@simpleinkumbanda.com'));

-- Create a user for the application
CREATE USER IF NOT EXISTS 'umbanda_user'@'localhost' IDENTIFIED BY '148750';
GRANT SELECT, INSERT, UPDATE, DELETE ON simple_ink_umbanda.* TO 'umbanda_user'@'localhost';
FLUSH PRIVILEGES;

-- Note: In a production environment, you should:
-- 1. Use a more secure password
-- 2. Consider using connection pooling
-- 3. Store credentials in environment variables, not in code
-- 4. Set up proper backup procedures
-- 5. Configure MySQL for performance based on your server specifications
-- 6. Implement proper password hashing (the admin password above is hashed with bcrypt)