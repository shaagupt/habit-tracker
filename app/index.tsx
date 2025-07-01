import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const mockHabits = [
  { id: '1', title: 'Run a mile', completed: false },
  { id: '2', title: 'Eat Breakfast', completed: false },
  { id: '3', title: 'Take a shower', completed: false },
  { id: '4', title: 'Daily Affirmations', completed: false },
  { id: '5', title: 'Work Hard', completed: false },
  { id: '6', title: 'Play Hard', completed: false },
];

export default function HomeScreen() {
  const [habits, setHabits] = useState(mockHabits);

  useEffect(() => {
  const loadHabits = async () => {
    try {
      const storedHabits = await AsyncStorage.getItem('habits');
      if (storedHabits) {
        setHabits(JSON.parse(storedHabits));
      }
    } catch (error) {
      console.error('Failed to load habits:', error);
    }
  };

  loadHabits();
}, []);


  const [newHabit, setNewHabit] = useState('');


  const [currentDate, setCurrentDate] = useState(new Date());


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); 

    return () => clearInterval(timer); 
  }, []);

  const toggleHabit = (id: string) => {
  setHabits(prevHabits =>
    prevHabits.map(habit =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    )
  );
};

  useEffect(() => {
    const saveHabits = async () => {
      try {
        await AsyncStorage.setItem('habits', JSON.stringify(habits));
      } catch (error) {
        console.error('Failed to save habits:', error);
      }
    };

    saveHabits();
  }, [habits]);


  const addHabit = () => {
    if (newHabit.trim() === '') return;

    const newHabitItem = {
      id: Date.now().toString(),
      title: newHabit,
      completed: false,
    };

    setHabits(prev => [...prev, newHabitItem]);
    setNewHabit('');
    Keyboard.dismiss();
  };


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.date}>
  {currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })}
</Text>
      <Text style={styles.title}>Daily Routine</Text>
      
        <View style={styles.inputContainer}>
    <TextInput
      value={newHabit}
      onChangeText={setNewHabit}
      placeholder="Add a new habit"
      placeholderTextColor="black"
      style={styles.input}
    />
    <TouchableOpacity onPress={addHabit} style={styles.addButton}>
      <Text style={styles.addButtonText}>＋</Text>
    </TouchableOpacity>
  </View>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.habitCard}>
            <Text style={styles.habitText}>{item.title}</Text>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => toggleHabit(item.id)}
            >
              <Text style={styles.doneText}>
                {item.completed ? '✅' : ''}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  habitCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'purple',
    borderRadius: 8,
  },
  habitText: { fontSize: 16 },
  doneButton: { backgroundColor: 'white', padding: 8, borderRadius: 5 },
  doneText: { color: 'white' },

  inputContainer: {
  flexDirection: 'row',
  marginBottom: 20,
},
input: {
  flex: 1,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  paddingHorizontal: 12,
  paddingVertical: 8,
  marginRight: 10,
},
addButton: {
  backgroundColor: '#4caf50',
  paddingHorizontal: 16,
  justifyContent: 'center',
  borderRadius: 8,
},
addButtonText: {
  color: 'white',
  fontSize: 24,
  fontWeight: 'bold',
},
});
