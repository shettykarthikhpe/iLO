import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Paper } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";

const getStatusIcon = (status: string, color: string) => {
  switch (status.toLowerCase()) {
    case "warning":
      return <WarningAmberIcon sx={{ color: "orange", fontSize: 18 }} />;
    case "risk":
    case "critical":
      return <ErrorIcon sx={{ color: "red", fontSize: 18 }} />;
    case "on":
    case "ok":
    case "enabled":
      return <CheckCircleIcon sx={{ color: "#17eba0", fontSize: 18 }} />;
    default:
      return (
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: color,
          }}
        />
      );
  }
};

const summaryCardsData = [
  {
    title: "Summary",
    items: [
      { label: "Server Power", status: "On", color: "#17eba0" },
      { label: "UID Indicator", status: "On", color: "#17eba0" },
      { label: "AMS", status: "warning", color: "gray" },
    ],
  },
];

const processorCardsData = [
  {
    title: "Processors",
    items: [
      { label: "Processor A", status: "On", color: "#17eba0" },
      { label: "Processor B", status: "Off", color: "red" },
      { label: "Processor C", status: "Idle", color: "gray" },
    ],
  },
];

const networkCardsData = [
  {
    title: "Memory",
    items: [
      { label: "Processor A", status: "On", color: "#17eba0" },
      { label: "Processor B", status: "Off", color: "red" },
      { label: "Processor C", status: "Idle", color: "gray" },
    ],
  },
];


const storageCardsData = [
  {
    title: "Device ",
    items: [
      { label: "Processor A", status: "On", color: "#17eba0" },
      { label: "Processor B", status: "Off", color: "red" },
      { label: "Processor C", status: "Idle", color: "gray" },
    ],
  },
];


const deviceCardsData = [
  {
    title: "Network",
    items: [
      { label: "Processor A", status: "On", color: "#17eba0" },
      { label: "Processor B", status: "Off", color: "red" },
      { label: "Processor C", status: "Idle", color: "gray" },
    ],
  },
];


const memoryCardsData = [
  {
    title: "Storage",
    items: [
      { label: "Processor A", status: "On", color: "#17eba0" },
      { label: "Processor B", status: "Off", color: "red" },
      { label: "Processor C", status: "Idle", color: "gray" },
    ],
  },
];




const CardsGrid: React.FC = () => {
  const [summary, setSummary] = useState([]);
  const [processor, setProcessor] = useState([]);

  const fetcher =async() =>{
    try{
      const response = await axios.post("/api/summary");
      setProcessor(response.data.data)
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    fetcher();
  },[])

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      {/* Parent flex container that wraps all section cards */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {/* Each section is wrapped in its own Box.
            The flex property forces each card to take up about 33.33% of the width,
            so you'll have 3 cards per row on larger screens. */}
        {/* <Box sx={{ flex: "0 0 calc(33.33% - 16px)" }}>
          {summary && summary.map((card, index) => (
            <Paper
              key={`summary-${index}`}
              elevation={3}
              sx={{
                borderRadius: "12px",
                p: 2,
                mb: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                {card.title}
              </Typography>
              {card['Other']?.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 0.5,
                  }}
                >
                  <Typography variant="body2">{item[idx]} --- {item['AgentlessManagementService']}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {getStatusIcon(item.status, item.color)}
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {item.status}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Paper>
          ))}
        </Box> */}
        <Box sx={{ flex: "0 0 calc(33.33% - 16px)" }}>
          {processor && processor.map((card, index) => (
            <div key={index}>
              <h1 >
                {card[0]['Name']}
              </h1>
            </div>
          ))}
        </Box>
        <Box sx={{ flex: "0 0 calc(33.33% - 16px)" }}>
          {networkCardsData.map((card, index) => (
            <Paper
              key={`network-${index}`}
              elevation={3}
              sx={{
                borderRadius: "12px",
                p: 2,
                mb: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                {card.title}
              </Typography>
              {card.items.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 0.5,
                  }}
                >
                  <Typography variant="body2">{item.label}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {getStatusIcon(item.status, item.color)}
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {item.status}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Paper>
          ))}
        </Box>
        <Box sx={{ flex: "0 0 calc(33.33% - 16px)" }}>
          {storageCardsData.map((card, index) => (
            <Paper
              key={`storage-${index}`}
              elevation={3}
              sx={{
                borderRadius: "12px",
                p: 2,
                mb: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                {card.title}
              </Typography>
              {card.items.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 0.5,
                  }}
                >
                  <Typography variant="body2">{item.label}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {getStatusIcon(item.status, item.color)}
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {item.status}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Paper>
          ))}
        </Box>
        <Box sx={{ flex: "0 0 calc(33.33% - 16px)" }}>
          {deviceCardsData.map((card, index) => (
            <Paper
              key={`device-${index}`}
              elevation={3}
              sx={{
                borderRadius: "12px",
                p: 2,
                mb: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                {card.title}
              </Typography>
              {card.items.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 0.5,
                  }}
                >
                  <Typography variant="body2">{item.label}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {getStatusIcon(item.status, item.color)}
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {item.status}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Paper>
          ))}
        </Box>
        <Box sx={{ flex: "0 0 calc(33.33% - 16px)" }}>
          {memoryCardsData.map((card, index) => (
            <Paper
              key={`memory-${index}`}
              elevation={3}
              sx={{
                borderRadius: "12px",
                p: 2,
                mb: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                {card.title}
              </Typography>
              {card.items.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 0.5,
                  }}
                >
                  <Typography variant="body2">{item.label}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {getStatusIcon(item.status, item.color)}
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {item.status}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CardsGrid;