import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import {useAppDispatch} from '../hooks/useStore';
import {addTodo, updateTodo} from '../redux/reducers/todo-slice';
import {formatDate} from '../utils/helpers';
import {Todo} from '../types/todo';
import {
  Gesture,
  GestureHandlerRootView,
  PanGestureHandler,
  GestureDetector,
} from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const BUTTON_WIDTH = Dimensions.get('window').width - 32;
const BUTTON_HEIGHT = 50;

const AddTodoScreen = ({navigation, route}: {navigation: any; route: any}) => {
  const dispatch = useAppDispatch();
  const todo: Todo = route.params?.todo;

  const X = useSharedValue(0);

  const [title, setTitle] = useState('');
  const [editable, setEditable] = useState<Boolean>(false);
  const [toggled, setToggled] = useState<Boolean>(false);
  const [editableTodo, setEditableTodo] = useState<Todo>();

  // Edit todo
  const handleAddTodo = () => {
    if (!title.trim()) return;
    const newTodo = {
      id: Date.now(),
      title,
      completed: false,
      created_at: formatDate(new Date()),
      updated_at: formatDate(new Date()),
    };
    dispatch(addTodo(newTodo));
    navigation.goBack();
  };

  // add new todo
  const handleEditTodo = (todo: Todo | undefined) => {
    if (todo) {
      const updatedTodo = {
        ...todo,
        title: title,
        updated_at: formatDate(new Date()),
      };
      dispatch(updateTodo(updatedTodo));
      navigation.goBack();
    } else {
      ToastAndroid.show('Something went wrong', 1000);
    }
  };

  const handleGestureEvent = Gesture.Pan()
    .onStart(event => {})
    .onChange(event => {
      let newValue;
      newValue = event.translationX;
      if (newValue >= 0 && newValue <= 270) {
        X.value = newValue;
      }
    })
    .onEnd(() => {
      if (X.value < BUTTON_WIDTH / 2) {
        X.value = withSpring(0);
      } else {
        X.value = withSpring(BUTTON_WIDTH - 50);
      }
      handleComplete(true);
    })
    .runOnJS(true);

  const handleComplete = (bool: Boolean) => {
    'worklet';
    if (bool !== toggled) {
      setToggled(bool);
      if (editable) {
        handleEditTodo(editableTodo);
      } else {
        handleAddTodo();
      }
    }
  };

  useEffect(() => {
    if (todo?.id) {
      setEditableTodo(todo);
      setTitle(todo.title);
      setEditable(true);
    }
  }, []);

  const AnimatedStyle = {
    swipeStyle: useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: X.value,
          },
        ],
      };
    }),
  };

  const AnimatedSwipeTextStyle = {
    swipeStyle: useAnimatedStyle(() => {
      return {
        opacity: interpolate(X.value, [0, 150], [1, 0]),
      };
    }),
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter TODO"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#aaa"
      />
      {title !== '' && (
        <View style={styles.button}>
          <GestureDetector gesture={handleGestureEvent}>
            <Animated.View
              style={[styles.innerButton, AnimatedStyle.swipeStyle]}>
              <MaterialIcons name="keyboard-arrow-right" size={20} />
            </Animated.View>
          </GestureDetector>
          <Animated.Text style={AnimatedSwipeTextStyle.swipeStyle}>
            Swipe to {editable ? 'Edit' : 'Add'}
          </Animated.Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#e0e0e0',
  },
  // 282828, 000000, 253836
  button: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    backgroundColor: '#282828',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  innerButton: {
    backgroundColor: '#1e88e5',
    height: 50,
    width: 50,
    borderRadius: 10,
    position: 'absolute',
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddTodoScreen;
