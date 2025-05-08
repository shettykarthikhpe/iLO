// components/ManualAddIpDialog.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface Props {
 onIpAdded: (ip: string) => void;
 disabled: boolean;
}

export default function ManualAddIpDialog({ onIpAdded, disabled }: Props) {
 const [showModal, setShowModal] = useState(false);
 const [ip, setIp] = useState("");
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");

 const handleAdd = async () => {
 try {
 const token = localStorage.getItem("token");
 if (!token) {
 alert("Not authenticated");
 return;
 }

 const response = await axios.post("/api/addSut", {
 userId: token,
 ip,
 username,
 password,
 });

 if (response.data.success) {
 onIpAdded(ip);
 setShowModal(false);
 setIp("");
 setUsername("");
 setPassword("");
 } else {
 alert("Failed to add IP");
 }
 } catch (error) {
 console.error(error);
 alert("Something went wrong.");
 }
 };

 return (
 <>
 <Button disabled={disabled} onClick={() => setShowModal(true)}>
 Add
 </Button>

 {showModal && (
 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
 <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
 <h2 className="text-xl font-semibold">Add New IP</h2>

 <input
 className="w-full border px-3 py-2 rounded"
 placeholder="IP Address"
 value={ip}
 onChange={(e) => setIp(e.target.value)}
 />
 <input
 className="w-full border px-3 py-2 rounded"
 placeholder="Username"
 value={username}
 onChange={(e) => setUsername(e.target.value)}
 />
 <input
 className="w-full border px-3 py-2 rounded"
 placeholder="Password"
 type="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 />

 <div className="flex justify-end gap-2">
 <Button variant="outline" onClick={() => setShowModal(false)}>
 Cancel
 </Button>
 <Button onClick={handleAdd}>Add</Button>
 </div>
 </div>
 </div>
 )}
 </>
 );
}