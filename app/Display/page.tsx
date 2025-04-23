"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import { Grid, Box, Button } from "@mui/material";
import { Menu as MenuIcon, ArrowForward } from "@mui/icons-material";
import { FiLoader } from "react-icons/fi";

import SummaryCard from "../Components/statusCard";
import ProcessorCard from "../Components/processorCard";
import MemoryCard from "../Components/memoryCard";
import DeviceCard from "../Components/deviceCard";
import NetworkSummaryCard from "../Components/networkCard";
import StorageSummaryCard from "../Components/storageCard";

interface PageProps {
  ip: string;
  username: string;
  password: string;
}

const Display: React.FC<PageProps> = ({ ip, username, password }) => {
  const [ipList, setIpList] = useState<any[]>([]);
  const [token, setToken] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentIp, setCurrentIp] = useState(ip);
  const [currentUser, setCurrentUser] = useState(username);
  const [currentPass, setCurrentPass] = useState(password);
  const [loading, setLoading] = useState({
    summary: false, processor: false, memory: false,
    device: false, storage: false, network: false
  });

  const [processor, setProcessor] = useState<any>([]);
  const [summary, setSummary] = useState<any>([]);
  const [device, setDevice] = useState<any>([]);
  const [memory, setMemory] = useState<any>([]);
  const [storage, setStorage] = useState<any>([]);
  const [network, setNetwork] = useState<any>([]);

  const tokenGetter = async () => {
    const tok = await localStorage.getItem("token");
    if (tok) setToken(tok);
  };

  const getIp = async () => {
    try {
      const response = await axios.post("/api/getSut", {
        userId: JSON.stringify(token),
      });
      if (response.data.success) {
        setIpList(response.data.data.sut);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async (
    endpoint: string,
    data: { username: string; ip: string; password: string },
    setter: any,
    key: string
  ) => {
    try {
      setLoading((prev) => ({ ...prev, [key]: false }));
      const response = await axios.post(`/api/${endpoint}`, { body: data });
      setter(response.data.data);
      setLoading((prev) => ({ ...prev, [key]: true }));
    } catch (err) {
      setLoading((prev) => ({ ...prev, [key]: false }));
      console.error(err);
    }
  };

  const reloadWithIp = (ip: string, username: string, password: string) => {
    setShowSidebar(false)
    setCurrentIp(ip);
    setCurrentUser(username);
    setCurrentPass(password);
  };

  useEffect(() => {
    tokenGetter();
  }, []);

  useEffect(() => {
    if (token) getIp();
  }, [token]);

  useEffect(() => {
    fetchData("processor", { username: currentUser, ip: currentIp, password: currentPass }, setProcessor, "processor");
    fetchData("device", { username: currentUser, ip: currentIp, password: currentPass }, setDevice, "device");
    fetchData("summary", { username: currentUser, ip: currentIp, password: currentPass }, setSummary, "summary");
    fetchData("memory", { username: currentUser, ip: currentIp, password: currentPass }, setMemory, "memory");
    fetchData("network", { username: currentUser, ip: currentIp, password: currentPass }, setNetwork, "network");
    fetchData("storage", { username: currentUser, ip: currentIp, password: currentPass }, setStorage, "storage");
  }, [currentIp, currentUser, currentPass]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      <h1 className="text-center align-item mt-5 font-bold ml-16 text-green-800 text-2xl">{currentIp}</h1>

      {/* Sidebar */}
      {showSidebar && (
        <div style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}> IP list</h3>
          {ipList.map((item, index) => (
            <div key={index} style={styles.ipItem}>
              <span>{item.ip}</span>
              <Button
                size="small"
                onClick={() => reloadWithIp(item.ip, item.username, item.password)}
              >
                <ArrowForward />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Sidebar toggle */}
      <div style={styles.menuButtonWrapper}>
        <Button onClick={() => setShowSidebar(!showSidebar)}>
          <MenuIcon />
        </Button>
      </div>

      {/* Content */}
      <Box sx={{ mt: 12, p: 3, width: "100%", overflowX: "hidden" }}>
        <Grid container spacing={3} justifyContent="center" alignItems="stretch">
          {!Object.values(loading).every(Boolean) && (
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <FiLoader size={40} />
            </Grid>
          )}
          {loading.summary && summary && summary.length > 0 && (
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <SummaryCard data={summary} />
            </Grid>
          )}
          {loading.memory && memory && memory.length > 0 &&  (
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <MemoryCard data={memory} />
            </Grid>
          )}
          {loading.device && device && device.length > 0 && (
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <DeviceCard data={device} />
            </Grid>
          )}
          {loading.processor && processor && processor.length > 0 && (
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <ProcessorCard data={processor} />
            </Grid>
          )}
          {loading.network && network && network.length > 0 && (
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <NetworkSummaryCard rawData={network} />
            </Grid>
          )}
          {loading.storage && storage && storage.length > 0 && (
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <StorageSummaryCard rawData={storage} />
            </Grid>
          )}
        </Grid>
      </Box>
    </div>
  );
};

export default Display;

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "280px",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #ddd",
    padding: "80px 20px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
    zIndex: 100,
  },
  sidebarTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#333",
  },
  ipItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px",
    background: "#f5f5f5",
    borderRadius: "6px",
  },
  menuButtonWrapper: {
    position: "fixed",
    top: "20px",
    left: "20px",
    zIndex: 200,
  },
};
