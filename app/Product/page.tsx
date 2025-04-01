

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
    const [processor, setProcessor] = useState();
    const [summary, setSummary] = useState([]);
    const [device, setDevice] = useState();
    const [memory, setMemory] = useState();
    const [storage, setStorage] = useState();
    const [network, setNetwork] = useState();
    const [loading, setLoading] = useState({
        summary: false, processor: false, memory: false,
        device: false, storage: false, network: false
    });

    const fetchData = async (endpoint: string, setter: { (value: SetStateAction<undefined>): void; (value: SetStateAction<undefined>): void; (value: SetStateAction<never[]>): void; (value: SetStateAction<undefined>): void; (value: SetStateAction<undefined>): void; (value: SetStateAction<undefined>): void; (arg0: any): void; }, key: string) => {
        try {
            setLoading(prev => ({ ...prev, [key]: false }));
            const response = await axios.post(`/api/${endpoint}`);
            setter(response.data.data);
            setLoading(prev => ({ ...prev, [key]: true }));
        } catch (err) {
            setLoading(prev => ({ ...prev, [key]: false }));
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData("processor", setProcessor, "processor");
        fetchData("device", setDevice, "device");
        fetchData("summary", setSummary, "summary");
        fetchData("memory", setMemory, "memory");
        fetchData("network", setNetwork, "network");
        fetchData("storage", setStorage, "storage");
    }, []);

    return (
      <>
      <NavBar/>
        <Box sx={{ mt:12, p: 3 }}>
            <Grid container spacing={3}>
                {loading.summary && summary && (
                    <Grid item xs={12} sm={6} md={4}>
                        <SummaryCard data={summary} />
                    </Grid>
                )}
                {loading.memory && memory && (
                    <Grid item xs={12} sm={6} md={4}>
                        <MemoryCard data={memory} />
                    </Grid>
                )}
                {loading.device && device && (
                    <Grid item xs={12} sm={6} md={4}>
                        <DeviceCard data={device} />
                    </Grid>
                )}
                {loading.processor && processor && (
                    <Grid item xs={12} sm={6} md={4}>
                        <ProcessorCard data={processor} />
                    </Grid>
                )}
                {loading.network && network && (
                    <Grid item xs={12} sm={6} md={4}>
                        <NetworkSummaryCard data={network} />
                    </Grid>
                )}
                {loading.storage && storage && (
                    <Grid item xs={12} sm={6} md={4}>
                        <StorageSummaryCard data={storage} />
                    </Grid>
                )}
            </Grid>
        </Box>
      </>
    );
};

export default Product;
