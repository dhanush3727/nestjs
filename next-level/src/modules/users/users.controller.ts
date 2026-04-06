import { Body, Controller, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Register user
  @Post()
  async register(@Body() dto: CreateUserDTO, @Res() res: Response) {
    const { newUser, token } = await this.usersService.registerUser(dto);
    res.cookie('token', token, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict', // Prevent CSRF attacks by only sending cookies for same-site requests
    });
    return await res.json({ newUser });
  }
}
