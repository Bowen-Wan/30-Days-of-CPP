import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getUserId, setUserIdCookie } from '../_middleware.js';

const app = new Hono();

app.use('*', cors());

// GET /api/progress?userId=xxx
app.get('/api/progress', async (c) => {
  const userId = c.req.query('userId') || getUserId(c);
  const kv = c.env.PROGRESS_KV;
  
  try {
    const data = await kv.get(`progress:${userId}`, { type: 'json' });
    setUserIdCookie(c, userId);
    return c.json({ completed: data?.completed || [] });
  } catch (e) {
    return c.json({ completed: [] });
  }
});

// POST /api/progress { userId, completedDays: [] }
app.post('/api/progress', async (c) => {
  const body = await c.req.json();
  const userId = body.userId || getUserId(c);
  const completedDays = body.completedDays || [];
  const kv = c.env.PROGRESS_KV;
  
  await kv.put(`progress:${userId}`, JSON.stringify({ completed: completedDays }));
  setUserIdCookie(c, userId);
  
  return c.json({ ok: true });
});

export default app;