export function requireAuth(req, res, next) {
  const isTestEnv = process.env.NODE_ENV === 'test';
  const allowTestAuth = process.env.ALLOW_TEST_AUTH !== 'false';

  // ✅ Test-only auth (safe + explicitly gated)
  if (isTestEnv && allowTestAuth) {
    const auth = req.headers.authorization;

    if (!auth) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (auth.includes('user')) {
      req.user = { id: 'user1', role: 'user' };
      return next();
    }

    if (auth.includes('admin')) {
      req.user = { id: 'admin1', role: 'admin' };
      return next();
    }

    return res.status(401).json({ message: 'Unauthorized' });
  }

  // 🚫 Production / real auth path
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}
