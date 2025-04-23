"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ArrowForward, Menu as MenuIcon, Padding, Password } from "@mui/icons-material";
import Display from "../Display/page";
import { FiLoader } from "react-icons/fi";

interface IP{
    ip:String,
    username:String,
    password:String
}

export default function Home() {
  const [ipList, setIpList] = useState<string[]>([]);
  const [token, setToken] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [newIp, setNewIp] = useState("");
  const [newUser, setNewUser] = useState("");
  const [newPass, setNewPass] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [ipClciked, setIpClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ip, setIp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const tokenGetter = async () => {
    const tok = await localStorage.getItem("token");
    if (tok) setToken(tok);
  };

  useEffect(() => {
    tokenGetter();
  }, []);

  const getIp = async () => {
    try {
      const response = await axios.post("/api/getSut", {
        userId: JSON.stringify(token),
      });
      console.log(response.data.data.sut);
      if (response.data.success) {
        setIpList(response.data.data.sut);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    token && getIp();
  }, [token]);

  const addIptoDb = async (ip: string) => {
    try {
      const response = await axios.post("/api/addSut", {
        userId: token,
        ip: ip,
        username: newUser,
        password: newPass,
      });
      console.log(response.data.data)
    } catch (err) {
      console.log(err);
    }
  };

  const removeIpFromDb = async (ip: string) => {
    try {
      const response = await axios.post("/api/removeSut", {
        ip: ip,
        userId: token,
      });
      if (response.data.success) {
        setIpList(response.data.data.sut);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleIpClick = (ip: string, username: string, password: string) => {
    setShowSidebar(false);
    setLoading(true);
    setIp(ip);
    setUsername(username);
    setPassword(password);

    setTimeout(() => {
      setIpClicked(true);
    }, 5000);

    setTimeout(() => {
      setLoading(false);
    }, 6000);
  };

  const removeIp = async (index: number) => {
    await removeIpFromDb(ipList[index]);
    const updatedIps = ipList.filter((_, i) => i !== index);
    setIpList(updatedIps);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
<<<<<<< HEAD
      {loading && (
        <div className="text-center mt-20 ml-30">
          <FiLoader size={40} />
        </div>
      )}
      {!ipClciked && !loading && (
        <>
          {/* Sidebar Toggle */}
          <div style={{ position: "absolute", top: 20, left: 20 }}>
            <Button onClick={() => setShowSidebar(!showSidebar)}>
              <MenuIcon />
            </Button>
          </div>

          {/* Sidebar */}
          {showSidebar && (
            <div style={styles.sidebar}>
              <h2 style={styles.sidebarTitle}></h2>
              {ipList.map((ip:any, index) => (
                <div key={index} style={styles.ipItem}>
                  <input
                    type="text"
                    value={ip.ip}
                    onChange={(e) => {
                      const updated = [...ipList];
                      updated[index] = e.target.value;
                      setIpList(updated);
                    }}
                    style={styles.ipInput}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeIp(index)}
                  ></Button>
                  <Button
                    className="ml-2"
                    variant="secondary"
                    size="icon"
                    onClick={() =>
                      handleIpClick(ip.ip, ip.username, ip.password)
                    }
                  >
                    <ArrowForward />
                  </Button>
                </div>
              ))}
              <div style={styles.sidebarButtons}>
                <Button onClick={Update}>Update</Button>
                {ipList.length < 5 && (
                  <Button onClick={() => setShowDialog(true)}>Add IP</Button>
                )}
              </div>
=======
        {
            loading && <div className="text-center mt-20 ml-30"><FiLoader size={40} /></div>
        }
        {
            !ipClciked && !loading &&
            <>
            {/* Sidebar Toggle */}
            <div style={{ position: "absolute", top: 20, left: 20 }}>
                <Button onClick={() => setShowSidebar(!showSidebar)}>
                <MenuIcon/>
                </Button>
>>>>>>> 66e072b7ae514e3287fca8649e89bc5cdce3eb76
            </div>
          )}

<<<<<<< HEAD
          {/* Main Content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#f7f9fb",
            }}
          >
            <h1 style={{ fontSize: "2rem", color: "#333" }}>
              {ipList.length === 0
                ? "No IPs added. Use the menu to add one!"
                : "Welcome!"}
            </h1>
          </div>
=======
            {/* Sidebar */}
            {showSidebar && (
                <div style={styles.sidebar}>
                <h2 style={styles.sidebarTitle}></h2>
                {ipList.map((ip, index) => (
                    <div key={index} style={styles.ipItem}>
                    <input
                        type="text"
                        value={ip.ip}
                        onChange={(e) => {
                        const updated = [...ipList];
                        updated[index] = e.target.value;
                        setIpList(updated);
                        }}
                        style={styles.ipInput}
                    />
                    <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeIp(index)}
                    ></Button>
                    <Button
                        className="ml-2"
                        variant="secondary"
                        size="icon"
                        onClick={()=>handleIpClick(ip.ip, ip.username, ip.password)}
                    >
                        <ArrowForward />
                    </Button>
                    </div>
                ))}
                <div style={styles.sidebarButtons}>
                    {ipList.length < 5 && (
                    <Button onClick={() => setShowDialog(true)}>Add IP</Button>
                    )}
                </div>
                </div>
            )}
>>>>>>> 66e072b7ae514e3287fca8649e89bc5cdce3eb76

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
                  <Button
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setIpList([...ipList, newIp]);
                      addIptoDb(newIp);
                      setShowDialog(false);
                      setNewIp("");
                      setNewUser("");
                      setNewPass("");
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
<<<<<<< HEAD
          )}
=======

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
                    <Button
                        onClick={() => {
                        setIpList([...ipList, newIp]);
                        addIptoDb(newIp);
                        setShowDialog(false);
                        setNewIp("");
                        setNewUser("");
                        setNewPass("");
                        window.location.reload();
                        }}
                    >
                        Add
                    </Button>
                    </div>
                </div>
                </div>
            )}
>>>>>>> 66e072b7ae514e3287fca8649e89bc5cdce3eb76
        </>
      )}
      {ipClciked && !loading && (
        <Display ip={ip} username={username} password={password} />
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: "300px",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #ddd",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
  },
  sidebarTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#333",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
  },
  ipItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  ipInput: {
    flex: 1,
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  sidebarButtons: {
    marginTop: "auto",
    display: "flex",
    justifyContent: "space-between",
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
