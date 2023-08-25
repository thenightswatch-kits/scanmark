import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import SelectDropdown from 'react-native-select-dropdown'
import * as WebBrowser from "expo-web-browser";
import { ToastAndroid } from 'react-native';
import * as Google from "expo-auth-session/providers/google"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from 'axios'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();
export default function Login({ setLogin, setEvent, setToken, event }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [events, setEvents] = useState(null);
  const [eventNames, setEventNames] = useState();
  
  useEffect(() => {
    // Define a function to fetch and process stored user data
    const fetchStoredUserData = async () => {
      try {
        const storedUserDataString = await AsyncStorage.getItem('userData');
        if (storedUserDataString !== null) {
          const storedUserData = JSON.parse(storedUserDataString);
          setEvent(storedUserData.event);
          setToken(storedUserData.token);
          setLogin(true);
        }
      } catch (error) {
        console.error('Error retrieving stored user data:', error);
      }
    };
  
    // Call the function to fetch stored user data
    fetchStoredUserData();
  }, []); 


  useEffect(() => {
    const fetchDataInterval = setInterval(() => {
      fetchData();
    }, 5000); // 5000 milliseconds = 5 seconds
  
    // Clear the interval when the component unmounts
    return () => clearInterval(fetchDataInterval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.159.195:3000/api/event'); // Replace with your API URL
      const enabledEvents = response.data.filter(event => event.active === true);
      console.log(enabledEvents)
      setEvents(enabledEvents); // Assuming the API response is an array of event objects
      const names = enabledEvents.map(event => event.name);
      setEventNames(names)
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = async () => {
    if (event) {
      const loginData = {
        username: email,
        password: password
      }
      try {
        const response = await axios.post(`http://192.168.159.195:3000/api/auth/login`, loginData);

        if (response.status === 200) {
          console.log('Logged In');

          // Access cookies from the response headers
          const cookies = response.headers['set-cookie'];
          console.log('Cookies:', cookies);
          const cookieString = cookies[0];
          const tokenStartIndex = cookieString.indexOf('token=') + 'token='.length;
          const tokenEndIndex = cookieString.indexOf(';', tokenStartIndex);
          const token = cookieString.substring(tokenStartIndex, tokenEndIndex);
          const userData = {
            token:token,
            event: event,
            username: email
          }
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          setToken(token)
          setLogin(true)
          ToastAndroid.show("Login Successful", ToastAndroid.SHORT)
        }
      } catch (error) {
        console.log(error);
        ToastAndroid.show("Error While Log In", ToastAndroid.SHORT)
      }
    }else{
      ToastAndroid.show("Select Event", ToastAndroid.SHORT)
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <Image style={styles.image} source={require("../assets/karunya-logo.png")} />
        <StatusBar style="auto" />
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Username"
            placeholderTextColor="#003f5c"
            onChangeText={(email) => setEmail(email)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>
        {events && <SelectDropdown
          defaultButtonText="Select Event"
          buttonStyle={{ width: "70%", borderRadius: 5, borderWidth: 1, }}
          data={eventNames}
          onSelect={(selectedItem, index) => {
            console.log(events[index].id)
            setEvent(events[index].id)
          }}
        />}
        <TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={() => { handleClick() }} >
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={{ paddingBottom: 3 }}>Powered By</Text>
        <Image
          style={styles.logo}
          source={require("../assets/ctc.png")} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-around",


  },
  container2: {
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginBottom: 40,
    height: 150,
    width: 150
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  footer: {
    flex: 0,
    marginTop: 70,
    alignItems: 'center'
  },
  inputView: {
    // backgroundColor: "#B9F3FC",
    borderWidth: 1,
    borderRadius: 5,
    width: "70%",
    height: 45,
    marginBottom: 20,
    paddingLeft: 10
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 0,
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  loginBtn: {
    width: "50%",
    borderRadius: 5,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#7792D7",
  },
  loginText: {
    color: 'white'
  }
});