// app/page.tsx
'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import { Button } from '@mui/material';
import { FiLoader } from 'react-icons/fi';
import { color, invariant } from 'framer-motion';

export default function HomePage() {
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePath, setFilePath] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [content, setContent] = useState([])
  const [contentLoader, setContentLoader] = useState(false);
  const [removeFileUploader, setRemoveFileUploader] = useState(false);
  const [fileName, setFileName] = useState("")
  const [lResult, setLResult] = useState("");
  const [shows,setShows]= useState(false)
  const [re, setRe] = useState(false)
  const [loader, setLoader] = useState(false)
  const [show,setShow] = useState(false)
  const [arrayIp, setArrayIps] = useState([{}])

  const options = [
    'Memory',
    'Processor',
  ];

  // dynamic tailwind classes for title size
  const titleSizeClass = isSubmitted ? 'text-xl' : 'text-3xl';

  const memoryFinder = async()=>{
    setLoader(true)
    setShow(false)
    setArrayIps([{"ip":0, "count":0}])
    try{
      const response = await axios.post("/api/memoryFinder",{partNumber:inputValue, userId:"85oiv2tqz4"});
      let result:any ={}
      if (response.data.success){

          response.data.data.forEach((ip: string | number) =>{
            result[ip] = (result[ip] || 0) + 1
          })

          const ipCountArray = Object.entries(result)
          .map(([ip, count]) => ({ ip, count }))
          .sort((a:any, b:any) => b.count - a.count);

          setArrayIps(ipCountArray)
          setShows(true)
          console.log("data from back", ipCountArray)
      }
      setLoader(false)
    }catch(err){
      console.log(err)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async() => {
      setIsSubmitted(true);
      memoryFinder();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        setFile(e.dataTransfer.files[0]);
        setStatus("File ready to upload.");
      }
    };

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
          
        } else {
          setStatus("Upload failed.");
        }
      } catch (error) {
        setStatus("Upload error.");
      }
    }  
  
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setFile(e.target.files[0]);
        setStatus("File ready to upload.");
      }
    };

    const handleLMemory = async() =>{
      try{
        const response = await axios.post("/api/memoryLFinder",{partNumber: inputValue, filename:fileName})
        console.log(response.data.data)
        if(response.data.success){
          setLResult(response.data.data)
          setShow(true)
        }
      }catch(err){
        console.log(err)
      }
    }

  // shared input + dropdown + title block
  const InputBlock = (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-2">
        <Avatar src="/iLOlogo.png" sx={{ width: 60, height: 60 }} />
        <h1 className={`font-bold ${titleSizeClass} text-white`}>
          Part number search.
        </h1>
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          className="border border-gray-300 rounded px-4 py-2 w-64"
          placeholder="Enter the part number."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {isSubmitted ? 'Update' : 'Submit'}
      </button>
    </div>
  );

  return (
    <main className="h-screen bg-[#0f3555] p-4">
      {!isSubmitted ? (
        // INITIAL CENTERED VIEW
        <div className="flex h-full items-center justify-center">
          {InputBlock}
        </div>
      ) : (
        // SPLIT VIEW
        <div className="flex h-full">
          {/* LEFT COLUMN (half width) */}
          <div className="w-1/2 flex items-center justify-center">
            {InputBlock}
          </div>

          {/* RIGHT COLUMN (half width) */}
          <div className="w-1/2 flex flex-col p-4 space-y-4">
            <div className="h-1/2 bg-white rounded shadow p-4 overflow-auto">
              <h2 className="font-semibold mb-2">Result</h2>
              <p><strong>Entered part number:</strong> {inputValue || '—'}</p>
              {
                shows &&
                (arrayIp.length>0 && <p><strong>Found in below SUTs</strong></p> ||
                  arrayIp.length==0 && <p><strong> Not Found in any SUT</strong></p>)
              }
              {loader && <FiLoader size={40} />}
              {shows && arrayIp.map((item:any) => (
                   <li key={item.ip}>{item.ip} - {item.count} quantity</li>
                ))}
            </div>
      

            {/* Bottom Half: Drag & Drop */}
            { !removeFileUploader &&  <div style={styles.rightPane}>
              <div style={styles.centerContent}>
                <div
                  style={styles.dragBox}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  color='white'
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
                <Button onClick={() => document.getElementById("fileInput")?.click()} sx={{color: 'white'}}>
                  Choose File
                </Button>

                {file && (
                  <Button onClick={() => {uploadFile(file)}} sx={{color: 'white'}}>
                    📤 Upload File
                  </Button>
                )}

                <p className="text-white">{status}</p>
              </div>
            </div>}
            {
              !re && removeFileUploader && <h1>
                <Button onClick={handleLMemory} variant='outlined' sx={{color: 'white'}}>Ready to scan local Inventory ?</Button>
              </h1>
            }
            {
              show && (lResult != "" ? <><h1 className='text-white'>Found in Local Inventory </h1> <div className='text-white '>{inputValue} {"-->"} {lResult}</div></> : <h1 className='text-white'>Oops! not there</h1>)
            }
          </div>
        </div>
      )}
    </main>
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
    borderRight: "2px solid white",
  },
  rightPane: {
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    marginBottom: "15px",
    textAlign: "center",
  },
  dragBox: {
    width: "357px",
    height: "200px",
    color:"white",
    border: "2px dashed white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginBottom: "20px",
    marginLeft: "60px",
    padding: "10px",
  },
  nextButton: {
    position: "absolute",
    bottom: "20px",
    right: "20px",
  },
  chooseButton: {
    marginLeft: "20px"
  }
};
