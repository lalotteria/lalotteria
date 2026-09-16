import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createClient } from '@supabase/supabase-js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 5555;

app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// POST /auth/signup
app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password, nome } = req.body;
    if (!email || !password || !nome) return res.status(400).json({ error: 'Campi obbligatori mancanti' });

    const hashedPassword = await bcryptjs.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password_hash: hashedPassword, nome }])
      .select();

    if (error) throw error;

    const token = jwt.sign({ id: data[0].id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: data[0].id, email, nome } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /auth/login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email e password obbligatori' });

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) return res.status(401).json({ error: 'Credenziali non valide' });

    const passwordValid = await bcryptjs.compare(password, data.password_hash);
    if (!passwordValid) return res.status(401).json({ error: 'Credenziali non valide' });

    const token = jwt.sign({ id: data.id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: data.id, email, nome: data.nome } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🎡 La Lotteria API\n🚀 http://localhost:${PORT}\n`);
});