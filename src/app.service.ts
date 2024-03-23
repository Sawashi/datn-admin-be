import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(private readonly jwtService: JwtService) {
    jwtService: jwtService;
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from Google';
    }

    const payload = {
      email: req.user.email,
      sub: req.user.userId,
    };

    const jwt = this.jwtService.sign(payload);

    return {
      message: 'User information from Google',
      user: req.user,
      jwt,
    };
  }
}
