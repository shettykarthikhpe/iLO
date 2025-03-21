// StatusCard.tsx
import React from "react";
import { Paper, Typography, Box, Divider } from "@mui/material";

interface StatusItem {
  label: string;
  status: string;
  color: string;
}

interface StatusCardProps {
  title: string;
  items: StatusItem[];
}

const StatusCard: React.FC<StatusCardProps> = ({ title, items }) => {
  return (
    <Paper 
      elevation={1} 
      sx={{ p: 2, borderRadius: 2, minHeight: "150px" }} 
    >
      <Typography variant="h6" sx={{ mb: 1}}>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {items.map((item, idx) => (
        <Box 
          key={idx} 
          sx={{ display: "flex", alignItems: "center", mb: 1 }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: item.color,
              mr: 1,
            }}
          />

          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {item.label}:{" "}
            <Typography 
              component="span" 
              variant="body2" 
              sx={{ color: item.color, fontWeight: 600 }}
            >
              {item.status}
            </Typography>
          </Typography>
        </Box>
      ))}
    </Paper>
  );
};

export default StatusCard;