import { TimeError } from "../types/response.ts";

function stringToUnixTime(inputStr: string): number {
  const unit: string = inputStr.slice(-1);
  const value: number = parseInt(inputStr.slice(0, -1));

  const now = Date.now();
  let result = 0;

  if (unit === "m") {
    result = now + value * 60 * 1000; // 1 minute = 60,000 milliseconds
  } else if (unit === "h") {
    result = now + value * 60 * 60 * 1000; // 1 hour = 3,600,000 milliseconds
  } else if (unit === "d") {
    result = now + value * 24 * 60 * 60 * 1000; // 1 day = 86,400,000 milliseconds
  } else {
    throw new TimeError("Invalid time unit");
  }

  return result;
}

function convertAll(time: string): number {
  let overall = 0;
  const numbersRegex = /\d+/g;
  const lettersRegex = /[a-zA-Z]+/g;

  const numbers = time.match(numbersRegex);
  const letters = time.match(lettersRegex);

  for (let i = 0; i < numbers!.length; i++) {
    overall = overall + stringToUnixTime(`${numbers![i]}${letters![i]}`);
  }

  return overall;
}

export { convertAll };
