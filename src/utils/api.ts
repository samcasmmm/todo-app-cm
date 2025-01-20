import axios from 'axios';
import {Todo} from '../types/todo';
import {formatDate} from './helpers';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

export const fetchTodos = async (): Promise<Todo[]> => {
  try {
    const response = await axios.get<Todo[]>(API_URL);

    return response.data.map(todo => ({
      ...todo,
      created_at: formatDate(new Date()),
      updated_at: formatDate(new Date()),
    }));
  } catch (error) {
    console.error('Error fetching TODO items:', error);
    throw new Error('Failed to fetch TODO items.');
  }
};
