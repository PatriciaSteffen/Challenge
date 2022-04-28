import React, { useState, useContext, useEffect } from 'react'


import { TodoContext } from "../TodoContext";
import Todo from "./todo";


export default function TodoList() {
    const [todos, setTodos] = useContext(TodoContext);
    const [value, setValue] = useState("")
    const [state, setState] = useState("")
    const [order, setOrder] = useState("")
    const [checked, setChecked] = useState(true)
    const [count, setCount] = useState(0)
    const [get, setGet] = useState(false)

    useEffect(() => {
        if (count === 0)
            setOrder("dateAdded")
        else
            setOrder("description")

        if (checked)
            setState("INCOMPLETE")
        else
            setState("")
        if (get)
            getTodo();

    }, [checked, count, state, order, get]);


    const changeTitle = () => {
        setCount((count) => count === 2 ? 0 : count + 1)
        setGet(true)
    };

    const changeCompleted = () => {
        setChecked(!checked)
        setGet(true)
    };

    async function getTodo() {
        return fetch(
            "http://localhost:5000/todos?filter=" + state + "&orderBy=" + order, {
            headers: { 'Content-Type': 'application/json' },
        }).then((res) => res.json())
            .then((json) => {
                if (count === 2)
                    setTodos(json.reverse())
                else
                    setTodos(json)
                setGet(false)
                return json;
            });
    }

    async function addTodo(e) {
        e.preventDefault()
        try {
            fetch(
                "http://localhost:5000/todos", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: value })
            }).finally(getTodo);
        } catch (err) {
            console.log("Erro:" + err);
        }
        setValue("");
        getTodo();
    }


    // toggleDone
    const toggleDone = (todo) => {
        try {
            fetch(
                "http://localhost:5000/todo/" + todo.id, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ state: todo.state === "COMPLETE" ? "INCOMPLETE" : "COMPLETE" })
            }).finally(getTodo);
        } catch (err) {
            console.log("Erro:" + err);
        }
    }
    // delete
    const deleteTodo = async (todo) => {
        fetch(
            "http://localhost:5000/todo/" + todo.id, {
            method: 'DELETE'
        }).finally(getTodo);
    }
    // edit
    const editTodo = (todo, description) => {
        return fetch(
            "http://localhost:5000/todo/" + todo.id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: description })
        }).finally(getTodo);
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
                    <p onClick={changeTitle} className="title" >Tasks</p>
                    {todos.length === 0 &&
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                            <h1> Nenhuma tarefa cadastrada!</h1>
                        </div>
                    }
                    {todos.map(todo => (
                        <Todo key={todo.id} todo={todo} toggleDone={toggleDone} deleteTodo={deleteTodo} editTodo={editTodo} />
                    ))
                    }

                </div>


            </section>

            <section className="section">
                <label>
                    <input type="checkbox"
                        defaultChecked={checked}
                        onChange={changeCompleted}
                    />
                    Hide Completed
                </label>
            </section>
        </div>
    )
}