import React, { useState, Fragment } from 'react'
import { Backdrop } from '@material-ui/core'
import { useAlert } from 'react-alert'
import { logout } from '../../../actions/userAction'
import { useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { SpeedDial, SpeedDialAction } from '@material-ui/lab'
import { AdminPanelSettingsOutlined, Logout, ShoppingCartOutlined } from '@mui/icons-material'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import "./UserOptions.css"

export default function UserOptions({ user }) {
    const [open, setOpen] = useState(false)
    const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const options = [
        { icon: <FiberManualRecordIcon />, name: "Orders", func: orders },
        { icon: <AccountBoxIcon />, name: "Profile", func: account },
        {
            icon: <ShoppingCartOutlined/>,
            name: "Cart",
            func: cart,
        },
        { icon: <Logout />, name: "Logout", func: logoutUser },
    ];

    if (user.role === "admin") {
        options.unshift({
            icon: <AdminPanelSettingsOutlined />,
            name: "Dashboard",
            func: dashboard,
        });
    }

    function dashboard() {
        navigate("/admin/dashboard");
    }

    function orders() {
        navigate("/orders");
    }
    function account() {
        navigate("/account");
    }
    function cart() {
        navigate("/cart");
    }
    function logoutUser() {
        dispatch(logout());
        alert.success("Logout Successfully");
    }
    return (
        <Fragment>
            <Backdrop open={open} style={{ zIndex: "10" }} />
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                style={{ zIndex: "11" }}
                open={open}
                direction="down"
                className="speedDial"
                icon={
                    <img
                        className="speedDialIcon"
                        src={user.avatar.url ? user.avatar.url : "/logo192.png"}
                        alt="Profile"
                    />
                }
            >
                {options.map((item) => (
                    <SpeedDialAction
                        key={item.name}
                        icon={item.icon}
                        tooltipTitle={item.name}
                        onClick={item.func}
                        tooltipOpen={window.innerWidth <= 600 ? true : false}
                    />
                ))}
            </SpeedDial>
        </Fragment>
    )
}
