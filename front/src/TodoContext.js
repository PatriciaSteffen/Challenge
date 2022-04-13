import React, { createContext, useState, useEffect } from 'react'

export const TodoContext = createContext();

export const TodoProvider = (props) => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      await fetch(
        "http://localhost:5000/todos")
        .then((res) => res.json())
        .then((json) => {
          setTodos(json);
        })
    };

    fetchPosts();
  }, []);



  return (
    <TodoContext.Provider value={[todos, setTodos]}>
      {props.children}
    </TodoContext.Provider>
  );
}
