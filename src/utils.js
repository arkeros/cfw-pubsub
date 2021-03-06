import '@sagi.io/globalthis';
import base64url from 'base64url';

const ERR_PREFIX = `@sagi.io/cfw-pubsub`;

export const keepTruthyProperties = obj =>
  Object.entries(obj).reduce(
    (acc, [k, v]) => ({ ...acc, ...(v ? { [k]: v } : {}) }),
    {}
  );

// https://cloud.google.com/pubsub/docs/reference/rest/v1/PubsubMessage
export const createPubSubMessage = ({
  message = null,
  attributes = null,
} = {}) => {
  if (!message && !attributes) {
    throw new Error(
      `${ERR_PREFIX}: must either have a non-empty message field or at least one attribute.`
    );
  }
  const data = message ? base64url.encode(message) : null;
  const psMessage = { data, attributes };
  return keepTruthyProperties(psMessage);
};

export const setGlobals = (fetchImpl = null) => {
  if (!globalThis.fetch) {
    if (!fetchImpl) {
      throw new Error(`${ERR_PREFIX}: No fetch nor fetchImpl were found.`);
    } else {
      globalThis.fetch = fetchImpl;
    }
  }
};

export const injectBaseInputs = (baseInputs, fnObj) =>
  Object.entries(fnObj).reduce(
    (acc, [name, fn]) => ({ ...acc, [name]: fn(baseInputs) }),
    {}
  );
