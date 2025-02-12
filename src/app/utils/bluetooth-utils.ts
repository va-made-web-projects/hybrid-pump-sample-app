import { BleClient } from "@capacitor-community/bluetooth-le";

// utils/bluetooth-utils.ts
export class BluetoothUtils {

  static async onWriteDataWithoutResponse(deviceID: string, uuid: string, data: DataView, service: string) {
    try {
      await BleClient.writeWithoutResponse(
        deviceID,
        service,
        uuid,
        data
      );
    }
    catch (error) {
        console.log('Write BT data error:', error);
    }
  }


  // Static properties if needed
  private static readonly MAX_RETRIES: number = 3;

  // Static methods that can be called from anywhere
  public static millivoltsToInches(millivolts: number): number {
      return Number((millivolts * 0.0393701).toFixed(2));
  }

  public static inchesToMillivolts(inches: number): number {
      return Number((inches / 0.0393701).toFixed(2));
  }

  public static parseDataView(data: DataView): number {
      return data.getInt32(0, true); // true for little-endian
  }

  public static createDataView(value: number): DataView {
      const buffer = new ArrayBuffer(4);
      const dataView = new DataView(buffer);
      dataView.setInt32(0, value, true);
      return dataView;
  }
}
