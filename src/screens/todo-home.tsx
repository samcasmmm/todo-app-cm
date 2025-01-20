import React, {useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useAppDispatch, useAppSelector} from '../hooks/useStore';
import {fetchTodos} from '../utils/api';
import {
  setTodos,
  toggleComplete,
  deleteTodo,
  setFilter,
  setSort,
} from '../redux/reducers/todo-slice';
import {Todo} from '../types/todo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';

const TodosHome = ({navigation}: {navigation: any}) => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(state => state.todos.todos);
  const filter = useAppSelector(state => state.todos.filter);
  const sort = useAppSelector(state => state.todos.sort);

  useEffect(() => {
    // fetching API
    const loadTodos = async () => {
      const fetchedTodos = await fetchTodos();
      dispatch(setTodos(fetchedTodos));
    };
    loadTodos();
  }, [dispatch]);

  // Apply filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'done') return todo.completed;
    return true;
  });

  // Apply sorting
  const sortedTodos = filteredTodos.sort((a, b) => {
    if (sort === 'recent') {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else {
      return a.id - b.id;
    }
  });

  const handleEditTodo = (item: Todo) => {
    navigation.navigate('todo-add', {todo: item});
  };

  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  const renderTodo = ({item}: {item: Todo}) => (
    <View style={styles.todoItem}>
      <Text style={styles.todoTitle} onPress={() => handleEditTodo(item)}>
        {item.title}
      </Text>
      <Text style={styles.todoCreated_at}>Created : {item.created_at}</Text>
      <Text style={styles.todoCreated_at}>Updated : {item.updated_at}</Text>
      <View style={styles.todoActions}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => dispatch(toggleComplete(item.id))}>
          <Ionicons
            name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color="green"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => dispatch(deleteTodo(item.id))}>
          <Octicons name="trash" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.stats}>
        Total TODOs: {totalTodos} | Completed TODOs: {completedTodos}
      </Text>
      <View style={styles.filters}>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'all' && styles.activeFilterButton,
            ]}
            onPress={() => dispatch(setFilter('all'))}>
            <Text style={styles.filterButtonText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'active' && styles.activeFilterButton,
            ]}
            onPress={() => dispatch(setFilter('active'))}>
            <Text style={styles.filterButtonText}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'done' && styles.activeFilterButton,
            ]}
            onPress={() => dispatch(setFilter('done'))}>
            <Text style={styles.filterButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sortButtons}>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sort === 'recent' && styles.activeSortButton,
            ]}
            onPress={() => dispatch(setSort('recent'))}>
            <Text style={styles.sortButtonText}>Most Recent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sort === 'id' && styles.activeSortButton,
            ]}
            onPress={() => dispatch(setSort('id'))}>
            <Text style={styles.sortButtonText}>By ID</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={sortedTodos}
        renderItem={renderTodo}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('todo-add')}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  stats: {
    fontSize: 18,
    marginBottom: 10,
    color: '#e0e0e0',
  },
  filters: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#282828',
    borderRadius: 5,
  },
  activeFilterButton: {
    backgroundColor: '#1e88e5',
  },
  filterButtonText: {
    color: '#e0e0e0',
    fontSize: 14,
  },
  sortButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  sortButton: {
    padding: 10,
    backgroundColor: '#282828',
    borderRadius: 5,
  },
  activeSortButton: {
    backgroundColor: '#1e88e5',
  },
  sortButtonText: {
    color: '#e0e0e0',
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 80,
  },
  todoItem: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  todoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  todoTitle: {
    fontSize: 18,
    color: '#e0e0e0',
  },
  todoCreated_at: {
    fontSize: 14,
    color: '#e0e0e040',
  },
  todoActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },
  deleteButton: {
    padding: 8,
    alignSelf: 'flex-end',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 60,
    backgroundColor: '#1e88e5',
    borderRadius: 50,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
});
export default TodosHome;
