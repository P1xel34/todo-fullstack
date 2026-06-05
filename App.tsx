import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Настроить базу данных Hasura', is_completed: false },
    { id: '2', title: 'Подключить авторизацию', is_completed: false }
  ]);

  const addTask = () => {
    if (task.trim().length > 0) {
      setTasks([...tasks, { id: Date.now().toString(), title: task, is_completed: false }]);
      setTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: !t.is_completed } : t));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Менеджер задач</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Новая задача..."
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.taskCard, item.is_completed && styles.taskCardCompleted]}
            onPress={() => toggleTask(item.id)}
          >
            <Text style={[styles.taskText, item.is_completed && styles.taskTextCompleted]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  taskCardCompleted: {
    backgroundColor: '#E5E7EB',
  },
  taskText: {
    fontSize: 16,
    color: '#374151',
  },
  taskTextCompleted: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
});