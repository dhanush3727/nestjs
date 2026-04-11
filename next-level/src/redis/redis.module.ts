import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';

// This module provides a Redis client that can be injected into other parts of the application.
@Global() // This decorator makes the module global, so it can be imported in other modules without needing to be listed in the imports array.
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT', // This is the token that will be used to inject the Redis client.
      useFactory: () => {
        return new Redis({
          host: 'localhost', // Redis server host
          port: 6379, // Redis server port
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT'], // This makes the Redis client available for injection in other modules.
})
export class RedisModule {}
