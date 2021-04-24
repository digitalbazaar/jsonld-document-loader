/*!
 * Copyright (c) 2019-2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {CachedResolver} = require('@digitalbazaar/did-io');

class JsonLdDocumentLoader {
  constructor() {
    this.documents = new Map();
    this.didDrivers = new CachedResolver();
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
   * Adds a DID method specific driver to the cached resolver.
   *
   * @param {object} didMethodDriver - A did-io style did method driver, such
   *   as did-method-key and did-veres-one. (Exposes a `.method` property,
   *   and a `.get()` function.)
   */
  addResolver(didMethodDriver) {
    this.didDrivers.use(didMethodDriver);
  }

  async documentLoader(url) {
    if(!_isString(url)) {
      throw new TypeError('The "url" parameter must be a string.');
    }
    let document;

    // First, check in the static document list
    document = this.documents.get(url);

    if(!document && url.startsWith('did:')) {
      // Fetch a DID Document or a key object (for did key ids)
      // Throws error if did method support not installed (via addResolver)
      document = await this.didDrivers.get({url});
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
