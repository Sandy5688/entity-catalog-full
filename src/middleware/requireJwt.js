import jwt from 'jsonwebtoken';

export function requireJwt(allowedRoles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const token = authHeader.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      if (
        allowedRoles.length &&
        !allowedRoles.includes(payload.role)
      ) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      req.auth = payload;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}
