import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDTO } from './dto/createPost.dto';
import { UpdateProfile } from './dto/updatePost.dto';

@Injectable() // Decorator to mark this class as a provider that can be injected into other classes
export class ProfilesService {
  private profiles = [
    {
      id: 1,
      name: 'John Doe',
    },
    {
      id: 2,
      name: 'Leo',
    },
    {
      id: 3,
      name: 'Alice Smith',
    },
    {
      id: 4,
      name: 'Bob Johnson',
    },
  ];

  // Get all profiles
  findAll() {
    return this.profiles;
  }

  // Get a profile by id
  findOne(id: string) {
    return this.profiles.find((profile) => profile.id === parseInt(id));
  }

  // Create a new profile
  create(data: CreateProfileDTO) {
    return this.profiles.push(data);
  }

  // Update a profile by id
  update(id: string, data: UpdateProfile) {
    const profile = this.profiles.find(
      (profile) => profile.id === parseInt(id),
    );

    if (!profile) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }

    if (profile) {
      profile.name = data.name || profile.name;
      return profile;
    }
  }

  // Delete a profile by id
  delete(id: string) {
    if (!this.profiles.find((profile) => profile.id === parseInt(id))) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }

    this.profiles = this.profiles.filter(
      (profile) => profile.id !== parseInt(id),
    );

    return this.profiles;
  }
}
