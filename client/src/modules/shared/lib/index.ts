import { jwtDecode } from "jwt-decode";

export function decodeToken(token: string): { id: string; username: string } | null {
  return jwtDecode(token);
}
