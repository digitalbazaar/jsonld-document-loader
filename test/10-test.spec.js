/*!
 * Copyright (c) 2019-2023 Digital Bazaar, Inc. All rights reserved.
 */
import {CachedResolver} from '@digitalbazaar/did-io';
import chai from 'chai';
import {JsonLdDocumentLoader} from '../lib/index.js';
import {sampleDoc} from './mock.data.js';

const should = chai.should();

describe('jsonld-document-loader', () => {
  describe('addStatic API', () => {
    it('accepts valid arguments', () => {
      const jldl = new JsonLdDocumentLoader();
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
      const jldl = new JsonLdDocumentLoader();
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
      const jldl = new JsonLdDocumentLoader();
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
      const jldl = new JsonLdDocumentLoader();
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
      const jldl = new JsonLdDocumentLoader();
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
      const jldl = new JsonLdDocumentLoader();
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
      const jldl = new JsonLdDocumentLoader();
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
    it('should clone a document', async () => {
      const documentUrl = 'https://example.org/context';
      const originalDoc = {
        '@context': {
          id: '@id',
          type: '@type',
          '@protected': true,
          myTerm: {
            '@id': 'https://example.org/context#myTerm',
            '@type': 'https://example.org/types#myType'
          }
        }
      };
      const expectedDoc = structuredClone(originalDoc);
      const jldl = new JsonLdDocumentLoader();
      jldl.addStatic(documentUrl, originalDoc);
      originalDoc.mutated = true;
      const result = await jldl.documentLoader(documentUrl);
      should.exist(
        result,
        `Expected documentLoader to return a document for ${documentUrl}.`);
      result.should.be.an(
        'object',
        'Expected document to be an object.');
      should.exist(result.document, 'Expected result to have a document.');
      result.document.should.not.eql(
        originalDoc,
        'Expected document from documentLoader to not equal mutated document.');
      result.document.should.eql(
        expectedDoc,
        'Expected document from documentLoader to equal unmutated document.');
    });
    it('allows overwrites', () => {
      const jldl = new JsonLdDocumentLoader();
      const documentUrl = 'https://example.com/foo.jsonld';
      let error;
      try {
        jldl.addStatic(documentUrl, sampleDoc);
        jldl.addStatic(documentUrl, sampleDoc);
      } catch(e) {
        error = e;
      }
      should.not.exist(error);
    });
  }); // end addStatic API

  describe('addDocuments API', () => {
    it('throws TypeError with no documents', () => {
      const jldl = new JsonLdDocumentLoader();
      let error;
      try {
        jldl.addDocuments();
      } catch(e) {
        error = e;
      }
      should.exist(error);
      error.should.be.instanceOf(TypeError);
    });
    it('throws TypeError with null documents', () => {
      const jldl = new JsonLdDocumentLoader();
      let error;
      try {
        jldl.addDocuments({documents: null});
      } catch(e) {
        error = e;
      }
      should.exist(error);
      error.should.be.instanceOf(TypeError);
    });
    it('throws TypeError with undefined documents', () => {
      const jldl = new JsonLdDocumentLoader();
      let error;
      try {
        jldl.addDocuments({documents: undefined});
      } catch(e) {
        error = e;
      }
      should.exist(error);
      error.should.be.instanceOf(TypeError);
    });
    it('throws TypeError with non-iterable', () => {
      const jldl = new JsonLdDocumentLoader();
      let error;
      try {
        jldl.addDocuments({documents: {}});
      } catch(e) {
        error = e;
      }
      should.exist(error);
      error.should.be.instanceOf(TypeError);
    });
    it('add multiple documents', async () => {
      const jldl = new JsonLdDocumentLoader();
      const documentUrl1 = 'https://example.com/foo1.jsonld';
      const documentUrl2 = 'https://example.com/foo2.jsonld';
      const documents = new Map([
        [documentUrl1, sampleDoc],
        [documentUrl2, sampleDoc]
      ]);
      let error;
      try {
        jldl.addDocuments({documents});
        const documentLoader = jldl.build();
        const result1 = await documentLoader(documentUrl1);
        should.exist(result1);
        should.exist(result1.documentUrl);
        should.exist(result1.document);
        const result2 = await documentLoader(documentUrl2);
        should.exist(result2);
        should.exist(result2.documentUrl);
        should.exist(result2.document);
      } catch(e) {
        error = e;
      }
      should.not.exist(error);
    });
    it('allows overwrites', () => {
      const jldl = new JsonLdDocumentLoader();
      const documentUrl1 = 'https://example.com/foo1.jsonld';
      const documents = [
        [documentUrl1, sampleDoc],
        [documentUrl1, sampleDoc]
      ];
      let error;
      try {
        jldl.addDocuments({documents});
      } catch(e) {
        error = e;
      }
      should.not.exist(error);
    });
  }); // end addDocuments API

  describe('documentLoader API', () => {
    it('throws error when url is not a string', async () => {
      const jldl = new JsonLdDocumentLoader();

      let result;
      let error;
      try {
        result = await jldl.documentLoader();
      } catch(e) {
        error = e;
      }
      should.not.exist(result);
      should.exist(error);
      error.should.be.instanceOf(Error);
      error.message.should.equal('The "url" parameter must be a string.');
    });
    it('throws Error on document not found', async () => {
      const jldl = new JsonLdDocumentLoader();
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
      const jldl = new JsonLdDocumentLoader();
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
        tag: 'static'
      });
    });
    it('throws an error if unsupported did method is passed in', async () => {
      const jldl = new JsonLdDocumentLoader();
      jldl.setDidResolver(new CachedResolver());
      let result;
      let error;
      try {
        result = await jldl.documentLoader('did:example:unsupported:1234');
      } catch(e) {
        error = e;
      }
      should.not.exist(result);
      should.exist(error);
      error.should.be.instanceOf(Error);
      error.message.should
        .equal('Driver for DID did:example:unsupported:1234 not found.');
    });
    it('fetches a did document for an installed did method', async () => {
      const jldl = new JsonLdDocumentLoader();
      const exampleDid = 'did:ex:12345';
      const mockExampleDidDriver = {
        method: 'ex',
        get: async () => {
          return {
            '@context': 'https://www.w3.org/ns/did/v1',
            id: 'did:ex:12345'
          };
        }
      };
      jldl.setDidResolver(mockExampleDidDriver);
      const result = await jldl.documentLoader(exampleDid);
      should.exist(result);
      result.should.have.keys(['contextUrl', 'document', 'documentUrl']);
      result.documentUrl.should.equal(exampleDid);
      result.document['@context'].should.equal('https://www.w3.org/ns/did/v1');
    });
  }); // end documentLoader API
});
