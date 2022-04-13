import React, { useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


export default function Todo(props) {
    const [open, setOpen] = React.useState(false);
    const [description, setDescription] = useState()


    function handleClickOpen(todo) {
        setDescription(todo.description);
        setOpen(true);
    };

    function handleClose() {
        setOpen(false);
        setDescription("");
    };

    function onSave() {
        props.editTodo(props.todo, description).then((e) => {
            handleClose();
        });

    };

    return (
        <div className="card">
            <div className="card-content">
                <div className="level">
                    <div class="field is-grouped">
                        <p class="control">
                            <input type='checkbox' onClick={props.toggleDone.bind(this, props.todo)} ></input>
                        </p>
                        <p class="control" className={`title ${props.todo.state === 'INCOMPLETE' ? "" : "has-text-grey-light"}`}>{props.todo.description}</p>

                    </div>
                    <div className="level-right">
                        <div className="level-item buttons">
                            <div>
                                <Dialog open={open} onClose={handleClose}>
                                    <DialogTitle>Edit</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            To change the task description, enter the new description here.
                                        </DialogContentText>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            label="Description"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose}>Cancel</Button>
                                        <Button onClick={onSave}>Save</Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                            <button onClick={handleClickOpen.bind(this, props.todo)} className="button is-warning has-text-weight-bold">Edit</button>
                            <button onClick={props.deleteTodo.bind(this, props.todo)} className="button is-danger has-text-weight-bold">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}