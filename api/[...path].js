const SKIP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'host',
  'x-vercel-id',
  'x-vercel-deployment-url',
  'x-vercel-forwarded-for',
  'x-real-ip',
  'x-forwarded-host',
  'x-forwarded-proto',
  'x-forwarded-for',
  'x-middleware-prefetch',
  'x-matched-path'
]);

const BACKEND_ORIGIN = 'http://zainportfilo.runasp.net';
const BACKEND_BASE = '/api';

module.exports = async (req, res) => {
  /* ---------- CORS preflight ---------- */
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  /* ---------- Build target URL ---------- */
  const pathParts = Array.isArray(req.query.path)
    ? req.query.path
    : req.query.path
      ? [req.query.path]
      : [];
  const subPath = pathParts.filter(Boolean).join('/');

  // Preserve query-string from original request
  const qs = new URL(req.url || '/', `http://${req.headers.host}`).search || '';
  const targetUrl = `${BACKEND_ORIGIN}${BACKEND_BASE}/${subPath}${qs}`;

  /* ---------- Forward headers (clean) ---------- */
  const headers = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (!SKIP_HEADERS.has(key.toLowerCase())) {
      headers[key] = value;
    }
  }
  // Override host to the real backend so virtual-hosting works
  headers['host'] = 'zainportfilo.runasp.net';

  /* ---------- Forward body ---------- */
  const method = req.method || 'GET';
  let body = undefined;

  if (!['GET', 'HEAD'].includes(method)) {
    if (req.body !== undefined && req.body !== null) {
      if (Buffer.isBuffer(req.body)) {
        body = req.body;
      } else if (typeof req.body === 'string') {
        body = req.body;
      } else {
        // Vercel already parsed JSON → re-serialise
        body = JSON.stringify(req.body);
        headers['content-type'] = 'application/json';
      }
    }
  }

  /* ---------- Proxy fetch ---------- */
  try {
    const upstream = await fetch(targetUrl, {
      method,
      headers,
      body,
      redirect: 'follow'
    });

    // Set status code
    res.status(upstream.status);

    // Copy safe response headers
    upstream.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (!SKIP_HEADERS.has(lower) && lower !== 'access-control-allow-origin') {
        res.setHeader(key, value);
      }
    });

    const buf = Buffer.from(await upstream.arrayBuffer());
    return res.send(buf);
  } catch (err) {
    console.error('[proxy error]', err);
    return res.status(502).json({
      message: 'Proxy error',
      detail: err instanceof Error ? err.message : String(err),
      target: targetUrl
    });
  }
};
