import { Controller, UseGuards, Req, Get, Res } from '@nestjs/common';
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
  signInWithGoogleRedirect(@Req() req, @Res() res) {
    this.authService.signInWithGoogle(req).subscribe((user) => {
      const token: string = user.access_token;
      if (token) res.redirect('http://localhost:4200/login/' + token);
    });
  }

  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  protectedResource() {
    return 'JWT is working!';
  }
}
