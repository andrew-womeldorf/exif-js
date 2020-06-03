interface EXIFStatic {
    getData(url: string, callback: any): any;
    getTag(img: any, tag: any, raw?: bool): any;
    getIptcTag(img: any, tag: any): any;
    getAllExifTags(img: any, raw?: bool): any;
    getAllIptcTags(img: any): any;
    getAllXmpTags(img: any): any;
    getAllTags(img: any, raw?: bool): any;
    pretty(img: any): string;
    readFromBinaryFile(file: any, raw?: bool): any;
}

declare var EXIF : EXIFStatic;
export = EXIF;
