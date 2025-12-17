import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Alert } from 'react-native';
import axios from 'axios';

const API_URL = "http://192.168.254.135:3000/api";
const WHEEL_SIZE = 300;

export default function SpinScreen({ route, navigation }) {
  const { user, foods } = route.params;
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  const sliceColors = [
    '#EF5350', 
    '#FDD835', 
    '#4DB6AC', 
    '#42A5F5', 
    '#AB47BC', 
    '#FF7043'  
  ];

  const handleSpin = () => {
    if (foods.length < 2) {
      Alert.alert("Opps", "Pagbutang sa og 2 ka pagkaon para maka-spin!");
      return;
    }

    setIsSpinning(true);
    setWinner(null);
    spinValue.setValue(0);

    const winningIndex = Math.floor(Math.random() * foods.length);
    const selectedFood = foods[winningIndex];
    setWinner(selectedFood);

    const sliceAngle = 360 / foods.length;
    const centerOfSlice = (winningIndex * sliceAngle) + (sliceAngle / 2);
    const angleToStop = 360 - centerOfSlice;
    const fullSpins = 5 * 360;
    const finalRotationValue = fullSpins + angleToStop;

    Animated.timing(spinValue, {
      toValue: finalRotationValue,
      duration: 4000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(async () => {
      setIsSpinning(false);
      try {
        await axios.post(`${API_URL}/spin-history/addSpin-history`, {
          user_id: user.id,
          food_id: selectedFood.id
        });
      } catch(e) { console.log(e); }
    });
  };

  const spinInterpolation = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>← Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Unsay Kan-on?</Text>

      <View style={styles.wheelContainer}>
        <View style={styles.pointer} />
        <Animated.View style={[styles.wheel, { transform: [{ rotate: spinInterpolation }] }]}>
          {foods.map((food, index) => {
            const rotate = (360 / foods.length) * index;
            const skewY = 90 - (360 / foods.length);
            
            const color = sliceColors[index % sliceColors.length];

            return (
              <View key={`slice-${index}`} style={[
                styles.segment,
                {
                  backgroundColor: color,
                  transform: [{ rotate: `${rotate}deg` }, { skewY: `-${skewY}deg` }]
                }
              ]} />
            );
          })}

          {foods.map((food, index) => {
            const sliceAngle = 360 / foods.length;
            const centerAngle = (sliceAngle * index) + (sliceAngle / 2);
            return (
              <View
                key={`text-${index}`}
                style={[styles.textContainer, { transform: [{ rotate: `${centerAngle}deg` }] }]}
              >
                <Text style={styles.segmentText} numberOfLines={1}>
                  {food.name}
                </Text>
              </View>
            );
          })}
        </Animated.View>

        <View style={styles.centerKnob}>
          <Text style={styles.centerKnobText}>SPIN</Text>
        </View>
      </View>

      <View style={styles.resultContainer}>
        {isSpinning && <Text style={styles.thinking}>...</Text>}
        {!isSpinning && winner && (
          <View style={styles.winnerContainer}>
            <Text style={styles.winnerLabel}>Mao ni inyong kan-on:</Text>
            <Text style={styles.winnerText}>{winner.name}!</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.btnSpin} onPress={handleSpin} disabled={isSpinning}>
        <Text style={styles.btnText}>SPIN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60
  },

  headerContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 10
  },

  backLink: {
    fontSize: 16,
    color: '#37474f',
    padding: 10,
    marginBottom: 20,
    marginTop: -19
  },

  title: {
    color: '#263238',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 70,
    textAlign: 'center'
  },

  wheelContainer: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    position: 'relative'
  },

  wheel: {
    width: '100%',
    height: '100%',
    borderRadius: 150,
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: '#fff',
    backgroundColor: '#790c0cff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },

  segment: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: '50%',
    height: '50%',
    transformOrigin: 'bottom left',
    borderWidth: 1,
    borderColor: '#fff'
  },

  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopWidth: 25,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#263238',
    position: 'absolute',
    top: -20,
    zIndex: 10
  },

  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    zIndex: 2
  },

  segmentText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    maxWidth: 80,
    textAlign: 'center',
    transform: [{ rotate: '0deg' }]
  },

  centerKnob: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#263238',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#fff',
    position: 'absolute'
  },

  centerKnobText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10
  },

  resultContainer: {
    height: 100,
    alignItems: 'center',
    marginTop: 40
  },

  thinking: {
    fontSize: 30,
    color: '#FDD835',
    fontWeight: 'bold'
  },

  winnerContainer: {
    alignItems: 'center'
  },

  winnerLabel: {
    color: '#78909c'
  },

  winnerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#263238',
    marginTop: 30
  },

  btnSpin: {
    width: '100%',
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#FDD835',
    alignItems: 'center',
    marginTop: 50
  },

  btnText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16
  }
});