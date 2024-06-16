import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private authRepository: Repository<User>,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {
    authRepository: authRepository;
    jwtService: jwtService;
    userService: userService;
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<{
    message: string;
  }> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User();
    user.username = username;
    user.password = hashedPassword;

    try {
      await this.userService.create(user);
      return { message: 'User created successfully' };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; id: number }> {
    const { username, password } = authCredentialsDto;
    const user = await this.authRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);

      return { accessToken, id: user.id };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
