
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Button, Alert } from 'react-native'
import { Camera } from 'expo-camera'
import { shareAsync } from 'expo-sharing'
import *  as MediaLibrary from 'expo-media-library'
import * as SQLite from 'expo-sqlite';
import { openDatabase } from 'react-native-sqlite-storage';
import { Ionicons } from '@expo/vector-icons'
import { React, useEffect, useRef, useState } from 'react'


import { FontAwesome5, MaterialIcons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';

export default function CameraWidow() {

    let cameraRef = useRef();

    const [cameraPermission, setCameraPermission] = useState()
    const [mediaPermission, setMediaPermission] = useState()
    // const [photo, setPhoto] = useState()
    const [capturedPhoto, setCapturedPhoto] = useState(null);


    
    const database = SQLite.openDatabase('myImageStore.db');

    // sqlite database to store images

    const createTable = () =>{
        database.transaction((tx) => {
            tx.executeSql(
              'CREATE TABLE IF NOT EXISTS imageObject (id INTEGER PRIMARY KEY AUTOINCREMENT, image TEXT, data TEXT)'
              
            );
          },
          (error) =>{
            console.log("error creating table", error);
            // Alert.alert('Success', 'Image was saved successfully')
        },
        
        (a,b) =>{
            console.log("Created ", b);
            // Alert.alert('Success', 'Image was saved successfully')
        });
    }
   

    // save image intyo database

    
    const saveImageToDatabase  = () =>{
        const imageURI = capturedPhoto.uri;
        console.log(imageURI);
        database.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO imageObject (image, data ) values(?,?)',
              [imageURI, "Data"]
            ),
            (txObj,error) =>{
                console.log("Errror", error);
               
            },
            (txObj,success) =>{
                console.log("Added");
                Alert.alert('Success', 'Image was saved successfully')
            }


          });
    }


    //camera permissions
    useEffect(() => {
        (async () => {

            const hascameraPermission = await Camera.requestCameraPermissionsAsync()
            const hasmediaPermission = await MediaLibrary.requestPermissionsAsync()
            setCameraPermission(hascameraPermission.status === 'granted')
            setMediaPermission(hasmediaPermission.status === 'granted')

        })()
    }, [])

    //sqlite Table
    useEffect(()=>{

        createTable()

        database.transaction((tx)=>{
            tx.executeSql('SELECT * FROM imageObject',null,
            (txObj,results)=>{
                 console.log('res',results.rows._array);
            },
            (txObj,error)=>{
                 console.log(error);
            },
            
            )
        })

        // getImage()

    },[])



    if (cameraPermission === undefined) {
        return <Text>Requesting Permissions... Loading... ('o' )</Text>

    } else if (!cameraPermission) {
        return <Text>Permissions have been denied. Please grant permissions in order to use camera.</Text>

    }

    //taking picture 

    // Function to capture a picture using the camera
  let capturePicture = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPicture = await cameraRef.current.takePictureAsync(options);
    setCapturedPhoto(newPicture);

  };

  // Check if a photo has been captured and display appropriate UI
  if (capturedPhoto) {
    // Function to share the captured image
    let shareCapturedPicture = () => {
      shareAsync(capturedPhoto.uri).then(() => {
        setCapturedPhoto(null);
      });
    };

    // Function to save the captured image to the device and database
    let saveCapturedPicture = () => {
      MediaLibrary.saveToLibraryAsync(capturedPhoto.uri).then(() => {
        setCapturedPhoto(null);
        saveImageToDatabase();
      });
    };

        return (
          <SafeAreaView style={styles.container}>
          <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + capturedPhoto.base64 }} />
          <View style={styles.buttonContainer}>
            {/* Share button */}
            <TouchableOpacity onPress={shareCapturedPicture}>
              <Entypo name="share" size={45} color="black" />
            </TouchableOpacity>
            {/* Save button */}
            {mediaPermission&& (
              <TouchableOpacity onPress={saveCapturedPicture}>
                <MaterialIcons name="save-alt" size={45} color="black" />
              </TouchableOpacity>
            )}
            {/* Retake button */}
            <TouchableOpacity onPress={() => { setCapturedPhoto(null) }}>
              <MaterialCommunityIcons name="camera-retake-outline" size={45} color="black" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        )
    }


  

    return (
      <Camera style={styles.cameraContainer} ref={cameraRef}>
      <View style={styles.captureButtonContainer}>

        {/* Capture button */}
        <TouchableOpacity onPress={capturePicture}>
          <FontAwesome5 name="circle" size={60} color="black" />
        </TouchableOpacity>
      </View>
    </Camera>
        
    )
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f25607',  //ORANGE RED COLOUR
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#fff', //white
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 20,
    backgroundColor: '#f25607',//ORANGE RED COLOUR
    width: '100%',
  },
  captureButtonContainer: {
    marginBottom: 20,
  },
});