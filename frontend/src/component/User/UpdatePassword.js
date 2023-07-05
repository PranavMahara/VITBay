import React, { Fragment, useEffect, useState } from 'react'
import "./UpdatePassword.css"
import Loader from '../layout/Loader/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { clearError } from '../../actions/userAction'
import { useNavigate } from 'react-router-dom'
import { updatePassword } from '../../actions/userAction'
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants'

export default function UpdatePassword() {
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate();

    const { error, isUpdated, loading } = useSelector((state) => state.profile)
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const updatePasswordSubmit = (e) => {
        e.preventDefault();
        const myForm = {}
        myForm.oldPassword = oldPassword;
        myForm.newPassword = newPassword
        myForm.confirmPassword = confirmPassword
        dispatch(updatePassword(myForm));
    };

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearError());
        }

        if (isUpdated) {
            alert.success("Profile Updated Successfully");

            navigate("/account")

            dispatch({
                type: UPDATE_PASSWORD_RESET,
            });
        }
    }, [dispatch, error, alert, isUpdated, navigate]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <div className="updatePasswordContainer">
                        <div className="updatePasswordBox">
                            <h2 className="updatePasswordHeading">Update Password</h2>

                            <form
                                className="updatePasswordForm"
                                onSubmit={updatePasswordSubmit}
                            >
                                <div className="loginPassword">
                                    <input
                                        type="password"
                                        placeholder="Old Password"
                                        required
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                </div>

                                <div className="loginPassword">
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
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
                                    value="Change"
                                    className="updatePasswordBtn"
                                />
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}
