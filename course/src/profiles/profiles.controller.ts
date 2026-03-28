import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateProfileDTO } from './dto/createPost.dto';
import { UpdateProfile } from './dto/updatePost.dto';

@Controller('profiles')
export class ProfilesController {
  // Get /profiles - get all profiles
  @Get()
  findAll() {
    return [];
  }

  // Get /profiles?(query) - get profiles with query parameter
  @Get()
  getAll(@Query('location') location: string) {
    return [{ location }];
  }

  // Get /profiles/:id - get a one profile using id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id };
  }

  // Post /profiles - post data
  @Post()
  create(@Body() createPost: CreateProfileDTO) {
    return {
      name: createPost.name,
      email: createPost.email,
    };
  }

  // Put /profiles/:id - update data
  @Put(':id')
  update(@Param('id') id: string, @Body() updatePost: UpdateProfile) {
    return {
      id,
      name: updatePost.name,
      email: updatePost.email,
    };
  }

  // Patch /profiles/:id
  @Patch(':id')
  patchUser(@Param('id') id: string, @Body() patchData: UpdateProfile) {
    return {
      id,
      ...patchData,
    };
  }

  // Delete /profiles/:id - delete data
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id') id: string) {
    return;
  }
}
