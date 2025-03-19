from flask import Flask,  request, jsonify
import requests

app = Flask(__name__)

@app.route('/api/requests', methods=['GET'])
def make_req():
    url = "https://10.132.147.215";
    user_name = "Administrator";
    password = "GXJYN722";
    user_auth = (user_name, password)
    try:
        response = requests.get(url, auth=user_auth, verify=False);
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)


def make_requests():
    url = "https://10.132.147.215";
    user_name = "Administrator";
    password = "GXJYN722";
    user_auth = (user_name, password)
    try:
        response = requests.get(url, auth=user_auth, verify=False);
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500
        