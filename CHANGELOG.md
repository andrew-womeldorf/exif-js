# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v3.0.0] - 2020-06-03

**Major version change - breaking changes!!!**

### Added

- `EXIF.getExifTag()` to get a single EXIF tag.
- `EXIF.getAllExifTags()` to get all EXIF tags.
- `EXIF.getAllXmpTags()` to get all XMP tags.

### Changed

- `EXIF.getAllTags()` now returns an object containing all of EXIF, IPTC, and
  XMP Tags. E.g. `{exif: {}, iptc: {}, xmp: {}}`

### Deprecated

- `EXIF.getTag()`

## [v2.5.0] - 2020-06-03

Change behavior of getting raw data. The human-readable strings are not parsed
until the user requests tags in the callback to `getData()`. The `getData()`
will always save raw values. The default behavior does not change - human
readable values are still returned.

There is an additional boolean parameter on any method returning EXIF tags,
which will translate the EXIF tags to human-readable values when set to false.
When set to true, no translation occurs.

This should allow for sharing the tags with any other program that can then map
the raw tags themselves.

This does not affect IPTC or XMP tags.

### Changed

- `EXIF.getTag()` has new boolean parameter at the third position. Set to true
  to receive raw values. Default is false, which maintains previous behavior.
- `EXIF.getAllTags()` has new boolean parameter at the second position. Set to true
  to receive raw values. Default is false, which maintains previous behavior.
- `EXIF.readFromBinaryFile()` has new boolean parameter at the second position. Set to true
  to receive raw values. Default is false, which maintains previous behavior.

## [v2.4.0] - 2020-06-02

When calling `getData()`, allow for retrieving the raw tags. There's a third
parameter on `getData()`, which is a boolean. Setting to true allows for tags to
be saved to the image as raw.

## v2.1.1 07/08/2015

*No changelog for this release.*

## v2.2.0 31/03/2017

Issue #69 #72: Added IPTC methods. New NPM release.

[v3.0.0]: https://github.com/andrew-womeldorf/exif-js/compare/v2.5.0...v3.0.0
[v2.5.0]: https://github.com/andrew-womeldorf/exif-js/compare/v2.4.0...v2.5.0
[v2.4.0]: https://github.com/andrew-womeldorf/exif-js/compare/v2.3.0...v2.4.0
