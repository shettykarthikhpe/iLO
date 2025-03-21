from flask import Flask,  request, jsonify
import requests
import redfish
from tabulate import tabulate

app = Flask(__name__)

@app.route('/api/login', methods=['POST'])
def make_req():
    dat = request.json
    data= dat['body']
    url= data['url']
    username= data['username']
    password= data['password']

    # Create a Redfish client object and connect to the API
    client = redfish.redfish_client(base_url=url, username=username, password=password)
    try:
        resp = client.login(auth=redfish.AuthMethod.SESSION)
        print("hey",resp)
        # Perform some tasks using the Redfish API
        response = client.get('/redfish')
        if response.status == 200:
            return jsonify({"message":"Logged in", "success":True})
        else:
            return jsonify({"message": 'Failed to get chassis information', "success":True})
    except Exception as e:
         return jsonify({"message":"Failed to Log in", "success":False})
    

@app.route('/api/table', methods=['GET'])
def table():
    url = 'https://10.132.147.215/'

    # Create a Redfish client object and connect to the API
    client = redfish.redfish_client(base_url=url, username='Administrator', password='GXJYN722')
    
    # Attempt to login with a timeout of 10 seconds
    try:
        client.login(auth=redfish.AuthMethod.SESSION)
        # Perform some tasks using the Redfish API
        response = client.get('/redfish/v1/Chassis/1/Devices/?$expand=.')
        if response.status == 200:
            print('Chassis information:')
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
            return jsonify({"data":[devices, stat, healt, names, fversion, cmpIntStatus, locats, pv]})
        else:
            print('Failed to get chassis information')
        
    except requests.exceptions.Timeout:
        print("Login request timed out after 10 seconds")
    
    # Logout of the API
    client.logout()

if __name__ == '__main__':
    app.run(debug=True)

        