

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
  Skeleton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";

interface RawNetworkData {
  Model?: string[];
  Location?: string[];
  Firmware?: string[];
  State?: string[];
  Health?: string[];
}

interface NetworkItem {
  Model: string;
  Location: string;
  Firmware: string;
  State: string;
  Health: string;
}

const getHealthIcon = (health?: string) => {
  if (!health) return null;
  if (health === "OK") return <CheckCircleIcon sx={{ color: "#17eba0", fontSize: 18 }} />;
  if (health === "Critical") return <ErrorIcon sx={{ color: "red", fontSize: 18 }} />;
  if (health === "Warning") return <WarningIcon sx={{ color: "orange", fontSize: 18 }} />;
  return null;
};

const NetworkSummaryCard: React.FC<{ rawData?: RawNetworkData; loading: boolean }> = ({ rawData, loading }) => {
  const [open, setOpen] = useState(false);

  const networkItems: NetworkItem[] = useMemo(() => {
    if (loading || !rawData || !rawData.Model || !rawData.Location || !rawData.Firmware || !rawData.State || !rawData.Health) {
      return [];
    }

    const count = Math.min(
      rawData.Model.length,
      rawData.Location.length,
      rawData.Firmware.length,
      rawData.State.length,
      rawData.Health.length
    );

    return Array.from({ length: count }, (_, i) => ({
      Model: rawData.Model![i] || "Unknown",
      Location: rawData.Location![i] || "Unknown",
      Firmware: rawData.Firmware![i] || "Unknown",
      State: rawData.State![i] || "Unknown",
      Health: rawData.Health![i] || "Unknown",
    }));
  }, [rawData, loading]);

  const compactView = networkItems.slice(0, 3);

  return (
    <>
      {/* Compact Main Card */}
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
          Network Summary
        </Typography>
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          {loading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Skeleton variant="text" width={120} height={20} />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Skeleton variant="circular" width={18} height={18} />
                    <Skeleton variant="text" width={50} height={20} />
                  </Box>
                </Box>
              ))
            : compactView.length > 0
              ? compactView.map((item, idx) => (
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
              : (
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
                {loading
                  ? Array.from({ length: 3 }).map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell><Skeleton variant="text" width={80} /></TableCell>
                        <TableCell><Skeleton variant="text" width={80} /></TableCell>
                        <TableCell><Skeleton variant="text" width={80} /></TableCell>
                        <TableCell><Skeleton variant="text" width={60} /></TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Skeleton variant="circular" width={18} height={18} />
                            <Skeleton variant="text" width={50} />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  : networkItems.length > 0
                    ? networkItems.map((item, idx) => (
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
                    : (
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
