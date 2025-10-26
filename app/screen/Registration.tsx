import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type RootStackParamList = {
  Signup: undefined;
  Registration: undefined;
  Playlist: undefined; // Assuming you'll redirect to Playlist screen after signup
};

export default function SpotifySignUpScreen() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Handle the sign up action
  const handleSignUp = () => {
    if (!email || !fullName || !password || !dobDay || !dobMonth || !dobYear || !gender) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    // Successful signup logic
    Alert.alert('Success', `Welcome, ${fullName}!`);
    
    // Navigate to the Playlist screen after successful signup
    navigation.navigate('Signup');
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert(`${provider} Login`, `Login with ${provider} clicked`);
  };

  const handleSignInRedirect = () => {
    // Navigate to login screen
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#121212' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Spotify Logo */}
        <View style={styles.logoContainer}>
          <Image
        source={{ uri: 'https://www.freepnglogos.com/uploads/spotify-logo-png/spotify-download-logo-30.png' }} // Spotify logo URL
            style={styles.logo}
          />
          <Text style={styles.title}>Spotify</Text>
        </View>

        {/* Input Fields */}
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#555"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#555"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#555"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Date of Birth */}
        <View style={styles.dobContainer}>
          <Text style={styles.dobLabel}>Date Of Birth :</Text>
          <TextInput
            style={[styles.dobInput, { marginRight: 6 }]}
            placeholder="DD"
            placeholderTextColor="#555"
            value={dobDay}
            onChangeText={setDobDay}
            maxLength={2}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.dobInput, { marginRight: 6 }]}
            placeholder="MM"
            placeholderTextColor="#555"
            value={dobMonth}
            onChangeText={setDobMonth}
            maxLength={2}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.dobInput}
            placeholder="YY"
            placeholderTextColor="#555"
            value={dobYear}
            onChangeText={setDobYear}
            maxLength={2}
            keyboardType="numeric"
          />
        </View>

        {/* Gender Selection */}
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[styles.genderOption, gender === 'male' && styles.genderSelected]}
            onPress={() => setGender('male')}
          >
            <View style={[styles.radioCircle, gender === 'male' && styles.radioSelected]} />
            <Text style={styles.genderText}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.genderOption, gender === 'female' && styles.genderSelected]}
            onPress={() => setGender('female')}
          >
            <View style={[styles.radioCircle, gender === 'female' && styles.radioSelected]} />
            <Text style={styles.genderText}>Female</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity onPress={handleSignUp} style={styles.signUpButton}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Social Sign Up */}
        <Text style={styles.socialText}>Sign Up With</Text>
        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={[styles.socialButton, styles.socialButtonShadow]}
            onPress={() => handleSocialLogin('Facebook')}
          >
            <Text style={styles.socialTextBtn}>f</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, styles.socialButtonShadow]}
            onPress={() => handleSocialLogin('Google')}
          >
            <Text style={styles.socialTextBtn}>G</Text>
          </TouchableOpacity>
        </View>

        {/* Already have an account */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleSignInRedirect}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 6,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 25,
    color: 'white',
    marginBottom: 8,
    fontSize: 14,
  },
  dobContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  dobLabel: {
    color: '#1DB954',
    marginRight: 8,
    fontWeight: '600',
    fontSize: 13,
  },
  dobInput: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 25,
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  genderContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 14,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 25,
    backgroundColor: '#1E1E1E',
    flex: 1,
    marginHorizontal: 5,
  },
  genderSelected: {
    backgroundColor: '#1DB954',
  },
  radioCircle: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1DB954',
    marginRight: 6,
  },
  radioSelected: {
    backgroundColor: '#1DB954',
  },
  genderText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  signUpButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 14,
    width: '100%',
  },
  signUpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  socialText: {
    color: '#1DB954',
    fontSize: 13,
    marginBottom: 8,
    textAlign: 'center',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
    marginBottom: 20,
  },
  socialButton: {
    backgroundColor: '#1E1E1E',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 5,
  },
  socialTextBtn: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  footerText: {
    color: '#888',
    fontSize: 13,
  },
  signInText: {
    color: '#1DB954',
    fontSize: 13,
    fontWeight: '600',
  },
});
