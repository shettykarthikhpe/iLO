"use client";

import { useState, DragEvent, ChangeEvent } from "react";

export default function Home() {
const [status, setStatus] = useState<string>("");
const [filePath, setFilePath] = useState<string>("");

const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
e.preventDefault();
};

const handleDrop = (e: DragEvent<HTMLDivElement>) => {
e.preventDefault();
if (e.dataTransfer.files.length > 0) {
uploadFile(e.dataTransfer.files[0]);
}
};

const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
if (e.target.files && e.target.files.length > 0) {
uploadFile(e.target.files[0]);
}
};

const uploadFile = async (file: File) => {
const formData = new FormData();
formData.append("file", file);

try {
const response = await fetch("/api/upload", {
method: "POST",
body: formData,
});

const data = await response.json();
if (response.ok) {
setStatus("File uploaded successfully!");
setFilePath(data.path);
} else {
setStatus("Upload failed.");
}
} catch (error) {
setStatus("Upload error.");
}
};

return (
<div style={styles.container}>
<div
style={styles.dragBox}
onDragOver={handleDragOver}
onDrop={handleDrop}
>
Drag & Drop your file here
</div>

<input
type="file"
id="fileInput"
hidden
accept=".csv, .xlsx"
onChange={handleFileChange}
/>
<button onClick={() => document.getElementById("fileInput")?.click()}>
Choose File
</button>

<p>{status}</p>
{filePath && <p>Saved at: <strong>{filePath}</strong></p>}
</div>
);
}

// Styles
const styles: { [key: string]: React.CSSProperties } = {
container: {
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
height: "100vh",
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
},
};