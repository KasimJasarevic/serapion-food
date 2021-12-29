import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.GOOGLE_CLIENT_SECRET,
    });
  }

  async validate(payload, done) {
    try {
      done(null, payload);
    } catch (err) {
      throw new UnauthorizedException('unauthorized', err.message);
    }
  }
}
