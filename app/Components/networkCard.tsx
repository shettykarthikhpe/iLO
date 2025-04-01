import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";

// Define the expected structure of the raw network data
interface RawNetworkData {
  Model?: string[];
  Location?: string[];
  Firmware?: string[];
  Status?: Array<{ State?: string; HealthRollup?: string; Health?: string }>;
}

// Our internal NetworkItem format
interface NetworkItem {
  Model: string;
  Location: string;
  Firmware: string;
  State: string;
  Health: string;
}

// Utility function to return an icon based on health status
const getHealthIcon = (health?: string) => {
  if (!health) return null;
  if (health === "OK") {
    return <CheckCircleIcon sx={{ color: "#17eba0", fontSize: 18 }} />;
  } else if (health === "Critical") {
    return <ErrorIcon sx={{ color: "red", fontSize: 18 }} />;
  } else if (health === "Warning") {
    return <WarningIcon sx={{ color: "orange", fontSize: 18 }} />;
  }
  return null;
};

const NetworkSummaryCard: React.FC<{ rawData?: RawNetworkData }> = ({ rawData }) => {
  const [open, setOpen] = useState(false);

  // Transform raw network data into a structured format
  const networkItems: NetworkItem[] = useMemo(() => {
    console.log("Raw Network Data:", rawData);

    // Ensure rawData is an array and extract the first object
    const data = Array.isArray(rawData) && rawData.length > 0 ? rawData[0] : rawData;

    console.log("Extracted Data:", data);

    if (!data || !data.Model || !data.Location || !data.Firmware || !data.State || !data.Health) {
        console.log("Invalid extracted data structure.");
        return [];
    }

    const count = Math.min(
        data.Model.length,
        data.Location.length,
        data.Firmware.length,
        data.State.length,
        data.Health.length
    );

    console.log("Computed Count:", count);

    if (count === 0) {
        console.log("All extracted arrays have length 0.");
        return [];
    }

    const processedItems = Array.from({ length: count }, (_, i) => ({
        Model: data.Model[i] || "Unknown",
        Location: data.Location[i] || "Unknown",
        Firmware: data.Firmware[i] || "Unknown",
        State: data.State[i] || "Unknown",
        Health: data.Health[i] || "Unknown",
    }));

    console.log("Processed Network Items:", processedItems);

    return processedItems;
}, [rawData]);


   // Debugging line

  const compactView = networkItems.slice(0, 3); // Show only the first 3 rows in the main card

  return (
    <>
      {/* Compact Main Card */}
      <Paper
        elevation={3}
        sx={{
          width: 450,
          height: 242,
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
          Network Summary
        </Typography>
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          {compactView.length > 0 ? (
            compactView.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {item.Model}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {getHealthIcon(item.Health)}
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {item.Health}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No network data available.
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Detailed Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Network Details</DialogTitle>
        <DialogContent dividers>
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
                {networkItems.length > 0 ? (
                  networkItems.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.Model}</TableCell>
                      <TableCell>{item.Location}</TableCell>
                      <TableCell>{item.Firmware}</TableCell>
                      <TableCell>{item.State}</TableCell>
                      <TableCell sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {getHealthIcon(item.Health)}
                        {item.Health}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No network data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NetworkSummaryCard;