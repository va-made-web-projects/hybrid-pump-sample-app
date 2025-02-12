export class ParseDataUtils {
  static setUint32DataView(num:number):DataView {
    const buffer = new ArrayBuffer(4);
    const dataView = new DataView(buffer);

    // Set the value of the DataView to the number 100
    dataView.setUint32(0, num, true);
    return dataView
  }

  static setPumpStateDataView(num:number):DataView {
    const buffer = new ArrayBuffer(1);
    const dataView = new DataView(buffer);

    // Set the value of the DataView to the number 100
    dataView.setUint8(0, num);
    return dataView
  }

  static parseInt16DataReading(mapData: DataView) {
    let length = mapData.byteLength;
    const mapNumbers = new Int16Array(length / Int16Array.BYTES_PER_ELEMENT);
    for (let i = 0; i < mapNumbers.length; i++) {
      mapNumbers[i] = mapData.getInt16(i * Int32Array.BYTES_PER_ELEMENT, true); // true for little-endian byte order
    }
    const numberArray = mapNumbers;
    return numberArray;
  }

  static parseInt32DataReading(mapData: DataView) {
    let length = mapData.byteLength;
    const mapNumbers = new Int32Array(length / Int32Array.BYTES_PER_ELEMENT);
    for (let i = 0; i < mapNumbers.length; i++) {
      mapNumbers[i] = mapData.getInt32(i * Int32Array.BYTES_PER_ELEMENT, true); // true for little-endian byte order
    }
    const numberArray = mapNumbers[0];
    return numberArray;
  }

  static parseInt8DataReading(mapData: DataView) {
    return mapData.getInt8(0); // true for little-endian byte order
  }

  static parseBatteryReading(data: DataView) {
    return data.getInt32(0, true); // true for little-endian byte order
  }
}
