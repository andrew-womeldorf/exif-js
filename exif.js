/**
 * Exif.js (https://github.com/andrew-womeldorf/exif-js)
 * Copyright 2008 Jacob Seidelin
 * MIT License (https://raw.githubusercontent.com/andrew-womeldorf/exif-js/master/LICENSE)
 */
(function () {
  var debug = false;

  var root = this;

  var EXIF = function (obj) {
    if (obj instanceof EXIF) return obj;
    if (!(this instanceof EXIF)) return new EXIF(obj);
    this.EXIFwrapped = obj;
  };

  if (typeof exports !== "undefined") {
    if (typeof module !== "undefined" && module.exports) {
      exports = module.exports = EXIF;
    }
    exports.EXIF = EXIF;
  } else {
    root.EXIF = EXIF;
  }

  /**
   * Object.assign pollyfill.
   *
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
   */
  if (typeof Object.assign !== "function") {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
      value: function assign(target, varArgs) {
        // .length of function is 2
        "use strict";
        if (target === null || target === undefined) {
          throw new TypeError("Cannot convert undefined or null to object");
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];

          if (nextSource !== null && nextSource !== undefined) {
            for (var nextKey in nextSource) {
              // Avoid bugs when hasOwnProperty is shadowed
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true,
    });
  }

  var ExifTags = (EXIF.Tags = {
    // version tags
    0x9000: "ExifVersion", // EXIF version
    0xa000: "FlashpixVersion", // Flashpix format version

    // colorspace tags
    0xa001: "ColorSpace", // Color space information tag

    // image configuration
    0xa002: "PixelXDimension", // Valid width of meaningful image
    0xa003: "PixelYDimension", // Valid height of meaningful image
    0x9101: "ComponentsConfiguration", // Information about channels
    0x9102: "CompressedBitsPerPixel", // Compressed bits per pixel

    // user information
    0x927c: "MakerNote", // Any desired information written by the manufacturer
    0x9286: "UserComment", // Comments by user

    // related file
    0xa004: "RelatedSoundFile", // Name of related sound file

    // date and time
    0x9003: "DateTimeOriginal", // Date and time when the original image was generated
    0x9004: "DateTimeDigitized", // Date and time when the image was stored digitally
    0x9290: "SubsecTime", // Fractions of seconds for DateTime
    0x9291: "SubsecTimeOriginal", // Fractions of seconds for DateTimeOriginal
    0x9292: "SubsecTimeDigitized", // Fractions of seconds for DateTimeDigitized

    // picture-taking conditions
    0x829a: "ExposureTime", // Exposure time (in seconds)
    0x829d: "FNumber", // F number
    0x8822: "ExposureProgram", // Exposure program
    0x8824: "SpectralSensitivity", // Spectral sensitivity
    0x8827: "ISOSpeedRatings", // ISO speed rating
    0x8828: "OECF", // Optoelectric conversion factor
    0x9201: "ShutterSpeedValue", // Shutter speed
    0x9202: "ApertureValue", // Lens aperture
    0x9203: "BrightnessValue", // Value of brightness
    0x9204: "ExposureBias", // Exposure bias
    0x9205: "MaxApertureValue", // Smallest F number of lens
    0x9206: "SubjectDistance", // Distance to subject in meters
    0x9207: "MeteringMode", // Metering mode
    0x9208: "LightSource", // Kind of light source
    0x9209: "Flash", // Flash status
    0x9214: "SubjectArea", // Location and area of main subject
    0x920a: "FocalLength", // Focal length of the lens in mm
    0xa20b: "FlashEnergy", // Strobe energy in BCPS
    0xa20c: "SpatialFrequencyResponse", //
    0xa20e: "FocalPlaneXResolution", // Number of pixels in width direction per FocalPlaneResolutionUnit
    0xa20f: "FocalPlaneYResolution", // Number of pixels in height direction per FocalPlaneResolutionUnit
    0xa210: "FocalPlaneResolutionUnit", // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
    0xa214: "SubjectLocation", // Location of subject in image
    0xa215: "ExposureIndex", // Exposure index selected on camera
    0xa217: "SensingMethod", // Image sensor type
    0xa300: "FileSource", // Image source (3 == DSC)
    0xa301: "SceneType", // Scene type (1 == directly photographed)
    0xa302: "CFAPattern", // Color filter array geometric pattern
    0xa401: "CustomRendered", // Special processing
    0xa402: "ExposureMode", // Exposure mode
    0xa403: "WhiteBalance", // 1 = auto white balance, 2 = manual
    0xa404: "DigitalZoomRation", // Digital zoom ratio
    0xa405: "FocalLengthIn35mmFilm", // Equivalent foacl length assuming 35mm film camera (in mm)
    0xa406: "SceneCaptureType", // Type of scene
    0xa407: "GainControl", // Degree of overall image gain adjustment
    0xa408: "Contrast", // Direction of contrast processing applied by camera
    0xa409: "Saturation", // Direction of saturation processing applied by camera
    0xa40a: "Sharpness", // Direction of sharpness processing applied by camera
    0xa40b: "DeviceSettingDescription", //
    0xa40c: "SubjectDistanceRange", // Distance to subject

    // other tags
    0xa005: "InteroperabilityIFDPointer",
    0xa420: "ImageUniqueID", // Identifier assigned uniquely to each image
  });

  var TiffTags = (EXIF.TiffTags = {
    0x0100: "ImageWidth",
    0x0101: "ImageHeight",
    0x8769: "ExifIFDPointer",
    0x8825: "GPSInfoIFDPointer",
    0xa005: "InteroperabilityIFDPointer",
    0x0102: "BitsPerSample",
    0x0103: "Compression",
    0x0106: "PhotometricInterpretation",
    0x0112: "Orientation",
    0x0115: "SamplesPerPixel",
    0x011c: "PlanarConfiguration",
    0x0212: "YCbCrSubSampling",
    0x0213: "YCbCrPositioning",
    0x011a: "XResolution",
    0x011b: "YResolution",
    0x0128: "ResolutionUnit",
    0x0111: "StripOffsets",
    0x0116: "RowsPerStrip",
    0x0117: "StripByteCounts",
    0x0201: "JPEGInterchangeFormat",
    0x0202: "JPEGInterchangeFormatLength",
    0x012d: "TransferFunction",
    0x013e: "WhitePoint",
    0x013f: "PrimaryChromaticities",
    0x0211: "YCbCrCoefficients",
    0x0214: "ReferenceBlackWhite",
    0x0132: "DateTime",
    0x010e: "ImageDescription",
    0x010f: "Make",
    0x0110: "Model",
    0x0131: "Software",
    0x013b: "Artist",
    0x8298: "Copyright",
  });

  var GPSTags = (EXIF.GPSTags = {
    0x0000: "GPSVersionID",
    0x0001: "GPSLatitudeRef",
    0x0002: "GPSLatitude",
    0x0003: "GPSLongitudeRef",
    0x0004: "GPSLongitude",
    0x0005: "GPSAltitudeRef",
    0x0006: "GPSAltitude",
    0x0007: "GPSTimeStamp",
    0x0008: "GPSSatellites",
    0x0009: "GPSStatus",
    0x000a: "GPSMeasureMode",
    0x000b: "GPSDOP",
    0x000c: "GPSSpeedRef",
    0x000d: "GPSSpeed",
    0x000e: "GPSTrackRef",
    0x000f: "GPSTrack",
    0x0010: "GPSImgDirectionRef",
    0x0011: "GPSImgDirection",
    0x0012: "GPSMapDatum",
    0x0013: "GPSDestLatitudeRef",
    0x0014: "GPSDestLatitude",
    0x0015: "GPSDestLongitudeRef",
    0x0016: "GPSDestLongitude",
    0x0017: "GPSDestBearingRef",
    0x0018: "GPSDestBearing",
    0x0019: "GPSDestDistanceRef",
    0x001a: "GPSDestDistance",
    0x001b: "GPSProcessingMethod",
    0x001c: "GPSAreaInformation",
    0x001d: "GPSDateStamp",
    0x001e: "GPSDifferential",
  });

  var AllTags = (EXIF.AllTags = Object.assign(
    {},
    EXIF.Tags,
    EXIF.TiffTags,
    EXIF.GPSTags
  ));

  // EXIF 2.3 Spec
  var IFD1Tags = (EXIF.IFD1Tags = {
    0x0100: "ImageWidth",
    0x0101: "ImageHeight",
    0x0102: "BitsPerSample",
    0x0103: "Compression",
    0x0106: "PhotometricInterpretation",
    0x0111: "StripOffsets",
    0x0112: "Orientation",
    0x0115: "SamplesPerPixel",
    0x0116: "RowsPerStrip",
    0x0117: "StripByteCounts",
    0x011a: "XResolution",
    0x011b: "YResolution",
    0x011c: "PlanarConfiguration",
    0x0128: "ResolutionUnit",
    0x0201: "JpegIFOffset", // When image format is JPEG, this value show offset to JPEG data stored.(aka "ThumbnailOffset" or "JPEGInterchangeFormat")
    0x0202: "JpegIFByteCount", // When image format is JPEG, this value shows data size of JPEG image (aka "ThumbnailLength" or "JPEGInterchangeFormatLength")
    0x0211: "YCbCrCoefficients",
    0x0212: "YCbCrSubSampling",
    0x0213: "YCbCrPositioning",
    0x0214: "ReferenceBlackWhite",
  });

  var StringValues = (EXIF.StringValues = {
    ExposureProgram: {
      0: "Not defined",
      1: "Manual",
      2: "Normal program",
      3: "Aperture priority",
      4: "Shutter priority",
      5: "Creative program",
      6: "Action program",
      7: "Portrait mode",
      8: "Landscape mode",
    },
    MeteringMode: {
      0: "Unknown",
      1: "Average",
      2: "CenterWeightedAverage",
      3: "Spot",
      4: "MultiSpot",
      5: "Pattern",
      6: "Partial",
      255: "Other",
    },
    LightSource: {
      0: "Unknown",
      1: "Daylight",
      2: "Fluorescent",
      3: "Tungsten (incandescent light)",
      4: "Flash",
      9: "Fine weather",
      10: "Cloudy weather",
      11: "Shade",
      12: "Daylight fluorescent (D 5700 - 7100K)",
      13: "Day white fluorescent (N 4600 - 5400K)",
      14: "Cool white fluorescent (W 3900 - 4500K)",
      15: "White fluorescent (WW 3200 - 3700K)",
      17: "Standard light A",
      18: "Standard light B",
      19: "Standard light C",
      20: "D55",
      21: "D65",
      22: "D75",
      23: "D50",
      24: "ISO studio tungsten",
      255: "Other",
    },
    Flash: {
      0x0000: "Flash did not fire",
      0x0001: "Flash fired",
      0x0005: "Strobe return light not detected",
      0x0007: "Strobe return light detected",
      0x0009: "Flash fired, compulsory flash mode",
      0x000d: "Flash fired, compulsory flash mode, return light not detected",
      0x000f: "Flash fired, compulsory flash mode, return light detected",
      0x0010: "Flash did not fire, compulsory flash mode",
      0x0018: "Flash did not fire, auto mode",
      0x0019: "Flash fired, auto mode",
      0x001d: "Flash fired, auto mode, return light not detected",
      0x001f: "Flash fired, auto mode, return light detected",
      0x0020: "No flash function",
      0x0041: "Flash fired, red-eye reduction mode",
      0x0045: "Flash fired, red-eye reduction mode, return light not detected",
      0x0047: "Flash fired, red-eye reduction mode, return light detected",
      0x0049: "Flash fired, compulsory flash mode, red-eye reduction mode",
      0x004d: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
      0x004f: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
      0x0059: "Flash fired, auto mode, red-eye reduction mode",
      0x005d: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
      0x005f: "Flash fired, auto mode, return light detected, red-eye reduction mode",
    },
    SensingMethod: {
      1: "Not defined",
      2: "One-chip color area sensor",
      3: "Two-chip color area sensor",
      4: "Three-chip color area sensor",
      5: "Color sequential area sensor",
      7: "Trilinear sensor",
      8: "Color sequential linear sensor",
    },
    SceneCaptureType: {
      0: "Standard",
      1: "Landscape",
      2: "Portrait",
      3: "Night scene",
    },
    SceneType: {
      1: "Directly photographed",
    },
    CustomRendered: {
      0: "Normal process",
      1: "Custom process",
    },
    WhiteBalance: {
      0: "Auto white balance",
      1: "Manual white balance",
    },
    GainControl: {
      0: "None",
      1: "Low gain up",
      2: "High gain up",
      3: "Low gain down",
      4: "High gain down",
    },
    Contrast: {
      0: "Normal",
      1: "Soft",
      2: "Hard",
    },
    Saturation: {
      0: "Normal",
      1: "Low saturation",
      2: "High saturation",
    },
    Sharpness: {
      0: "Normal",
      1: "Soft",
      2: "Hard",
    },
    SubjectDistanceRange: {
      0: "Unknown",
      1: "Macro",
      2: "Close view",
      3: "Distant view",
    },
    FileSource: {
      3: "DSC",
    },

    Components: {
      0: "",
      1: "Y",
      2: "Cb",
      3: "Cr",
      4: "R",
      5: "G",
      6: "B",
    },
  });

  function addEvent(element, event, handler) {
    if (element.addEventListener) {
      element.addEventListener(event, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent("on" + event, handler);
    }
  }

  /** v3.0.0 Deprecated */
  function imageHasData(img) {
    return imageHasExifData(img);
  }

  function imageHasExifData(img) {
    return !!img.exifdata;
  }

  function imageHasIptcData(img) {
    return !!img.iptcdata;
  }

  function imageHasXmpData(img) {
    return !!img.xmpdata;
  }

  function base64ToArrayBuffer(base64, contentType) {
    contentType =
      contentType || base64.match(/^data\:([^\;]+)\;base64,/im)[1] || ""; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
    base64 = base64.replace(/^data\:([^\;]+)\;base64,/gim, "");
    var binary = atob(base64);
    var len = binary.length;
    var buffer = new ArrayBuffer(len);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }
    return buffer;
  }

  function objectURLToBlob(url, callback) {
    var http = new XMLHttpRequest();
    http.open("GET", url, true);
    http.responseType = "blob";
    http.onload = function (e) {
      if (this.status == 200 || this.status === 0) {
        callback(this.response);
      }
    };
    http.send();
  }

  /**
   * Read image metadata and add to HTML element.
   *
   * Inputs
   * ------
   * img : HTMLImageElement || self.Image
   * callback : function
   */
  function getImageData(img, callback) {
    function handleBinaryFile(binFile) {
      var data = findEXIFinJPEG(binFile);
      img.exifdata = data || {};
      var iptcdata = findIPTCinJPEG(binFile);
      img.iptcdata = iptcdata || {};
      if (EXIF.isXmpEnabled) {
        var xmpdata = findXMPinJPEG(binFile);
        img.xmpdata = xmpdata || {};
      }
      if (callback) {
        callback.call(img);
      }
    }

    if (img.src) {
      if (/^data\:/i.test(img.src)) {
        // Data URI
        var arrayBuffer = base64ToArrayBuffer(img.src);
        handleBinaryFile(arrayBuffer);
      } else if (/^blob\:/i.test(img.src)) {
        // Object URL
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
          handleBinaryFile(e.target.result);
        };
        objectURLToBlob(img.src, function (blob) {
          fileReader.readAsArrayBuffer(blob);
        });
      } else {
        var http = new XMLHttpRequest();
        http.onload = function () {
          if (this.status == 200 || this.status === 0) {
            handleBinaryFile(http.response);
          } else {
            throw "Could not load image";
          }
          http = null;
        };
        http.open("GET", img.src, true);
        http.responseType = "arraybuffer";
        http.send(null);
      }
    } else if (
      self.FileReader &&
      (img instanceof self.Blob || img instanceof self.File)
    ) {
      var fileReader = new FileReader();
      fileReader.onload = function (e) {
        if (debug)
          console.log("Got file of length " + e.target.result.byteLength);
        handleBinaryFile(e.target.result);
      };

      fileReader.readAsArrayBuffer(img);
    }
  }

  /**
   * Determine the starting point in the file for reading EXIF data.
   *
   * TODO: Document inputs and returns
   */
  function findEXIFinJPEG(file) {
    var dataView = new DataView(file);

    if (debug) console.log("Got file of length " + file.byteLength);
    if (dataView.getUint8(0) != 0xff || dataView.getUint8(1) != 0xd8) {
      if (debug) console.log("Not a valid JPEG");
      return false; // not a valid jpeg
    }

    var offset = 2,
      length = file.byteLength,
      marker;

    while (offset < length) {
      if (dataView.getUint8(offset) != 0xff) {
        if (debug)
          console.log(
            "Not a valid marker at offset " +
              offset +
              ", found: " +
              dataView.getUint8(offset)
          );
        return false; // not a valid marker, something is wrong
      }

      marker = dataView.getUint8(offset + 1);
      if (debug) console.log("marker", marker);

      // we could implement handling for other markers here,
      // but we're only looking for 0xFFE1 for EXIF data

      if (marker == 225) {
        if (debug) console.log("Found 0xFFE1 marker");

        return readEXIFData(
          dataView,
          offset + 4,
          dataView.getUint16(offset + 2) - 2 // TODO: What's this parameter? Not used?
        );

        // offset += 2 + file.getShortAt(offset+2, true);
      } else {
        offset += 2 + dataView.getUint16(offset + 2);
      }
    }
  }

  function findIPTCinJPEG(file) {
    var dataView = new DataView(file);

    if (debug) console.log("Got file of length " + file.byteLength);
    if (dataView.getUint8(0) != 0xff || dataView.getUint8(1) != 0xd8) {
      if (debug) console.log("Not a valid JPEG");
      return false; // not a valid jpeg
    }

    var offset = 2,
      length = file.byteLength;

    var isFieldSegmentStart = function (dataView, offset) {
      return (
        dataView.getUint8(offset) === 0x38 &&
        dataView.getUint8(offset + 1) === 0x42 &&
        dataView.getUint8(offset + 2) === 0x49 &&
        dataView.getUint8(offset + 3) === 0x4d &&
        dataView.getUint8(offset + 4) === 0x04 &&
        dataView.getUint8(offset + 5) === 0x04
      );
    };

    while (offset < length) {
      if (isFieldSegmentStart(dataView, offset)) {
        // Get the length of the name header (which is padded to an even number of bytes)
        var nameHeaderLength = dataView.getUint8(offset + 7);
        if (nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
        // Check for pre photoshop 6 format
        if (nameHeaderLength === 0) {
          // Always 4
          nameHeaderLength = 4;
        }

        var startOffset = offset + 8 + nameHeaderLength;
        var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

        return readIPTCData(file, startOffset, sectionLength);

        break;
      }

      // Not the marker, continue searching
      offset++;
    }
  }
  var IptcFieldMap = {
    0x78: "caption",
    0x6e: "credit",
    0x19: "keywords",
    0x37: "dateCreated",
    0x50: "byline",
    0x55: "bylineTitle",
    0x7a: "captionWriter",
    0x69: "headline",
    0x74: "copyright",
    0x0f: "category",
  };
  function readIPTCData(file, startOffset, sectionLength) {
    var dataView = new DataView(file);
    var data = {};
    var fieldValue, fieldName, dataSize, segmentType, segmentSize;
    var segmentStartPos = startOffset;
    while (segmentStartPos < startOffset + sectionLength) {
      if (
        dataView.getUint8(segmentStartPos) === 0x1c &&
        dataView.getUint8(segmentStartPos + 1) === 0x02
      ) {
        segmentType = dataView.getUint8(segmentStartPos + 2);
        if (segmentType in IptcFieldMap) {
          dataSize = dataView.getInt16(segmentStartPos + 3);
          segmentSize = dataSize + 5;
          fieldName = IptcFieldMap[segmentType];
          fieldValue = getStringFromDB(dataView, segmentStartPos + 5, dataSize);
          // Check if we already stored a value with this name
          if (data.hasOwnProperty(fieldName)) {
            // Value already stored with this name, create multivalue field
            if (data[fieldName] instanceof Array) {
              data[fieldName].push(fieldValue);
            } else {
              data[fieldName] = [data[fieldName], fieldValue];
            }
          } else {
            data[fieldName] = fieldValue;
          }
        }
      }
      segmentStartPos++;
    }
    return data;
  }

  /**
   * Read the metadata tags from the file between starting/ending points.
   *
   * Inputs
   * ------
   * file : TODO
   * tiffStart : TODO
   * dirStart : TODO
   * bigEnd : TODO
   */
  function readTags(file, tiffStart, dirStart, bigEnd) {
    var entries = file.getUint16(dirStart, !bigEnd),
      tags = {},
      entryOffset,
      tag,
      i;

    for (i = 0; i < entries; i++) {
      entryOffset = dirStart + i * 12 + 2;
      tag = file.getUint16(entryOffset, !bigEnd);
      if (!tag && debug)
        console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
      tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
    }
    return tags;
  }

  /**
   * Assign tags a human readable string value.
   *
   * Inputs
   * ------
   * rawTags : Object
   *     The raw tags found from the image metadata
   * humanTags : Object
   *     1:1 Mapping of raw tags to human readable strings
   */
  function getHumanReadableTags(rawTags, humanTags) {
    function getHumanTag(rawKey, rawVal, humanTags) {
      switch (parseInt(rawKey)) {
        case 0x9208: // LightSource
        case 0x9209: // Flash
        case 0x9207: // MeteringMode
        case 0x8822: // ExposureProgram
        case 0xa217: // SensingMethod
        case 0xa406: // SceneCaptureType
        case 0xa301: // SceneType
        case 0xa401: // CustomRendered
        case 0xa403: // WhiteBalance
        case 0xa407: // GainControl
        case 0xa408: // Contrast
        case 0xa409: // Saturation
        case 0xa40a: // Sharpness
        case 0xa40c: // SubjectDistanceRange
        case 0xa300: // FileSource
          return [
            humanTags[rawKey],
            StringValues[humanTags[rawKey]][rawVal.toString()],
          ];
          break;

        case 0x9000: // ExifVersion
        case 0xa000: // FlashpixVersion
          return [
            humanTags[rawKey],
            String.fromCharCode(rawVal[0], rawVal[1], rawVal[2], rawVal[3]),
          ];
          break;

        case 0x9101: // ComponentsConfiguration
          return [
            humanTags[rawKey],
            StringValues.Components[rawVal[0]] +
              StringValues.Components[rawVal[1]] +
              StringValues.Components[rawVal[2]] +
              StringValues.Components[rawVal[3]],
          ];
          break;

        case 0x0000: // GPSVersionID
          return [
            humanTags[rawKey],
            rawVal[0] + "." + rawVal[1] + "." + rawVal[2] + "." + rawVal[3],
          ];
          break;

        default:
          return [humanTags[rawKey], rawVal];
          break;
      }
    }

    humanReadable = {};
    humanTags = humanTags || AllTags;

    for (var tag of Object.keys(rawTags)) {
      if ("thumbnail" == tag) {
        humanReadable["thumbnail"] = {};
        for (var thumbTag of Object.keys(rawTags[tag])) {
          mapped = getHumanTag(thumbTag, rawTags[tag][thumbTag], IFD1Tags);
          humanReadable["thumbnail"][mapped[0]] = mapped[1];
        }
      } else {
        mapped = getHumanTag(tag, rawTags[tag], AllTags);
        humanReadable[mapped[0]] = mapped[1];
      }
    }

    return humanReadable;
  }

  /**
   * Get the value for a tag
   */
  function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
    var type = file.getUint16(entryOffset + 2, !bigEnd),
      numValues = file.getUint32(entryOffset + 4, !bigEnd),
      valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart,
      offset,
      vals,
      val,
      n,
      numerator,
      denominator;

    switch (type) {
      case 1: // byte, 8-bit unsigned int
      case 7: // undefined, 8-bit byte, value depending on field
        if (numValues == 1) {
          return file.getUint8(entryOffset + 8, !bigEnd);
        } else {
          offset = numValues > 4 ? valueOffset : entryOffset + 8;
          vals = [];
          for (n = 0; n < numValues; n++) {
            vals[n] = file.getUint8(offset + n);
          }
          return vals;
        }

      case 2: // ascii, 8-bit byte
        offset = numValues > 4 ? valueOffset : entryOffset + 8;
        return getStringFromDB(file, offset, numValues - 1);

      case 3: // short, 16 bit int
        if (numValues == 1) {
          return file.getUint16(entryOffset + 8, !bigEnd);
        } else {
          offset = numValues > 2 ? valueOffset : entryOffset + 8;
          vals = [];
          for (n = 0; n < numValues; n++) {
            vals[n] = file.getUint16(offset + 2 * n, !bigEnd);
          }
          return vals;
        }

      case 4: // long, 32 bit int
        if (numValues == 1) {
          return file.getUint32(entryOffset + 8, !bigEnd);
        } else {
          vals = [];
          for (n = 0; n < numValues; n++) {
            vals[n] = file.getUint32(valueOffset + 4 * n, !bigEnd);
          }
          return vals;
        }

      case 5: // rational = two long values, first is numerator, second is denominator
        if (numValues == 1) {
          numerator = file.getUint32(valueOffset, !bigEnd);
          denominator = file.getUint32(valueOffset + 4, !bigEnd);
          val = new Number(numerator / denominator);
          val.numerator = numerator;
          val.denominator = denominator;
          return val;
        } else {
          vals = [];
          for (n = 0; n < numValues; n++) {
            numerator = file.getUint32(valueOffset + 8 * n, !bigEnd);
            denominator = file.getUint32(valueOffset + 4 + 8 * n, !bigEnd);
            vals[n] = new Number(numerator / denominator);
            vals[n].numerator = numerator;
            vals[n].denominator = denominator;
          }
          return vals;
        }

      case 9: // slong, 32 bit signed int
        if (numValues == 1) {
          return file.getInt32(entryOffset + 8, !bigEnd);
        } else {
          vals = [];
          for (n = 0; n < numValues; n++) {
            vals[n] = file.getInt32(valueOffset + 4 * n, !bigEnd);
          }
          return vals;
        }

      case 10: // signed rational, two slongs, first is numerator, second is denominator
        if (numValues == 1) {
          return (
            file.getInt32(valueOffset, !bigEnd) /
            file.getInt32(valueOffset + 4, !bigEnd)
          );
        } else {
          vals = [];
          for (n = 0; n < numValues; n++) {
            vals[n] =
              file.getInt32(valueOffset + 8 * n, !bigEnd) /
              file.getInt32(valueOffset + 4 + 8 * n, !bigEnd);
          }
          return vals;
        }
    }
  }

  /**
   * Given an IFD (Image File Directory) start offset
   * returns an offset to next IFD or 0 if it's the last IFD.
   */
  function getNextIFDOffset(dataView, dirStart, bigEnd) {
    //the first 2bytes means the number of directory entries contains in this IFD
    var entries = dataView.getUint16(dirStart, !bigEnd);

    // After last directory entry, there is a 4bytes of data,
    // it means an offset to next IFD.
    // If its value is '0x00000000', it means this is the last IFD and there is no linked IFD.

    return dataView.getUint32(dirStart + 2 + entries * 12, !bigEnd); // each entry is 12 bytes long
  }

  /**
   * TODO: document
   *
   * Inputs
   * ------
   * dataView : TODO
   * tiffStart : TODO
   * firstIFDOffset : TODO
   * bigEnd : TODO
   */
  function readThumbnailImage(dataView, tiffStart, firstIFDOffset, bigEnd) {
    // get the IFD1 offset
    var IFD1OffsetPointer = getNextIFDOffset(
      dataView,
      tiffStart + firstIFDOffset,
      bigEnd
    );

    if (!IFD1OffsetPointer) {
      // console.log('******** IFD1Offset is empty, image thumb not found ********');
      return {};
    } else if (IFD1OffsetPointer > dataView.byteLength) {
      // this should not happen
      // console.log('******** IFD1Offset is outside the bounds of the DataView ********');
      return {};
    }
    // console.log('*******  thumbnail IFD offset (IFD1) is: %s', IFD1OffsetPointer);

    var thumbTags = readTags(
      dataView,
      tiffStart,
      tiffStart + IFD1OffsetPointer,
      bigEnd
    );

    // EXIF 2.3 specification for JPEG format thumbnail

    // If the value of Compression(0x0103) Tag in IFD1 is '6', thumbnail image format is JPEG.
    // Most of Exif image uses JPEG format for thumbnail. In that case, you can get offset of thumbnail
    // by JpegIFOffset(0x0201) Tag in IFD1, size of thumbnail by JpegIFByteCount(0x0202) Tag.
    // Data format is ordinary JPEG format, starts from 0xFFD8 and ends by 0xFFD9. It seems that
    // JPEG format and 160x120pixels of size are recommended thumbnail format for Exif2.1 or later.

    if (thumbTags[0x8825]) {
      // Compression
      // console.log('Thumbnail image found!');

      switch (thumbTags[0x8825]) {
        case 6:
          // console.log('Thumbnail image format is JPEG');
          if (
            thumbTags[0x0201] && // JpegIFOffset
            thumbTags[0x0202] // JpegIFByteCount
          ) {
            // extract the thumbnail
            var tOffset = tiffStart + thumbTags[0x0201]; // JpegIFOffset;
            var tLength = thumbTags[0x0202]; // JpegIFByteCount;
            thumbTags["blob"] = new Blob(
              [new Uint8Array(dataView.buffer, tOffset, tLength)],
              {
                type: "image/jpeg",
              }
            );
          }
          break;

        case 1:
          console.log(
            "Thumbnail image format is TIFF, which is not implemented."
          );
          break;
        default:
          console.log(
            "Unknown thumbnail image format '%s'",
            thumbTags[0x8825] // Compression
          );
      }
    } else if (thumbTags[0x0106] == 2) {
      // PhotometricInterpretation
      console.log("Thumbnail image format is RGB, which is not implemented.");
    }

    return thumbTags;
  }

  function getStringFromDB(buffer, start, length) {
    var outstr = "";
    for (var n = start; n < start + length; n++) {
      outstr += String.fromCharCode(buffer.getUint8(n));
    }
    return outstr;
  }

  /**
   * Parses TIFF, EXIF and GPS tags, and looks for a thumbnail
   *
   * Inputs
   * ------
   * file : DataView
   * start : TODO: What type is this?
   *     Location where the EXIF data begin in the file
   */
  function readEXIFData(file, start) {
    if (getStringFromDB(file, start, 4) != "Exif") {
      if (debug)
        console.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
      return false;
    }

    var bigEnd,
      tags,
      tag,
      exifData,
      gpsData,
      tiffOffset = start + 6;

    // test for TIFF validity and endianness
    if (file.getUint16(tiffOffset) == 0x4949) {
      bigEnd = false;
    } else if (file.getUint16(tiffOffset) == 0x4d4d) {
      bigEnd = true;
    } else {
      if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
      return false;
    }

    if (file.getUint16(tiffOffset + 2, !bigEnd) != 0x002a) {
      if (debug) console.log("Not valid TIFF data! (no 0x002A)");
      return false;
    }

    var firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);

    if (firstIFDOffset < 0x00000008) {
      if (debug)
        console.log(
          "Not valid TIFF data! (First offset less than 8)",
          file.getUint32(tiffOffset + 4, !bigEnd)
        );
      return false;
    }

    tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, bigEnd);

    if (tags[0x8769]) {
      // ExifIFDPointer
      exifData = readTags(file, tiffOffset, tiffOffset + tags[0x8769], bigEnd);

      for (tag in exifData) {
        tags[tag] = exifData[tag];
      }
    }

    if (tags[0x8825]) {
      // GPSInfoIFDPointer
      gpsData = readTags(file, tiffOffset, tiffOffset + tags[0x8825], bigEnd);
      for (tag in gpsData) {
        tags[tag] = gpsData[tag];
      }
    }

    // extract thumbnail
    tags["thumbnail"] = readThumbnailImage(
      file,
      tiffOffset,
      firstIFDOffset,
      bigEnd
    );

    return tags;
  }

  function findXMPinJPEG(file) {
    if (!("DOMParser" in self)) {
      // console.warn('XML parsing not supported without DOMParser');
      return;
    }
    var dataView = new DataView(file);

    if (debug) console.log("Got file of length " + file.byteLength);
    if (dataView.getUint8(0) != 0xff || dataView.getUint8(1) != 0xd8) {
      if (debug) console.log("Not a valid JPEG");
      return false; // not a valid jpeg
    }

    var offset = 2,
      length = file.byteLength,
      dom = new DOMParser();

    while (offset < length - 4) {
      if (getStringFromDB(dataView, offset, 4) == "http") {
        var startOffset = offset - 1;
        var sectionLength = dataView.getUint16(offset - 2) - 1;
        var xmpString = getStringFromDB(dataView, startOffset, sectionLength);
        var xmpEndIndex = xmpString.indexOf("xmpmeta>") + 8;
        xmpString = xmpString.substring(
          xmpString.indexOf("<x:xmpmeta"),
          xmpEndIndex
        );

        var indexOfXmp = xmpString.indexOf("x:xmpmeta") + 10;
        //Many custom written programs embed xmp/xml without any namespace. Following are some of them.
        //Without these namespaces, XML is thought to be invalid by parsers
        xmpString =
          xmpString.slice(0, indexOfXmp) +
          'xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/" ' +
          'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
          'xmlns:tiff="http://ns.adobe.com/tiff/1.0/" ' +
          'xmlns:plus="http://schemas.android.com/apk/lib/com.google.android.gms.plus" ' +
          'xmlns:ext="http://www.gettyimages.com/xsltExtension/1.0" ' +
          'xmlns:exif="http://ns.adobe.com/exif/1.0/" ' +
          'xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#" ' +
          'xmlns:stRef="http://ns.adobe.com/xap/1.0/sType/ResourceRef#" ' +
          'xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/" ' +
          'xmlns:xapGImg="http://ns.adobe.com/xap/1.0/g/img/" ' +
          'xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" ' +
          xmpString.slice(indexOfXmp);

        var domDocument = dom.parseFromString(xmpString, "text/xml");
        return xml2Object(domDocument);
      } else {
        offset++;
      }
    }
  }

  function xml2json(xml) {
    var json = {};

    if (xml.nodeType == 1) {
      // element node
      if (xml.attributes.length > 0) {
        json["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          json["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) {
      // text node
      return xml.nodeValue;
    }

    // deal with children
    if (xml.hasChildNodes()) {
      for (var i = 0; i < xml.childNodes.length; i++) {
        var child = xml.childNodes.item(i);
        var nodeName = child.nodeName;
        if (json[nodeName] == null) {
          json[nodeName] = xml2json(child);
        } else {
          if (json[nodeName].push == null) {
            var old = json[nodeName];
            json[nodeName] = [];
            json[nodeName].push(old);
          }
          json[nodeName].push(xml2json(child));
        }
      }
    }

    return json;
  }

  function xml2Object(xml) {
    try {
      var obj = {};
      if (xml.children.length > 0) {
        for (var i = 0; i < xml.children.length; i++) {
          var item = xml.children.item(i);
          var attributes = item.attributes;
          for (var idx in attributes) {
            var itemAtt = attributes[idx];
            var dataKey = itemAtt.nodeName;
            var dataValue = itemAtt.nodeValue;

            if (dataKey !== undefined) {
              obj[dataKey] = dataValue;
            }
          }
          var nodeName = item.nodeName;

          if (typeof obj[nodeName] == "undefined") {
            obj[nodeName] = xml2json(item);
          } else {
            if (typeof obj[nodeName].push == "undefined") {
              var old = obj[nodeName];

              obj[nodeName] = [];
              obj[nodeName].push(old);
            }
            obj[nodeName].push(xml2json(item));
          }
        }
      } else {
        obj = xml.textContent;
      }
      return obj;
    } catch (e) {
      console.log(e.message);
    }
  }

  EXIF.enableXmp = function () {
    EXIF.isXmpEnabled = true;
  };

  EXIF.disableXmp = function () {
    EXIF.isXmpEnabled = false;
  };

  /**
   * Trigger reading the image metadata, or trigger the callback.
   *
   * Inputs
   * ------
   * img : HTMLImageElement || self.Image
   * callback : function
   *
   * Returns
   * -------
   * bool : Validity of the passed img
   */
  EXIF.getData = function (img, callback) {
    if (
      ((self.Image && img instanceof self.Image) ||
        (self.HTMLImageElement && img instanceof self.HTMLImageElement)) &&
      !img.complete
    ) {
      return false;
    }

    if (!imageHasData(img)) {
      getImageData(img, callback);
    } else {
      if (callback) {
        callback.call(img);
      }
    }
    return true;
  };

  /** v3.0.0 Deprecated */
  EXIF.getTag = function (img, tag, raw) {
    raw = raw || false;
    return EXIF.getExifTag(img, tag, raw);
  }

  /**
   * Returns an EXIF tag
   *
   * If the Raw argument is true, then the tag being searched for must also be raw.
   *
   * Inputs
   * ------
   * img : HTMLImageElement || self.Image
   * tag : any
   *     String name or integer of the tag to query
   * raw : bool
   *     Default: false
   *     Retrieve the raw value for the tag. False returns the human-readable value.
   */
  EXIF.getExifTag = function (img, tag, raw) {
    if (!imageHasExifData(img)) return;
    raw = raw || false;
    tags = raw ? img.exifdata : getHumanReadableTags(img.exifdata);
    return tags[tag];
  };

  /**
   * Returns an IPTC tag
   *
   * Inputs
   * ------
   * img : HTMLImageElement || self.Image
   * tag : any
   *     String name or integer of the tag to query
   */
  EXIF.getIptcTag = function (img, tag) {
    if (!imageHasIptcData(img)) return;
    return img.iptcdata[tag];
  };

  /**
   * Get all EXIF tags.
   *
   * Inputs
   * ------
   * img : HTMLImageElement || self.Image
   * raw : bool
   *     Default: false
   *     Retrieve the raw value for the tag. False returns the human-readable value.
   *
   * Returns
   * -------
   * Object
   */
  EXIF.getAllExifTags = function (img, raw) {
    if (!imageHasExifData(img)) return {};
    raw = raw || false;
    tags = raw ? img.exifdata : getHumanReadableTags(img.exifdata);
    return tags;
  };

  /**
   * Get all IPTC tags.
   *
   * Inputs
   * ------
   * img : HTMLImageElement || self.Image
   *
   * Returns
   * -------
   * Object
   */
  EXIF.getAllIptcTags = function (img) {
    if (!imageHasIptcData(img)) return {};
    return img.iptcdata;
  };

  /**
   * Get all XMP tags.
   *
   * Inputs
   * ------
   * img : HTMLImageElement || self.Image
   *
   * Returns
   * -------
   * Object
   */
  EXIF.getAllXmpTags = function (img) {
    if (!imageHasXmpData(img)) return {};
    return img.xmpdata;
  };

  /**
   * Get all tags.
   *
   * Inputs
   * ------
   * img : HTMLImageElement || self.Image
   * raw : boolean
   *     Default: false
   *     Retrieve the raw value for the tag. False returns the human-readable value.
   *
   * Returns
   * -------
   * {exif: Object, iptc: Object, xmp: Object}
   */
  EXIF.getAllTags = function (img, raw) {
    raw = raw || false;
    return {
      exif: EXIF.getAllExifTags(img, raw),
      iptc: EXIF.getAllIptcTags(img),
      xmp: EXIF.getAllXmpTags(img),
    };
  };

  EXIF.pretty = function (img) {
    if (!imageHasData(img)) return "";
    var a,
      data = getHumanReadableTags(img.exifdata),
      strPretty = "";
    for (a in data) {
      if (data.hasOwnProperty(a)) {
        if (typeof data[a] == "object") {
          if (data[a] instanceof Number) {
            strPretty +=
              a +
              " : " +
              data[a] +
              " [" +
              data[a].numerator +
              "/" +
              data[a].denominator +
              "]\r\n";
          } else {
            strPretty += a + " : [" + data[a].length + " values]\r\n";
          }
        } else {
          strPretty += a + " : " + data[a] + "\r\n";
        }
      }
    }
    return strPretty;
  };

  /**
   * TODO: Add description
   *
   * Inputs
   * ------
   * img : self.Image
   */
  EXIF.readFromBinaryFile = function (file, raw) {
    raw = raw || false;
    var data = findEXIFinJPEG(file);
    data = raw ? data : getHumanReadableTags(data);
    return data;
  };

  if (typeof define === "function" && define.amd) {
    define("exif-js", [], function () {
      return EXIF;
    });
  }
}.call(this));
