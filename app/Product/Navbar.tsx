"use client";
import {useEffect, useState} from "react";
import { AppBar, Toolbar, Button, Menu, MenuItem, Box, IconButton, Avatar, Alert } from "@mui/material";
import { CheckCircle, CloseRounded } from "@mui/icons-material";
import SideBar from "./Sider";
import { redirect } from "next/navigation";
import axios from "axios";

const NavBar = () => {
    const [anchor1, setAnchor1] = useState<null | HTMLElement>(null);
    const [anchor2, setAnchor2] = useState<null | HTMLElement>(null);
    const [alert, setAlert] = useState(false);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [health, setHealth] = useState(" ");

    const getHealth = async()=>{
        try{
            const response = await axios.post("/api/health");
            setHealth(response.data.data[0]["Health"])
        }catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        getHealth();
    },[])

    const handleLogOut = async() =>{
        try{
            const response = await axios.post("/api/logout");
            if(response.data.data.success){
                localStorage.setItem("LoggedIn","false")
                setSuccess(true);
                setMessage("Logged Out Successfully")
                setAlert(true);
                setTimeout(() => {
                    redirect("/")
                }, 3000);
            }else{
                setMessage("Failed to logOut")
                setAlert(true);
            }
        }catch(err){
            console.log(err);
        }
    }

    const handleClick1 = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchor1(event.currentTarget);
    }

    const handleClose1 = () => {
        setAnchor1(null);
    }

    const handleClick2 = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchor2(event.currentTarget);
    }

    const handleClose2 = () => {
        setAnchor2(null);
    }

    return (
        <>
        {alert && <Alert variant="filled" severity={success ? "success" : "error"}>
          {message}
        </Alert>}
        <AppBar position="fixed" elevation={0} sx={{backgroundColor: "transparent", boxShadow: "none"}}>
        <Toolbar sx = {{display: "flex", justifyContent: "space-between"}}>
       <SideBar />
            <Box/>
            <Box>
            <IconButton onClick={handleClick1}>
                {health == "Critical" ? <CloseRounded sx={{color: 'red', fontSize: 32}}/> : <CheckCircle sx={{color: 'green', fontSize: 32}}/>}
            </IconButton>
            <Menu anchorEl={anchor1} open = {Boolean(anchor1)} onClose={handleClose1}>
                <MenuItem onClick={handleClose1}>Server Health : {health}</MenuItem>
                {/* <MenuItem onClick={handleClose1}>Option 2</MenuItem>
                <MenuItem onClick={handleClose1}>Option 3</MenuItem> */}
            </Menu>

            <IconButton onClick={handleClick2} sx = {{ml: 2}}>
                <Avatar alt="Profile" sx={{width:32, height: 32}}/>
            </IconButton>
            <Menu anchorEl={anchor2} open = {Boolean(anchor2)} onClose={handleClose2}>
                <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                <MenuItem onClick={handleClose2}>Settings</MenuItem>
            </Menu>
            </Box>
        </Toolbar>
        </AppBar>
        </>
    )
}

export default NavBar;