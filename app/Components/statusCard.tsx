

import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button 
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface SummaryData {
  Name: string;
  Model: string;
  Other: {
    AMS: {
      [key: string]: any;
    };
  }[];
}

interface SummaryCardProps {
  data: SummaryData[];
}

// Utility function to return an icon based on status
const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case "ok":
    case "redundant":
      return <CheckCircleIcon sx={{ color: "#17eba0", fontSize: 18 }} />;
    case "unavailable":
    case "not redundant":
      return <WarningAmberIcon sx={{ color: "orange", fontSize: 18 }} />;
    case "critical":
    case "risk":
      return <ErrorIcon sx={{ color: "red", fontSize: 18 }} />;
    default:
      return null;
  }
};

const SummaryCard: React.FC<SummaryCardProps> = ({ data }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {data.map((item, index) => {
        // Extract AMS data
        const AMS = item.Other && item.Other.length > 0 ? item.Other[0].AMS : {};
        const amsKeys = Object.keys(AMS);
        
        // Limit to first 3-4 parts for main card
        const mainParts = amsKeys.slice(0, 4);
        const extraParts = amsKeys.slice(4);

        return (
          <Paper
            key={index}
            elevation={3}
            sx={{
              width: "100%",
              minHeight: "100%",
              borderRadius: "12px",
              padding: "20px",
              cursor: extraParts.length > 0 ? "pointer" : "default",
            }}
            onClick={extraParts.length > 0 ? () => setOpen(true) : undefined}
          >
            {/* Title & Model */}
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              {item.Name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Model: {item.Model}
            </Typography>

            {/* Main Card Parts */}
            {mainParts.map((key, idx) => {
              let value = AMS[key];
              let displayValue = "";

              if (typeof value === "object" && value.Status && value.Status.Health) {
                displayValue = value.Status.Health;
              } else {
                displayValue = String(value);
              }

              return (
                <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="body2">{key}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {getStatusIcon(displayValue)}
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {displayValue}
                    </Typography>
                  </Box>
                </Box>
              );
            })}

            {/* Indicate More Parts Exist */}
            {extraParts.length > 0 && (
              <Typography 
                variant="body2" 
                sx={{ color: "blue", mt: 1, cursor: "pointer", fontWeight: "bold" }}
              >
              ...
              </Typography>
            )}
          </Paper>
        );
      })}
      
      {/* Full Details Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Full Summary Details</DialogTitle>
        <DialogContent dividers>
          {data.map((item, index) => {
            const AMS = item.Other && item.Other.length > 0 ? item.Other[0].AMS : {};
            const amsKeys = Object.keys(AMS);

            return (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  {item.Name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Model: {item.Model}
                </Typography>

                {amsKeys.map((key, idx) => {
                  let value = AMS[key];
                  let displayValue = "";

                  if (typeof value === "object" && value.Status && value.Status.Health) {
                    displayValue = value.Status.Health;
                  } else {
                    displayValue = String(value);
                  }

                  return (
                    <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2">{key}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        {getStatusIcon(displayValue)}
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          {displayValue}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SummaryCard;

