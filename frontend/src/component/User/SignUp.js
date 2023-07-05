import React, {  useState, useEffect, Fragment } from 'react'
import "./LoginSignup.css"
import Loader from '../layout/Loader/Loader'
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from 'react-alert'
import { Link } from 'react-router-dom';
import { clearError, register } from "../../actions/userAction"
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate();
    const { error, loading, isAuthenticated } = useSelector((state) => state.user)
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    })

    const { name, email, password } = user
    const [avatar, setAvatar] = useState("/logo192.png")
    const [avatarPreview, setAvatarPreview] = useState("/logo192.png")

    const registerDataChange = (e) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) { // 3 states, 0[Initial], 1[Processing], 2[Final]
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };

            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    const registerSubmit = (e) => {
        e.preventDefault()

        const myForm = new FormData()
        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("password", password);
        myForm.set("avatar", avatar);
        dispatch(register(myForm));
    }

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
                        <form className="login-form" onSubmit={registerSubmit} encType="multipart/form-data">
                        <div className="signUpName">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        required
                                        name="name"
                                        value={name}
                                        onChange={registerDataChange}
                                    />
                                </div>
                                <div className="signUpEmail">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        name="email"
                                        value={email}
                                        onChange={registerDataChange}
                                    />
                                </div>
                                <div className="signUpPassword">
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        required
                                        name="password"
                                        value={password}
                                        onChange={registerDataChange}
                                    />
                                </div>
                            <div className="registerImage">
                                <img src={avatarPreview} alt="Avatar Preview" />
                                <input
                                    type="file"
                                    name="avatar"
                                    accept="image/*"
                                    onChange={registerDataChange}
                                />
                            </div>
                            <input type="submit" value="Register" className="signUpBtn" />
                            <p className="message">Already a User! <Link to="/login">Login Here</Link></p>
                        </form>
                    </div>
                </div>
            )}
        </Fragment>
    )
}
