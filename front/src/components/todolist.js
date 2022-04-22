import React, { useState, useContext } from 'react'


import { TodoContext } from "../TodoContext";
import Select from 'react-select';
import Todo from "./todo";


export default function TodoList() {
    const [todos, setTodos] = useContext(TodoContext);
    const [value, setValue] = useState("")
    let state = ""
    let order = ""

    const ListStates = [
        { label: "Select", value: "" },
        { label: "COMPLETE", value: "COMPLETE" },
        { label: "INCOMPLETE", value: "INCOMPLETE" },
    ];

    const ListOrder = [
        { label: "Select", value: "" },
        { label: "DESCRIPTION", value: "description" },
        { label: "DATE_ADDED", value: "dateAdded" },
    ];

    const getTodo = async () => {
        return fetch(
            "http://localhost:5000/todos?filter=" + state + "&orderBy=" + order, {
            headers: { 'Content-Type': 'application/json' },
        }).then((res) => res.json())
            .then((json) => {
                console.log(json)
                setTodos(json);
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
        return fetch(
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

            <div className="card-content">
                <div className="level">
                    <div className="field is-grouped">
                    </div>
                    <div className="level-right">
                        <div className="level-item buttons">
                            <table className='table'>
                                <tbody>
                                    <tr>
                                        <th>
                                            <Select
                                                options={ListStates}
                                                value={ListStates.value}
                                                defaultValue={ListStates[0]}
                                                onChange={(e) => {
                                                    state = e.value;
                                                    console.log(state);
                                                    getTodo();
                                                }}

                                            /> </th>
                                        <th>
                                            <Select
                                                options={ListOrder}
                                                value={ListOrder.value}
                                                defaultValue={ListOrder[0]}
                                                onChange={(e) => {
                                                    order = e.value;
                                                    console.log(order);
                                                    getTodo();
                                                }}

                                            />
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    {todos.length === 0 &&
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                            <h1> Nenhuma tarefa cadastrada!</h1>
                        </div>
                    }
                    {todos.length > 0 &&
                        <p className="title" >Tasks</p>
                    }
                    {todos.map(todo => (
                        <Todo key={todo.id} todo={todo} toggleDone={toggleDone} deleteTodo={deleteTodo} editTodo={editTodo} />
                    ))
                    }
                </div>
            </section>
        </div>
    )
}