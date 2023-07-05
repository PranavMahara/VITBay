import React, { Fragment, useState, useEffect } from 'react'
import "./UpdateProfile.css"
import Loader from "../layout/Loader/Loader"
import { useAlert } from "react-alert"
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants'
import { useDispatch, useSelector } from "react-redux"
import { clearError, updateProfile, loadUser } from "../../actions/userAction";
import { useNavigate } from 'react-router-dom'

export default function UpdateProfile() {
    const { user } = useSelector((state) => state.user)
    const { error, isUpdated, loading } = useSelector((state) => state.profile);
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState();
    const [avatarPreview, setAvatarPreview] = useState("/logo192.png");

    const updateProfileSubmit = (e) => {
        e.preventDefault();
        const myForm = {}
        myForm.email = email;
        myForm.name = name;
        myForm.avatar = avatar;
        dispatch(updateProfile(myForm));
    };

    const updateProfileDataChange = (e) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        };

        reader.readAsDataURL(e.target.files[0]);
    };

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url);
        }

        if (error) {
            alert.error(error);
            dispatch(clearError());
        }

        if (isUpdated) {
            alert.success("Profile Updated Successfully");
            dispatch(loadUser());

            navigate("/account")

            dispatch({
                type: UPDATE_PROFILE_RESET,
            });
        }

    }, [dispatch, error, alert, user, isUpdated, navigate]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <div className="updateProfileContainer">
                        <div className="updateProfileBox">
                            <h2 className="updateProfileHeading">Update Profile</h2>

                            <form
                                className="updateProfileForm"
                                encType="multipart/form-data"
                                onSubmit={updateProfileSubmit}
                            >
                                <div className="updateProfileName">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        required
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="updateProfileEmail">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div id="updateProfileImage">
                                    <img src={avatarPreview} alt="Avatar Preview" />
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={updateProfileDataChange}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    value="Update"
                                    className="updateProfileBtn"
                                />
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
}
