import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { jwtConfig } from "../config/auth";

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  // Validate JWT Token

  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new Error("JWT Token is missing.");
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = verify(token, jwtConfig.secret);
    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new Error("Token JWT inválido");
  }
}
