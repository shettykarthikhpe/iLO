import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Define interfaces based on your input format.
interface PMData {
  Locator: string[];
  Technology: string[];
  Status: string[];
  Size: number[];
  Frequncy: (string | number)[];
}

interface MSItem {
  BoardCpuNumber: number;
  BoardMemoryType: string;
  BoardNumberOfSockets: number;
}

interface MemoryData {
  PM: PMData[];
  MS: MSItem[][];
}

interface MemoryCardProps {
  data: MemoryData;
}

// Utility function to return an icon based on a memory status string.
const getStatusIcon = (status: string) => {
  // Normalize status for comparison
  const s = status.toLowerCase();
  // Here you can adjust which statuses use which icon.
  // In this example, we'll assume "GoodInUse" is OK, "NotPresent" is a warning,
  // and any other value is treated as an error.
  if (s === "goodinuse") {
    return <CheckCircleIcon sx={{ color: "green", fontSize: 18 }} />;
  } else if (s === "notpresent") {
    return <WarningAmberIcon sx={{ color: "orange", fontSize: 18 }} />;
  } else {
    return <ErrorIcon sx={{ color: "red", fontSize: 18 }} />;
  }
};

const MemoryCard: React.FC<MemoryCardProps> = ({ data }) => {
  // We assume that data.PM is an array with at least one element.
  const pm = data && data.PM[0];

  return (
    <>
      {data && (
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
            Memory
          </Typography>

          {/* Physical Memory (PM) Section */}
          <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>
            Physical Memory (PM)
          </Typography>
          {pm.Locator.map((loc, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                py: 0.5,
                borderBottom:
                  idx < pm.Locator.length - 1 ? "1px solid #eee" : "none",
                mb: idx < pm.Locator.length - 1 ? 0.5 : 0,
              }}
            >
              <Typography variant="body2" sx={{ flexBasis: "30%" }}>
                {loc}
              </Typography>
              <Typography variant="body2" sx={{ flexBasis: "20%" }}>
                {pm.Technology[idx]}
              </Typography>
              <Box
                sx={{
                  flexBasis: "20%",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                {getStatusIcon(pm.Status[idx])}
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {pm.Status[idx]}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ flexBasis: "15%" }}>
                {pm.Size[idx]} GB
              </Typography>
              <Typography variant="body2" sx={{ flexBasis: "15%" }}>
                {pm.Frequncy[idx]}
              </Typography>
            </Box>
          ))}

          {/* Memory Summary (MS) Section */}
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Memory Summary (MS)
          </Typography>
          {data.MS[0].map((msItem, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 0.5,
              }}
            >
              <Typography variant="body2">
                Board CPU Number: {msItem.BoardCpuNumber}
              </Typography>
              <Typography variant="body2">{msItem.BoardMemoryType}</Typography>
              <Typography variant="body2">
                Sockets: {msItem.BoardNumberOfSockets}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}
    </>
  );
};

export default MemoryCard;
