import pytest
import requests
import random
import string
from datetime import datetime, timedelta
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from test_utils import db_connection, cursor, BASE_URL
from test_helper import generate_random_email, generate_random_string, invalid_email
from user_test import generate_auth_header

@pytest.fixture(scope='module')
def shared_state():
    return {}

test_employer_email = "tvhtialbgalbylukwh@ytnhy.com"
test_service_provider_email = "hgengxlxhcyosafmjr@ytnhy.com"
record_type = ['start', 'end']


def create_record_data(record_date: datetime, record_type: str, record_id: int = None):
    if record_type == "start":
        record_time = datetime(record_date.year, record_date.month, record_date.day, 9, 0).timestamp()
    else:
        record_time = datetime(record_date.year, record_date.month, record_date.day, 17, 0).timestamp()
    
    record_data = {
        "employerEmail": test_employer_email,
        "serviceProviderEmail": test_service_provider_email,
        "recordTime": int(record_time),
        "type": record_type
    }

    if record_id is not None:
        record_data["id"] = record_id

    return record_data

@pytest.mark.parametrize("record_type", ["start", "end"])
def test_set_record(record_type, shared_state):
    
    if record_type == "start":
        record_date = datetime.now() - timedelta(days=random.randint(1, 30))
        record_data = create_record_data(record_date, record_type)
        response = requests.post(f"{BASE_URL}/record", json=record_data)
        assert response.status_code == 200

        id = response.json().get("records")[0].get("id")
        shared_state["record_id"] = id
        shared_state["record_date"] = record_date

    else:
        record_id = shared_state.get("record_id")
        record_date = shared_state["record_date"]

        record_data = create_record_data(record_date, record_type, record_id)
        response = requests.post(f"{BASE_URL}/record", json=record_data)
        assert response.status_code == 200

        # shared_state.clear()

def test_get_record(shared_state):
    response = requests.get(f"{BASE_URL}/record?employerEmail={test_employer_email}&serviceProviderEmail={test_service_provider_email}")
    assert response.status_code == 200
    record_data = response.json()
    assert "records" in record_data

def test_get_record_by_date(shared_state):
    record_date = shared_state.get("record_date")
    date_in_epoch = int(record_date.timestamp())

    response = requests.get(f"{BASE_URL}/record/date?employerEmail={test_employer_email}&serviceProviderEmail={test_service_provider_email}&dateInEpoch={date_in_epoch}")
    assert response.status_code == 200

    # Validate the response
    record_data = response.json()
    assert "records" in record_data
    assert len(record_data["records"]) > 0
    for record in record_data["records"]:
        assert record["employerEmail"] == test_employer_email
        assert record["serviceProviderEmail"] == test_service_provider_email

def test_update_record_by_service_provider(cursor):
    record_data = {
        "recordId": 84,
        "startTime": 1745884859,
        "endTime": 1745920859,
        "updatedBy": "binsvcatootyxegtro@nbmbb.com" #sp
    }

    response = requests.put(f"{BASE_URL}/record", json=record_data, headers=generate_auth_header())
    assert response.status_code == 204

    cursor.execute("SELECT * FROM time_record WHERE time_record_id = %s", (record_data["recordId"],))
    db_record_date = cursor.fetchone()
    assert db_record_date["epoch_start_time"] == record_data["startTime"]
    assert db_record_date["epoch_end_time"] == record_data["endTime"]
    assert db_record_date["update_by"] == record_data["updatedBy"]


