import { Controller, UseGuards, Req, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('google'))
  @Get('google')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signInWithGoogle() {}

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async signInWithGoogleRedirect(@Req() req) {
    return this.authService.signInWithGoogle(req);
  }
}
