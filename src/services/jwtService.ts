import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.Bcrypt_secret || '557cf7ebd08a6e44ebe35331e1d33783'; // Reemplaza esto con tu clave secreta

interface Payload {
  [key: string]: any;
}

class JwtService {
  createToken(payload: Payload, expiresIn: string | number): string {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
  }

  createTokenFromString(payloadString: string, expiresIn: string | number): string {
    const payload = this.stringToPayload(payloadString);
    return this.createToken(payload, expiresIn);
  }
  validateToken(token: string): boolean {
    try {
      jwt.verify(token, SECRET_KEY);
      return true;
    } catch (error) {
      return false;
    }
  }

  decodeToken(token: string): Payload | null {
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as Payload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  private stringToPayload(payloadString: string): Payload {
    try {
      return JSON.parse(payloadString);
    } catch (error) {
      throw new Error('Invalid JSON string');
    }
  }
}

export const jwtService = new JwtService();
