// web 508253672676-76khi7s9eoihe8vel0r84p3po4cok40l.apps.googleusercontent.com
//ios 508253672676-4q1lmmb1bjfrb5569l7m1pslpi5ard3t.apps.googleusercontent.com
//android 508253672676-qthfhgphh3k1s7a1duhu89lk3polkgbh.apps.googleusercontent.com

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextComponent,ToastAndroid, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import * as Device from 'expo-device';
import Header from './Header';
import axios from 'axios';
import * as Location from 'expo-location';

import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Home({ event, setLogin, setToken, token }) {

  const logoImage = require('../assets/karunya-logo.png');
  const device = {
    name: Device.deviceName,
    brand: Device.brand,
    model: Device.modelName
  }
  const [hasPermisson, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("Not Yet scanned")
  const [errorMsg, setErrorMsg] = useState(null);


  const askCamPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status == 'granted')
      let { loc_status } = await Location.requestForegroundPermissionsAsync();
      if (loc_status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
    })()
  }

  //Request camera permission
  useEffect(() => {
    askCamPermission();
  }, [])

  //what happens when we scann the bar code

  const handleSubmit = async () => {
    try {
      const existingArrayString = await AsyncStorage.getItem('attendance');
      existingArray = existingArrayString ? JSON.parse(existingArrayString) : [];
      if(existingArray.length == 0){
        ToastAndroid.show("No Data", ToastAndroid.SHORT)
        return
      }
    } catch (error) {
      console.error('Error retrieving array:', error);
    }
    const headers = {
      'Content-Type': 'application/json',
      Cookie: `token=${token}`, // Set the token cookie
    };    
    console.log(existingArray)
        await axios.post(`http://192.168.159.195:3000/api/attend`, existingArray,{
          headers,
          withCredentials: true,
        })
      .then(async res =>{
        if (res.status === 201) {
          console.log('Marked Attendance')
          await AsyncStorage.clear();
          ToastAndroid.show("Marked Attendance", ToastAndroid.SHORT)
          setScanned(false);

          setText("Submitted")
        }
      }).catch((err) => {
        console.log("Error : "+err.error)
      })
  }
  const handLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setToken(null);
      setLogin(false);
      ToastAndroid.show("Logging Out", ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error deleting stored user data:', error);
    }
  };

  const handleScanned = async ({ type, data }) => {
    const currentDate = new Date();
    const time = currentDate.toISOString();
    let location = await Location.getCurrentPositionAsync({});
    const attend = {
      rollnumber: data.slice(3),
      device: {
        name: Device.deviceName,
        brand: Device.brand,
        model: Device.modelName
      },
      location:{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      },
      event_id: event,
      recorded_at: time
    }
    let existingArray = []
    try {
      const existingArrayString = await AsyncStorage.getItem('attendance');
      existingArray = existingArrayString ? JSON.parse(existingArrayString) : [];
    } catch (error) {
      console.error('Error retrieving array:', error);
    }
    existingArray.push(attend)
    console.log(existingArray)
    const modifiedArrayString = JSON.stringify(existingArray);

    try {
      await AsyncStorage.setItem('attendance', modifiedArrayString);
      console.log('Object appended to array and updated in AsyncStorage');
    } catch (error) {
      console.error('Error updating array:', error);
    }
    setText(data.slice(3))
    setScanned(true);
  }

  //Check for permissions and return the screen
  if (hasPermisson === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    )
  }
  if (hasPermisson === false) {
    return (
      <View style={styles.container}>
        <Text>No Access to camera </Text>
        <Button title={'allow Camera'} onPress={() => { askCamPermission() }} />
      </View>
    )
  }


  return (
    <>
      <View style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Image source={logoImage} style={styles.logo} />
          <TouchableOpacity onPress={() => {handLogout()}} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Barcode Scanner */}
        <View style={styles.barcodebox}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleScanned}
            style={{ height: 400, width: 300 }}
          />
        </View>

        {/* Text */}
        <Text style={styles.maintext}>{text}</Text>

        {/* Scan Button */}
        {/* <Button title={'Next'} style={{width:'40%'}} onPress={() => setScanned(false)} color='#7792D7' /> */}
        {scanned &&
          <TouchableOpacity style={styles.nextBtn} onPress={() => {setScanned(false),setText('scanning')}} >
            <Text style={styles.loginText}>NEXT</Text>
          </TouchableOpacity>}


      </View>
      <View style={{ display: 'flex', alignItems: 'center' }}>
        <TouchableOpacity style={styles.submitBtn} onPress={() => {handleSubmit()}} >
          <Text style={styles.loginText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    margin: 0,
    flex: 1,
    alignItems: 'center',
    paddingTop: 0,
    // backgroundColor: '#F9F1F7'
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    width: '100%',
    // backgroundColor: '#DCEDF9',
    borderWidth: 0.5,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  logoutButton: {
    // backgroundColor: '#7792D7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    width: 50,
    height: 50
  },
  barcodebox: {
    backgroundColor: '#fff',
    margin: 50,
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
  },
  maintext: {
    fontSize: 16,
    margin: 0,
    marginTop: 0
  },
  nextBtn: {
    width: "50%",
    borderRadius: 5,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#7792D7",
  },
  submitBtn: {
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute',
    // bottom: 0,
    // right:100,
    backgroundColor: '#E45057',
    margin: 16,
    padding: 19,
    borderRadius: 5
  },
  loginText: {
    display: 'flex',
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
