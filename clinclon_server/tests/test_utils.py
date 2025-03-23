import requests
import psycopg2
import time
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import os
import pytest
import random
import string

load_dotenv()

BASE_URL = "http://localhost:3000"

def is_server_running():
    try:
        response = requests.get(f"{BASE_URL}")
        return response.status_code == 200
    except requests.ConnectionError:
        return False

#region check if server is running
@pytest.fixture(scope='module', autouse=True)
def ensure_server_running():
    # Wait for the server to start
    for _ in range(10):
        if is_server_running():
            return
        time.sleep(1)
    pytest.fail("Node.js server is not running")
#endregion

@pytest.fixture(scope='module', autouse=True)
def db_connection():
    # Ensure the server is running
    for _ in range(10):
        if is_server_running():
            break
        time.sleep(1)
    else:
        pytest.fail("Node.js server is not running")

    # Establish database connection
    conn = psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )
    yield conn
    conn.close()

@pytest.fixture
def cursor(db_connection):
    cur = db_connection.cursor(cursor_factory=RealDictCursor)
    yield cur
    cur.close()
