import React from "react";
import { Box, Typography, Paper } from "@mui/material";
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
  if (s === "ok") {
    return <CheckCircleIcon sx={{ color: "green", fontSize: 18 }} />;
  } else if (s === "enabled") {
    return <WarningAmberIcon sx={{ color: "orange", fontSize: 18 }} />;
  } else if (s === "absent" || s === "unsupported") {
    return <ErrorIcon sx={{ color: "red", fontSize: 18 }} />;
  }
  return null; // No icon for neutral statuses
};

const DeviceCard: React.FC<DeviceCardProps> = ({ data }) => {
  const deviceNames = data && data.data[0]; // Device type names
  const deviceStatuses = data && data.data[1]; // Status (Enabled, Absent, etc.)
  const healthStatuses = data && data.data[2]; // Health status (OK, N/A, etc.)
  const productNames = data && data.data[3]; // Product names
  const productVersions = data && data.data[4]; // Product versions
  const componentIntegrity = data && data.data[5]; // Integrity status
  const locations = data && data.data[6]; // Device location
  const ids = data && data.data[7]; // Product IDs

  return (
    <Paper
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
      {/* Card Title */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
        Device Overview
      </Typography>

      {/* Table-like structure */}
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
    </Paper>
  );
};

export default DeviceCard;