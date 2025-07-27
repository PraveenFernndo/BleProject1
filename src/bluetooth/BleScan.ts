import { PermissionsAndroid, Platform } from "react-native";
import { BleManager } from "react-native-ble-plx";
import { BleError } from "react-native-ble-plx";
import { Device } from "react-native-ble-plx";
import Toast from "react-native-toast-message";

const manager = new BleManager();

const requestPermissions = async () => {
    console.log('Requesting permissions...');
    // if (Platform.OS === 'android' && Platform.Version >= 31) {
    if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
    } else {
        console.log("Your android version is not compatible to use this feature")
        return false;
    }

    console.log('Permissions granted');
    return true;

};

var status = true;

export const BleScan = async (onDeviceFind: any) => {

    StopBleScan();

    const permission = await requestPermissions();

    if (permission) {
        status = false;
        console.log("Permissions granted, starting scan...");

        manager.startDeviceScan(null, null, (error, device) => {

            if (error) {

                console.log("Scan error:", error);

                Toast.show({
                    visibilityTime: 2000,
                    position: "top",
                    type: "error",
                    text1: `${error}`
                });

                return error;
            }

            if (device?.name) {
                onDeviceFind(device);
                console.log("Found device:", device.name, "Device ID:", device.id, "RSSI:", device.rssi);
                return device;
            }
        });

        setTimeout(StopBleScan, 10000);

    } else {
        console.log("Permissions not granted");

    }
};

export const StopBleScan = () => {
    console.log("Stopping BLE scan...");
    manager.stopDeviceScan();

};

export const connectDevice = async (device: Device) => {

    manager.stopDeviceScan();
    try {

        const connectedDevice = await manager.connectToDevice(device.id);

        console.log("Connected to device123:", connectedDevice.name, "Device ID:", connectedDevice.id);

        const discoveredServices = await connectedDevice.discoverAllServicesAndCharacteristics();

        const services = await discoveredServices.services();

        for (const service of services) {
            console.log("Service UUID:", service.uuid);

            const characteristics = await service.characteristics();
            for (const characteristic of characteristics) {
                console.log("Characteristic UUID:", characteristic.uuid);
            }
        }

        console.log("Connected to device:", connectedDevice.name, "Device ID:", connectedDevice.id);
        return true;
    } catch (error) {


        deviceDisconnect(device.id);
        console.error("Connection error:", error);

         Toast.show({
                    visibilityTime: 2000,
                    position: "top",
                    type: "error",
                    text1: `${error}`
                });

        return error;
    }

}

export const deviceDisconnect = async (deviceId: string) => {

    try {

        const disconnectDevice = await manager.cancelDeviceConnection(deviceId);
        console.log("Device disconnected:", disconnectDevice.name, "Device ID:", disconnectDevice.id);

    } catch (error) {
        console.error("Error during disconnection:", error);

    }

    manager.onDeviceDisconnected(deviceId, (error: BleError | null, device: Device | null) => {
        if (error) {
            console.error(JSON.stringify(error, null, 4))
            console.log("Error disconnecting device:", error.message);
        }
        if (device) {
            console.info(JSON.stringify(device, null, 4))
            console.log("Device disconnected:", device.name, "Device ID:", device.id);

        }
    });


}