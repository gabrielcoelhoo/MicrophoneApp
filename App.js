/**
 Summary
 import
 functions
 useEffect
 permissions
 const for startRecording, stopRecording, playSound and stopSound
 view
 style
 */

//import components to be used 

import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { Audio } from 'expo-av';

let recording = new Audio.Recording();

//set the useStates as false which will be changed when start an action
export default function App() {
  const [RecordedURI, SetRecordedURI] = useState('');
  const [AudioPerm, SetAudioPerm] = useState(false);
  const [isRecording, SetisRecording] = useState(false);
  const [isPLaying, SetisPLaying] = useState(false);
  const Player = useRef(new Audio.Sound());

  useEffect(() => {
    GetPermission();
  }, []);

  //audio permission
  const GetPermission = async () => {
    const getAudioPerm = await Audio.requestPermissionsAsync();
    SetAudioPerm(getAudioPerm.granted);
  };

  //actions of start and stop audio and recordings
  const startRecording = async () => {
    if (AudioPerm === true) {
      try {
        await recording.prepareToRecordAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        await recording.startAsync();
        SetisRecording(true);
      } catch (error) {
        console.log(error);
      }
    } else {
      GetPermission();
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const result = recording.getURI();
      SetRecordedURI(result); // Here is the URI
      recording = new Audio.Recording();
      SetisRecording(false);
    } catch (error) {
      console.log(error);
    }
  };

//playsound - code to execute a file after the recording 
  //reference 
  //https://stackoverflow.com/questions/67207450/how-can-i-play-a-sound-after-recording-in-react-native-expo
  const playSound = async () => {
    try {
      const result = await Player.current.loadAsync(
        { uri: RecordedURI },// RecordedURI - this is the parameter where is allocated the audio file
        {},
        true
      );

      const response = await Player.current.getStatusAsync();
      if (response.isLoaded) {
        if (response.isPlaying === false) {
          Player.current.playAsync();
          SetisPLaying(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const stopSound = async () => {
    try {
      const checkLoading = await Player.current.getStatusAsync();
      if (checkLoading.isLoaded === true) {
        await Player.current.stopAsync();
        SetisPLaying(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textPage}>
        <Text>Welcome to the Audio Recording App</Text>
        <Text>Now you can record any song at any place</Text>
        </View>
      <View style={styles.buttonsSpace}/>
      <Button color="#0000CC"
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? () => stopRecording() : () => startRecording()}
      />
      <View style={styles.buttonsSpace}/>
      <Button color="#0066CC"
        title="Play Sound"
        onPress={isPLaying ? () => stopSound : () => playSound()}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  buttonsSpace: {
    width: 20, 
    height: 20,
  },
  textPage: {
    alignItems: 'center',
  },
});
