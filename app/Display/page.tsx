"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Grid, Box, Button, Avatar } from "@mui/material";
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
    summary: false,
    processor: false,
    memory: false,
    device: false,
    storage: false,
    network: false,
  });

  //— Add IP dialog state
  const [showDialog, setShowDialog] = useState(false);
  const [newIp, setNewIp] = useState("");
  const [newUser, setNewUser] = useState("");
  const [newPass, setNewPass] = useState("");

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

  //— Fetch the IP list from your API
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

  //— Add IP to the backend and update local state
  const handleAddIp = async () => {
    if (!newIp || !newUser || !newPass) return alert("Fill all fields");
    try {
      const res = await axios.post("/api/addSut", {
        userId: token,
        ip: newIp,
        username: newUser,
        password: newPass,
      });
      if (res.data.success) {
        setIpList((prev) => [
          ...prev,
          { ip: newIp, username: newUser, password: newPass },
        ]);
        setNewIp("");
        setNewUser("");
        setNewPass("");
        setShowDialog(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  //— Reload your display with a new IP
  const reloadWithIp = (ip: string, username: string, password: string) => {
    setShowSidebar(false);
    setCurrentIp(ip);
    setCurrentUser(username);
    setCurrentPass(password);
  };

  //— Fetch data for all cards
  const fetchData = async (
    endpoint: string,
    data: { username: string; ip: string; password: string },
    setter: any,
    key: string
  ) => {
    try {
      setLoading((prev) => ({ ...prev, [key]: false }));
      const response = await axios.post(`/api/${endpoint}`, { body: data });
      console.log(`${endpoint} is `, response.data.data)
      setter(response.data.data);
      setLoading((prev) => ({ ...prev, [key]: true }));
    } catch (err) {
      setLoading((prev) => ({ ...prev, [key]: false }));
      console.error(err);
    }
  };

  useEffect(() => {
    tokenGetter();
  }, []);
  
  useEffect(() => {
    if (token) getIp();
  }, [token]);

  useEffect(() => {
    fetchData(
      "processor",
      { username: currentUser, ip: currentIp, password: currentPass },
      setProcessor,
      "processor"
    );
    fetchData(
      "device",
      { username: currentUser, ip: currentIp, password: currentPass },
      setDevice,
      "device"
    );
    fetchData(
      "summary",
      { username: currentUser, ip: currentIp, password: currentPass },
      setSummary,
      "summary"
    );
    fetchData(
      "memory",
      { username: currentUser, ip: currentIp, password: currentPass },
      setMemory,
      "memory"
    );
    fetchData(
      "network",
      { username: currentUser, ip: currentIp, password: currentPass },
      setNetwork,
      "network"
    );
    fetchData(
      "storage",
      { username: currentUser, ip: currentIp, password: currentPass },
      setStorage,
      "storage"
    );
  }, [currentIp, currentUser, currentPass]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <h1 className="text-center mt-5 ml-16 font-bold text-green-800 text-2xl">
        {currentIp}
      </h1>

      {/* Sidebar */}
      {showSidebar && (
        <div style={styles.sidebar}>
          <div className="flex-items-center">
            <Button onClick={() => window.location.reload()}>
              <Avatar src="/iLOlogo.png" sx={{ width: 60, height: 60 }} />{" "}
              <h3 style={styles.sidebarTitle}>IP List</h3>
            </Button>
          </div>
          {ipList.map((item, idx) => (
            <div key={idx} style={styles.ipItem}>
              <span>{item.ip}</span>
              <Button
                size="small"
                onClick={() =>
                  reloadWithIp(item.ip, item.username, item.password)
                }
              >
                <ArrowForward />
              </Button>
            </div>
          ))}

          {/* Add IP Button */}
          <div style={styles.sidebarButtons}>
            {ipList.length < 5 && (
              <Button onClick={() => setShowDialog(true)}>+ Add IP</Button>
            )}
          </div>
        </div>
      )}

      {/* Sidebar Toggle */}
      <div style={styles.menuButtonWrapper}>
        <Button onClick={() => setShowSidebar(!showSidebar)}>
          <MenuIcon />
        </Button>
      </div>

      {/* Main Content */}
      <Box sx={{ mt: 12, p: 3, width: "100%", overflowX: "hidden" }}>
        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
        >
          {!Object.values(loading).every(Boolean) && (
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <FiLoader size={40} />
            </Grid>
          )}
          {/* {loading.summary && summary.length > 0 && (
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <SummaryCard data={summary} />
            </Grid>
          )}
          {loading.memory && memory.length > 0 && (
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <MemoryCard data={memory} />
            </Grid>
          )} */}
          {loading.device && device.length > 0 && (
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <DeviceCard data={device} />
            </Grid>
          )}
          {/* {loading.processor && processor.length > 0 && (
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <ProcessorCard data={processor} />
            </Grid>
          )}
          {loading.network && network.length > 0 && (
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <NetworkSummaryCard rawData={network} loading={false} />
            </Grid>
          )}
          {loading.storage && storage.length > 0 && (
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <StorageSummaryCard data={storage} loading={false} />
            </Grid>
          )} */}
        </Grid>
      </Box>

      {/* Add IP Dialog */}
      {showDialog && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalBox}>
            <h3>Add New IP</h3>
            <input
              placeholder="IP Address"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              style={styles.input}
            />
            <input
              placeholder="Username"
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              style={styles.input}
            />
            <div style={styles.dialogButtons}>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddIp}>Add</Button>
            </div>
          </div>
        </div>
      )}
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
    width: "300px",
    backgroundColor: "#0f3555",
    borderRight: "1px solid #ddd",
    padding: "80px 20px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
  },
  sidebarTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "white",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
  },
  ipItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px",
    background: "#f5f5f5",
    borderRadius: "6px",
  },
  sidebarButtons: {
    marginTop: "auto",
    display: "flex",
    justifyContent: "center",
  },
  menuButtonWrapper: {
    position: "fixed",
    top: "20px",
    left: "20px",
    zIndex: 200,
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  dialogButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
}; 
