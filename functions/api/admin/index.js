import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Octokit } from '@octokit/rest';

const app = new Hono();

app.use('*', cors());

// GitHub OAuth config
const GITHUB_CLIENT_ID = c => c.env.GH_OAUTH_CLIENT_ID;
const GITHUB_CLIENT_SECRET = c => c.env.GH_OAUTH_CLIENT_SECRET;
const GH_REPO_OWNER = c => c.env.GH_REPO_OWNER;
const GH_REPO_NAME = c => c.env.GH_REPO_NAME;
const GH_ADMIN_TOKEN = c => c.env.GH_ADMIN_TOKEN;

// Simple session verification
function verifySession(token) {
  try {
    const data = JSON.parse(atob(token));
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

// GET /api/auth/github
app.get('/api/auth/github', (c) => {
  const clientId = GITHUB_CLIENT_ID(c);
  const redirectUri = `${new URL(c.req.url).origin}/api/auth/callback`;
  const state = crypto.randomUUID();
  
  // Store state in KV (using a simple in-memory for now, should use KV)
  c.env.PROGRESS_KV?.put(`oauth:${state}`, redirectUri, { expirationTtl: 600 });
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email&state=${state}`;
  return c.redirect(authUrl);
});

// GET /api/auth/callback
app.get('/api/auth/callback', async (c) => {
  const code = c.req.query('code');
  const state = c.req.query('state');
  const error = c.req.query('error');
  
  if (error) return c.text(`OAuth error: ${error}`, 400);
  if (!code || !state) return c.text('Missing code or state', 400);
  
  // Verify state
  const stored = await c.env.PROGRESS_KV?.get(`oauth:${state}`);
  if (!stored) return c.text('Invalid state', 400);
  await c.env.PROGRESS_KV?.delete(`oauth:${state}`);
  
  // Exchange code for token
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID(c),
      client_secret: GITHUB_CLIENT_SECRET(c),
      code,
      state
    })
  });
  
  const tokenData = await tokenRes.json();
  if (tokenData.error) return c.text(`Token error: ${tokenData.error_description}`, 400);
  
  // Get user
  const userRes = await fetch('https://api.github.com/user', {
    headers: { 'Authorization': `Bearer ${tokenData.access_token}`, 'Accept': 'application/vnd.github+json' }
  });
  const user = await userRes.json();
  
  if (user.login !== GH_REPO_OWNER(c)) {
    return c.text('Unauthorized: not repo owner', 403);
  }
  
  // Create session token
  const session = btoa(JSON.stringify({ user: user.login, exp: Date.now() + 86400000 }));
  return c.redirect(`${new URL(c.req.url).origin}/admin?session=${session}`);
});

// POST /api/admin/update-day (requires admin session)
app.post('/api/admin/update-day', async (c) => {
  const auth = c.req.header('Authorization');
  const session = auth?.startsWith('Bearer ') ? auth.slice(7) : c.req.query('session');
  const user = verifySession(session);
  
  if (!user || user.user !== GH_REPO_OWNER(c)) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const { currentDay } = await c.req.json();
  const day = parseInt(currentDay, 10);
  if (isNaN(day) || day < 1 || day > 30) {
    return c.json({ error: 'currentDay must be 1-30' }, 400);
  }
  
  // Update curriculum.json via GitHub API
  const octokit = new Octokit({ auth: GH_ADMIN_TOKEN(c) });
  
  const { data: file } = await octokit.rest.repos.getContent({
    owner: GH_REPO_OWNER(c),
    repo: GH_REPO_NAME(c),
    path: 'src/_data/curriculum.json'
  });
  
  const content = JSON.parse(atob(file.content));
  content.currentDay = day;
  
  await octokit.rest.repos.createOrUpdateFileContents({
    owner: GH_REPO_OWNER(c),
    repo: GH_REPO_NAME(c),
    path: 'src/_data/curriculum.json',
    message: `chore: update currentDay to ${day} [skip ci]`,
    content: btoa(JSON.stringify(content, null, 2)),
    sha: file.sha
  });
  
  return c.json({ success: true, currentDay: day });
});

export default app;