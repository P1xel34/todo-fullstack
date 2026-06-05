import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';
import { client } from './apollo';
import { useState } from 'react';

const USER_ID = '54f667f2-ea84-4be3-b4e7-0da8d888bc9c';

const GET_TODOS = gql`
  query GetTodos($userId: uuid!) {
    todos(where: { user_id: { _eq: $userId } }) {
      id
      title
      is_completed
    }
  }
`;

const ADD_TODO = gql`
  mutation AddTodo($title: String!, $userId: uuid!) {
    insert_todos_one(object: { title: $title, user_id: $userId }) {
      id
      title
      is_completed
    }
  }
`;

const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: uuid!, $isCompleted: Boolean!) {
    update_todos_by_pk(pk_columns: { id: $id }, _set: { is_completed: $isCompleted }) {
      id
      is_completed
    }
  }
`;

function TodoApp() {
  const [task, setTask] = useState('');

  const { loading, error, data } = useQuery(GET_TODOS, {
    variables: { userId: USER_ID },
  });

  const [addTodo] = useMutation(ADD_TODO, {
    update(cache, { data: { insert_todos_one } }) {
      const existingData: any = cache.readQuery({
        query: GET_TODOS,
        variables: { userId: USER_ID },
      });
      cache.writeQuery({
        query: GET_TODOS,
        variables: { userId: USER_ID },
        data: {
          todos: [...existingData.todos, insert_todos_one],
        },
      });
    },
  });

  const [toggleTodo] = useMutation(TOGGLE_TODO);

  const handleAddTask = () => {
    if (task.trim().length > 0) {
      addTodo({ variables: { title: task, userId: USER_ID } });
      setTask('');
    }
  };

  const handleToggleTask = (id: string, currentStatus: boolean) => {
    toggleTodo({ variables: { id, isCompleted: !currentStatus } });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Ошибка соединения с базой данных</Text>
      </View>
    );
  }

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
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data.todos}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.taskCard, item.is_completed && styles.taskCardCompleted]}
            onPress={() => handleToggleTask(item.id, item.is_completed)}
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

export default function App() {
  return (
    <ApolloProvider client={client}>
      <TodoApp />
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
  },
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