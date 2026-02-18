import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { Request } from 'express';

/**
 * An injectable AuthGuard guard class that acts as a middleware for application routes.
 * It returns a boolean state: true, if a request from the client came with a generated bearer token; false, if token was incorrect or undefined.
 *
 * The AuthGuard can be injected easily to the controller class as follows:
 *
 * Example:
 * ```
 *  @UseGuards(AuthGuard)
 *  @Controller('posts')
 *  export class PostController {
 *      // ...
 *  }
 * ```
 */
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = jwt.verify(token, String(process.env.JWT_SECRET_KEY));
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
