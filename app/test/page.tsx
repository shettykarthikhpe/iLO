"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import StatusCard from "../Product/StatusCards";
import SummaryCard from "../Components/statusCard";
import ProcessorCard from "../Components/processorCard";
import MemoryCard from "../Components/memoryCard";
import DeviceCard from "../Components/deviceCard";
import NetworkSummaryCard from "../Components/networkCard";


const dummy = () =>{
    const [processor, setProcessor] = useState();
    const [summary, setSummary] = useState([]);
    const [device, setDevice] = useState();
    const [memory, setMemory] = useState();
    const [ploading, setPLoading] = useState(false)
    const [sloading, setSLoading] = useState(false)
    const [dloading, setDLoading] = useState(false)
    const [mloading, setMLoading] = useState(false)
    const [nloading, setNLoading] = useState(false)
    const [network, setNetwork] = useState();


  const deviceFetcher =async() =>{
    try{
      setDLoading(false)
      const response = await axios.post("/api/device");
      setDevice(response.data.data)
      setDLoading(true)
    }catch(err){
      setDLoading(false)
      console.log(err)
    }
  }

  const networkFetcher =async() =>{
    try{
      setNLoading(false)
      const response = await axios.post("/api/network");
      setNetwork(response.data.data)
      setNLoading(true)
    }catch(err){
      setNLoading(false)
      console.log(err)
    }
  }

  const memoryFetcher =async() =>{
    try{
      setMLoading(false)
      const response = await axios.post("/api/memory");
      setMemory(response.data.data)
      setMLoading(true)
    }catch(err){
      setMLoading(false)
      console.log(err)
    }
  }

  const processorFetcher =async() =>{
    try{
      setPLoading(false)
      const response = await axios.post("/api/processor");
      setProcessor(response.data.data)
      setPLoading(true)
    }catch(err){
      setPLoading(false)
      console.log(err)
    }
  }

  const summaryFetcher =async() =>{
    try{
      setSLoading(false)
      const response = await axios.post("/api/summary");
      setSummary(response.data.data)
      setSLoading(true)
    }catch(err){
      setSLoading(false)
      console.log(err)
    }
  }
  useEffect(()=>{
    processorFetcher()
    deviceFetcher()
    summaryFetcher()
    memoryFetcher()
    networkFetcher();
  },[])

    return(
        <>
        { sloading && summary && <SummaryCard data={summary} /> }
        { mloading && memory && <MemoryCard data={memory} /> }
        { dloading && device && <DeviceCard data={device} />}
        { ploading && processor &&  <ProcessorCard data={processor} /> }
        {nloading && network && <NetworkSummaryCard />}
        </>
    )
}

export default dummy;