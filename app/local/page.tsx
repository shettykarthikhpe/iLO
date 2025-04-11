"use client";

import { useState, DragEvent, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Importing ShadCN Button
import axios from "axios";

export default function Home() {
  const [status, setStatus] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [filePath, setFilePath] = useState<string>("");
  const [ipList, setIpList] = useState<string[]>([""]);
  const router = useRouter();

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

  const handleIpChange = (index: number, value: string) => {
    const updatedIps = [...ipList];
    updatedIps[index] = value;
    setIpList(updatedIps);
  };

  const getIp = async ()=>{
    try {
      const response = await axios.post("/api/getSut",{
        userId: "72727"
      })
      if(response.data.success){
        setIpList(response.data.data.sut)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getIp();
  }, [])

  const addIptoDb = async (ip: string)=>{
    try{
      const response = await axios.post("/api/addSut",{
        userId:"72727",
        ip: ip,
        username: "shetty"
      })
      console.log(response)
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
    await removeIpFromDb(ipList[index], "72727")
    const updatedIps = ipList.filter((_, i) => i !== index);
    setIpList(updatedIps);
  };

  return (
    <div style={styles.container}>
      {/* Left Side - IP Box */}
      <div style={styles.leftPane}>
        <div style={styles.ipBox}>
          <h3 style={styles.heading}>IP Addresses</h3>
          <div style={styles.ipList}>
            {ipList.map((ip, index) => (
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
      </div>

      {/* Right Side - File Upload */}
      <div style={styles.rightPane}>
        <div style={styles.centerContent}>
          <div
            style={styles.dragBox}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {file ? file.name : "Drag & Drop your file here"}
          </div>

          <input
            type="file"
            id="fileInput"
            hidden
            accept=".csv, .xlsx"
            onChange={handleFileChange}
          />
          <Button onClick={() => document.getElementById("fileInput")?.click()} variant="outline">
            Choose File
          </Button>

          {file && (
            <Button onClick={() => {}} variant="secondary">
              📤 Upload File
            </Button>
          )}

          <p>{status}</p>
          {filePath && (
            <p>
              Saved at: <strong>{filePath}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Next Button */}
      <Button onClick={() => router.push("/next-page")} variant="default" style={styles.nextButton}>
        Next ➡️
      </Button>
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
