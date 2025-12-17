import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://192.168.254.135:3000/api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('user_session');
        if (jsonValue != null) {
          const savedUser = JSON.parse(jsonValue);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home', params: { user: savedUser } }],
          });
        }
      } catch (e) {
        console.log(e);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkLogin();
  }, []);

  const showAlert = (title, message, onPressAction = null) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
      if (onPressAction) onPressAction();
    } else {
      Alert.alert(title, message, onPressAction ? [{ text: "OK", onPress: onPressAction }] : [{ text: "OK" }]);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert("Kuwang nga Impormasyon", "Palihug butangi ang email ug password.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(`${API_URL}/users/getAllusers`);
      const users = res.data;

      const registeredUser = users.find(u => u.email === email);

      if (!registeredUser) {
        setLoading(false);
        showAlert("Naay Problema", "Wala pa na-register kini nga email. Palihug pag Sign Up una.");
        return;
      }

      if (registeredUser.password !== password) {
        setLoading(false);
        showAlert("Sayop ang Password", "Dili mao ang password. Palihug suwayi pag-usab.");
        return;
      }

      await AsyncStorage.setItem('user_session', JSON.stringify(registeredUser));

      setLoading(false);
      showAlert("Malampuson", "Malampuson nga nakasulod!", () => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home', params: { user: registeredUser } }],
        });
      });

    } catch (error) {
      setLoading(false);
      console.log(error);
      showAlert("Problema sa Koneksyon", "Dili maka-connect sa server. I-check imong internet o server IP.");
    }
  };

  if (checkingAuth) {
    return (
      <View style={[styles.container, { alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4DB6AC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back!</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="hello@example.com"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
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
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.footerLink}>
          <Text style={styles.footerText}>
            Don't have an account? <Text style={styles.link}>Sign Up</Text>
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