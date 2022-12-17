import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Platform,StyleSheet,Dimensions } from 'react-native';
import axios from 'axios'



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
  
       <View
      style={styles.listback}>
      <View
      style={styles.listfront}>
        <View
      style={styles.list}>
      {/* <Text>Your expo push token: {expoPushToken}</Text> */}
      <View style={styles.area}>
        {/* <Text>Title: {notification && notification.request.content.title} </Text> */}
        <Text style={styles.text}>{notification && notification.request.content.body}</Text>
        {/* <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text> */}
      </View>
      </View>
    </View>
    </View>
  );
}

const SaveToken=async(token)=>{
    try{
    const data = JSON.stringify({
      token:token
    });
    const config = {
        headers: {
        'Content-Type': 'application/json'
        }
          };
          const response = await axios.post('https://notification-app-kappa.vercel.app/send', data, config);
          console.log(response.data);
        }
        catch(e){
          console.log(e)
        }
      }


async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    SaveToken(token)
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

const styles = StyleSheet.create({
  area:{
    width:"90%",
    height:100,
    backgroundColor:"red",
    marginTop:100,
    marginLeft:20
  },
  text:{
    textAlign:"center",
    justifyContent:"center",
    color:"green"
  }
  
})