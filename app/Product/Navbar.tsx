"use client";
import {useState} from "react";
import { AppBar, Toolbar, Button, Menu, MenuItem, Box, IconButton, Avatar } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import SideBar from "./Sider";

const NavBar = () => {
    const [anchor1, setAnchor1] = useState<null | HTMLElement>(null);
    const [anchor2, setAnchor2] = useState<null | HTMLElement>(null);

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
        <AppBar position="fixed" elevation={0} sx={{backgroundColor: "transparent", boxShadow: "none"}}>
        <Toolbar sx = {{display: "flex", justifyContent: "space-between"}}>
       <SideBar />
            <Box/>
            <Box>
            <IconButton onClick={handleClick1}>
                <CheckCircle sx={{color: 'green', fontSize: 32}}/>
            </IconButton>
            <Menu anchorEl={anchor1} open = {Boolean(anchor1)} onClose={handleClose1}>
                <MenuItem onClick={handleClose1}>Option 1</MenuItem>
                <MenuItem onClick={handleClose1}>Option 2</MenuItem>
                <MenuItem onClick={handleClose1}>Option 3</MenuItem>
            </Menu>

            <IconButton onClick={handleClick2} sx = {{ml: 2}}>
                <Avatar alt="Profile" sx={{width:32, height: 32}}/>
            </IconButton>
            <Menu anchorEl={anchor2} open = {Boolean(anchor2)} onClose={handleClose2}>
                <MenuItem onClick={handleClose2}>Logout</MenuItem>
                <MenuItem onClick={handleClose2}>Settings</MenuItem>
            </Menu>
            </Box>
        </Toolbar>
        </AppBar>
        </>
    )
}

export default NavBar;