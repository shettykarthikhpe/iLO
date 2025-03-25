import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";

// Define the network data structure
interface NetworkData {
  model: string;
  location: string;
  firmware: string;
  state: string;
  health: string;
}

// Input data transformed into an array
const networkData: NetworkData[] = [
  {
    model: "E810-XXVAM2",
    location: "N/A",
    firmware: "4.10 (0x80015188)",
    state: "Enabled",
    health: "OK",
  },
  {
    model: "Intel Eth Adptr I350T4 OCPv3",
    location: "OCP 3.0 Slot 15",
    firmware: "1.3310.0",
    state: "Enabled",
    health: "OK",
  },
];

// Utility function to return an icon based on health status
const getHealthIcon = (health: string) => {
  switch (health.toLowerCase()) {
    case "ok":
      return <CheckCircleIcon sx={{ color: "green", fontSize: 18 }} />;
    case "critical":
      return <ErrorIcon sx={{ color: "red", fontSize: 18 }} />;
    case "warning":
      return <WarningIcon sx={{ color: "orange", fontSize: 18 }} />;
    default:
      return null;
  }
};

const NetworkSummaryCard: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: "12px", mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Network Summary
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Model</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Firmware</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>State</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Health</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {networkData.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>{item.model}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.firmware}</TableCell>
                <TableCell>{item.state}</TableCell>
                <TableCell
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  {getHealthIcon(item.health)}
                  {item.health}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default NetworkSummaryCard;
