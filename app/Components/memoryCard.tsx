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

interface PMData {
 Locator: string[];
 Technology: string[];
 Status: string[];
 Size: number[];
 Frequency: (string | number)[];
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
 data?: MemoryData; // optional in case you want to load async
}

const getStatusIcon = (status: string) => {
 const s = status.toLowerCase();
 if (s === "goodinuse") return <CheckCircleIcon sx={{ color: "#17eba0", fontSize: 18 }} />;
 if (s === "notpresent") return <WarningAmberIcon sx={{ color: "orange", fontSize: 18 }} />;
 return <ErrorIcon sx={{ color: "red", fontSize: 18 }} />;
};

const MemoryCard: React.FC<MemoryCardProps> = ({ data }) => {
 const [open, setOpen] = useState(false);

 const loading =
 !data ||
 !data.PM ||
 data.PM.length === 0 ||
 !data.MS ||
 data.MS.length === 0 ||
 !data.PM[0].Locator;

 if (loading) {
 return (
 <Paper
 elevation={3}
 sx={{
 width: "100%",
 minHeight: "100px",
 borderRadius: "12px",
 display: "flex",
 alignItems: "center",
 justifyContent: "center",
 p: 2,
 }}
 >
 <CircularProgress />
 </Paper>
 );
 }

 const pm = data.PM[0];
 const msList = data.MS[0];

 const activeParts =
 pm.Locator.map((loc, idx) => ({
 name: loc,
 status: pm.Status[idx],
 })).filter((item) => item.status?.toLowerCase() === "goodinuse") || [];

 return (
 <>
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
 Memory Summary
 </Typography>

 {msList.map((msItem, idx) => (
 <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
 <Typography variant="body2">CPU: {msItem.BoardCpuNumber}</Typography>
 <Typography variant="body2">{msItem.BoardMemoryType}</Typography>
 <Typography variant="body2">Sockets: {msItem.BoardNumberOfSockets}</Typography>
 </Box>
 ))}

 <Typography variant="subtitle2" sx={{ fontWeight: "bold", mt: 1, mb: 1 }}>
 Active Physical Memory Parts
 </Typography>
 <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
 {activeParts.length > 0 ? (
 activeParts.map((part, idx) => (
 <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
 <Typography variant="body2" sx={{ flexGrow: 1 }}>
 {part.name}
 </Typography>
 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
 {getStatusIcon(part.status)}
 <Typography variant="body2">{part.status}</Typography>
 </Box>
 </Box>
 ))
 ) : (
 <Typography variant="body2" color="textSecondary">
 No active parts found.
 </Typography>
 )}
 </Box>
 </Paper>

 <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
 <DialogTitle>Memory Details</DialogTitle>
 <DialogContent dividers>
 <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
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
 borderBottom: idx < pm.Locator.length - 1 ? "1px solid #eee" : "none",
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
 {pm.Frequency && pm.Frequency.length > idx ? pm.Frequency[idx] : "N/A"}
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

export default MemoryCard;