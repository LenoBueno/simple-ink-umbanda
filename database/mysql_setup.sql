-- MySQL Database Setup for Simple Ink Umbanda

-- Create the database
CREATE DATABASE IF NOT EXISTS simple_ink_umbanda CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE simple_ink_umbanda;

-- Create historia table
CREATE TABLE IF NOT EXISTS historia (
  id VARCHAR(36) PRIMARY KEY,
  conteudo TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id VARCHAR(36) PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  subtitulo VARCHAR(255),
  imagem_url VARCHAR(2048) NOT NULL,
  compositor VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  num_pontos INT DEFAULT 0,
  num_followers INT DEFAULT 0,
  num_downloads INT DEFAULT 0
);

-- Create pontos table
CREATE TABLE IF NOT EXISTS pontos (
  id VARCHAR(36) PRIMARY KEY,
  playlist_id VARCHAR(36),
  titulo VARCHAR(255) NOT NULL,
  compositor VARCHAR(255) NOT NULL,
  audio_url VARCHAR(2048) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_pontos_playlist_id ON pontos(playlist_id);
CREATE INDEX idx_playlists_titulo ON playlists(titulo);

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

-- Insert a default record into historia table
INSERT INTO historia (id, conteudo) VALUES (UUID(), 'Conteúdo padrão da história da Umbanda.');

-- Create a user for the application
CREATE USER IF NOT EXISTS 'leno'@'localhost' IDENTIFIED BY 'Ftec@148750W559rt';
GRANT SELECT, INSERT, UPDATE, DELETE ON simple_ink_umbanda.* TO 'leno'@'localhost';
FLUSH PRIVILEGES;

-- Sample connection string for Node.js application:
-- const mysql = require('mysql2');
-- const connection = mysql.createConnection({
--   host: 'localhost',
--   user: 'leno',
--   password: 'Ftec@148750W559rt',
--   database: 'simple_ink_umbanda'
-- });

-- Note: In a production environment, you should:
-- 1. Use a more secure password
-- 2. Consider using connection pooling
-- 3. Store credentials in environment variables, not in code
-- 4. Set up proper backup procedures
-- 5. Configure MySQL for performance based on your server specifications