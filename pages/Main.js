// Import necessary components and libraries
import "react-native-gesture-handler";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Camera from "../pages/Camera"; // Updated import name for CameraWindow component
import ImageGalleria from "../pages/ImageGalleria"; // Updated import name for ImageGallery component
import camera from "../assets/camera.png";

const Drawer = createDrawerNavigator();

// Function to define the drawer navigation
function MyDrawer() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Camera" component={Camera} />{" "}
        <Drawer.Screen name="ImageGallery" component={ImageGalleria} />{" "}
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
          <Text style={styles.appTitle}>Image Galleria </Text>
          <TouchableOpacity style={styles.actionButton}  onPress={() => navigation.navigate('Camera')} >
          <Image source={camera} size={70} />
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  topContainer: {
    flex: 1,
    height: "50%", //Define the height the container takes 
    top: 45,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  topInnerContainer: {
    flex: 1,
    top: -50,
    height: "50%",//Define the height the container takes 
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  appTitle: {
    fontSize: 40,
    color: "#CC5500", //Burnt Orange color
  },
  // bottomContainer: {
  //   flex: 1,
  //   height: "80%", //Define the height the container takes 
  //   alignItems: "center",
  //   justifyContent: "center",
  //   width: "100%",
  // },
  // actionButton: {
  //   backgroundColor: "green",
  //   borderRadius: 20,
  //   height: 45,
  //   width: 300,
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  // buttonText: {
  //   color: "white",
  // },
});
