from fastapi import FastAPI, HTTPException, File, UploadFile
from pydantic import BaseModel
import requests
import redfish
import openpyxl
import os
import csv
import pandas as pd

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
           
        Processor.append({"Name":response.dict["Model"], "Status":response.dict["Status"], "Speed":response.dict["Oem"]["Hpe"]["RatedSpeedMHz"], "Core":response.dict["Oem"]["Hpe"]["Characteristics"][1],
                          "TotalCore": response.dict["TotalCores"], "TotalThreads":response.dict["TotalThreads"],"Cache":Cache})
        return(Processor)
    except Exception as e:
        return ({"error": e})
   
 
# Network
@app.post('/network')
def test(data:User):
    url = data.url
    username = data.username
    password = data.password
    # Create a Redfish client object and connect to the API
    client = redfish.redfish_client(base_url=url, username=username, password=password)
   
    # Attempt to login with a timeout of 10 seconds
    try:
        client.login(auth=redfish.AuthMethod.SESSION)
        # Perform some tasks using the Redfish API
        response = client.get('/redfish/v1/Chassis/1/NetworkAdapters/')
        Location= []
        PhysicalPorts= []
        FirmwareVersion= []
        Ports= []
        Model= []
        State= []
        Health= []
        if response.status == 200:
            for member in response.dict["Members"]:
                resp= client.get(member["@odata.id"])
                Model.append(resp.dict["Model"])
                if "Location" in resp.dict:
                    Location.append(resp.dict["Location"]["PartLocation"]["ServiceLabel"])
                else:
                    Location.append("N/A")
                if "Controllers" in resp.dict:
                    if "FirmwarePackageVersion" in resp.dict["Controllers"][0]:
                        FirmwareVersion.append(resp.dict["Controllers"][0]["FirmwarePackageVersion"])
                else:
                    FirmwareVersion.append("N/A")
                if "Status" in resp.dict:
                    if "HealthRollup" in resp.dict["Status"]:
                        Health.append(resp.dict['Status']["HealthRollup"])
                    elif "Health" in resp.dict["Status"]:
                        Health.append(resp.dict['Status']["Health"])
                    else:
                        Health.append("N/A")
                    # Status.append(resp.dict['Status'])
                if "Status" in resp.dict:
                    if "State" in resp.dict["Status"]:
                        State.append(resp.dict['Status']["State"])
                    else:
                        State.append("N/A")
                links= []
                # for member in resp.dict["Controllers"][0]["Links"]["Ports"]["@odata.id"]:
                links.append(resp.dict["Controllers"][0]["Links"]["Ports"])
                # for lin in links:
                #     for mu in lin:
                #         resp= client.get(mu['@odata.id'])
                #         return (resp.dict)
            # return(FirmwareVersion)
                # print(resp.dict["Oem"]["Hpe"]["PhysicalPorts"])
                # print(resp.dict["Controllers"]["FirmwarePackageVersion"])
                # print(resp.dict["Controllers"]["Ports"])
        return ([{"Model":Model, "Location":Location, "Firmware":FirmwareVersion, "State":State, "Health":Health}])
    except Exception as e:
        return ({"error":e})
   
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
            # for item in response.dict["Oem"]["Hpe"]["AggregateHealthStatus"]:
            #     return(response.dict["Oem"]["Hpe"]["AggregateHealthStatus"])
            Other.append({"AMS":response.dict["Oem"]["Hpe"]["AggregateHealthStatus"]})
            return ([{"Name":response.dict["Name"], "Model":response.dict["Model"], "Other":Other}])
    except Exception as e:
        return ({"error": e})
   
 
 
Memo= []
Controllers= []
Drives= []
DrivesCount= []
Enclosure= []
ControllerCount= []
@app.post("/storage")
def Storage(data:User):
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
            location= []
            media= []
            mediaType= []
            capacity= []
            for murl in response.dict["Members"]:
                resp = client.get(murl["@odata.id"])
                for mul in resp.dict["Drives"]:
                    re= client.get(mul["@odata.id"])
                    location.append(re.dict["PhysicalLocation"]["PartLocation"])
                    # if "PredictedMediaLifeLeftPercent" in re.dict:
                    #     media.append(re.dict["PredictedMediaLifeLeftPercent"])
                    # else:
                    #     media.append("N/A")
                    # if "MediaType" in re.dict:
                    #     mediaType.append(re.dict["MediaType"])
                    # else:
                    #     mediaType.append("N/A")
                    # if "CapacityBytes" in re.dict:
                    #     capacity.append(re.dict["CapacityBytes"])
                    # else:
                    #     capacity.append("N/A")
                Drives.append({"Location":location, "MediaLife":media, "MediaType":mediaType, "CapacityBytes":capacity})
                # DrivesCount.append({"DriveCount":len(Drives[0]["Location"]), "Status":re.dict['Oem']['Hpe']['DriveStatus']})
            DrivesCount.append(len(Drives[0]["Location"]))
            for murl in response.dict["Members"]:
                resp = client.get(murl["@odata.id"])
                controllers= resp.dict["Controllers"]
                respo.append(controllers)
            for item in respo:
                re= client.get(item["@odata.id"])
                Memo.append(re.dict["Members"][0]["@odata.id"])
            for item in Memo:
                respons= client.get(item)
                Controllers.append({"Model":respons.dict["Model"], "Status":respons.dict["Status"]})  
            ControllerCount.append(len(Controllers))
   
            # return (ControllerCount)
            # for murl in response.dict["Members"]:
            #     resp = client.get(murl["@odata.id"])
            #     # return(resp.dict)
            #     links= []
            #     for mul in resp.dict["Links"]["Enclosures"]:
            #         links.append(mul)
            #     for item in links:
            #         resps= client.get(item["@odata.id"])
            #         Enclosure.append([resps.dict])
            #     return (Enclosure)
            print(ControllerCount)
        return ([{"entity":"Storage Controller", "count":ControllerCount, "health":"OK"}, {"entity":"Drives","count":DrivesCount, "health":"OK"}])
    except Exception as e:
        return ({"error": e})


