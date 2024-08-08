import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface CustomRequest extends Request {
  user?: any;
}

export const verifyToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const bearerHeader = req.headers["authorization"];
  let token: string | undefined;

  if (typeof bearerHeader !== "undefined") {
    token = bearerHeader.split(" ")[1].trim();
  } else {
    return res.status(403).json({
      status: false,
      message: "Acceso denegado",
      token: bearerHeader,
    });
  }

  if (token) {
    try {
      const verify = jwt.verify(token, process.env.JWT_Secret!) as any; // El ! indica que estamos seguros de que JWT_Secret no es undefined
      const user = await prisma.user.findUnique({
        where: {
          email: verify.email,
        },
      });

      if (!user) {
        return res.status(403).json({
          status: false,
          message: "Usuario no encontrado",
        });
      }

      req.user = verify;
      next();
    } catch (error) {
      return res.status(403).json({
        status: false,
        message: "Invalid token",
      });
    }
  }
};

export const grantRole = (roles: string[]) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const bearerHeader = req.headers["authorization"];
      let token: string | undefined;

      if (typeof bearerHeader !== "undefined") {
        token = bearerHeader.split(" ")[1].trim();
      } else {
        return res.status(403).json({
          status: false,
          message: "Acceso denegado",
        });
      }

      if (token) {
        const verify = jwt.verify(token, process.env.SECRET_KEY!) as any;

        if (roles.length && roles.indexOf(verify.role) === -1) {
          return res.status(401).json({ message: "No autorizado" });
        }

        next();
      }
    } catch (error) {
      next(error);
    }
  };
};
