'use strict';

const fs = require('fs');

class Bitmap {
  constructor(buffer) {
    this.buffer = buffer;

    // Read Bitmap Header
    this.type = buffer.toString('utf-8', 0, 2);
    this.size = buffer.readUInt32LE(2);
    // instead of readUInt32LE,
    // you can specify readUIntLE plus number of bytes
    this.offset = buffer.readUIntLE(0x0A, 4);

    this.img = buffer.slice(this.offset);

    // Read DIB Header
    this.headerSize = buffer.readUIntLE(0x0E, 4);
    this.width = buffer.readUIntLE(0x12, 4);
    this.height = buffer.readUIntLE(0x16, 4);
    this.paletteColorCount = buffer.readUIntLE(0x2E, 4);

    // Color Palette
    const bytesPerColor = 4;
    const paletteOffset = 0x36;
    const paletteEndOffset = Math.min(
      this.offset,
      paletteOffset + 
        this.paletteColorCount * bytesPerColor
    );
    this.palette = buffer.slice(paletteOffset, paletteEndOffset);
  }

  writeToFile(path) {
    fs.writeFileSync(path, this.buffer);
  }

  static fromFile(path) {
    const buffer = fs.readFileSync(path);
    return new Bitmap(buffer);
  }
}

module.exports = Bitmap;