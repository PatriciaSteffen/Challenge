import React from 'react';


export default function Todo(props) {

    return (
        <div className="card">
            <div className="card-content">
                <div className="level">
                    <div className="level-left">
                        <div className="level-item">

                            <input
                                type='checkbox' onClick={props.toggleDone.bind(this, props.todo)}></input>
                            <label className={`subtitle ${props.todo.done ? "has-text-grey-light" : ""}, `}>{props.todo.value}</label>

                        </div>
                    </div>
                    <div className="level-right">
                        <div className="level-item buttons">
                            <button onClick={props.editTodo.bind(this, props.todo)} className="button is-warning has-text-weight-bold">Edit</button>
                            <button onClick={props.deleteTodo.bind(this, props.todo)} className="button is-danger has-text-weight-bold">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

