import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import compression from 'compression';

dotenv.config();

// Create Express app
const app = express();

// Apply compression middleware to reduce bandwidth usage
app.use(compression());

// Apply CORS with specific options to reduce overhead
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON with size limits to prevent memory issues
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Middleware for API responses
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.header('Content-Type', 'application/json');
  }
  next();
});

// Ensure upload directories exist
const uploadDirs = ['uploads/imagens', 'uploads/audios'];
for (const dir of uploadDirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Configure multer with file size limits
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const bucket = req.body.bucket || 'imagens';
    cb(null, `uploads/${bucket}`);
  },
  filename: function (req, file, cb) {
    const customPath = req.body.path || `${Date.now()}-${file.originalname}`;
    cb(null, customPath);
  }
});

// Set file size limits to prevent memory issues
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('Nenhum arquivo enviado');
    }
    
    const bucket = req.body.bucket || 'imagens';
    const filePath = req.file.path;
    const relativePath = path.relative('uploads', filePath);
    
    res.json({ 
      data: { 
        path: req.file.filename, 
        url: `/api/files/${relativePath}` 
      }, 
      error: null 
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ data: null, error: error.message });
  }
});

// Serve static files with caching headers
app.use('/api/files', express.static('uploads', {
  maxAge: '1d', // Cache for 1 day
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.jsx') || path.endsWith('.ts') || path.endsWith('.tsx')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Serve static files from dist with caching
app.use(express.static('dist', {
  maxAge: '1d', // Cache for 1 day
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.jsx') || path.endsWith('.ts') || path.endsWith('.tsx')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Optimized MySQL connection pool for low memory environment
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'leno',
  password: process.env.DB_PASSWORD || 'Ftec@148750W559rt',
  database: process.env.DB_NAME || 'simple_ink_umbanda',
  waitForConnections: true,
  connectionLimit: 5, // Reduced from 10 to 5 for lower memory usage
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 30000, // 30 seconds
  // Add connection timeout to prevent hanging connections
  connectTimeout: 10000, // 10 seconds
  // Add query timeout to prevent long-running queries
  socketTimeout: 30000 // 30 seconds
});

// Database connection check
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

// Helper function to handle database queries with error handling
async function executeQuery(query, params = []) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(query, params);
    return { data: rows, error: null };
  } catch (error) {
    console.error('Database query error:', error.message);
    return { data: null, error: error.message };
  } finally {
    if (connection) connection.release();
  }
}

// API Routes with optimized query handling

// Playlists routes
app.get('/api/playlists', async (req, res) => {
  const result = await executeQuery('SELECT * FROM playlists ORDER BY created_at DESC');
  res.json(result);
});

app.get('/api/playlists/:id', async (req, res) => {
  const result = await executeQuery('SELECT * FROM playlists WHERE id = ?', [req.params.id]);
  if (result.data && result.data.length === 0) {
    return res.status(404).json({ data: null, error: 'Playlist não encontrada' });
  }
  res.json({ data: result.data ? result.data[0] : null, error: result.error });
});

app.post('/api/playlists', async (req, res) => {
  const { titulo, subtitulo, imagem_url, compositor } = req.body;
  const id = uuidv4();
  const result = await executeQuery(
    'INSERT INTO playlists (id, titulo, subtitulo, imagem_url, compositor) VALUES (?, ?, ?, ?, ?)',
    [id, titulo, subtitulo, imagem_url, compositor]
  );
  res.json({ data: result.data ? { id } : null, error: result.error });
});

app.put('/api/playlists/:id', async (req, res) => {
  const { titulo, subtitulo, imagem_url, compositor } = req.body;
  const { id } = req.params;
  
  let updateFields = [];
  let updateValues = [];
  
  if (titulo !== undefined) {
    updateFields.push('titulo = ?');
    updateValues.push(titulo);
  }
  
  if (subtitulo !== undefined) {
    updateFields.push('subtitulo = ?');
    updateValues.push(subtitulo);
  }
  
  if (imagem_url !== undefined) {
    updateFields.push('imagem_url = ?');
    updateValues.push(imagem_url);
  }
  
  if (compositor !== undefined) {
    updateFields.push('compositor = ?');
    updateValues.push(compositor);
  }
  
  updateValues.push(id);
  
  if (updateFields.length === 0) {
    return res.status(400).json({ data: null, error: 'Nenhum campo para atualizar' });
  }
  
  const query = `UPDATE playlists SET ${updateFields.join(', ')} WHERE id = ?`;
  const result = await executeQuery(query, updateValues);
  
  if (result.data && result.data.affectedRows === 0) {
    return res.status(404).json({ data: null, error: 'Playlist não encontrada' });
  }
  
  res.json({ data: { id }, error: result.error });
});

// Pontos routes
app.get('/api/pontos', async (req, res) => {
  const playlistId = req.query.playlist_id;
  let query = 'SELECT * FROM pontos';
  let params = [];

  if (playlistId) {
    query += ' WHERE playlist_id = ?';
    params.push(playlistId);
  }

  const result = await executeQuery(query, params);
  res.json(result);
});

app.post('/api/pontos', async (req, res) => {
  const { playlist_id, titulo, compositor, audio_url } = req.body;
  const id = uuidv4();
  const result = await executeQuery(
    'INSERT INTO pontos (id, playlist_id, titulo, compositor, audio_url) VALUES (?, ?, ?, ?, ?)',
    [id, playlist_id, titulo, compositor, audio_url]
  );
  res.json({ data: result.data ? { id } : null, error: result.error });
});

app.put('/api/pontos/:id', async (req, res) => {
  const { playlist_id, titulo, compositor, audio_url } = req.body;
  const { id } = req.params;
  
  let updateFields = [];
  let updateValues = [];
  
  if (playlist_id !== undefined) {
    updateFields.push('playlist_id = ?');
    updateValues.push(playlist_id);
  }
  
  if (titulo !== undefined) {
    updateFields.push('titulo = ?');
    updateValues.push(titulo);
  }
  
  if (compositor !== undefined) {
    updateFields.push('compositor = ?');
    updateValues.push(compositor);
  }
  
  if (audio_url !== undefined) {
    updateFields.push('audio_url = ?');
    updateValues.push(audio_url);
  }
  
  updateValues.push(id);
  
  if (updateFields.length === 0) {
    return res.status(400).json({ data: null, error: 'Nenhum campo para atualizar' });
  }
  
  const query = `UPDATE pontos SET ${updateFields.join(', ')} WHERE id = ?`;
  const result = await executeQuery(query, updateValues);
  
  if (result.data && result.data.affectedRows === 0) {
    return res.status(404).json({ data: null, error: 'Ponto não encontrado' });
  }
  
  res.json({ data: { id }, error: result.error });
});

// Delete playlist route
app.delete('/api/playlists/:id', async (req, res) => {
  console.log('Requisição para excluir playlist com ID:', req.params.id);
  try {
    const { id } = req.params;
    
    // Check if playlist exists
    const playlistResult = await executeQuery('SELECT * FROM playlists WHERE id = ?', [id]);
    
    if (playlistResult.data && playlistResult.data.length === 0) {
      return res.status(404).json({ data: null, error: 'Playlist não encontrada' });
    }
    
    // Update associated pontos
    await executeQuery('UPDATE pontos SET playlist_id = NULL WHERE playlist_id = ?', [id]);
    
    // Delete playlist
    const deleteResult = await executeQuery('DELETE FROM playlists WHERE id = ?', [id]);
    
    if (deleteResult.data && deleteResult.data.affectedRows === 0) {
      return res.status(404).json({ data: null, error: 'Playlist não encontrada' });
    }
    
    console.log(`Playlist ${id} excluída com sucesso`);
    res.json({ data: { id }, error: null });
  } catch (error) {
    console.error('Erro ao excluir playlist:', error);
    res.status(500).json({ data: null, error: error.message });
  }
});

// Historia route
app.get('/api/historia', async (req, res) => {
  const result = await executeQuery('SELECT * FROM historia ORDER BY created_at DESC LIMIT 1');
  res.json({ data: result.data ? result.data[0] : null, error: result.error });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ data: null, error: 'Internal server error' });
});

// Graceful shutdown handling
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown() {
  console.log('Shutting down gracefully...');
  try {
    await pool.end();
    console.log('Database connections closed');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
}

const PORT = process.env.PORT || 3000;

// Start server after checking database connection
checkDatabaseConnection().then(connected => {
  if (!connected) {
    console.warn('Aviso: Usando dados mockados devido a falha na conexão com o banco de dados');
  }
  
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});