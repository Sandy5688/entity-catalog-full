import jwt from 'jsonwebtoken';

export const requireAuth = (allowedRoles = []) => {
  return (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const authHeader = req.headers.authorization;

    // ---- SYSTEM API KEY
    if (apiKey && apiKey === process.env.SYSTEM_API_KEY) {
      req.user = { role: 'system' };
      return next();
    }

    // ---- JWT REQUIRED
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (
        allowedRoles.length &&
        !allowedRoles.includes(decoded.role)
      ) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      next();
    } catch {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
};
