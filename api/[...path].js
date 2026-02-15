const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade'
]);

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end();
    return;
  }

  const backendOrigin = process.env.BACKEND_ORIGIN || 'http://zainportfilo.runasp.net';
  const backendBasePath = process.env.BACKEND_BASE_PATH || '/api';
  const pathParts = Array.isArray(req.query.path) ? req.query.path : [req.query.path];
  const path = pathParts.filter(Boolean).join('/');

  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const targetUrl = `${backendOrigin}${backendBasePath}/${path}${url.search}`;

  const headers = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers[key] = value;
    }
  }

  const method = req.method || 'GET';
  const canHaveBody = !['GET', 'HEAD'].includes(method);
  let body;

  if (canHaveBody && req.body !== undefined) {
    if (Buffer.isBuffer(req.body) || typeof req.body === 'string') {
      body = req.body;
    } else {
      body = JSON.stringify(req.body);
      if (!headers['content-type']) {
        headers['content-type'] = 'application/json';
      }
    }
  }

  try {
    const response = await fetch(targetUrl, { method, headers, body });

    res.status(response.status);
    res.setHeader('Access-Control-Allow-Origin', '*');
    response.headers.forEach((value, key) => {
      if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    res.status(502).json({
      message: 'Proxy error',
      detail: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
