import jwt from 'jsonwebtoken';

export function verifyToken(req) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw { status: 401, message: 'Token não fornecido' };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw { status: 403, message: 'Token inválido' };
  }
}
