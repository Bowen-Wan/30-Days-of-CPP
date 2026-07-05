import { createMiddleware } from 'hono/factory';
import { verify } from 'hono/jwt';

// JWT secret for admin session (set via wrangler secret)
const JWT_SECRET = 'REPLACE_WITH_WRANGLER_SECRET';

// User ID cookie name
const USER_ID_COOKIE = 'cpp_sprint_uid';

// ============================================================================
// CORS Middleware
// ============================================================================

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
};

export function cors() {
  return async (c, next) => {
    if (c.req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    await next();
    Object.entries(corsHeaders).forEach(([k, v]) => c.header(k, v));
  };
}

// ============================================================================
// Get or create anonymous user ID
// ============================================================================

export function getUserId(c) {
  // Check cookie first
  const cookie = c.req.header('Cookie');
  if (cookie) {
    const match = cookie.match(new RegExp(`${USER_ID_COOKIE}=([^;]+)`));
    if (match) return match[1];
  }
  // Generate new
  return crypto.randomUUID();
}

export function setUserIdCookie(c, userId) {
  c.header('Set-Cookie', `${USER_ID_COOKIE}=${userId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`);
}

// ============================================================================
// Admin Auth Middleware
// ============================================================================

export const adminAuth = createMiddleware(async (c, next) => {
  const auth = c.req.header('Authorization');
  if (!auth?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const token = auth.slice(7);
  try {
    const payload = await verify(token, JWT_SECRET);
    if (payload.scope !== 'admin') throw new Error('Invalid scope');
    c.set('admin', payload);
    await next();
  } catch (e) {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

// ============================================================================
// Generate Admin JWT (call after GitHub OAuth)
// ============================================================================

import { SignJWT } from 'hono/jwt';

export async function createAdminToken(user) {
  return new SignJWT({ sub: user.login, scope: 'admin', name: user.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(JWT_SECRET));
}