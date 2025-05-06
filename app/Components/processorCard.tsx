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

interface ProcessorStatus {
  Health: string;
  State: string;
}

interface ProcessorData {
  Name: string;
  Status: ProcessorStatus;
  Speed: number;
  Core: string;
  TotalCore: number;
  TotalThreads: number;
  Cache: [string, string, number][];
}

interface ProcessorCardProps {
  data?: ProcessorData[]; // now optional for safety
}

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case "ok":
    case "on":
    case "enabled":
      return <CheckCircleIcon sx={{ color: "#17eba0", fontSize: 18 }} />;
    case "warning":
      return <WarningAmberIcon sx={{ color: "orange", fontSize: 18 }} />;
    case "critical":
    case "risk":
      return <ErrorIcon sx={{ color: "red", fontSize: 18 }} />;
    default:
      return null;
  }
};

const ProcessorCard: React.FC<ProcessorCardProps> = ({ data }) => {
  const [open, setOpen] = useState(false);

  if (!data) {
    return (
      <Paper elevation={3} sx={{ padding: "20px", borderRadius: "12px", textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Loading processor data...
        </Typography>
      </Paper>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Paper elevation={3} sx={{ padding: "20px", borderRadius: "12px" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Processors
        </Typography>
        <Typography variant="body2" color="textSecondary">
          No processor data available.
        </Typography>
      </Paper>
    );
  }

  const processors = data.slice(0, 2);

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          minHeight: "100%",
          borderRadius: "12px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
        }}
        onClick={() => setOpen(true)}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          Processors
        </Typography>

        {processors.map((proc, index) => (
          <Box key={index} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2">{proc.Name}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {getStatusIcon(proc.Status?.Health)}
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {proc.Status?.Health}
              </Typography>
            </Box>
          </Box>
        ))}
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Processor Details</DialogTitle>
        <DialogContent dividers>
          {processors.map((proc, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                {proc.Name}
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Health:</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {getStatusIcon(proc.Status?.Health)}
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {proc.Status?.Health}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">State:</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {proc.Status?.State}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Speed:</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {proc.Speed} MHz
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Cores:</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {proc.TotalCore}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Threads:</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {proc.TotalThreads}
                </Typography>
              </Box>

              {proc.Cache.map((cacheEntry, idx) => (
                <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="body2">{cacheEntry[1]}:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {cacheEntry[2]} KB
                  </Typography>
                </Box>
              ))}
            </Box>
          ))}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProcessorCard;
