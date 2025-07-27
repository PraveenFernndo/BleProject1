import React, { useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AvailableDevices from './AvailableDevices';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../navigation/navigation';
import { StopBleScan } from '../bluetooth/BleScan';
import { Device } from 'react-native-ble-plx';


function Home(): React.JSX.Element {

  const [getAvailableDevices, setAvailableDevices] = useState(false);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [getScanningStatus, setScanningStatus] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
      />
      <View style={styles.mainContainer}>
        <Text style={styles.mainHeading}>BLE Project</Text>
        <TouchableOpacity onPress={() => {
          setAvailableDevices(true);//to popup the model(AvailableDevices)
        }}>
          <View style={styles.scanButton}>
            <Text style={styles.buttonText}>Scan Devices Now</Text>
          </View>
        </TouchableOpacity>

        <AvailableDevices isVisible={getAvailableDevices} onClose={() => {
          setAvailableDevices(false);
          StopBleScan();
        }}
        />

      </View>

      <Button title="Device Details" onPress={() => {

        navigation.navigate('DeviceDetails');


      }} />

      <View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 30,
    flex: 1,
    alignItems: 'center',
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scanButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#b42eb4ff',
    borderRadius: 5,
    width: "100%"
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default Home;
