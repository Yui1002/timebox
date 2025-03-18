import pytest;
import requests;
from unittest.mock import patch;

BASE_URL = "http://localhost:3000"

@pytest.fixture
def mock_db():
    with patch('src.repositories.RecordRepo.RecordRepo') as mock_db:
        yield mock_db

def test_getRecordByPeriod(mock_db):
    employer_email = "tvhtialbgalbylukwh@ytnhy.com"
    service_provider_email = 'hgengxlxhcyosafmjr@ytnhy.com'
    start_epoch = 1735968007
    end_epoch = 1735996807

    mock_db.return_value.getrecordByPeriod.return_value = [
        {
            "id": 1,
            "start_time": 1735968007,
            "end_time": 1735996807,
            "status": "active",
            "id_user_transaction": 1
        }
    ]

    response = requests.get(f"{BASE_URL}/getRecordByPeriod", params={
        "employer_email": employer_email,
        "service_provider_email": service_provider_email,
        "start_epoch": start_epoch,
        "end_epoch": end_epoch
    })

    assert response.status_code == 200
    records = response.json()
    assert len(records) == 1
    assert records[0]["id"] == 1
    assert records[0]["start_time"] == 1735968007
    assert records[0]["end_time"] == 1735996807 
    assert records[0]["status"] == "active"
    assert records[0]["id_user_transaction"] == 1

