from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import redfish

app = FastAPI()

class User(BaseModel):
    url: str
    username: str
    password: str


# Create an item
@app.post("/login/")
async def login(data: User):
    url = data.url
    username = data.username
    password = data.password
    print(data)
    # Create a Redfish client object and connect to the API
    client = redfish.redfish_client(base_url=url, username=username, password=password)
    try:
        client.login(auth=redfish.AuthMethod.SESSION)
        # Perform some tasks using the Redfish API
        response = client.get('/redfish')
        if response.status == 200:
            return ({"message":"Logged in", "success":True})
        else:
            return ({"message": 'Failed to get chassis information', "success":True})
    except Exception as e:
         return ({"message":"Failed to Log in", "success":False})
     
# endpoint for getting device inventory
@app.post("/device")
def Device(data: User):
    url = data.url
    username = data.username
    password = data.password
    
    # Create a Redfish client object and connect to the API
    client = redfish.redfish_client(base_url=url, username=username, password=password)
    
    # Attempt to login with a timeout of 10 seconds
    try:
        client.login(auth=redfish.AuthMethod.SESSION)
        # Perform some tasks using the Redfish API
        response = client.get('/redfish/v1/Chassis/1/Devices/?$expand=.')
        if response.status == 200:
            # return jsonify(response.dict)
            members = response.dict.get('Members', [])
            if not members:
                print("No data found")
                return
            
            table_data = []
            devices =[]
            stat= []
            healt= []
            names= []
            fversion= []
            cmpIntStatus= []
            locats= []
            pv= []
            
            for member in members:
                device_type= member.get('DeviceType', 'N/A')
                location= member.get('Location', 'N/A')
                name= member.get('Name', 'N/A')
                links= member.get('Links', {})
                pci= links.get('PCISlot', {})
                oid= pci.get('@odata.id', 'N/A')
                
                ver= member.get('FirmwareVersion',{})
                cver= ver.get('Current',{})
                vers= cver.get('VersionString','N/A')
                
                cis= member.get("ComponentIntegrityStatus","N/A")
                prdV= member.get("ProductVersion", "N/A")
                status= member.get('Status',{})
                health= status.get('Health','N/A')
                state= status.get('State','N/A')
                table_data.append([device_type, location, name, health, state, oid])
                devices.append([device_type])
                stat.append([state])
                healt.append([health])
                names.append([name])
                fversion.append([vers])
                cmpIntStatus.append([cis])
                locats.append([location])
                pv.append([prdV])
            # print(tabulate(table_data, headers=['Device Type', 'Location', 'Name', 'Health', 'State', 'Links']))
            return ({"data":[devices, stat, healt, names, fversion, cmpIntStatus, locats, pv]})
        else:
            print('Failed to get chassis information')
    except requests.exceptions.Timeout:
        print("Login request timed out after 10 seconds")


# to fetch memory data
PhysicalMemory= []
MemorySummary= []
@app.post("/Memory")
def Memory(data: User):
    url = data.url
    username = data.username
    password = data.password
    # Create a Redfish client object and connect to the API
    client = redfish.redfish_client(base_url=url, username=username, password=password)
    
    # Attempt to login with a timeout of 10 seconds
    try:
        client.login(auth=redfish.AuthMethod.SESSION)
        # Perform some tasks using the Redfish API
        response = client.get('/redfish/v1/Systems/1/Memory')
        if response.status == 200:
            MemorySummary.append(response.dict['Oem']['Hpe']['MemoryList'])
            dim_status= []
            locator= []
            baseType= []
            databits= []
            frequency= []
            for murl in response.dict['Members']:
                resp= client.get(murl["@odata.id"])
                dim_status.append(resp.dict["Oem"]["Hpe"]["DIMMStatus"])
                baseType.append(resp.dict["Oem"]["Hpe"]["BaseModuleType"])
                databits.append(resp.dict["DataWidthBits"])
                locator.append(resp.dict["DeviceLocator"])
                maxspeed= resp.dict["Oem"]["Hpe"]
                if "MaxOperatingSpeedMTs" in maxspeed:
                    frequency.append(resp.dict["Oem"]["Hpe"]["MaxOperatingSpeedMTs"])
                else:
                    frequency.append("N/A")
            PhysicalMemory.append({"Locator":locator, "Technology":baseType, "Status":dim_status, "Size":databits, "Frequncy":frequency})
        return ({"PM":PhysicalMemory, "MS":MemorySummary})
    except Exception as e:
        return ("error fetching memory")
    
MemberUrl= []
@app.post("/memory")
def Memory(data:User):
    url = data.url
    username = data.username
    password = data.password
    # Create a Redfish client object and connect to the API
    client = redfish.redfish_client(base_url=url, username=username, password=password)
    
    # Attempt to login with a timeout of 10 seconds
    try:
        client.login(auth=redfish.AuthMethod.SESSION)
        # Perform some tasks using the Redfish API
        response = client.get('/redfish/v1/Systems/1/NetworkInterfaces')
        if response.status == 200:
            member= response.dict["Members"]
            for mu in member:
                murl = mu["@odata.id"]
                resp= client.get(murl)
                print (resp.dict['Name'])
            return ("jhel")
    except Exception as e:
        return ({"error":e})
    

