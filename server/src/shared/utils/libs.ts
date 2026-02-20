import { IncomingHttpHeaders } from 'http';

export function extractTokenFromHeader(
  headers: IncomingHttpHeaders,
): string | undefined {
  const [type, token] = headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
