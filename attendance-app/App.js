import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import Home from './components/Home';
import Login from './components/Login';
import GoogleLogin from './components/GoogleLogin';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google"
import AsyncStorage from "@react-native-async-storage/async-storage"

WebBrowser.maybeCompleteAuthSession();

export default function App(){
  const [isLogin, setLogin] = useState(false);
  const [event, setEvent] = useState(null);
  const [token, setToken] = useState(null);

  if(isLogin){
    return(<Home event={event} setLogin={setLogin} setToken={setToken} token={token}/>)
  }else{
    return(
      <Login setLogin={setLogin} setEvent={setEvent} setToken={setToken} event={event}/>
    )
  }

}
