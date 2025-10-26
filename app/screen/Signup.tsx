import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Define the RootStackParamList to define the navigation structure and types
type RootStackParamList = {
  Signup: undefined;  // No parameters for Signup screen
  Playlist: undefined;  // No parameters for Playlist screen
  Registration: undefined;  // No parameters for Registration screen
  DrawerWrapper: undefined;  // No parameters for Drawer navigator
};

// Correctly type the navigation prop with NativeStackNavigationProp
type SignupNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation<SignupNavigationProp>();  // Using the correct type for navigation

  const handleLogin = () => {
    console.log('Login Details:', { username, password });

    if (username && password) {
      navigation.navigate('DrawerWrapper');
;  // This works because 'Playlist' is defined in RootStackParamList
    } else {
      alert('Please enter valid credentials');
    }
  };

  const handleSignup = () => {
    navigation.navigate('Registration');  // This works because 'Registration' is defined in RootStackParamList
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://www.freepnglogos.com/uploads/spotify-logo-png/spotify-download-logo-30.png' }} // Spotify logo URL
        style={styles.logo}
      />
      <Text style={styles.heading}>Spotify</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#fff"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#fff"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <Text style={styles.forgotPassword}>Forgot password?</Text>
      <View style={styles.socialLoginContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialButtonText}>f</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialButtonText}>G</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.signUpText}>
        Don't have an account?{' '}
        <Text style={styles.signUpLink} onPress={handleSignup}>Sign Up</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  // Ensure it takes up the entire screen
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#121212',  // Black background
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 45,
    backgroundColor: '#333',
    color: 'white',
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#1DB954',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    color: '#b3b3b3',
    textAlign: 'center',
    marginVertical: 10,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  socialButton: {
    backgroundColor: '#333',
    width: 45,
    height: 45,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpText: {
    color: '#b3b3b3',
    textAlign: 'center',
  },
  signUpLink: {
    color: '#1DB954',
    fontWeight: 'bold',
  },
});

export default Signup;
