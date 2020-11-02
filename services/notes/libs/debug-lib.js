import util from "util";
import AWS from "aws-sdk";

let logs;

// Log AWS SDK calls
// Telling the AWS SDK to log using our logger, the debug() method
AWS.config.logger = { log: debug };

export default function debug() {
  logs.push({
    date: new Date(),
    string: util.format.apply(null, arguments),
  });
}

//  Initialize debugger by calling init().
// log the API request info, including the path parameters, query string parameters, and request body
// using internal debug() method
export function init(event, context) {
  logs = [];

  // Log API event
  debug("API event", {
    body: event.body,
    pathParameters: event.pathParameters,
    queryStringParameters: event.queryStringParameters,
  });
}

// log messages using our debug() method.
// Debug messages logged using this method only get printed out when we call the flush() method.
// store the log info (when calling debug()) in memory inside the logs array. And when we call flush() (in the case of an error), we console.debug() all those stored log messages.
export function flush(error) {
  logs.forEach(({ date, string }) => console.debug(date, string));
  console.error(error);
}
