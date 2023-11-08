import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';
import Test from './pages/Test';

import Main from './pages/Main';
import Camera from './pages/Camera';
import ShowImage from "./pages/ShowImage"
import ImageGal from './pages/ImageGal';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer style={styles.theme}>
      <Drawer.Navigator screenOptions={{}}>
        <Drawer.Screen name="Home" component={Main}/>
        <Drawer.Screen name="ImageDisplay" component={Camera}/>
        <Drawer.Screen name="Image" component={ImageGal}/>
        <Drawer.Screen name="Camera" component={ShowImage}/>



      </Drawer.Navigator>

    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  theme:{
    dark: false,
    colors: {
      primary: 'rgb(255, 45, 199)',
      background: '#fcf9f5',
      card: '#ffffff',
      text: '#000000',
      border: "#ccc7c8",
      notification: '#ff863a',
    },

  }
});
