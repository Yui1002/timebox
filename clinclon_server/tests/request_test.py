import json
import requests
from test_utils import BASE_URL
from test_helper import generate_random_email, generate_random_invalid_email, invalid_email
from user_test import generate_auth_header

def test_is_request_valid():
    request_data = {
        "senderEmail": "bqrqcbrxydwbhydvkt@poplk.com",
        "receiverEmail": "xxnxmmrmhscvyrzfdo@nbmbb.com"
    }

    response = requests.get(f"{BASE_URL}/request/eligible", params=request_data, headers=generate_auth_header())
    assert response.status_code == 200

def test_is_request_valid_invalid_email():
    request_data = {
        "senderEmail": generate_random_invalid_email(),
        "receiverEmail": generate_random_invalid_email(),
    }

    response = requests.get(f"{BASE_URL}/request/eligible", params=request_data, headers=generate_auth_header())
    assert response.status_code == 400
    assert json.loads(response.content).get("message") == "Email is invalid"
