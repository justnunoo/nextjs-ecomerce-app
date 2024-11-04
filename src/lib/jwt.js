// /lib/jwt.js
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';

export function verifyJwtToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null;
    }
}
