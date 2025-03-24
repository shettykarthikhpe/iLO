import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";


interface SummaryData {
  Name: string;
  Model: string;
  Other: {
    AMS: {
      [key: string]: any;
    }
  }[];
}

interface SummaryCardProps {
  data: SummaryData[];
}

// Utility function to return an icon based on a status string.
const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "ok":
      return <CheckCircleIcon sx={{ color: "green", fontSize: 18 }} />;
    case "warning":
      return <WarningAmberIcon sx={{ color: "orange", fontSize: 18 }} />;
    case "critical":
    case "risk":
      return <ErrorIcon sx={{ color: "red", fontSize: 18 }} />;
    default:
      return null;
  }
};

const SummaryCard: React.FC<SummaryCardProps> = ({ data }) => {
  return (
    <>
      {data.map((item, index) => {
        // Extract the AMS object from the first element of "Other".
        const AMS = item.Other && item.Other.length > 0 ? item.Other[0].AMS : {};
        const amsKeys = Object.keys(AMS);
        return (
          <Paper
            key={index}
            elevation={3}
            sx={{
              p: 2,
              borderRadius: "12px",
              mb: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {/* Display the summary title and model */}
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              {item.Name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Model: {item.Model}
            </Typography>
            {/* Iterate over the AMS keys */}
            {amsKeys.map((key, idx) => {
              let value = AMS[key];
              let displayValue = "";
              // If the value is an object with a nested Status.Health, use that.
              if (typeof value === "object" && value.Status && value.Status.Health) {
                displayValue = value.Status.Health;
              } else {
                displayValue = String(value);
              }
              return (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 0.5,
                  }}
                >
                  <Typography variant="body2">{key}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {/* {getStatusIcon(displayValue)} */}
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {displayValue}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Paper>
        );
      })}
    </>
  );
};

export default SummaryCard;