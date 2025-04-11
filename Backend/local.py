# import csv
import pandas as pd
import redfish

# # read specific columns of csv file using Pandas
# filename = "../csv/customers-100.csv"
# df = pd.read_csv(filename)
# data =[] 
# for rows in df:
#     data.append(str(rows))


# datas = [
#     {1, 'hgwbnw', "karthik", "hello", "hpe", "bangalore", "india", "456789", "993848393", "kskk@gmail.com", "12-122-2222", "hello"}
# ]

# # writing to csv file
# with open(filename, 'a') as csvfile:
#     # creating a csv writer object
#     csvwriter = csv.writer(csvfile)

#     # # writing the fields
#     # csvwriter.writerow(datas)

#     # writing the data rows
#     csvwriter.writerows(datas)

import openpyxl
import csv
import os

def file_converter(file_name):
	file_extension = os.path.splitext(file_name)[1]
	file_original_name = os.path.splitext(file_name)[0]
	if(file_extension == '.xlsx'):
		# Load the Excel file
		wb = openpyxl.load_workbook(f'../uploads/{file_original_name}.xlsx')
		sheet = wb.active

		# Open a CSV file to write
		with open(f'../csv/{file_original_name}.csv', 'w', newline="") as f:
			c = csv.writer(f)

			# Write the rows from the Excel sheet to the CSV file
			for row in sheet.iter_rows(values_only=True):
				c.writerow(row)
	else:
		print("proper csv")

# function to geth the drive list
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


filename = "../csv/ilo.csv"
df = pd.read_csv(filename, encoding="ISO-8859-1")

ActualDrives= DriveGetter()

drive_str_no = df[df['Type'].str.lower()=='drive' ]['SR no']

matched = drive_str_no[drive_str_no.isin(ActualDrives)]
print(matched)

# for rows in df:
#     if rows == 'Type':
#         print(df['Type'])
        # for item in df[rows]:
        #     if item == 'Drive':
        # 					print(item)
          
          
          
        # if df[rows][1] == 'Drive':  
    # if df[rows]== 'Drive':
        
# print(df['Type']== 'Drive')
# iterating the rows
# for rows in df:
#     if rows == 'SR no':
#         if df['Type'] == "Drive":
# 			for item in df[rows]:
# 				print(item)
        	# if item in ActualDrives:
            # 		print(df[rows])
