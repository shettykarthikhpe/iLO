
import React from "react";
import { Box, Grid, Typography, Paper } from "@mui/material";

const cardsData = [
    {
        title: "Summary",
        items: [
            {label: "lorem ipsum......", status: "On", color: "#17eba0"},
            {label: "lorem ipsum......", status: "On", color: "#17eba0"},
            {label: "lorem ipsum......", status: "On", color: "#17eba0"},
            {label: "lorem ipsum......", status: "On", color: "#17eba0"},
            {label: "lorem ipsum......", status: "On", color: "#17eba0"},
            {label: "lorem ipsum......", status: "On", color: "red"},
        ],
    },
    {
        title: "Processors",
        items: [
            {label: "lorem ipsum......", status: "On", color: "#17eba0"},
            {label: "lorem ipsum......", status: "On", color: "gray"},
            {label: "lorem ipsum......", status: "On", color: "#17eba0"},
        ],
    },
    {
        title: "Device Inventory",
        items: [
            {label: "lorem ipsum......", status: "On", color: "red"},
            {label: "lorem ipsum......", status: "On", color: "gray"},
            {label: "lorem ipsum......", status: "On", color: "red"},
        ],
    },
    {
        title: "Network",
        items: [
            {label: "lorem ipsum......", status: "On", color: "#17eba0"},
            {label: "lorem ipsum......", status: "On", color: "gray"},
            {label: "lorem ipsum......", status: "On", color: "#17eba0"},
        ],
    },
    {
        title: "Storage",
        items: [
            {label: "lorem ipsum......", status: "On", color: "#17eba0"},
            {label: "lorem ipsum......", status: "On", color: "#17eba0"},
            {label: "lorem ipsum......", status: "On", color: "#17eba0"},
            {label: "lorem ipsum......", status: "On", color: "#17eba0"},
            {label: "lorem ipsum......", status: "On", color: "gray"},
            {label: "lorem ipsum......", status: "On", color: "#17eba0"},
        ],
    },
    {
        title: "Memory",
        items: [
            {label: "lorem ipsum......", status: "On", color: "#17eba0"},
            {label: "lorem ipsum......", status: "On", color: "gray"},
            {label: "lorem ipsum......", status: "On", color: "red"},
        ],
    },
]



const CardsGrid: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 64px)", // Adjust for navbar height
        paddingTop: "80px", // Prevent overlapping
        paddingBottom: "20px",
        width: "100%", // Ensure it spans the full width
      }}
    >
      <Grid 
        container 
        spacing={2} 
        sx={{ 
          maxWidth: "1100px", 
          justifyContent: "center", 
          paddingX: 2 
        }}
      >
        {cardsData.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper 
              sx={{ 
                width: "100%", 
                minHeight: "180px", 
                bgcolor: "white", 
                color: "black", 
                p: 2, 
                borderRadius: "12px", // Rounded corners
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", 
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                {card.title}
              </Typography>
              {card.items.map((item, idx) => (
                <Box 
                  key={idx} 
                  sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between", // Push items to the edges
                    mb: 1 
                  }}
                >
                  <Typography variant="body2">{item.label}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography 
                      component="span" 
                      variant="body2" 
                      sx={{ color: item.color, fontWeight: "bold", mr: 1 }}
                    >
                      {item.status}
                    </Typography>
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: "50%", 
                        backgroundColor: item.color, 
                      }} 
                    />
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CardsGrid;

