/**
 * All possible Xmpp error conditions used in xep-0060.
 */
export enum XmppErrorCondition {
  BadRequest = 'bad-request',
  Conflict = 'conflict',
  FeatureNotImplemented = 'feature-not-implemented',
  Forbidden = 'forbidden',
  Gone = 'gone',
  InternalServerError = 'internal-server-error',
  ItemNotFound = 'item-not-found',
  JidMalformed = 'jid-malformed',
  NotAcceptable = 'not-acceptable',
  NotAllowed = 'not-allowed',
  NotAuthorized = 'not-authorized',
  PaymentRequired = 'payment-required',
  PolicyViolation = 'policy-violation',
  Timeout = 'timeout',
  UnexpectedRequest = 'unexpected-request',
  Unsupported = 'unsupported',
}

/**
 * An XMPP specific error object that contains the condition in addition to a user friendly message.
 */
export class XmppError extends Error {

  constructor(message: string, public readonly condition: XmppErrorCondition | string) {
    super(message);

    // Set the prototype explicitly
    // (See https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work)
    Object.setPrototypeOf(this, XmppError.prototype);
  }
}

/**
 * Maps the given error object into an XmppError.
 * You must only provide error message mappings for the conditions that can occur during the xmpp request.
 * Generic errors such as timeout and internal server errors are handled by this method.
 *
 * @param error the error as returned by stanza.io or the xmpp service.
 * @param conditionToErrorMapping {{[key: string]: string}} Specific error handling. Use {@link XmppErrorCondition} as keys!
 */
export function JxtErrorToXmppError(error: any, conditionToErrorMapping: { [key: string]: string }): XmppError {
  if (error && error.condition) {
    if (conditionToErrorMapping && conditionToErrorMapping[error.condition]) {
      return new XmppError(conditionToErrorMapping[error.condition], error.condition);
    } else if (error.condition === XmppErrorCondition.Timeout) {
      return new XmppError('Connection has timed out', error.condition);
    } else if (error.condition === XmppErrorCondition.InternalServerError) {
      return new XmppError('Internal Server Error', error.condition);
    }
  }
  if (error instanceof Error) {
    return new XmppError(`An unknown error has occurred: ${error.message}!`, undefined);
  }
  return new XmppError(`An unknown error has occurred: ${JSON.stringify(error)}!`, undefined);
}

/**
 * Safely converts the given error into a human readable error.
 *
 * @param error
 * @constructor
 */
export function ErrorToString(error: any): string {
  if (error instanceof XmppError) {
    return error.message;
  } else if (error instanceof Error) {
    return `An unknown error has occurred: ${error.message}`;
  } else {
    return `An unknown error has occurred: ${JSON.stringify(error)}`;
  }
}
