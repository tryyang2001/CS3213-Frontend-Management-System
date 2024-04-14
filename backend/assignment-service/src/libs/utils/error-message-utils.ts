import { ZodError } from "zod";

export function formatZodErrorMessage(error: ZodError<unknown>): string {
  let errorMessage = JSON.parse(error.message)[0];

  if (errorMessage.message === "Required") {
    if (errorMessage.path.length > 1) {
      errorMessage = `${errorMessage.path[0][0].toUpperCase() + errorMessage.path[0].substr(1)} ${errorMessage.path[errorMessage.path.length - 1]} is required.`;
    } else {
      const errorField = JSON.parse(error.message)[0].path[0];
      errorMessage = `${
        errorField[0].toUpperCase() + errorField.substr(1)
      } is required.`;
    }
  } else if (
    errorMessage.minimum !== undefined ||
    errorMessage.maximum !== undefined ||
    (errorMessage.expected !== undefined && errorMessage.received !== undefined)
  ) {
    errorMessage = `Invalid ${errorMessage.path[0]}. ${errorMessage.message}`;
  }
  return Object.keys(errorMessage).includes("message")
    ? errorMessage.message
    : errorMessage;
}
