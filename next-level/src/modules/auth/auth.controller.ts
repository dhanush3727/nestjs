import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: any) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: any, @Res() res: Response) {
    const user = await this.authService.validateUser(dto);

    const { accessToken, refreshToken } =
      await this.authService.generateTokens(user);

    const hashed = await this.authService.hashToken(refreshToken);

    await this.authService['userRepo'].update(user.id, {
      refreshToken: hashed,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return res.json({ accessToken });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: any) {
    console.log('User from request:', req.user); 

    return {
      message: 'Protected route success',
      user: req.user,
    };
  }

  // REFRESH (ROTATION)
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(@Req() req: any, @Res() res: Response) {
    const { userId, refreshToken } = req.user;

    const isValid = await this.authService.validateRefreshToken(
      userId,
      refreshToken,
    );

    if (!isValid) throw new UnauthorizedException();

    const user = await this.authService['userRepo'].findById(userId);

    const { accessToken, refreshToken: newRefresh } =
      await this.authService.generateTokens(user);

    const hashed = await this.authService.hashToken(newRefresh);

    await this.authService['userRepo'].update(userId, {
      refreshToken: hashed,
    });

    res.cookie('refreshToken', newRefresh, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return res.json({ accessToken });
  }

  // LOGOUT
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any, @Res() res: Response) {
    await this.authService['userRepo'].update(req.user.userId, {
      refreshToken: null,
    });

    res.clearCookie('refreshToken');

    return res.json({ message: 'Logged out' });
  }
}
