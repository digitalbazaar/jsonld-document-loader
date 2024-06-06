# jsonld-document-loader

## 2.1.0 - 2024-xx-xx

### Changed
- `addStatic` deep clones documents to avoid shared document mutation issues.
  - The clone adds potential time and memory use considerations depending on
    the frequency of `addStatic` calls and on document size. For expected use
    cases this should be minimal.
  - [structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
    is used and may not be available in old browsers and Node.js before v17.
    Use a polyfill if needed.

## 2.0.0 - 2023-02-06

### Changed
- **BREAKING**: Convert to module (ESM).
- **BREAKING**: Drop support for node <= 14.
- Update dev deps to latest.
- Use `c8@7.12.0` for coverage.

## 1.2.1 - 2022-03-09

### Fixed
- Only set `static` tag for statically loaded contexts.

## 1.2.0 - 2021-04-28

### Added
- Adds `setProtocolHandler()` method (and a did-specific alias for it,
  `setDidResolver()`).

## 1.1.0 - 2020-11-19

### Added
- Set `static` tag for statically loaded contexts.

## 1.0.0 - 2019-10-18

- See git history for changes.
