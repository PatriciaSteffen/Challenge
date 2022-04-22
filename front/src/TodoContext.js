import React, { createContext, useState, useEffect } from 'react'

export const TodoContext = createContext();

export const TodoProvider = (props) => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      return fetch(
        "http://localhost:5000/todos?filter=&orderBy=dateAdded", {
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => res.json())
        .then((json) => {
          console.log(json)
          setTodos(json);
        });

    };

    fetchPosts();
  }, []);



  return (
    <TodoContext.Provider value={[todos, setTodos]}>
      {props.children}
    </TodoContext.Provider>
  );
}
