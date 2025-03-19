import redfish
import requests
 
url = 'https://10.132.147.215/'
 
 
# Create a Redfish client object and connect to the API
client = redfish.redfish_client(base_url=url, username='Administrator', password='GXJYN722')
 
# Attempt to login with a timeout of 10 seconds
try:
    client.login(auth=redfish.AuthMethod.SESSION)
except requests.exceptions.Timeout:
    print("Login request timed out after 10 seconds")
 
# Perform some tasks using the Redfish API
response = client.get('/redfish/v1/Chassis')
if response.status == 200:
    print('Chassis information:')
    print(response.dict)
else:
    print('Failed to get chassis information')
 
# Logout of the API
client.logout()