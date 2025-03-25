import React from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";

// Define the structure of storage data
interface StorageData {
  entity: string;
  count: number;
  health: string;
}

const storageData: StorageData[] = [
  { entity: "Storage Controllers", count: 1, health: "Critical" },
  { entity: "Volumes", count: 0, health: "Not available" },
  { entity: "Storage Enclosures", count: 1, health: "OK" },
  { entity: "Drives", count: 8, health: "Critical" },
];

// Utility function to return an icon based on health status
const getHealthIcon = (health: string) => {
  switch (health.toLowerCase()) {
    case "ok":
      return <CheckCircleIcon sx={{ color: "green", fontSize: 18 }} />;
    case "critical":
      return <ErrorIcon sx={{ color: "red", fontSize: 18 }} />;
    case "not available":
      return <InfoIcon sx={{ color: "gray", fontSize: 18 }} />;
    default:
      return null;
  }
};

const StorageSummaryCard: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: "12px", mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Storage Summary
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Entity</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Count</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Health Summary</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {storageData.map((item, idx) => (
              <TableRow
                key={idx}
                sx={{ backgroundColor: item.entity === "Storage Controllers" ? "" : "inherit" }}
              >
                <TableCell sx={{ fontWeight: "bold" }}>{item.entity}</TableCell>
                <TableCell>{item.count}</TableCell>
                <TableCell sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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

export default StorageSummaryCard;