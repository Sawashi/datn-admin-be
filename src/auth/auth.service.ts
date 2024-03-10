/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcryptjs from 'bcryptjs';
import { Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { QueryFailedError, Repository } from 'typeorm';

import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    userRepository: userRepository;
  }

  async registerUser(user: User, resp: Response) {
    const { firstName, lastName, email, password, phoneNumber } = user;

    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !phoneNumber?.trim() ||
      !email?.trim() ||
      !password.trim()
    ) {
      return resp
        .status(500)
        .send({ message: 'Not all required fields have been filled in.' });
    }

    try {
      const user = await this.userRepository.save({
        firstName,
        lastName,
        email,
        phoneNumber,
        password: await bcryptjs.hash(password, 12),
        imgUrl: '',
        gender: '',
        description: '',
        dateOfBirth: '',
      });

      console.log(user);

      return resp.status(200).send(user);
    } catch (error) {
      console.error(error);

      if (error instanceof QueryFailedError) {
        //@ts-expect-error
        if (error.code === '23505') {
          //@ts-expect-error
          console.error(`Unique constraint ${error.constraint} failed`);
          return resp
            .status(500)
            .send({ message: 'There is already a user with this email.' });
        }
      }

      return resp.status(500).send({ message: error });
    }
  }

  async loginUser(user: User, resp: Response) {
    const { email, password } = user;

    if (!email?.trim() || !password?.trim()) {
      return resp
        .status(500)
        .send({ message: 'Not all required fields have been filled in.' });
    }

    const userDB = await this.userRepository.findOne({ where: { email } });

    if (!userDB || !(await bcryptjs.compare(password, userDB.password))) {
      return resp.status(500).send({ message: 'Invalid Credentials.' });
    }

    const accessToken = sign({ id: userDB.id }, 'access_secret', {
      expiresIn: 60 * 60,
    });

    const refreshToken = sign({ id: userDB.id }, 'refresh_secret', {
      expiresIn: 24 * 60 * 60,
    });

    resp.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    resp.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    resp.status(200).send({ message: 'Login success.' });
  }

  async authUser(req: Request, resp: Response) {
    try {
      const accessToken = req.cookies['accessToken'];

      const payload: any = verify(accessToken, 'access_secret');

      if (!payload) {
        return resp.status(401).send({ message: 'Unauthenticated.' });
      }

      const user = await this.userRepository.findOne({
        where: { id: payload.id },
      });

      if (!user) {
        return resp.status(401).send({ message: 'Unauthenticated.' });
      }

      return resp.status(200).send(user);
    } catch (error) {
      console.error(error);
      return resp.status(500).send({ message: error });
    }
  }

  async refreshUser(req: Request, resp: Response) {
    try {
      const refreshToken = req.cookies['refreshToken'];

      const payload: any = verify(refreshToken, 'refresh_secret');

      if (!payload) {
        return resp.status(401).send({ message: 'Unauthenticated.' });
      }

      const accessToken = sign({ id: payload.id }, 'access_secret', {
        expiresIn: 60 * 60,
      });

      resp.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      resp.status(200).send({ message: 'refresh success.' });
    } catch (error) {
      console.error(error);
      return resp.status(500).send({ message: error });
    }
  }

  async logoutUser(resp: Response) {
    resp.cookie('accessToken', '', { maxAge: 0 });
    resp.cookie('refreshToken', '', { maxAge: 0 });

    return resp.status(200).send({ message: 'logged out.' });
  }
}
