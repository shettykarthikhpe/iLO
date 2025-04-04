"use client"
import axios from "axios";
import { SetStateAction, useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import SummaryCard from "../Components/statusCard";
import ProcessorCard from "../Components/processorCard";
import MemoryCard from "../Components/memoryCard";
import DeviceCard from "../Components/deviceCard";
import NetworkSummaryCard from "../Components/networkCard";
import StorageSummaryCard from "../Components/storageCard";
import NavBar from "./Navbar";

const Product = () => {
    const [processor, setProcessor] = useState<any>();
    const [summary, setSummary] = useState<any>([]);
    const [device, setDevice] = useState<any>();
    const [memory, setMemory] = useState<any>();
    const [storage, setStorage] = useState<any>();
    const [network, setNetwork] = useState<any>();
    const [loading, setLoading] = useState({
        summary: false, processor: false, memory: false,
        device: false, storage: false, network: false
    });
    const [ip, setIp] = useState()
    const [username, setUserName] = useState()
    const [password, setPassword] = useState()


    const fetchData = async (endpoint: string, data:{username:string, ip:string, password:string}, setter: { (value: SetStateAction<undefined>): void; (value: SetStateAction<undefined>): void; (value: SetStateAction<never[]>): void; (value: SetStateAction<undefined>): void; (value: SetStateAction<undefined>): void; (value: SetStateAction<undefined>): void; (arg0: any): void; }, key: string) => {
        try {
            setLoading(prev => ({ ...prev, [key]: false }));
            const response = await axios.post(`/api/${endpoint}`,{body:data});
            setter(response.data.data);
            setLoading(prev => ({ ...prev, [key]: true }));
        } catch (err) {
            setLoading(prev => ({ ...prev, [key]: false }));
            console.error(err);
        }
    };

    const UserGetter = async ()=>{
        const token = localStorage.getItem("token") || ""
        try{
            const response = await axios.post("/api/getUser",{
                token:token
            })
            setIp(response.data.data.ip)
            setUserName(response.data.data.username)
            setPassword(response.data.data.password)
        }catch(e){
            console.log(e)
        }
    }

    useEffect(()=>{
        UserGetter();
    },[])

    useEffect(() => {
        processor && username && ip && password && fetchData("processor", {username, ip, password} ,setProcessor, "processor");
        device && username && ip && password && fetchData("device", {username, ip, password}, setDevice, "device");
        summary && username && ip && password && fetchData("summary",{username, ip, password}, setSummary, "summary");
        memory && username && ip && password && fetchData("memory", {username, ip, password}, setMemory, "memory");
        network && username && ip && password && fetchData("network",{username, ip, password},  setNetwork, "network");
        storage && username && ip && password && fetchData("storage",{username, ip, password},  setStorage, "storage");
    }, [username, ip, password]);

    return (
      <>
      <NavBar/>
        <Box sx={{ mt:12, p: 3, width: "100%", overflowX: "hidden" }}>
            <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                {loading.summary && summary && (
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                        <SummaryCard data={summary} />
                    </Grid>
                )}
                {loading.memory && memory && (
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                        <MemoryCard data={memory} />
                    </Grid>
                )}
                {loading.device && device && (
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                        <DeviceCard data={device} />
                    </Grid>
                )}
                {loading.processor && processor && (
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                        <ProcessorCard data={processor} />
                    </Grid>
                )}
                {loading.network && network && (
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                        <NetworkSummaryCard rawData={network} />
                    </Grid>
                )}
                {loading.storage && storage && (
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                        <StorageSummaryCard data={storage} />
                    </Grid>
                )}
            </Grid>
        </Box>
      </>
    );
};

export default Product;
