"use client"
import axios from "axios";
import React from "react";
import https from 'https'

const Page =()=>{
    
    const handleLogin = async() =>{
      const url = "https://10.132.147.210/redfish/v1/Systems"
      const username = "Administrator";
      const password = "SZMJKGN6";
  
      const encoded = btoa(`${username}:${password}`)
  
      const agent = new https.Agent({
        rejectUnauthorized:false
      })
  
        try{
            console.log("started")
            // Make the API call
            const response = await axios.get(url, {
              headers:{
                'Authorization':`Basic ${encoded}`,
                "rejectUnauthorized": false, 
              },
              httpAgent: agent
            });
              console.log("done")
              console.log(response)
        }catch(err){
          console.log("Errror occured while login", err);
        }
      }
    return(
        <div className="bg-white mt-10 m-30">
            <button className="Bg-red" onClick={handleLogin}>button</button>
        </div>
    )
}

export default Page;