@app.post("/logout/")
async def logout(data: User):
    url = data.url
    username = data.username
    password = data.password
    
    # Create a Redfish client object and connect to the API
    client = redfish.redfish_client(base_url=url, username=username, password=password)
    try:
        client.login(auth=redfish.AuthMethod.SESSION)
        # Logout of the API
        client.logout()
        return ({"message":"Logged out", "success":True})
    except Exception as e:
         return ({"message":"Failed to Logout", "success":False})

@app.post("/health")
async def Health(data: User):
    url = data.url
    username = data.username
    password = data.password
    # Create a Redfish client object and connect to the API
    client = redfish.redfish_client(base_url=url, username=username, password=password)
    try:
        client.login(auth=redfish.AuthMethod.SESSION)
        # Perform some tasks using the Redfish API
        response = client.get('/redfish/v1/Systems/1')
        if response.status == 200:
            return ([response.dict["Status"]])
        else:
            return ({"message": 'Failed to get health information', "success":True})
    except Exception as e:
         return ({"message":"Failed to get health information", "success":False})
 

@app.post("/test")
async def Test(data: User):
    url = data.url
    username = data.username
    password = data.password
    # Create a Redfish client object and connect to the API
    client = redfish.redfish_client(base_url=url, username=username, password=password)
    try:
        client.login(auth=redfish.AuthMethod.SESSION)
        # Perform some tasks using the Redfish API
        response = client.get('/redfish/v1/Systems/1/Storage/')
        if response.status == 200:
            for murl in response.dict["Members"]:
                resp = client.get(murl["@odata.id"])
                for mul in resp.dict["Drives"]:
                    re= client.get(mul["@odata.id"])
                    print(re.dict['SerialNumber'])
        else:
            return ({"message": 'Failed to get health information', "success":True})
    except Exception as e:
         return ({"message":"Failed to get health information", "success":False})

class File(BaseModel):
    filename:str

def file_converter(file_name):
	file_extension = os.path.splitext(file_name)[1]
	file_original_name = os.path.splitext(file_name)[0]
	if(file_extension == '.xlsx'):
		# Load the Excel file
		wb = openpyxl.load_workbook(f'../uploads/{file_original_name}.xlsx')
		sheet = wb.active

		# Open a CSV file to write
		with open(f'../uploads/{file_original_name}.csv', 'w', newline="") as f:
			c = csv.writer(f)

			# Write the rows from the Excel sheet to the CSV file
			for row in sheet.iter_rows(values_only=True):
				c.writerow(row)
	else:
		print("proper csv")

@app.post("/upload")
def converter(data:File):
    file_name = data.filename
    file_converter(file_name)
    print(file_name)
    
Drives= []
def DriveGetter():
    url = "10.132.147.215"
    username = "Administrator"
    password = "GXJYN722"
    # Create a Redfish client object and connect to the API
    client = redfish.redfish_client(base_url=url, username=username, password=password)
    try:
        client.login(auth=redfish.AuthMethod.SESSION)
        # Perform some tasks using the Redfish API
        response = client.get('/redfish/v1/Systems/1/Storage/')
        if response.status == 200:
            for murl in response.dict["Members"]:
                resp = client.get(murl["@odata.id"])
                for mul in resp.dict["Drives"]:
                    re= client.get(mul["@odata.id"])
                    Drives.append(re.dict['SerialNumber'])
            return ([Drives])
        else:
            return ([])
    except Exception as e:
         return ([])


@app.post("/content")
def getContent(data:File):
    file_original_name = os.path.splitext(data.filename)[0]
    filename = f"../uploads/{file_original_name}.csv"
    df = pd.read_csv(filename, encoding="ISO-8859-1")
    ActualDrives= DriveGetter()
    drive_str_no = df[df['Type'].str.lower()=='drive' ]['SR no']
    matched = drive_str_no[drive_str_no.isin(ActualDrives[0])]
    return ([matched])

class Tester(BaseModel):
    url: str
    username: str
    password: str
    endpoint:str
    partNumber:str
    
DrivesArray= []
DevicesArray= []
@app.post("/tester")
async def Tester(data: Tester):
    url = data.url
    username = data.username
    password = data.password
    endpoint = data.endpoint
    partNumber = data.partNumber
    # Create a Redfish client object and connect to the API
    client = redfish.redfish_client(base_url=url, username=username, password=password)
    try:
        client.login(auth=redfish.AuthMethod.SESSION)
        # Perform some tasks using the Redfish API
        response = client.get(endpoint)
        if response.status == 200:
            return(response.dict)
            try:
                respons = response.dict["Members"]
                DrivesArray.append(respons)
            except e:
                print(e)
            # print(f"array is {DrivesArray}")
        for item in DrivesArray[0]:
            response = client.get(item['@odata.id'])
            if response.status == 200:
                for it in ([response.dict['Oem']['Hpe']['Links']['Devices']]):
                    respo = client.get(it['@odata.id'])
                    if respo.status == 200:
                        for i in (respo.dict['Members']):
                            resp = client.get(i['@odata.id'])
                            if resp.status == 200:
                                if partNumber == resp.dict['PartNumber']:
                                    return (resp.dict)
        else:
            return ({"message": 'Failed to get health information', "success":True})
    except Exception as e:
         return ({"message":"Failed to get health information", "success":False})
 