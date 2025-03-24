"use client";
import {useState} from "react";
import { Box, CssBaseline, Typography} from "@mui/material";
import NavBar from "./Navbar";
import CardsGrid from "./CardsGrid";

const MainPage = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline/>
      
      <Box sx = {{flexGrow: 1, ml: isSideBarOpen ? 25 : 0, transition: "margin 0.3s ease-in-out", width: "100%"}}>
        <NavBar />
        <Box sx = {{ pr: 25}}> 
          <CardsGrid/>
      </Box>
      </Box>
    </Box>
  )
}

export default MainPage;
