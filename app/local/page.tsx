"use client";

import { useState, DragEvent, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { FiLoader } from "react-icons/fi";
import { ArrowBackIosNew, ArrowForward } from "@mui/icons-material";

export default function Home() {
  const [status, setStatus] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [filePath, setFilePath] = useState<string>("");
  const [ipList, setIpList] = useState<string[]>([]);
  const router = useRouter();
  const [removeFileUploader, setRemoveFileUploader] = useState(false);
  const [token, setToken ] = useState("");
  const [fileName, setFileName] = useState("")
  const [content, setContent] = useState([])
  const [contentLoader, setContentLoader] = useState(false);

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
      console.log(value)
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


  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    setFileName(file.name.split('.')[0])

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setStatus("File uploaded successfully!");
        setFilePath(data.path);
        setTimeout(() => {
          setRemoveFileUploader(true);
        }, 3000);
        setTimeout(() => {
          getFileConetnt(file.name.split('.')[0])
        }, 5000);
      } else {
        setStatus("Upload failed.");
      }
    } catch (error) {
      setStatus("Upload error.");
    }
  }

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

  const getFileConetnt = async (filename:any)=>{
    try{
      setContentLoader(true)
      const response = await axios.post("/api/content",{
        filename:filename
      })
      setContent(response.data.data[0])
      setContentLoader(false)
    }catch(err){
      setContentLoader(false)
      console.log(err)
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
      {/* Left Side - IP Box */}
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
      </div>

      {/* Right Side - File Upload */}
    { !removeFileUploader &&  <div style={styles.rightPane}>
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
              <Button onClick={() => {uploadFile(file)}} variant="secondary">
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
        </div>}
      
    { !contentLoader && removeFileUploader ? 
      <>
      {!contentLoader && content && <span className="m-4 font-bold pb-12">Drives</span>}
      {!contentLoader && content &&  Object.values(content).map((value, index)=>{
        return (
          <div key={index} className="m-8">
            <h3 >{value}</h3>
          </div>
        )
      })}
      </> : contentLoader && <div className="mt-20 ml-40"><FiLoader size={50} color="red"><span>Fetching your data</span></FiLoader> </div>}
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
