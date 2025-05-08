// pages/index.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import AddIpDialog from "@/components/ui/addIpDialog";
import axios from "axios";

const HomePage = () => {
  const [ips, setIps] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchIps = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.post("/api/getSut", {
          userId: token,
        });

        if (response.data.success) {
          const ipList = response.data.data.sut.map((item: any) => item.ip);
          setIps(ipList);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchIps();
  }, []);

  const handleRemoveIp = async (index: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const ipToRemove = ips[index];
      const response = await axios.post("/api/removeSut", {
        userId: token,
        ip: ipToRemove,
      });

      if (response.data.success) {
        const updatedIps = ips.filter((_, i) => i !== index);
        setIps(updatedIps);
      } else {
        alert("Failed to remove IP.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while removing the IP.");
    }
  };

  const handleIpAdded = (newIp: string) => {
    setIps((prevIps) => [...prevIps, newIp]);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f3555] px-4">
      <Card className="w-full max-w-xl p-6 border-muted shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold">Manage IP Addresses</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {ips.map((ip, index) => (
              <li
                key={index}
                className="flex items-center justify-between px-3 py-2 border rounded text-muted-foreground bg-muted"
              >
                <span className="text-sm">{ip}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveIp(index)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </li>
            ))}
          </ul>

          <div className="flex gap-2">
            <AddIpDialog onIpAdded={handleIpAdded} disabled={ips.length >= 5} />
          </div>

          <div className="flex justify-center gap-4 pt-6">
            <Button variant="secondary" onClick={() => router.push("/iplist")}>
              Sut Details
            </Button>
            <Button onClick={() => router.push("/partNo")}>
              Part No Search
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default HomePage;
