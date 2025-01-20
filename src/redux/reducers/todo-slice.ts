import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Todo} from '../../types/todo';
import {formatDate} from '../../utils/helpers';

interface TodosState {
  todos: Todo[];
  filter: 'all' | 'active' | 'done';
  sort: 'recent' | 'id';
}

const initialState: TodosState = {
  todos: [],
  filter: 'all',
  sort: 'recent',
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos(state, action: PayloadAction<Todo[]>) {
      state.todos = action.payload;
    },
    addTodo(state, action: PayloadAction<Todo>) {
      state.todos.unshift(action.payload);
    },
    toggleComplete(state, action: PayloadAction<number>) {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    deleteTodo(state, action: PayloadAction<number>) {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    updateTodo(state, action: PayloadAction<Todo>) {
      const index = state.todos.findIndex(
        todo => todo.id === action.payload.id,
      );
      if (index > -1) {
        state.todos[index] = {
          ...action.payload,
          updated_at: formatDate(new Date()),
        };
      }
    },
    setFilter(state, action: PayloadAction<TodosState['filter']>) {
      state.filter = action.payload;
    },
    setSort(state, action: PayloadAction<TodosState['sort']>) {
      state.sort = action.payload;
    },
  },
});

export const {
  setTodos,
  addTodo,
  toggleComplete,
  deleteTodo,
  updateTodo,
  setFilter,
  setSort,
} = todosSlice.actions;

export default todosSlice.reducer;
