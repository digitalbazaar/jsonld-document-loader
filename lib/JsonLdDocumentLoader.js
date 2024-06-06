/*!
 * Copyright (c) 2019-2024 Digital Bazaar, Inc. All rights reserved.
 */

export class JsonLdDocumentLoader {
  constructor() {
    this.documents = new Map();
    this.protocolHandlers = new Map();
  }

  /**
   * Adds a URL to document mapping to the loader.
   *
   * The document will be cloned.
   *
   * @param {string} url - The URL of a document,
   *   etc.
   * @param {object} document -The document.
   */
  addStatic(url, document) {
    if(!_isString(url)) {
      throw new TypeError('The first parameter (url) must be a string.');
    }
    if(!_isObject(document)) {
      throw new TypeError('The second parameter (document) must be an object.');
    }
    this.documents.set(url, structuredClone(document));
  }

  /**
   * Adds a custom protocol handler to the loader.
   *
   * @example
   * // Using did-io's CachedResolver instance as a did: protocol handler
   * jld.addProtocolHandler({protocol: 'did', handler: cachedResolver});
   *
   * @param {object} options -The options to use.
   * @param {string} options.protocol - Protocol id, such as 'did', 'https',
   *   etc.
   * @param {{get: Function}} options.handler - Protocol handler object,
   *   exposes an async `get({url})` method.
   */
  setProtocolHandler({protocol, handler} = {}) {
    this.protocolHandlers.set(protocol, handler);
  }

  /**
   * Sets a DID resolver (either a method-specific resolver  to support just a
   * single DID method, or a general driver harness to support multiple DID
   * methods) as the 'did' protocol handler.
   *
   * @param {object} didResolver - A did-io style did method driver, such
   *   as did-method-key and did-veres-one. (Exposes a `.method` property,
   *   and a `.get()` function).
   */
  setDidResolver(didResolver) {
    this.setProtocolHandler({protocol: 'did', handler: didResolver});
  }

  async documentLoader(url) {
    if(!_isString(url)) {
      throw new TypeError('The "url" parameter must be a string.');
    }
    let document;

    // First, check in the static document list
    document = this.documents.get(url);

    // if static document was found, use `static` tag
    let tag;
    if(document) {
      tag = 'static';
    }

    if(!document) {
      const [protocol] = url.split(':');
      // Check if this protocol has a custom handler installed
      if(this.protocolHandlers.has(protocol)) {
        document = await this.protocolHandlers.get(protocol).get({url});
      }
    }

    if(document) {
      const result = {
        contextUrl: null,
        document,
        documentUrl: url
      };
      // include `tag` if set
      if(tag) {
        result.tag = tag;
      }
      return result;
    }
    throw new Error(`Document not found in document loader: ${url}`);
  }

  /**
   * Returns the self-contained `documentLoader` function for passing to various
   * json-ld libraries.
   *
   * @example
   * import {JsonLdDocumentLoader} from 'jsonld-document-loader';
   * const jdl = new JsonLdDocumentLoader();
   * jdl.addSatic(MY_URL, MY_CONTEXT);
   * const doucmentLoader = jdl.build();
   *
   * @returns {Function} - The self-contained `documentLoader` function.
   */
  build() {
    return this.documentLoader.bind(this);
  }
}

function _isString(arg) {
  return typeof (arg) === 'string';
}
function _isObject(arg) {
  return typeof (arg) === 'object' && arg !== null;
}
