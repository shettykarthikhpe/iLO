"use client";

import { useState, DragEvent, ChangeEvent, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Importing ShadCN Button
import axios from "axios";
import { FiLoader } from "react-icons/fi";
import { ArrowBackIosNew, ArrowForward } from "@mui/icons-material";
import Display from "../Display/page";

export default function Home() {
  const [status, setStatus] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [ipList, setIpList] = useState<string[]>([]);
  const [token, setToken ] = useState("");
  const [clicked, setClicked] = useState(false);


  const tokenGetter = async() =>{
    try{
      const tok = await localStorage.getItem("token");
      if(tok){
        setToken(tok);
      }
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    tokenGetter();
  }, [])

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setStatus("File ready to upload.");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus("File ready to upload.");
    }
  };

  const handleIPClick = async (value:any)=>{
     setClicked(true)
  }

  const handleIpChange = (index: number, value: string) => {
    const updatedIps = [...ipList];
    updatedIps[index] = value;
    setIpList(updatedIps);
  };

  const getIp = async ()=>{
    try {
      const response = await axios.post("/api/getSut",{
        userId: JSON.stringify(token)
      })
      if(response.data.success){
        setIpList(response.data.data.sut)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    token && getIp();
  }, [token])

  const addIptoDb = async (ip: string)=>{
    try{
      const response = await axios.post("/api/addSut",{
        userId: token,
        ip: ip,
      })
    }catch(err){
      console.log(err)
    }
  }

  const addIp = () => {
    if (ipList.length < 5) {
      setIpList([...ipList, ""]);
    }
  };

  const Update = async ()=>{
    if(ipList.length > 0){
      ipList.map((i)=>{
        addIptoDb(i)
      })
    }
  }

  const removeIpFromDb = async (ip:string, userId:string) =>{
    try {
      const response = await axios.post("/api/removeSut",{
        ip:ip,
        userId:userId
      })
      if(response.data.success){
        setIpList(response.data.data.sut)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const removeIp = async(index: number) => {
    await removeIpFromDb(ipList[index], token)
    const updatedIps = ipList.filter((_, i) => i !== index);
    setIpList(updatedIps);
  };

  return (
    <div style={styles.container}>
      {!clicked ? 
      <div style={styles.leftPane}>
        <div style={styles.ipBox}>
          <h3 style={styles.heading}>IP Addresses</h3>
          <div style={styles.ipList}>
            {token && ipList.map((ip, index) => (
              <div key={index} style={styles.ipItem}>
                <input
                  type="text"
                  value={ip}
                  onChange={(e) => handleIpChange(index, e.target.value)}
                  placeholder="Enter IP address"
                  style={styles.input}
                />
                <Button variant="destructive" size="icon" onClick={() => removeIp(index)}>
                  ❌
                </Button>
                <Button className="ml-2" variant="secondary" size="icon" onClick={(e) => handleIPClick(ip)}>
                  <ArrowForward fontSize="large" />
                </Button>
              </div>
            ))}
          </div>
          <div style={styles.buttonContainer}>
            <Button variant="outline" onClick={Update}>🔄 Update</Button>
            {ipList.length < 5 && (
              <Button variant="default" onClick={addIp}>
                ➕ Add IP
              </Button>
            )}
          </div>
      </div>
      </div> :
      <Display ip="10.132.147.215" username="Administrator" password="GXJYN722"/>
    }
    </div>
  );
}

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    height: "100vh",
    position: "relative",
  },
  leftPane: {
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRight: "2px solid #ddd",
  },
  rightPane: {
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  ipBox: {
    width: "300px",
    padding: "20px",
    border: "2px solid #ddd",
    borderRadius: "10px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  heading: {
    marginBottom: "15px",
    textAlign: "center",
  },
  ipList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "100%",
  },
  ipItem: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  input: {
    flex: 1,
    padding: "5px",
    marginRight: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "15px",
  },
  dragBox: {
    width: "300px",
    height: "200px",
    border: "2px dashed #333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginBottom: "20px",
    padding: "10px",
  },
  nextButton: {
    position: "absolute",
    bottom: "20px",
    right: "20px",
  },
};
