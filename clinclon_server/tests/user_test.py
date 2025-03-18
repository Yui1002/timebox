import pytest
import requests
import psycopg2
import random
import string
import time
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv(dotenv_path='../.env')

BASE_URL = "http://localhost:3000"  # Replace with your API base URL

def is_server_running():
    try:
        response = requests.get(f"{BASE_URL}")  # Assuming there's a health check endpoint
        return response.status_code == 200
    except requests.ConnectionError:
        return False

@pytest.fixture(scope='module')
def db_connection():
    # Set up the database connection using environment variables
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
    # Set up the cursor
    cur = db_connection.cursor(cursor_factory=RealDictCursor)
    yield cur
    cur.close()

@pytest.fixture(scope='module')
def shared_state():
    return {}

def generate_random_email():
    return f"{generate_random_string(10)}@example.com"

def generate_random_string(length=15):
    letters = string.ascii_letters + string.digits
    return ''.join(random.choice(letters) for i in range(length))

def create_user_data(email=None, password=None):
    if email is None:
        email = generate_random_email()
    if password is None:
        password = generate_random_string(15)
    return {
        "email": email,
        "password": password
    }

@pytest.fixture(scope='module', autouse=True)
def ensure_server_running():
    # Wait for the server to start
    for _ in range(10):
        if is_server_running():
            return
        time.sleep(1)
    pytest.fail("Node.js server is not running")

def test_setUser(cursor, shared_state):
    # Create user data
    user_data = create_user_data()

    # Call the API
    response = requests.post(f"{BASE_URL}/user", json=user_data)

    # Verify the response
    assert response.status_code == 200

    # Verify the database state
    cursor.execute("SELECT * FROM users WHERE email = %s", (user_data["email"],))
    db_user_data = cursor.fetchone()
    assert db_user_data["email"] == user_data["email"]

    # Store user data in shared state
    shared_state['user_data'] = user_data

def test_signInUser(cursor, shared_state):
    # Use existing user data or create new if not available
    user_data = shared_state.get('user_data')
    if not user_data:
        user_data = create_user_data()
        requests.post(f"{BASE_URL}/user", json=user_data)

    # Call the sign-in API
    response = requests.post(f"{BASE_URL}/user/signIn", json=user_data)

    # Verify the response
    assert response.status_code == 200
    sign_in_data = response.json()
    assert sign_in_data["email"] == user_data["email"]

    # Store user data in shared state
    shared_state['user_data'] = user_data

def test_getUser(cursor, shared_state):
    # Use existing user data or create new if not available
    user_data = shared_state.get('user_data')
    if not user_data:
        user_data = create_user_data()
        requests.post(f"{BASE_URL}/user", json=user_data)

    # Define the input parameters
    params = {
        "user_id": 1  # Assuming user_id is 1 for simplicity
    }

    # Call the API
    response = requests.get(f"{BASE_URL}/user", params=params)

    # Verify the response
    assert response.status_code == 200
    user_data_response = response.json()
    assert user_data_response["id"] == 1

    # Verify the database state
    cursor.execute("SELECT * FROM users WHERE id = %s", (1,))
    db_user_data = cursor.fetchone()
    assert db_user_data["id"] == 1
    assert db_user_data["email"] == user_data_response["email"]

def test_resetPassword(cursor, shared_state):
    # Use existing user data or create new if not available
    user_data = shared_state.get('user_data')
    if not user_data:
        user_data = create_user_data()
        requests.post(f"{BASE_URL}/user", json=user_data)

    # Define the reset password data
    reset_password_data = {
        "email": user_data["email"],
        "new_password": generate_random_string(15)
    }

    # Call the reset password API
    response = requests.post(f"{BASE_URL}/user/resetPassword", json=reset_password_data)

    # Verify the response
    assert response.status_code == 200

    # Verify the database state
    cursor.execute("SELECT * FROM users WHERE email = %s", (reset_password_data["email"],))
    db_user_data = cursor.fetchone()
    assert db_user_data["password"] == reset_password_data["new_password"]  # Assuming the password is stored in plain text (not recommended)

    # Update user data in shared state
    shared_state['user_data']['password'] = reset_password_data["new_password"]