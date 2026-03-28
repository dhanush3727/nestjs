# NestJS:
Before move to nestjs, things to know:
1. Decorators
2. Dependency Injection
These are the two main concepts that nestjs is built on top of.

## Decorators:
A decorator is just a function that wraps another function or class and modifies its behavior without changing its original code.
Ex:
```ts
function logger(fn) {
  return function (...args) {
    console.log(`Arguments: ${args}`);
    const result = fn(...args);
    console.log(`Result: ${result}`);
    return result;
  };
}

function add(a, b) {
  return a + b;
}

const loggedAdd = logger(add);
loggedAdd(2, 3);
```
In this example, the `logger` function is a decorator that wraps the `add` function. It logs the arguments and the result of the `add` function without modifying its original code.
In NestJS, decorators are used to define controllers, services, modules and other components. They provide a way to add metadata to classes and methods, which NestJS uses to manage the application structure and behavior.
For example, the `@Controller` decorator is used to define a controller class, and the `@Get` decorator is used to define a route handler for GET requests.

## Dependency Injection:
Dependency Injection (DI) is a design pattern that allows a class to receive its dependencies from an external source rather than creating them itself. This promotes loose coupling and makes the code more modular and testable.
Ex:
```ts
class Service {
  constructor(userRep) {
    this.userRep = userRep;
  }
}
const userRepo = new UserRepository();
const service = new Service(userRepo);
```
In this example, the `Service` class depends on the `UserRepository` class. Instead of creating an instance of `UserRepository` inside the `Service` class, we inject it from outside. This allows us to easily swap out the `UserRepository` with a different implementation if needed, and it also makes testing easier since we can mock the dependency.
In NestJS, dependency injection is a core feature. You can define providers (services) and inject them into controllers or other services using the `@Injectable` decorator. NestJS will automatically resolve the dependencies and provide the necessary instances when needed.

## NestJS Setup:
To set up a NestJS project, you can use the Nest CLI. First, install the Nest CLI globally:
```bash
npm install -g @nestjs/cli
```
Then, create a new NestJS project:
```bash
nest new project-name
```
This will create a new NestJS project with the necessary files and folders. You can then navigate to the project directory and start the development server:
```bash
cd project-name
npm run start:dev
```
This will start the NestJS application in development mode, allowing you to make changes and see the results immediately. You can access the application at `http://localhost:3000` by default.
