import json
from flask import Flask, jsonify
from flask import request as R
from urllib import request, parse
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/fetchDataWater", methods=["POST", "GET"])
def fetch_data_water():
    data = R.get_json()
    regNo = data.get('RRNo')
    print("Reg num: ", regNo)
    apiUrl = "https://koneapi.cmsuat.co.in:3443/KarnatakaMobileOne/api/1.1/WaterBoard/WaterBoardDetails"
    data = parse.urlencode(
        {
            "RRNo": regNo,
            "SubDivisionID": "",
            "DuplicateCheckRequired": "N",
            "CityCode": "BN",
            "ServiceCityId": "97",
            "CityId": 2,
        }
    ).encode()
    req = request.Request(apiUrl, data=data)
    req.add_header("Authorization", "Basic a29uZW1vYjprb25lbW9i")
    req.add_header("auth_userid", "105")
    response = request.urlopen(req).read().decode('utf-8')
    jsonify(response)
    response = json.loads(response)
    return (response)


@app.route("/fetchDataPoliceFine", methods=["POST", "GET"])
def fetch_data_police_fine():
    data = R.get_json()
    regisNum = data.get('regisNum')
    print("Reg num: ", regisNum)
    apiUrl = "https://koneapi.cmsuat.co.in:3443/KarnatakaMobileOne/api/1.1/PoliceCollection/PoliceCollectionFetchDetails"
    data = parse.urlencode(
        {
            "SearchBy": "REGISTERNO",
            "SearchValue": regisNum,
            "ServiceType": "BPS"
        }
    ).encode()
    req = request.Request(apiUrl, data=data)
    req.add_header("Authorization", "Basic a29uZW1vYjprb25lbW9i")
    req.add_header("auth_userid", "105")
    response = request.urlopen(req).read().decode('utf-8')
    jsonify(response)
    response = json.loads(response)
    return (response)


@app.route("/fetchDataRcExtract", methods=["POST", "GET"])
def fetch_data_rc_extract():
    data = R.get_json()
    regNum = data.get('regNum')
    print("Reg num: ", regNum)
    apiUrl = "https://koneapi.cmsuat.co.in:3443/KarnatakaMobileOne/api/1.1/RTOServices/RCExtractFetchDetails"
    data = parse.urlencode(
        {
            "RegNo": regNum,
            "DuplicateCheckRequired": "N",
            "CityCode": "BN",
            "ServiceCityId": "7",
            "CityId": 2
        }
    ).encode()
    req = request.Request(apiUrl, data=data)
    req.add_header("Authorization", "Basic a29uZW1vYjprb25lbW9i")
    req.add_header("auth_userid", "105")
    response = request.urlopen(req).read().decode('utf-8')
    jsonify(response)
    response = json.loads(response)
    return (response)


if __name__ == "__main__":
    app.run(debug=True)
