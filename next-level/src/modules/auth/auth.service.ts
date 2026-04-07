import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  // This is a user repository t's just for example in project use separately
  private userRepo = {
    async findByEmail(email: string) {
      // Fetch user from DB
    },
    async findById(id: number) {},
    async create(data: any) {},
    async update(id: number, data: any) {},
  };

  // Register user
  async register(dto: any) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
      role: 'USER',
    });

    return user;
  }

  // Validate user
  async validateUser(dto: any) {
    const user = await this.userRepo.findByEmail(dto.email);

    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) throw new UnauthorizedException();
  }

  // Generate the access and refresh token with user payload
  async generateTokens(user: any) {
    // user payload
    const payload = {
      id: user.id,
      role: user.role,
    };

    // access token in 15m expiration. Store it in memory
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: '15m',
    });

    // refresh token in 7d expiration. Store it in DB using hash
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  // compare the refresh token and DB refresh token
  async validateRefreshToken(userId: number, token: string) {
    const user = await this.userRepo.findById(userId);

    if (!user || !user.refreshToken) return false;

    return bcrypt.compare(token, user.refreshToken);
  }
}
