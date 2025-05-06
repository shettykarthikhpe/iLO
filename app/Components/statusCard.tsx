


import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
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
  data?: SummaryData[];
}

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

  if (!data) {
    return (
      <Paper elevation={3} sx={{ padding: "20px", borderRadius: "12px", textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Loading summary data...
        </Typography>
      </Paper>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Paper elevation={3} sx={{ padding: "20px", borderRadius: "12px" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Summary
        </Typography>
        <Typography variant="body2" color="textSecondary">
          No summary data available.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      {data.map((item, index) => {
        const AMS = item.Other?.[0]?.AMS || {};
        const amsKeys = Object.keys(AMS);
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
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              {item.Name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Model: {item.Model}
            </Typography>

            {mainParts.map((key, idx) => {
              const value = AMS[key];
              const displayValue =
                typeof value === "object" && value?.Status?.Health
                  ? value.Status.Health
                  : String(value);

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

            {extraParts.length > 0 && (
              <Typography
                variant="body2"
                sx={{ color: "blue", mt: 1, fontWeight: "bold" }}
              >
                ...
              </Typography>
            )}
          </Paper>
        );
      })}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Full Summary Details</DialogTitle>
        <DialogContent dividers>
          {data.map((item, index) => {
            const AMS = item.Other?.[0]?.AMS || {};
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
                  const value = AMS[key];
                  const displayValue =
                    typeof value === "object" && value?.Status?.Health
                      ? value.Status.Health
                      : String(value);

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
