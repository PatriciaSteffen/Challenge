import React, { useState, useContext } from 'react'


import { TodoContext } from "../TodoContext";

import Todo from "./todo";

export default function TodoList() {
    const [todos, setTodos] = useContext(TodoContext);
    const [value, setValue] = useState("")


    async function addTodo(e) {
        e.preventDefault()
        try {
            fetch(
                "http://localhost:5000/todos", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: value })
            })
                .then((res) => res.json())
                .then((json) => {
                    console.log(json)
                    setTodos(json);
                });
        } catch (err) {
            console.log("Erro:" + err);
        }
        setValue("");
    }


    // toggleDone
    const toggleDone = (todo) => {
        try {
            fetch(
                "http://localhost:5000/todo/" + todo.id, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ state: todo.state === "COMPLETO" ? "INCOMPLETE" : "COMPLETO" })
            })
                .then((res) => res.json())
                .then((json) => {
                    console.log(json)
                    setTodos(json);
                });
        } catch (err) {
            console.log("Erro:" + err);
        }
    }
    // delete
    const deleteTodo = async (todo) => {
        fetch(
            "http://localhost:5000/todo/" + todo.id, {
            method: 'DELETE'
        })
            .then((res) => res.json())
            .then((json) => {
                setTodos(json);
            });
    }
    // edit
    const editTodo = (todo, description) => {
        return  fetch(
                "http://localhost:5000/todo/" + todo.id, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: description })
            })
                .then((res) => res.json())
                .then((json) => {
                    console.log(json)
                    setTodos(json);
                    return json;
                });
    }

    return (
        <div>
            <div className="hero is-info">
                <div className="hero-body has-text-centered">

                    <form onSubmit={addTodo} className="field has-addons">
                        <p className="control is-expanded">
                            <input value={value} type="text" onChange={(e) => setValue(e.target.value)} className="input" />
                        </p>
                        <p className="control">
                            <button className="button is-primary has-text-weight-bold">
                                Create
                            </button>
                        </p>
                    </form>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <p className="title" >Tasks</p>
                    {todos.map(todo => (
                        <Todo key={todo.id} todo={todo} toggleDone={toggleDone} deleteTodo={deleteTodo} editTodo={editTodo} />
                    ))}
                </div>
            </section>
        </div>
    )
}