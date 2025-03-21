"use client";
import {useState}  from "react";
import {Avatar, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";


const SideBar = () => {
  const [open, setOpen] = useState(true);


  return (
    <div>
      <IconButton onClick={() => setOpen(!open)} className="m-4">
        <MenuIcon/>
      </IconButton>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)} sx = {{ "& .MuiDrawer-paper": {backgroundColor: "#0f3555", color:"white"}}}>
        <div className="w-64 h-screen">
            <div className ="flex items-center ">
            <Avatar src="/iLOlogo.png" sx={{width: 80, height: 80}}/>
            <h2 className="text-lg font-semibold p-5 border-b">HPE iLO</h2>
            </div>
          <List>
           <>
           {["Information", "System Information", "HPE Compute Ops Management", "Firmware & OS Software", "iLO Federation"].map((text, index) => {
              return (
                <ListItem key = {index} disablePadding>
                <ListItemButton>
                <ListItemText primary={text} sx={{color:"white"}}/>
                </ListItemButton>
              </ListItem>
              )
            })}
           </>
          </List>
        </div>
      </Drawer>
    </div>
  )
}

export default SideBar;