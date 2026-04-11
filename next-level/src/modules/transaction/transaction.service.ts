import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class TransactionService {
  // @Inject() is a decorator that allows us to inject dependencies into the service.
  // In this case, we are injecting the Redis client that we defined in the RedisModule.
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  // This method is an example of how to use the Redis client to set a value in Redis.
  async getTransactions(userId: string, page: number, limit: number) {
    const key = `transactions:${userId}:${page}:${limit}`;

    // Check if the transactions are already cached in Redis.
    const cachedTransactions = await this.redisClient.get(key);
    if (cachedTransactions) {
      return JSON.parse(cachedTransactions); // If cached, return the transactions from Redis.
    }

    // If not cached, fetch transactions from the database (this is just a placeholder).
    const transactions = await this.fetchTransactionsFromDatabase(
      userId,
      page,
      limit,
    );

    // Cache the transactions in Redis for future requests.
    await this.redisClient.set(key, JSON.stringify(transactions), 'EX', 3600); // Cache for 1 hour.

    return transactions; // Return the transactions fetched from the database.
  }

  // This is a placeholder method to simulate fetching transactions from a database.
  private async fetchTransactionsFromDatabase(
    userId: string,
    page: number,
    limit: number,
  ) {
    // Replace this with your actual database query logic.
    return {
      userId,
      page,
      limit,
      transactions: [],
    };
  }

  // Cache invalidation: When a new transaction is created, we need to invalidate the cache for the user's transactions to ensure that the next time they request their transactions, they get the updated data from the database instead of stale data from Redis.
  async createTransaction(userId: string, amount: number) {
    const tx = await this.saveTransactionToDatabase(userId, amount);
    // Invalidate the cache for the user's transactions when a new transaction is created.
    // We can use a pattern to delete all keys related to the user's transactions.
    const keys = await this.redisClient.keys(`transactions:${userId}:*`);
    // If there are any keys that match the pattern, delete them from Redis.
    if (keys.length > 0) {
      await this.redisClient.del(keys);
    }
    return tx; // Return the newly created transaction.
  }
}
