import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import axios from 'axios';

const API_URL = "http://192.168.254.135:3000/api";

const FOOD_POOL = [
  "Lechon Manok", "Liempo", "Sinigang", "Adobo", "Tinola", 
  "Ngohiong", "Puso", "Ginabot", "Larang", "Balbacua",
  "Jollibee", "McDo", "KFC", "Chowking", "Mang Inasal",
  "Pizza", "Burger", "Fries", "Shawarma", "Sisig",
  "Batchoy", "Lomi", "Pancit Canton", "Bihon", "Bam-i",
  "Siomai", "Tempura", "Kwek-kwek", "Isaw", "Fishball",
  "Halo-halo", "Milk Tea", "Samgyupsal", "Ramen", "Sushi"
];

export default function AddFoodScreen({ route, navigation }) {
  const { user } = route.params;
  const [foodName, setFoodName] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleSave = async () => {
    if (!foodName.trim()) {
      if (Platform.OS === 'web') {
        alert("Kuwang ang Impormasyon: Palihug ibutang ang ngalan sa pagkaon.");
      } else {
        Alert.alert("Kuwang ang Impormasyon", "Palihug ibutang ang ngalan sa pagkaon.");
      }
      return;
    }

    try {
      await axios.post(`${API_URL}/foods/addFoods`, {
        user_id: user.id,
        category_id: "default",
        name: foodName
      });

      if (Platform.OS === 'web') {
        alert(`Success! Na-add na ang ${foodName}.`);
        navigation.goBack(); 
      } else {
        Alert.alert(
          "Success", 
          `Na-add na ang ${foodName}!`,
          [
            { 
              text: "OK", 
              onPress: () => navigation.goBack() 
            }
          ]
        );
      }

    } catch (error) {
      console.log(error);
      if (Platform.OS === 'web') {
        alert("Error: Wala na-add ang pagkaon. Palihug suwayi utro.");
      } else {
        Alert.alert("Error", "Wala na-add ang pagkaon. Palihug suwayi utro.");
      }
    }
  };

  const generateAI = () => {
    setLoading(true);
    setSuggestions([]);

    setTimeout(() => {
      const shuffled = [...FOOD_POOL].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 5);
      setSuggestions(selected);
      setLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backLink}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Add New Food</Text>

      <TextInput 
        style={styles.input} 
        value={foodName} 
        onChangeText={setFoodName} 
        placeholder="e.g. Mang Inasal" 
      />

      <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
        <Text style={styles.btnText}>SAVE</Text>
      </TouchableOpacity>

      <View style={styles.aiHeader}>
        <Text style={styles.aiLabel}>AI SUGGESTIONS</Text>
        <TouchableOpacity onPress={generateAI} style={styles.aiButton}>
          {loading ? (
            <ActivityIndicator size="small" color="#009688" />
          ) : (
            <Text style={styles.generateLink}>Generate</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.chipsContainer}>
        {suggestions.map((item, index) => (
          <TouchableOpacity key={index} style={styles.chip} onPress={() => setFoodName(item)}>
            <Text style={styles.chipText}>+ {item}</Text>
          </TouchableOpacity>
        ))}
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

  backLink: { 
    fontSize: 16, 
    color: '#37474f', 
    marginBottom: 70, 
    marginTop: -10 
  },

  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#263238', 
    textAlign: 'center', 
    marginBottom: 70 
  },

  input: { 
    backgroundColor: '#f5f5f5', 
    borderWidth: 1, 
    borderColor: '#FDD835', 
    padding: 15, 
    borderRadius: 5, 
    fontSize: 16, 
    marginBottom: 20 
  },

  btnSave: { 
    backgroundColor: '#FDD835', 
    padding: 15, 
    borderRadius: 5, 
    alignItems: 'center' 
  },

  btnText: { 
    color: '#333', 
    fontWeight: 'bold', 
    fontSize: 16 
  },

  aiHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 50 
  },

  aiLabel: { 
    color: '#546E7A', 
    fontWeight: 'bold' 
  },

  aiButton: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },

  generateLink: { 
    color: '#009688', 
    fontWeight: 'bold' 
  },

  chipsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10, 
    marginTop: 15 
  },

  chip: { 
    backgroundColor: '#E0F2F1', 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#4DB6AC' 
  },

  chipText: { 
    color: '#00695C', 
    fontWeight: '600' 
  }
});