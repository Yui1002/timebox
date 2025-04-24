import pytest
import json
import random
import requests
from test_utils import BASE_URL
from test_helper import generate_random_invalid_email, invalid_email
from user_test import generate_auth_header

@pytest.fixture(scope="module")
def shared_state():
    state = {}
    request_data = create_request_data()
    response = requests.post(f"{BASE_URL}/request", json=request_data, headers=generate_auth_header())
    assert response.status_code == 204
    state['request_data'] = request_data
    return state

def get_valid_users():
    return [
        'john.doe@example.com',
        'jane.smith@example.com',
        'alice.johnson@example.com',
        'bob.brown@example.com',
        'charlie.davis@example.com'
    ]

def generate_random_schedule():
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    times = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]

    # Generate two random schedules
    schedule_1 = {
        "day": random.choice(days),
        "startTime": random.choice(times),
        "endTime": random.choice(times),
    }
    schedule_2 = {
        "day": random.choice(days),
        "startTime": random.choice(times),
        "endTime": random.choice(times),
    }

    return [schedule_1, schedule_2]

def create_request_data(senderEmail=None, receiverEmail=None, rate=None, rateType=None, schedule=None, mode=None):
    valid_users = get_valid_users()

    if senderEmail is None or receiverEmail is None:
        senderEmail, receiverEmail = random.sample(valid_users, 2)
    if rate is None:
        rate = 90
    if rateType is None:
        rateType = 'hourly'
    if schedule is None:
        schedule = generate_random_schedule()
    if mode is None:
        mode = 0

    return {
        "senderEmail": senderEmail,
        "receiverEmail": receiverEmail,
        "rate": rate,
        "rateType": rateType,
        "schedules": schedule,
        "mode": mode
    }

def test_get_request_by_email(shared_state):
    print('shared state', shared_state)
    request_data = shared_state.get('request_data')

    params = {
        "senderEmail": request_data["senderEmail"],
        "receiverEmail": request_data["receiverEmail"]
    }

    response = requests.get(f"{BASE_URL}/request/email", params=params, headers=generate_auth_header())

    assert response.status_code == 200
    request_data_response = response.json()['requests']
    print('request_data_response', request_data_response)

    assert request_data_response["senderEmail"] == request_data["senderEmail"]
    assert request_data_response["receiverEmail"] == request_data["receiverEmail"]

def test_is_request_valid(shared_state):
    request_data = shared_state.get('request_data')

    params = {
        "senderEmail": request_data["senderEmail"],
        "receiverEmail": request_data["receiverEmail"]
    }

    response = requests.get(f"{BASE_URL}/request/eligible", params=params, headers=generate_auth_header())
    assert response.status_code == 200

def test_is_request_valid_invalid_email():
    request_data = {
        "senderEmail": generate_random_invalid_email(),
        "receiverEmail": generate_random_invalid_email(),
    }

    response = requests.get(f"{BASE_URL}/request/eligible", params=request_data, headers=generate_auth_header())
    assert response.status_code == 400
    assert json.loads(response.content).get("message") == "Email is invalid"


