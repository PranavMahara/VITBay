import React, { Fragment, useEffect, useState } from 'react'
import "./ResetPassword.css"
import Loader from '../layout/Loader/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { clearError, resetPassword } from '../../actions/userAction'
import { useNavigate, useParams } from 'react-router-dom'

export default function ResetPassword() {
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate();
    const { token } = useParams()

    const { error, success, loading } = useSelector((state) => state.forgotPassword)
    const [password, SetPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const resetPasswordSubmit = (e) => {
        e.preventDefault()
        const myForm = {}
        myForm.password = password
        myForm.confirmPassword = confirmPassword

        dispatch(resetPassword(token, myForm))
    }

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearError())
        }

        if (success) {
            alert.success("Password Updated Successfully")
            navigate("/login")
        }


    }, [dispatch, alert, error, navigate, success])
    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <div className="resetPasswordContainer">
                        <div className="resetPasswordBox">
                            <h2 className="resetPasswordHeading">Password Reset</h2>

                            <form
                                className="resetPasswordForm"
                                onSubmit={resetPasswordSubmit}
                            >
                                <div>
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        required
                                        value={password}
                                        onChange={(e) => SetPassword(e.target.value)}
                                    />
                                </div>
                                <div className="loginPassword">
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    value="Update"
                                    className="resetPasswordBtn"
                                />
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}
