import React, {useState, useEffect, Fragment} from 'react'
import { useAlert } from 'react-alert'
import Loader from '../layout/Loader/Loader'
import "./ForgotPassword.css"
import { useDispatch, useSelector } from 'react-redux'
import { clearError, forgotPassword } from '../../actions/userAction'

export default function ForgotPassword() {
    const dispatch = useDispatch()
    const alert = useAlert()

    const { error, message, loading } = useSelector((state) => state.forgotPassword)

    const [email, setEmail] = useState("")

    const forgotPasswordSubmit = (e) => {
        e.preventDefault()
        const myForm = {}
        myForm.email = email
        dispatch(forgotPassword(myForm))
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearError());
        }

        if (message) {
            alert.success(message);
        }
    }, [dispatch, error, alert, message]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <div className="forgotPasswordContainer">
                        <div className="forgotPasswordBox">
                            <h2 className="forgotPasswordHeading">Forgot Password</h2>

                            <form
                                className="forgotPasswordForm"
                                onSubmit={forgotPasswordSubmit}
                            >
                                <div className="forgotPasswordEmail">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <input
                                    type="submit"
                                    value="Send"
                                    className="forgotPasswordBtn"
                                />
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}
