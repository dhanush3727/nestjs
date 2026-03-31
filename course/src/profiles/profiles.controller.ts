import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  // NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateProfileDTO } from './dto/createPost.dto';
import { UpdateProfile } from './dto/updatePost.dto';
import { ProfilesService } from './profiles.service';
import type { UUID } from 'crypto';

@Controller('profiles')
export class ProfilesController {
  constructor(private profileService: ProfilesService) {}

  // Get /profiles - get all profiles
  @Get()
  findAll() {
    // Call the findAll method of the ProfilesService to get all profiles
    return this.profileService.findAll();
  }

  // Get /profiles?(query) - get profiles with query parameter
  // @Get()
  // getAll(@Query('location') location: string) {
  //   return [{ location }];
  // }

  // Get /profiles/:id - get a one profile using id
  @Get(':id')
  // Use ParseUUIDPipe to validate that the id parameter is a valid UUID. If it's not, NestJS will automatically return a 400 Bad Request response.
  findOne(@Param('id', ParseUUIDPipe) id: UUID) {
    // Exception handling example
    const profile = this.profileService.findOne(id);
    if (!profile) {
      // If the profile with the specified id is not found, throw an HttpException with a 404 status code
      throw new HttpException('Profile Not Found', HttpStatus.NOT_FOUND);

      // Alternatively, you can throw a NotFoundException which is a built-in exception in NestJS that automatically sets the status code to 404
      // throw new NotFoundException(`Profile with id ${id} not found`);
    }

    // Call the findOne method of the ProfilesService to get the profile with the specified id
    return this.profileService.findOne(id);
  }

  // Post /profiles - post data
  @Post()
  create(@Body() createPost: CreateProfileDTO) {
    const data = {
      id: createPost.id,
      name: createPost.name,
    };

    // Call the create method of the ProfilesService to add the new profile
    this.profileService.create(data);
    return 'Create a new profile';
  }

  // Put /profiles/:id - update data
  @Put(':id')
  // Use ParseUUIDPipe to validate that the id parameter is a valid UUID. If it's not, NestJS will automatically return a 400 Bad Request response.
  update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updatePost: UpdateProfile,
  ) {
    // Call the update method of the ProfilesService to update the profile with the specified id
    return this.profileService.update(id, updatePost);
  }

  // Patch /profiles/:id
  @Patch(':id')
  // Use ParseUUIDPipe to validate that the id parameter is a valid UUID. If it's not, NestJS will automatically return a 400 Bad Request response.
  patchUser(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() patchData: UpdateProfile,
  ) {
    return {
      id,
      ...patchData,
    };
  }

  // Delete /profiles/:id - delete data
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  // Use ParseUUIDPipe to validate that the id parameter is a valid UUID. If it's not, NestJS will automatically return a 400 Bad Request response.
  deleteUser(@Param('id', ParseUUIDPipe) id: UUID) {
    // Call the delete method of the ProfilesService to delete the profile with the specified id
    return this.profileService.delete(id);
  }
}
