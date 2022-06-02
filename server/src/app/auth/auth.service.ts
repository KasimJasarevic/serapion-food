import {Injectable, BadRequestException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {map} from 'rxjs';
import {UserDTO} from '../user/user.dto';
import {UserEntity} from '../user/user.entity';
import {UserService} from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) {
    }

    login(user: UserDTO) {
        return {
            access_token: this.jwtService.sign({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                photo: user.photo,
            }),
        };
    }

    signInWithGoogle(data) {
        if (!data.user) throw new BadRequestException();

        return this.usersService.findByEmail(data.user.email).pipe(
            map((user: any) => {
                if (user) {
                    return this.login(user);
                } else {
                    try {
                        const newUser = new UserEntity();
                        newUser.firstName = data.user.firstName;
                        newUser.lastName = data.user.lastName;
                        newUser.email = data.user.email;
                        newUser.photo = data.user.photoUrl;
                        newUser.googleId = data.user.id;

                        this.usersService.store(newUser).subscribe((u) => {
                            newUser.id = u.id;
                            return this.login(newUser);
                        });
                    } catch (e) {
                        throw new Error(e);
                    }
                }
            })
        );
    }
}
