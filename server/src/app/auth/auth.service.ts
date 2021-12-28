import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { map } from 'rxjs';
import { UserDTO } from '../user/user.dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // async validateUser(username: string, password: string): Promise<User | null> {
  //   const user = (
  //     await this.usersService.findByEmail({ where: [{ email: username }] })
  //   )[0];
  //   if (user && user.password === password) return user;
  //   return null;
  // }

  // async login(user: UserDTO) {
  //   return {
  //     access_token: this.jwtService.sign(
  //       {
  //         sub: user.id,
  //         email: user.email,
  //       },
  //       // {
  //       //   secret: this.configService.get('googleClientSecret'),
  //       //   expiresIn: this.configService.ge,
  //       // },
  //     ),
  //   };
  // }

  login(user: UserDTO) {
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
      }),
    };
  }

  // async handleUser(user: any) {
  //   if (user) return this.login(user);

  //   try {
  //     const newUser = new UserEntity();
  //     newUser.firstName = user.firstName;
  //     newUser.lastName = user.lastName;
  //     newUser.email = user.email;
  //     newUser.photo = user.photo;
  //     newUser.googleId = user.id;

  //     this.usersService.store(newUser);
  //     return this.login(newUser);
  //   } catch (e) {
  //     throw new Error(e);
  //   }
  // }

  signInWithGoogle(data) {
    if (!data.user) throw new BadRequestException();

    // console.log(data.user);

    // this.usersService.findByEmail('test').subscribe({
    //   next: (user) => {
    //     this.handleUser(user);
    //   },
    // });

    this.usersService
      .findByEmail(data.user.email)
      .pipe(
        map((user: any) => {
          if (user) {
            console.log(this.login(user));
          } else {
            try {
              const newUser = new UserEntity();
              newUser.firstName = data.user.firstName;
              newUser.lastName = data.user.lastName;
              newUser.email = data.user.email;
              newUser.photo = data.user.photo;
              newUser.googleId = data.user.googleId;

              this.usersService.store(newUser);
              console.log(this.login(newUser));
            } catch (e) {
              throw new Error(e);
            }
          }
        }),
      )
      .subscribe();
  }
}
