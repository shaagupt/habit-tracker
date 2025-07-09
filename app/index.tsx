
// Initial Imports
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Navigation Imports For Header
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';


// Initital Hard Coded Data
const mockHabits = [
  { id: '1', title: 'Run a mile', completed: false },
  { id: '2', title: 'Eat Breakfast', completed: false },
  { id: '3', title: 'Take a shower', completed: false },
  { id: '4', title: 'Daily Affirmations', completed: false },
  { id: '5', title: 'Work Hard', completed: false },
  { id: '6', title: 'Play Hard', completed: false },
];


  export default function HomeScreen() {
  // State For All Habits
    const [habits, setHabits] = useState(mockHabits);

    // Navigation Object To Customize Header
    const navigation = useNavigation();

    // Header Layout And Rendering
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'My Routine',
      headerTitleAlign: 'center',
    });
  }, [navigation]);


  // Load Data from Local Storage When Loaded
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


// State For New Habit Field 
  const [newHabit, setNewHabit] = useState('');

// State For Current Date
  const [currentDate, setCurrentDate] = useState(new Date());

// Updates Date Every Minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); 

    return () => clearInterval(timer); 
  }, []);

  // Completion Status Of A Habit
  const toggleHabit = (id: string) => {
  setHabits(prevHabits =>
    prevHabits.map(habit =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    )
  );
};

// Saving Habits
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


  // Adding Habits
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

  // Deleting Habits
  const deleteHabit = (id: string) => {
  const updatedHabits = habits.filter(habit => habit.id !== id);
  setHabits(updatedHabits);
};


// Renders UI
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

      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => toggleHabit(item.id)}
        >
          <Text style={styles.doneText}>{item.completed ? '✅' : ''}</Text>
        </TouchableOpacity>

          <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => {
        Alert.alert(
          'Delete Habit',
          'Are you sure you want to delete this habit?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => deleteHabit(item.id),
            },
          ]
        );
      }}
    >
  <Text style={styles.deleteText}>␡</Text>
</TouchableOpacity>

      </View>
    </View>
        )}
      />
    </SafeAreaView>
  );
}


// All Styles For The App
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginLeft:20},
    date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    marginTop:20,
    marginLeft:20,
  },
  habitCard: {
  backgroundColor: 'lavender',
  padding: 16,
  marginBottom: 10,
  marginLeft:10,
  marginRight:10,
  borderRadius: 10,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 2,
},

  habitText: { fontSize: 16, fontWeight: '800', color: 'black', paddingLeft: 10},
  doneButton: {   width: 40,
  height: 40,
  borderRadius: 8,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 8,
  borderWidth: 2,
  borderColor: '#ccc', },
  doneText: { fontSize: 24,
  textAlign: 'center', },

  inputContainer: {
  flexDirection: 'row',
  marginBottom: 20,
  marginLeft: 167,
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
  marginRight: 10,
},
addButtonText: {
  color: 'white',
  fontSize: 24,
  fontWeight: 'bold',
},
deleteButton: {
  marginLeft: 10,
  padding: 10,
},

deleteText: {
  fontSize: 25,
  color: 'red',
},

});
