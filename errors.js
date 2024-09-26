const VALID_ERROR_CLASS_NAMES_FRONT_END = ["LoginError", "ValidationError"];

// ### REGION: Getters
export const getErrorFormatted = (error) => {
  console.log(error.name);
  if (VALID_ERROR_CLASS_NAMES_FRONT_END.includes(error.name)) {
    return error;
  }
  
  return { message: "Unknown error", statusCode: 500 };
};
// ### END REGION

// ### REGION: Setters
const createErrorClass = function (name, code) {
  return class CustomError extends Error {
    constructor(message) {
      super(`${name}: ${message}`);
      this.name = name;
      this.statusCode = code;
    }
  };
};
// ### END REGION

export const LoginError = createErrorClass("LoginError", 401);
export const InternalError = createErrorClass("InternalError", 500);
export const ValidationError = createErrorClass("ValidationError", 400);
