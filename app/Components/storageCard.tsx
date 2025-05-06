

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
  Skeleton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";

interface StorageData {
  entity: string;
  count: number;
  health: string;
}

interface Props {
  data: StorageData[];
  loading: boolean;
}

const getHealthIcon = (health: string) => {
  switch (health.toLowerCase()) {
    case "ok":
      return <CheckCircleIcon sx={{ color: "#17eba0", fontSize: 18 }} />;
    case "critical":
      return <ErrorIcon sx={{ color: "red", fontSize: 18 }} />;
    case "not available":
      return <InfoIcon sx={{ color: "gray", fontSize: 18 }} />;
    default:
      return null;
  }
};

const StorageSummaryCard: React.FC<Props> = ({ data, loading }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        p: 2,
        borderRadius: "12px",
        mb: 2,
      }}
    >
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
            {loading
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Skeleton variant="text" width={120} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={40} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Skeleton variant="circular" width={18} height={18} />
                        <Skeleton variant="text" width={60} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              : data.map((item, idx) => (
                  <TableRow key={idx}>
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
