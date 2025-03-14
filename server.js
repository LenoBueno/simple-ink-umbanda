import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração para upload de arquivos
app.post('/api/upload', async (req, res) => {
  try {
    // Em uma implementação real, você salvaria o arquivo em um sistema de arquivos ou serviço de armazenamento
    // Por enquanto, apenas simulamos um upload bem-sucedido
    const { bucket, path } = req.body;
    const filePath = `uploads/${bucket}/${path}`;
    
    res.json({ data: { path: filePath, url: `/files/${bucket}/${path}` }, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

// Rota para servir arquivos estáticos
app.use('/api/files', express.static('uploads'));

// Configuração do pool de conexões MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'umbanda_user',
  password: process.env.DB_PASSWORD || 'StrongPassword123!',
  database: process.env.DB_NAME || 'simple_ink_umbanda',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificar a conexão com o banco de dados
async function checkDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexão com o banco de dados MySQL estabelecida com sucesso!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados MySQL:', error.message);
    return false;
  }
}

// Rotas para Playlists
app.get('/api/playlists', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM playlists ORDER BY created_at DESC');
    res.json({ data: rows, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

app.post('/api/playlists', async (req, res) => {
  try {
    const { titulo, subtitulo, imagem_url, compositor } = req.body;
    const id = uuidv4();
    await pool.query(
      'INSERT INTO playlists (id, titulo, subtitulo, imagem_url, compositor) VALUES (?, ?, ?, ?, ?)',
      [id, titulo, subtitulo, imagem_url, compositor]
    );
    res.json({ data: { id }, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

// Rotas para Pontos
app.get('/api/pontos', async (req, res) => {
  try {
    const playlistId = req.query.playlist_id;
    let query = 'SELECT * FROM pontos';
    let params = [];

    if (playlistId) {
      query += ' WHERE playlist_id = ?';
      params.push(playlistId);
    }

    const [rows] = await pool.query(query, params);
    res.json({ data: rows, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

app.post('/api/pontos', async (req, res) => {
  try {
    const { playlist_id, titulo, compositor, audio_url } = req.body;
    const id = uuidv4();
    await pool.query(
      'INSERT INTO pontos (id, playlist_id, titulo, compositor, audio_url) VALUES (?, ?, ?, ?, ?)',
      [id, playlist_id, titulo, compositor, audio_url]
    );
    res.json({ data: { id }, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

// Rota para História
app.get('/api/historia', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM historia ORDER BY created_at DESC LIMIT 1');
    res.json({ data: rows[0], error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

// Verificar a conexão com o banco de dados antes de iniciar o servidor
checkDatabaseConnection().then(connected => {
  if (!connected) {
    console.warn('Aviso: Usando dados mockados devido a falha na conexão com o banco de dados');
    // Implementar lógica para usar dados mockados
  }
  
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});