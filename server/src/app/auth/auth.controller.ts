import {
  Controller,
  Get,
  HttpException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard('google'))
  @Get('google')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signInWithGoogle() {}

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  signInWithGoogleRedirect(@Req() req, @Res() res) {
    this.authService.signInWithGoogle(req).subscribe((user) => {
      const token: string = user.access_token;
      if (token) {
        const redirectUrl = `${this.configService.get(
            'LOGIN_REDIRECT',
        )}/login/${token}`;
        res.redirect(redirectUrl);
      } else {
        throw new HttpException('Server error', 500);
      }
    });
  }
}
