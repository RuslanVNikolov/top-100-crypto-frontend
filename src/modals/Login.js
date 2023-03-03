import React, { useState, useRef } from 'react';
import classes from './Login.module.css'


const Login = (props) => {
    const usernameInputRef = useRef();
    const passwordInputRef = useRef();
    const [error, setError] = useState();

    const submitHandler = (event) => {
        event.preventDefault();
        const enteredUserame = usernameInputRef.current.value.trim();
        const enteredPassword = passwordInputRef.current.value.trim();

        if (enteredUserame.length === 0 || enteredPassword.length === 0) {
            setError({
                title: 'Invalid input',
                message: 'Please enter a valid username and password (non-empty values).'
            })
            return
        }

        console.log("Call authentication API with username and password " + enteredUserame + " : " + enteredPassword)
        usernameInputRef.current.value = ''
        passwordInputRef.current.value = ''
    }

    return (
        <div className={classes.modal}>
            <form onSubmit={submitHandler}>
                <label htmlFor="username">Username</label><button type='button'>X</button><br />
                <input id="username" ref={usernameInputRef} type="text" /><br />
                <label htmlFor="password">Password</label><br />
                <input id="pasword" ref={passwordInputRef} type="password" /><br />
                <button type='submit'>Login</button>
                <button type='button'>Sign up</button>
            </form>
        </div>
    )
}

export default Login;