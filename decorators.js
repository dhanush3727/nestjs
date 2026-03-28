// Decorator Example
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
loggedAdd(2, 3); // Logs arguments and result of the add function

// Dependency injection example
class Service {
  constructor(userRep) {
    this.userRep = userRep;
  }
}
const userRepo = new UserRepository();
const service = new Service(userRepo); // Injecting the user repository into the service
