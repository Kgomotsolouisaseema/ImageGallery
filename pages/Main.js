// Import necessary components and libraries
import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import CameraWindow from './Camera'; // Updated import name for CameraWindow component
import ImageGallery from './ImageGal'; // Updated import name for ImageGallery component

const Drawer = createDrawerNavigator();

// Function to define the drawer navigation
function MyDrawer() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Camera" component={CameraWindow} /> {/* Updated component name */}
        <Drawer.Screen name="ImageGallery" component={ImageGallery} /> {/* Updated component name */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

// Main component
export default function Main({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.topInnerContainer}>
          <Text style={styles.appTitle}>Image Gallery App</Text>
          <Ionicons name="ios-camera" size={200} color="green" />
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.actionSignButton}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Camera')}
            style={styles.actionButton}
          >
            <Text style={styles.buttonText}>Lets take  a Picture</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topContainer: {
    flex: 1,
    height: '60%',
    top: 45,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  topInnerContainer: {
    flex: 1,
    top: 60,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  appTitle: {
    fontSize: 20,
    color: 'gray',
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  actionButton: {
    backgroundColor: 'green',
    borderRadius: 20,
    height: 45,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
  },
});
