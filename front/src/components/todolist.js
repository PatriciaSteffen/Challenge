import React, { useState, useContext } from 'react'


import { TodoContext } from "../TodoContext";

import Todo from "./todo";

export default function TodoList() {
    const [todos, setTodos] = useContext(TodoContext);
    const [value, setValue] = useState("")


    const addTodo = (e) => {
        e.preventDefault()
        setTodos([...todos, {
            "id": Date.now(),
            "value": value, //<= value
            "done": false
        }])
        setValue("") //<= clear value after submit
    }


    // toggleDone
    const toggleDone = (todo) => {
        todos.map(_todo => _todo === todo ? _todo.done = !todo.done : todo)
        setTodos([...todos])
    }
    // delete
    const deleteTodo = (todo) => {
        const _todos = todos.filter(_todo => _todo !== todo)
        setTodos(_todos)
    }
    // edit
    const editTodo = (todo) => {
        console.log(todo);
        const _todos = todos.forEach(_todo => {
            if (_todo.id === todo.id) {
                _todo.value = 'AQUI'
                return true

                setTodos(_todos.id, _todos)
            }
        })
        console.log(_todos)
        //     setTodos(_todos)
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