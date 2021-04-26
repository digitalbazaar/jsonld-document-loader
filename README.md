# JSON-LD Document Loader _(jsonld-document-loader)_

[![Build Status](https://img.shields.io/github/workflow/status/digitalbazaar/jsonld-document-loader/Node.js%20CI)](https://github.com/digitalbazaar/jsonld-document-loader/actions?query=workflow%3A%22Node.js+CI%22)
[![NPM Version](https://img.shields.io/npm/v/jsonld-document-loader.svg)](https://npm.im/@digitalbazaar/jsonld-document-loader)

> A document loader API for jsonld.js.

## Table of Contents

- [Background](#background)
- [Security](#security)
- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [Commercial Support](#commercial-support)
- [License](#license)

## Background

TBD

## Security

TBD

## Install

- Node.js 12+ is required.

### NPM

To install via NPM:

```
npm install --save jsonld-document-loader
```

### Development

To install locally (for development):

```
git clone https://github.com/digitalbazaar/jsonld-document-loader.git
cd jsonld-document-loader
npm install
```

## Usage

```js
import {JsonLdDocumentLoader} from 'jsonld-document-loader';
// or
const {JsonLdDocumentLoader} = require('jsonld-document-loader');

const loader = new JsonLdDocumentLoader();
```

### `addStatic()`

The `addStatic()` method allows developers to load fixed static contexts and
documents, to ensure known versions and contents, without going out to the
network.

For example, to add support for the DID Core context, the VC context, and crypto 
suite specific contexts:

```js
import cred from 'credentials-context';
import didContext from 'did-context';
import ed25519Ctx from 'ed25519-signature-2020-context';

const {contexts: credentialsContexts, constants: {CREDENTIALS_CONTEXT_V1_URL}} =
  cred;

const jdl = new JsonLdDocumentLoader();

jdl.addStatic(ed25519Ctx.CONTEXT_URL, ed25519Ctx.CONTEXT);

jdl.addStatic(
  didContext.constants.DID_CONTEXT_URL,
  didContext.contexts.get(didContext.constants.DID_CONTEXT_URL)
);

jdl.addStatic(
  CREDENTIALS_CONTEXT_V1_URL,
  credentialsContexts.get(CREDENTIALS_CONTEXT_V1_URL)
);

const documentLoader = jdl.build();
// Pass to jsonld, jsonld-signatures, vc-js and similar libraries
```

### `addDidResolver()`

To add support for resolving DIDs and DID-related key ids:

```js
import * as didKey from '@digitalbazaar/did-method-key';
import {CachedResolver} from '@digitalbazaar/did-io';

const cachedResolver = new CachedResolver();
const jdl = new JsonLdDocumentLoader();

cachedResolver.use(didKey.driver());

jdl.addDidResolver(cachedResolver);

// Now you can resolve did:key type DIDs and key objects
const verificationKeyId = 'did:key:z6MkuBLrjSGt1PPADAvuv6rmvj4FfSAfffJotC6K8ZEorYmv#z6MkuBLrjSGt1PPADAvuv6rmvj4FfSAfffJotC6K8ZEorYmv';
await jdl.documentLoader(verificationKeyId);
// ->
{
  documentUrl: 'did:key:z6MkuBLrjSGt1PPADAvuv6rmvj4FfSAfffJotC6K8ZEorYmv#z6MkuBLrjSGt1PPADAvuv6rmvj4FfSAfffJotC6K8ZEorYmv',
  document: {
    "@context": "https://w3id.org/security/suites/ed25519-2020/v1",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:key:z6MkuBLrjSGt1PPADAvuv6rmvj4FfSAfffJotC6K8ZEorYmv",
    "publicKeyMultibase": "zFj5p9C2Sfqth6g6DEXtw5dWFqrtpFn4TCBBPJHGnwKzY",
    // ...
  }
}
```

### `addProtocolHandler()`

You can also add support for a custom protocol handler:

```js
const customHandler = {
  get: ({url}) => {
    // return document
  }
}

// For entertainment purposes only; please don't actually use FTP
jdl.addProtocolHandler({protocol: 'ftp', handler: customHandler});
```

## Contribute

See [the contribute file](https://github.com/digitalbazaar/bedrock/blob/master/CONTRIBUTING.md)!

PRs accepted.

If editing the Readme, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## Commercial Support

Commercial support for this library is available upon request from
Digital Bazaar: support@digitalbazaar.com

## License

[New BSD License (3-clause)](LICENSE) © Digital Bazaar
