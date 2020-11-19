/*!
 * Copyright (c) 2019-2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

class JsonLdDocumentLoader {
  constructor() {
    this.documents = new Map();
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

  async documentLoader(url) {
    const document = this.documents.get(url);
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
}

function _isString(arg) {
  return typeof (arg) === 'string';
}
function _isObject(arg) {
  return typeof (arg) === 'object' && arg !== null;
}

module.exports = JsonLdDocumentLoader;
