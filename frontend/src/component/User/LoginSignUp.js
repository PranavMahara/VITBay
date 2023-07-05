import React, { useState, useEffect, Fragment } from 'react'
import "./LoginSignup.css"
import Loader from '../layout/Loader/Loader'
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from 'react-alert'
import { Link } from 'react-router-dom';
import { clearError, login } from "../../actions/userAction"
import { useNavigate } from "react-router-dom";

export default function LoginSignUp({location}) {
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate();
    const { error, loading, isAuthenticated } = useSelector((state) => state.user)

    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    const loginSubmit = (e) => {
        e.preventDefault();
        dispatch(login(loginEmail, loginPassword));
    };


    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearError())
        }

        if (isAuthenticated) {
            navigate(`/account`);
        }
    }, [dispatch, error, alert, isAuthenticated, navigate])

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <div className="login-page">
                    <div className="form">
                        <form className="login-form" onSubmit={loginSubmit}>
                            <input type="email" required placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                            <input type="password" required placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                            <input type="submit" value="Login" className="loginBtn" />
                            <p className="message">Not registered? <Link to="/register">Create an account</Link></p>
                            <p className="message">Forgot Password? <Link to="/password/forgot">Click Here</Link></p>
                        </form>
                    </div>
                </div>
            )}
        </Fragment>
    )
}
