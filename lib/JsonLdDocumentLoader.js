/*!
 * Copyright (c) 2019-2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

class JsonLdDocumentLoader {
  constructor() {
    this.documents = new Map();
    this.protocolHandlers = new Map();
  }

  addStatic(url, document) {
    if(!_isString(url)) {
      throw new TypeError('The first parameter (url) must be a string.');
    }
    if(!_isObject(document)) {
      throw new TypeError('The second parameter (document) must be an object.');
    }
    this.documents.set(url, document);
  }

  /**
   * Adds a custom protocol handler to the loader.
   *
   * @example
   * // Using did-io's CachedResolver instance as a did: protocol handler
   * jld.addProtocolHandler({protocol: 'did', handler: cachedResolver});
   *
   * @param {string} protocol - Protocol id, such as 'did', 'https', etc.
   * @param {{get: Function}} handler - Protocol handler object, exposes an
   *   async `get({url})` method.
   */
  addProtocolHandler({protocol, handler} = {}) {
    this.protocolHandlers.set(protocol, handler);
  }

  /**
   * Adds a DID resolver (either a method-specific resolver, or a general driver
   * harness) to protocol handlers.
   *
   * @param {object} didResolver - A did-io style did method driver, such
   *   as did-method-key and did-veres-one. (Exposes a `.method` property,
   *   and a `.get()` function.)
   */
  addDidResolver(didResolver) {
    this.addProtocolHandler({protocol: 'did', handler: didResolver});
  }

  async documentLoader(url) {
    if(!_isString(url)) {
      throw new TypeError('The "url" parameter must be a string.');
    }
    let document;

    // First, check in the static document list
    document = this.documents.get(url);

    if(!document) {
      const [protocol] = url.split(':');
      // Check if this protocol has a custom handler installed
      if(this.protocolHandlers.has(protocol)) {
        document = await this.protocolHandlers.get(protocol)
          .get({url});
      }
    }

    if(document) {
      return {
        contextUrl: null,
        document,
        documentUrl: url,
        tag: 'static'
      };
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
   * @returns {Function}
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

module.exports = JsonLdDocumentLoader;
