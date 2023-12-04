
import {  StyleSheet } from 'react-native';

import Main from './pages/Main';
import Camera from './pages/Camera';
import ShowImage from "./pages/ShowImage"
import ImageGalleria from './pages/ImageGalleria';


import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function ViewPicture() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="ShowImage"
          component={ShowImage}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {


  return (
    <NavigationContainer style={styles.theme}>
      <Drawer.Navigator screenOptions={{}}>
        
        <Drawer.Screen name="Home" component={Main}/>
        <Drawer.Screen name="Camera" component={Camera}   options={{ headerShown: true }}/>
        <Drawer.Screen name="Image Gallaria" component={ImageGalleria}/>
        <Drawer.Screen name="View Picture" component={ShowImage}  options={{ headerShown: false }}/>

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
      background: '#CC5500',
      card: '#ffffff',
      text: '#000000',
      border: "#ccc7c8",
      notification: '#ff863a',
    },

  }
});
