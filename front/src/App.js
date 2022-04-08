import React from 'react';

import { TodoProvider } from "./TodoContext";

import TodoList from "./components/todolist";

function App() {
  return (
    <TodoProvider>
      <TodoList/>
    </TodoProvider>
  );
}

export default App;