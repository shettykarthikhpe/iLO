

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

// Define interface for device data
interface DeviceData {
  data: string[][][];
}

interface DeviceCardProps {
  data: DeviceData;
}

// Utility function to return an icon based on device status
const getStatusIcon = (status: string) => {
  const s = status.toLowerCase();
  if (s === "enabled") {
    return <CheckCircleIcon sx={{ color: "#17eba0", fontSize: 18 }} />;
  } else if (s === "N/A") {
    return <WarningAmberIcon sx={{ color: "orange", fontSize: 18 }} />;
  } else if (s === "absent" || s === "unsupported") {
    return <ErrorIcon sx={{ color: "red", fontSize: 18 }} />;
  }
  return null;
};

const DeviceCard: React.FC<DeviceCardProps> = ({ data }) => {
  // Destructure columns from data
  const deviceNames = data && data.data[0]; // Device type names
  const deviceStatuses = data && data.data[1]; // Status (Enabled, Absent, etc.)
  const healthStatuses = data && data.data[2]; // Health status (OK, N/A, etc.)
  const productNames = data && data.data[3]; // Product names
  const productVersions = data && data.data[4]; // Product versions
  const componentIntegrity = data && data.data[5]; // Integrity status
  const locations = data && data.data[6]; // Device location
  const ids = data && data.data[7]; // Product IDs

  // For the compact view, show only the first 3 rows.
  const compactRowsCount = 5;
  const compactRows = deviceNames.slice(0, compactRowsCount).map((device, idx) => ({
    name: device[0],
    status: deviceStatuses[idx] ? deviceStatuses[idx][0] : "",
  }));

  // State for dialog open
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Main Device Card (Compact View) */}
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          minHeight: "100%",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          cursor: "pointer",
          p: 2,
        }}
        onClick={() => setOpen(true)}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          Device Overview
        </Typography>
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          {compactRows.length > 0 ? (
            compactRows.map((row, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                {/* Device Name */}
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {row.name}
                </Typography>
                {/* Gap, then Status Icon and Status */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {getStatusIcon(row.status)}
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {row.status}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No device data available.
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Dialog for Full Device Details */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Device Details</DialogTitle>
        <DialogContent dividers>
          {deviceNames.map((device, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                py: 0.5,
                borderBottom: idx < deviceNames.length - 1 ? "1px solid #eee" : "none",
                mb: idx < deviceNames.length - 1 ? 0.5 : 0,
              }}
            >
              {/* Device Type */}
              <Typography variant="body2" sx={{ flexBasis: "15%", fontWeight: "bold" }}>
                {device[0]}
              </Typography>
              {/* Status with icon */}
              <Box sx={{ flexBasis: "15%", display: "flex", alignItems: "center", gap: 0.5 }}>
                {getStatusIcon(deviceStatuses[idx][0])}
                <Typography variant="body2">{deviceStatuses[idx][0]}</Typography>
              </Box>
              {/* Health Status */}
              <Typography variant="body2" sx={{ flexBasis: "10%" }}>
                {healthStatuses[idx][0]}
              </Typography>
              {/* Product Name */}
              <Typography variant="body2" sx={{ flexBasis: "20%" }}>
                {productNames[idx][0]}
              </Typography>
              {/* Version */}
              <Typography variant="body2" sx={{ flexBasis: "10%" }}>
                {productVersions[idx][0]}
              </Typography>
              {/* Component Integrity */}
              <Typography variant="body2" sx={{ flexBasis: "10%" }}>
                {componentIntegrity[idx][0]}
              </Typography>
              {/* Location */}
              <Typography variant="body2" sx={{ flexBasis: "10%" }}>
                {locations[idx][0]}
              </Typography>
              {/* Product ID */}
              <Typography variant="body2" sx={{ flexBasis: "10%" }}>
                {ids[idx][0]}
              </Typography>
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

export default DeviceCard;
