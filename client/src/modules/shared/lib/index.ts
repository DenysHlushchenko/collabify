import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/types";

export function decodeToken(token: string): JwtPayload | null {
  return jwtDecode(token);
}
