interface SensorData {
  timestamp: number;
  sensorValue: number;
  isMotorRunning: boolean;
  pumpMode: number;
  batteryReading: number;
  lowThreshold: number;
  highThreshold: number;
}

export default SensorData;