Processor= []
@app.post("/processor")
def Processort(data: User):
    url = data.url
    username = data.username
    password = data.password
    # Create a Redfish client object and connect to the API
    client = redfish.redfish_client(base_url=url, username=username, password=password)
    
    # Attempt to login with a timeout of 10 seconds
    try:
        client.login(auth=redfish.AuthMethod.SESSION)
        # Perform some tasks using the Redfish API
        response = client.get('/redfish/v1/Systems/1/Processors/1')
        if response.status == 200:  
            Cache= []
            for cache in response.dict["Oem"]["Hpe"]["Cache"]:
                Cache.append([cache["Location"], cache["Name"], cache["InstalledSizeKB"]])
            
        Processor.append([{"Name":response.dict["Model"], "Status":response.dict["Status"], "Speed":response.dict["Oem"]["Hpe"]["RatedSpeedMHz"], "Core":response.dict["Oem"]["Hpe"]["Characteristics"][1], 
                          "TotalCore": response.dict["TotalCores"], "TotalThreads":response.dict["TotalThreads"],"Cache":Cache}])
        return(Processor)
    except Exception as e:
        return ({"error": e})
    

# @app.post('/test')
# def test(data:User):
#     url = data.url
#     username = data.username
#     password = data.password
#     # Create a Redfish client object and connect to the API
#     client = redfish.redfish_client(base_url=url, username=username, password=password)
    
#     # Attempt to login with a timeout of 10 seconds
#     try:
#         client.login(auth=redfish.AuthMethod.SESSION)
#         # Perform some tasks using the Redfish API
#         response = client.get('/redfish/v1/Chassis/1/NetworkAdapters/')
#         Location= []
#         PhysicalPorts= []
#         FirmwareVersion= []
#         Ports= []
#         Status= []
#         if response.status == 200:
#             for member in response.dict["Members"]:
#                 resp= client.get(member["@odata.id"])
#                 if "Location" in resp.dict:
#                     Location.append(resp.dict["Location"]["PartLocation"]["ServiceLabel"])
#                 else:
#                     Location.append("N/A")
#                     # print(resp.dict["Status"])
                
#                 print(resp.dict["Oem"]["Hpe"]["PhysicalPorts"])
#                 # print(resp.dict["Controllers"]["FirmwarePackageVersion"])
#                 # print(resp.dict["Controllers"]["Ports"])
#         # return (resp.dict)
#             return (response.dict)
#     except Exception as e:
#         return ({"error":e})
   
# Summary         
Other= []            
@app.post('/summary')
def Summary(data:User):
    url = data.url
    username = data.username
    password = data.password
    # print(data.username, data.url)
    # Create a Redfish client object and connect to the API
    client = redfish.redfish_client(base_url=url, username=username, password=password)
    # Attempt to login with a timeout of 10 seconds
    try:
        client.login(auth=redfish.AuthMethod.SESSION)
        # Perform some tasks using the Redfish API
        response = client.get('/redfish/v1/Systems/1')
        if response.status == 200:
            Other.append(response.dict["Oem"]["Hpe"]["AggregateHealthStatus"])
            return ({"Name":response.dict["Name"], "Model":response.dict["Model"], "Other":Other})
    except Exception as e:
        return ({"error": e})
    

 
Memo= []
Storage= []
@app.post("/test")
def test(data:User):
    url = data.url
    username = data.username
    password = data.password
    # Create a Redfish client object and connect to the API
    client = redfish.redfish_client(base_url=url, username=username, password=password)
    # Attempt to login with a timeout of 10 seconds
    try:
        client.login(auth=redfish.AuthMethod.SESSION)
        respo= []
        # Perform some tasks using the Redfish API
        response = client.get('/redfish/v1/Systems/1/Storage/')
        if response.status == 200:
            # location= []
            # media= []
            # mediaType= []
            # capacity= []
            # for murl in response.dict["Members"]:
            #     resp = client.get(murl["@odata.id"])
            #     for mul in resp.dict["Drives"]:
            #         re= client.get(mul["@odata.id"])
            #         location.append(re.dict["PhysicalLocation"]["PartLocation"])
            #         if "PredictedMediaLifeLeftPercent" in re.dict:
            #             media.append(re.dict["PredictedMediaLifeLeftPercent"])
            #         else:
            #             media.append("N/A")
            #         if "MediaType" in re.dict:
            #             mediaType.append(re.dict["MediaType"])
            #         else:
            #             mediaType.append("N/A")
            #         if "CapacityBytes" in re.dict:
            #             capacity.append(re.dict["CapacityBytes"])
            #         else:
            #             capacity.append("N/A")
            # # return ({"Location":location, "MediaLife":media, "MediaType":mediaType, "CapacityBytes":capacity})
            # for murl in response.dict["Members"]:
            #     resp = client.get(murl["@odata.id"])
            #     controllers= resp.dict["Controllers"]
            #     respo.append(controllers)
            # for item in respo:
            #     re= client.get(item["@odata.id"])
            #     Memo.append(re.dict["Members"][0]["@odata.id"])
            # for item in Memo:
            #     respons= client.get(item)
            #     Storage.append({"Model":respons.dict["Model"], "Status":respons.dict["Status"]})
            # return (Storage)
            for murl in response.dict["Members"]:
                resp = client.get(murl["@odata.id"])
                links= []
                for mul in resp.dict["Links"]["Enclosures"]:
                    links.append(mul)
                for item in links:
                    resps= client.get(item["@odata.id"])
                    return(resps.dict)
    except Exception as e:
        return ({"error": e})