import { ScrollView, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'react-native';
import * as React from 'react';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// const Images = [
//     // { uri: img1 },
//     { uri: img2 },
//     { uri: img3 },
//     { uri: img4 },
//     { uri: img4 },
//     { uri: img4 },
//     { uri: img4 },
// ];

const Stack = createNativeStackNavigator();

let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

const database = SQLite.openDatabase('myImageDatabase.db');

 function Camera({ navigation }) {

    // CREATE A NEW STATE VARIABLE NAMED 'IMAGE_DATA' AND SET IT TO NULL INITIALLY
    const [imageData, setImageData] = React.useState(null);

    // RETRIEVE DATA FROM SQLITE DATABASE WHEN COMPONENT MOUNTS
    React.useEffect(() => {
        // OPEN A TRANSACTION TO FETCH IMAGE DATA FROM THE DATABASE
        database.transaction((tx) => {
            // EXECUTE SQL QUERY TO SELECT DATA FROM 'IMAGEGALLERY' TABLE, ORDERED BY ID DESCENDING
            tx.executeSql(
                'SELECT * FROM imageGallery ORDER BY id DESC',
                null,
                // SUCCESS CALLBACK: SET 'IMAGE_DATA' STATE WITH THE FETCHED DATA
                (txObj, results) => {
                    setImageData(results.rows._array);
                },
                // ERROR CALLBACK: LOG ANY ERRORS ENCOUNTERED DURING FETCHING
                (txObj, error) => {
                    console.log('Error retrieving image data:', error);
                }
            );
        });
    }, []); // EMPTY DEPENDENCY ARRAY ENSURES THE EFFECT RUNS ONLY ONCE, AFTER THE INITIAL RENDER

    return (
        <ScrollView>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', width: 350 }}>
                {/* MAP THROUGH THE 'IMAGE_DATA' ARRAY AND RENDER IMAGES */}
                {imageData && imageData.map((image, index) => {
                    return (
                        <TouchableOpacity key={index} onPress={() => navigation.navigate('ShowImage', { value: image })} style={{ width: '47%', margin: 5 }}  >
                            {/* DISPLAY THE IMAGE USING THE URI FROM THE 'IMAGE_DATA' ARRAY */}
                            <Image source={{ uri: image.image }}
                                style={{ height: deviceHeight / 3, width: '100%', borderRadius: 2, borderWidth: 0.2, borderColor: 'rgba(0,0,0,0.4)' }} />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
}
export default Camera
