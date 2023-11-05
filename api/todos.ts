const API_URL = 'http://localhost:3000';

export interface Todos {
  id: number;
  text: string;
  done: boolean;
}

export const getTodos = async () => {
  const response = await fetch(`${API_URL}/todos`);
  const result = await response.json();
  return result;
};

export const createTodo = async (text: string): Promise<Todos> => {
  const todo = {
    text,
    done: false,
  };
  const result = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });
  return result.json();
};

export const updateTodo = async (todo: Todos): Promise<Todos> => {
  const result = await fetch(`${API_URL}/todos/${todo.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });
  return result.json();
};

export const deleteTodo = async (id: number): Promise<Todos> => {
  const result = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  return result.json();
};

export const getTodoById = async (id: number): Promise<Todos> => {
  const result = await fetch(`${API_URL}/todos/${id}`);
  return result.json();
};
