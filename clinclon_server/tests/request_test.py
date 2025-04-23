import pytest;
import requests;
from test_utils import BASE_URL;
from test_helper import generate_random_email, invalid_email;
from user_test import generate_auth_header;

def test_is_request_valid():
    request_data = {
        "senderEmail": "bqrqcbrxydwbhydvkt@poplk.com",
        "receiverEmail": "xxnxmmrmhscvyrzfdo@nbmbb.com"
    }

    response = requests.get(f"{BASE_URL}/request/eligible", params=request_data, headers=generate_auth_header())
    print("response", response.content)
    assert response.status_code == 200

