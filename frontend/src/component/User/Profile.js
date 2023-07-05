import React, { Fragment, useEffect } from 'react'
import Loader from "../layout/Loader/Loader"
import { useDispatch, useSelector } from 'react-redux'
import "./Profile.css"
import { useNavigate, Link } from 'react-router-dom'
import { logout } from '../../actions/userAction'
import { useAlert } from 'react-alert'

export default function Profile() {
    const { user, loading, isAuthenticated } = useSelector((state) => state.user)
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const alert = useAlert();

    function logoutUser() {
        dispatch(logout());
        alert.success("Logout Successfully");
    }

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate])
    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <div className="container-profile">
                        <div className="profile">
                            <img src={user.avatar.url} alt={user.name} />
                            <div className='profile-info'>
                                <h1>Hello, {user.name}</h1>
                                <p>You joined us on  <span>{String(user.createdAt).substr(0, 10)}</span></p>
                                <p>Email: {user.email}</p>
                                <div className='buttonRedirect'>
                                    {/* <Link to="/orders">My Orders</Link> */}
                                    <Link to="/me/update">Update Profile</Link>
                                    <Link to="/password/update">Update Password</Link>
                                    <Link onClick={(e) => {
                                        logoutUser()
                                    }}>Logout</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}

        </Fragment>
    )
}
