import { Body, Controller, HttpException, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('google/callback')
  signInWithGoogleRedirect(@Body() user: any, @Res() res) {
    if (user === null) {
      throw new HttpException('Server error', 500);
    }

    this.authService.signInWithGoogle({ user: user }).subscribe((user) => {
      const token: string = user?.access_token;
      if (token) {
        res.json({ token });
      } else {
        throw new HttpException('Server error', 500);
      }
    });
  }
}
