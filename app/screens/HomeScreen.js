import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://192.168.254.135:3000/api";

export default function HomeScreen({ route, navigation }) {
  const { user } = route.params;
  const [foods, setFoods] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchFoods();
    }, [])
  );

  const fetchFoods = async () => {
    try {
      const res = await axios.get(`${API_URL}/foods/getFood/${user.id}`);
      setFoods(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteLatest = () => {
    if (foods.length === 0) return;

    const performDelete = async () => {
      const latestFood = foods.reduce((prev, current) => {
        const prevTime = prev.created_at?._seconds || 0;
        const currentTime = current.created_at?._seconds || 0;
        return prevTime > currentTime ? prev : current;
      });

      try {
        await axios.delete(`${API_URL}/foods/deleteFood/${latestFood.id}`);
        fetchFoods(); 
      } catch (error) {
        console.log("Failed to delete:", error);
        if (Platform.OS === 'web') {
          alert("Error: Network error, wala na-delete.");
        } else {
          Alert.alert("Error", "Network error, wala na-delete.");
        }
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm("Sigurado ka gusto nimo i-delete ang pinaka-uwahi nga gi-add?");
      if (confirmed) performDelete();
    } else {
      Alert.alert(
        "Confirm Delete",
        "Sigurado ka gusto nimo i-delete ang pinaka-uwahi nga gi-add?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: performDelete }
        ]
      );
    }
  };

  const handleSpinNavigation = () => {
    if (foods.length < 2) {
      if (Platform.OS === 'web') {
        alert("Oops! Pag-add sa og at least 2 ka pagkaon para maka-spin.");
      } else {
        Alert.alert("Oops!", "Pag-add sa og at least 2 ka pagkaon para maka-spin.");
      }
    } else {
      navigation.navigate('Spin', { user, foods });
    }
  };

  const handleLogout = () => {
    const performLogout = async () => {
      try {
        await AsyncStorage.removeItem('user_session');
        navigation.replace('Login');
      } catch (e) {
        console.log(e);
        navigation.replace('Login');
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm("Sigurado ka gusto ka mag-logout?");
      if (confirmed) performLogout();
    } else {
      Alert.alert(
        "Confirm Logout",
        "Sigurado ka gusto ka mag-logout?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Log Out", style: "destructive", onPress: performLogout }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Unsay Kan-on?</Text>
      <Text style={styles.subText}>User: {user.name}</Text>

      {foods.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No food added yet.</Text>
        </View>
      ) : (
        <FlatList
          data={foods}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.foodItem}>
              <Text style={styles.foodText}> ‣  {item.name}</Text>
            </View>
          )}
          style={styles.list}
        />
      )}

      <View style={styles.btnGroup}>
        <TouchableOpacity 
          style={styles.btnAdd} 
          onPress={() => navigation.navigate('AddFood', { user })}
        >
          <Text style={styles.btnText}>ADD FOOD</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btnDelete} 
          onPress={handleDeleteLatest}
        >
          <Text style={styles.btnText}>DELETE</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btnSpin} 
          onPress={handleSpinNavigation}
        >
          <Text style={[styles.btnText, { color: '#333' }]}>SPIN</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btnLogout} 
          onPress={handleLogout}
        >
          <Text style={[styles.btnText, { color: '#37474f' }]}>LOG OUT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    paddingTop: 60, 
    backgroundColor: '#fff' 
  },

  header: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#263238', 
    textAlign: 'center', 
    marginTop: -10 
  },

  subText: { 
    textAlign: 'center', 
    color: '#78909c', 
    marginBottom: 30, 
    marginTop: 10 
  },

  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  emptyText: { 
    color: '#ccc' 
  },

  list: { 
    flex: 1, 
    width: '100%', 
    marginBottom: 20 
  },

  foodItem: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },

  foodText: { 
    fontSize: 16, 
    color: '#333' 
  },

  btnGroup: { 
    gap: 10 
  },

  btnAdd: { 
    backgroundColor: '#4DB6AC', 
    padding: 15, 
    borderRadius: 5, 
    alignItems: 'center' 
  },

  btnDelete: { 
    backgroundColor: '#EF5350', 
    padding: 15, 
    borderRadius: 5, 
    alignItems: 'center' 
  },

  btnSpin: { 
    backgroundColor: '#FDD835', 
    padding: 15, 
    borderRadius: 5, 
    alignItems: 'center' 
  },

  btnLogout: { 
    borderWidth: 1, 
    borderColor: '#78909c', 
    padding: 15, 
    borderRadius: 5, 
    alignItems: 'center' 
  },

  btnText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});