/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const should = require('chai').should();
const {sampleDoc} = require('./mock.data');

describe('jsonld-document-loader', () => {
  describe('addStatic API', () => {
    it('accepts valid arguments', () => {
      const jldl = new (require('..')).JsonLdDocumentLoader();
      const documentUrl = 'https://example.com/foo.jsonld';
      let error;
      try {
        jldl.addStatic(documentUrl, sampleDoc);
      } catch(e) {
        error = e;
      }
      should.not.exist(error);
    });
    it('Throws TypeError on undefined url parameter', () => {
      const jldl = new (require('..')).JsonLdDocumentLoader();
      const documentUrl = undefined;
      let error;
      try {
        jldl.addStatic(documentUrl, sampleDoc);
      } catch(e) {
        error = e;
      }
      should.exist(error);
      error.should.be.instanceOf(TypeError);
    });
    it('Throws TypeError on null url parameter', () => {
      const jldl = new (require('..')).JsonLdDocumentLoader();
      const documentUrl = null;
      let error;
      try {
        jldl.addStatic(documentUrl, sampleDoc);
      } catch(e) {
        error = e;
      }
      should.exist(error);
      error.should.be.instanceOf(TypeError);
    });
    it('Throws TypeError on object url parameter', () => {
      const jldl = new (require('..')).JsonLdDocumentLoader();
      const documentUrl = {some: 'object'};
      let error;
      try {
        jldl.addStatic(documentUrl, sampleDoc);
      } catch(e) {
        error = e;
      }
      should.exist(error);
      error.should.be.instanceOf(TypeError);
    });
    it('Throws TypeError on null document parameter', () => {
      const jldl = new (require('..')).JsonLdDocumentLoader();
      const documentUrl = 'https://example.com/foo.jsonld';
      const sampleDoc = null;
      let error;
      try {
        jldl.addStatic(documentUrl, sampleDoc);
      } catch(e) {
        error = e;
      }
      should.exist(error);
      error.should.be.instanceOf(TypeError);
    });
    it('Throws TypeError on undefined document parameter', () => {
      const jldl = new (require('..')).JsonLdDocumentLoader();
      const documentUrl = 'https://example.com/foo.jsonld';
      const sampleDoc = undefined;
      let error;
      try {
        jldl.addStatic(documentUrl, sampleDoc);
      } catch(e) {
        error = e;
      }
      should.exist(error);
      error.should.be.instanceOf(TypeError);
    });
    it('Throws TypeError on string document parameter', () => {
      const jldl = new (require('..')).JsonLdDocumentLoader();
      const documentUrl = 'https://example.com/foo.jsonld';
      const sampleDoc = 'a string';
      let error;
      try {
        jldl.addStatic(documentUrl, sampleDoc);
      } catch(e) {
        error = e;
      }
      should.exist(error);
      error.should.be.instanceOf(TypeError);
    });
  }); // end addStatic API

  describe('documentLoader API', () => {
    it('throws Error on document not found', async () => {
      const jldl = new (require('..')).JsonLdDocumentLoader();
      const documentUrl = 'https://example.com/foo.jsonld';
      let result;
      let error;
      try {
        result = await jldl.documentLoader(documentUrl);
      } catch(e) {
        error = e;
      }
      should.not.exist(result);
      should.exist(error);
      error.should.be.instanceOf(Error);
      error.message.should.contain(documentUrl);
    });
    it('properly returns a document', async () => {
      const jldl = new (require('..')).JsonLdDocumentLoader();
      let result;
      let error;
      const documentUrl = 'https://example.com/foo.jsonld';
      jldl.addStatic(documentUrl, sampleDoc);
      try {
        result = await jldl.documentLoader(documentUrl);
      } catch(e) {
        error = e;
      }
      should.not.exist(error);
      should.exist(result);
      result.should.eql({
        contextUrl: null,
        document: sampleDoc,
        documentUrl,
      });
    });
  }); // end documentLoader API
});
