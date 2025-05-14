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

const Dummy: React.FC<PageProps> = ({ ip, username, password }) => {
  const [ipList, setIpList] = useState<any[]>([]);
  const [token, setToken] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentIp, setCurrentIp] = useState(ip);
  const [currentUser, setCurrentUser] = useState(username);
  const [currentPass, setCurrentPass] = useState(password);
  const [dloading, setDLoading] = useState(false);
  const [sloading, setSLoading] = useState(false);
  const [ploading, setPLoading] = useState(false);
  const [nloading, setNLoading] = useState(false);
  const [stloading, setStLoading] = useState(false);
  const [mloading, setMLoading] = useState(false);


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

  const deviceGetter = async ()=>{
    try{
      setDLoading(true)
      const response = await axios.post(`/api/device`, {body:{ username: currentUser, ip: currentIp, password: currentPass }});
      setDevice(response.data.data);
      setTimeout(() => {
        setDLoading(false)
      }, 3000);
    }catch(err){
        setDLoading(true)
        console.log(err)
    }
  }

  const summaryGetter = async ()=>{
    try{
      setSLoading(true)
      const response = await axios.post(`/api/summary`, {body:{ username: currentUser, ip: currentIp, password: currentPass }});
      setSummary(response.data.data);
      setTimeout(() => {
        setSLoading(false)
      }, 3000);
    }catch(err){
        setSLoading(true)
        console.log(err)
    }
  }

  const processorGetter = async ()=>{
    try{
      setPLoading(true)
      const response = await axios.post(`/api/processor`, {body:{ username: currentUser, ip: currentIp, password: currentPass }});
      setProcessor(response.data.data);
      setTimeout(() => {
        setPLoading(false)
      }, 3000);
    }catch(err){
        setPLoading(true)
        console.log(err)
    }
  }

  const networkGetter = async ()=>{
    try{
      setNLoading(true)
      const response = await axios.post(`/api/network`, {body:{ username: currentUser, ip: currentIp, password: currentPass }});
      setNetwork(response.data.data);
      setTimeout(() => {
        setNLoading(false)
      }, 3000);
    }catch(err){
        setNLoading(true)
        console.log(err)
    }
  }

  const storageGetter = async ()=>{
    try{
      setStLoading(true)
      const response = await axios.post(`/api/storage`, {body:{ username: currentUser, ip: currentIp, password: currentPass }});
      setStorage(response.data.data);
      setTimeout(() => {
        setStLoading(false)
      }, 3000);
    }catch(err){
        setStLoading(true)
        console.log(err)
    }
  }

  const memoryGetter = async ()=>{
    try{
      setMLoading(true)
      const response = await axios.post(`/api/memory`, {body:{ username: currentUser, ip: currentIp, password: currentPass }});
      console.log(response.data.data)
      setMemory(response.data.data);
      setTimeout(() => {
        setMLoading(false)
      }, 3000);
    }catch(err){
        setMLoading(true)
        console.log(err)
    }
  }

  useEffect(() => {
    tokenGetter();
  }, []);
  
  useEffect(() => {
    if (token) getIp();
  }, [token]);

  useEffect(() => {
    deviceGetter()
    summaryGetter()
    processorGetter()
    networkGetter()
    storageGetter()
    memoryGetter()
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
 
        
            <Grid item xs={12} sm={6} md={4} lg={4}>
                {dloading && <FiLoader size={40} />}
               {!dloading && device?.data?.length>0 &&  <DeviceCard data={device} />}
               {!dloading && device?.data ==null && <h1>Data is not available</h1>}
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
               {sloading && <FiLoader size={40} />}
               {!sloading && summary?.length>0 &&  <SummaryCard data={summary} />}
               {!sloading && summary?.length <=0 && <h1>Data is not available</h1>}
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
               {ploading && <FiLoader size={40} />}
               {!ploading && processor?.length>0 &&  <ProcessorCard data={processor} />}
               {!ploading && processor?.length <=0 && <h1>Data is not available</h1>}
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
               {nloading && <FiLoader size={40} />}
               {!nloading && network?.length>0 &&  <NetworkSummaryCard rawData={network} loading={false} />}
               {!nloading && network?.length <=0 && <h1>Data is not available</h1>}
            </Grid>
          
            
            <Grid item xs={12} sm={6} md={4} lg={4}>
               {stloading && <FiLoader size={40} />}
               {!stloading && storage?.length>0 &&  <StorageSummaryCard data={storage} loading={false} />}
               {!stloading && storage?.length <=0 && <h1>Data is not available</h1>}
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
               {mloading && <FiLoader size={40} />}
               {!mloading && memory?.PM?.length>0 && memory?.MS?.length>0 &&  <MemoryCard data={memory} />}
               {!mloading && memory?.PM?.length <=0 && memory?.MS?.length <=0 && <h1>Data is not available</h1>}
            </Grid>

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
              <Button onClick={() => setShowDialog(false)}>
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

export default Dummy;

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
