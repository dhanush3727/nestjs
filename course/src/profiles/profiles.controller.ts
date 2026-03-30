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
} from '@nestjs/common';
import { CreateProfileDTO } from './dto/createPost.dto';
import { UpdateProfile } from './dto/updatePost.dto';
import { ProfilesService } from './profiles.service';

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
  findOne(@Param('id') id: string) {
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
  update(@Param('id') id: string, @Body() updatePost: UpdateProfile) {
    // Call the update method of the ProfilesService to update the profile with the specified id
    return this.profileService.update(id, updatePost);
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
    // Call the delete method of the ProfilesService to delete the profile with the specified id
    return this.profileService.delete(id);
  }
}
