import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import axios from 'axios';

const API_URL = "https://backend-project-wktw.onrender.com";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const showAlert = (title, message, onPressAction = null) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
      if (onPressAction) onPressAction();
    } else {
      Alert.alert(title, message, onPressAction ? [{ text: "OK", onPress: onPressAction }] : [{ text: "OK" }]);
    }
  };

  const handleSignup = async () => {
    if (!username.trim() || !/[a-zA-Z]/.test(username)) {
      showAlert("Sayop nga Ngalan", "Palihug butangi ug tarong nga ngalan (dapat naay letters).");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      showAlert("Sayop nga Email", "Dili mao ang format sa email. (Ex: test@gmail.com)");
      return;
    }

    if (password.length < 6) {
      showAlert("Mubo ra nga Password", "Ang password dapat muabot ug 6 ka characters o labaw pa.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/users/addUser`, {
        name: username,
        email,
        password
      });
      
      setLoading(false);
      
      showAlert(
        "Malampuson", 
        "Malampuson nga nakahimo og account! Palihug pag-login.",
        () => navigation.goBack() 
      );

    } catch (error) {
      setLoading(false);
      console.log(error);
      showAlert("Naay Problema", "Wala nahimo ang account. Palihug suwayi pag-usab.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="anghel123"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="hello@example.com"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="⦁⦁⦁⦁⦁⦁"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          style={[styles.btnPrimary, loading && styles.btnDisabled]} 
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.footerLink}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.link}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f7fa',
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  
  formContainer: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    maxWidth: 500, 
    width: '100%',
    alignSelf: 'center'
  },

  title: {
    color: '#263238',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center'
  },

  label: {
    color: '#546e7a',
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    fontSize: 14
  },

  input: {
    backgroundColor: '#f0f4f8',
    borderColor: '#cfd8dc',
    borderRadius: 8,
    borderWidth: 1,
    color: '#333',
    padding: 14,
    fontSize: 16,
    outlineStyle: 'none' 
  },

  btnPrimary: {
    alignItems: 'center',
    backgroundColor: '#4DB6AC',
    borderRadius: 8,
    marginTop: 30,
    padding: 16,
    cursor: 'pointer' 
  },

  btnDisabled: {
    backgroundColor: '#b2dfdb',
  },

  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1
  },

  footerLink: {
    marginTop: 20,
    padding: 10,
    cursor: 'pointer'
  },

  footerText: {
    color: '#78909c',
    textAlign: 'center',
    fontSize: 15
  },

  link: {
    color: '#009688',
    fontWeight: 'bold'
  }
});