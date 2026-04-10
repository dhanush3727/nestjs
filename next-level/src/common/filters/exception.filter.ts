import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch() // This decorator tells NestJS that this class is an exception filter that can catch any type of exception
// The GlobalExceptionFilter class implements the ExceptionFilter interface, which requires us to implement the catch method
export class GlobalExceptionFilter implements ExceptionFilter {
  // The catch method is called whenever an exception is thrown in the application
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // Get the HTTP context from the ArgumentsHost, which allows us to access the request and response objects
    const response = ctx.getResponse(); // Get the response object from the HTTP context, which we will use to send the error response back to the client

    let status = 500; // Default to 500 Internal Server Error for unhandled exceptions
    let message: string = 'Internal Server Error'; // Default error message for unhandled exceptions
    let errors = null; // Initialize errors to null, which will be used to hold any additional error details if available

    // Check if the exception is an instance of HttpException, which is a common base class for HTTP-related exceptions in NestJS
    if (exception instanceof HttpException) {
      status = exception.getStatus(); // Get the HTTP status code from the exception (e.g., 400 for Bad Request, 404 for Not Found, etc.)
      const res = exception.getResponse(); // Get the response body from the exception, which may contain additional details about the error

      // If the response is a string, use it as the error message. Otherwise, if it's an object, try to extract the message and any additional errors from it.
      if (typeof res === 'string') {
        message = res;
      } else {
        const r = res as any; // Cast the response to any type to access its properties
        message = r.message || message; // Use the message from the response if available, otherwise use the default message
        errors = r.errors || null; // Use the errors from the response if available, otherwise use null
      }
    }

    // Send the error response back to the client with a consistent structure that includes success, statusCode, message, and any additional errors
    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      errors,
    });
  }
}
