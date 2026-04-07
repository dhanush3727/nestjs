import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';
import { MailService } from 'src/shared/services/mail.service';
import { CreateUserDTO } from './dto/create-user.dto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
    private mailService: MailService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // This is the create method, it takes a partial user object and creates a new user in the database
  async registerUser(data: CreateUserDTO) {
    const { userName, email, password } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      userName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: newUser._id },
      this.configService.get<string>('JWT_SECRET')!,
      { expiresIn: '1h' },
    );

    return { newUser, token };
  }

  // This is the findByEmail method, it takes an email and returns the user document that matches the email
  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).select('+password').lean();
  }

  async findById(userId: string) {
    return await this.userModel
      .findById(userId)
      .select('userName email imgURL')
      .lean();
  }

  async updateUser(userId: string, data: Partial<User>) {
    return await this.userModel
      .findByIdAndUpdate(userId, data, { new: true })
      .select('userName email imgURL')
      .lean();
  }

  async deleteUser(userId: string) {
    return await this.userModel.findByIdAndDelete(userId).lean();
  }
}
