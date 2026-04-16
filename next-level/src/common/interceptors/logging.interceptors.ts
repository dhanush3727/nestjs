import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { WinstonLogger } from '../logger/winston.logger';
import { MetricsService } from '../metrics/metrics.service';

@Injectable()
// This interceptor logs the HTTP method, URL, and the time taken to process the request.
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: WinstonLogger,
    private readonly metrics: MetricsService,
  ) {} // Inject the WinstonLogger and MetricsService to log messages and track metrics.

  // The intercept method is called for each incoming request.
  intercept(
    context: ExecutionContext, // The execution context provides details about the current request.
    next: CallHandler<any>, // The call handler is responsible for handling the request and returning an observable.
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest(); // Get the HTTP request object from the execution context.
    const { method, url } = req; // Extract the HTTP method and URL from the request object.
    const startTime = Date.now(); // Record the start time to calculate the duration later.

    // Handle the request and log the method, URL, and duration when the response is sent.
    return next.handle().pipe(
      // The tap operator allows us to perform side effects (like logging) without affecting the response stream.
      tap(() => {
        const endTime = Date.now();

        const duration = endTime - startTime;

        this.metrics.incrementRequests(); // Increment the request count in the MetricsService.

        this.logger.log(`${method} ${url} - ${duration}ms`); // Log the method, URL, and duration using the WinstonLogger.
      }),
    );
  }
}
