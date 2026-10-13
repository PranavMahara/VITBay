import React from 'react'
import "./NotFound.css"
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="PageNotFound">
            <Typography>Page Not Found </Typography>
            <Link to="/">Home</Link>
        </div>
    )
}
