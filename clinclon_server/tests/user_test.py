import pytest
import requests
import psycopg2
import random
import string
import time
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import os
import pdb
import bcrypt

load_dotenv()

BASE_URL = "http://localhost:3000"
def is_server_running():
    try:
        response = requests.get(f"{BASE_URL}")
        return response.status_code == 200
    except requests.ConnectionError:
        return False

@pytest.fixture(scope='module')
def db_connection():

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

@pytest.fixture(scope='module')
def shared_state():
    return {}

def generate_random_email():
    return f"{generate_random_string(10)}@example.com"

def generate_random_string(length=15):
    letters = string.ascii_letters + string.digits
    return ''.join(random.choice(letters) for i in range(length))

def generate_random_first_name():
    return generate_random_string(7).capitalize()

def generate_random_last_name():
    return generate_random_string(10).capitalize()

def create_user_data(email=None, password=None, firstName=None, lastName=None):
    if email is None:
        email = generate_random_email()
    if password is None:
        password = generate_random_string(15)
    if firstName is None:
        firstName = generate_random_first_name()
    if lastName is None:
        lastName = generate_random_last_name()
    return {
        "email": email,
        "password": password,
        "firstName": firstName,
        "lastName": lastName
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
    assert response.status_code == 204

    # Verify the database state
    cursor.execute("SELECT * FROM users WHERE email_address = %s", (user_data["email"],))
    db_user_data = cursor.fetchone()
    assert db_user_data["email_address"] == user_data["email"]

    # Store user data in shared state
    shared_state['user_data'] = user_data

def test_signInUser(cursor, shared_state):

    user_data = shared_state.get('user_data')
    if not user_data:
        user_data = create_user_data()
        requests.post(f"{BASE_URL}/user", json=user_data)

    sign_in_data = {
        "email": user_data["email"],
        "password": user_data["password"]
    }

    response = requests.post(f"{BASE_URL}/user/signIn", json=sign_in_data)

    assert response.status_code == 200
    sign_in_response = response.json()
    assert sign_in_response["email"] == user_data["email"]

    shared_state['user_data'] = user_data

def test_getUser(cursor, shared_state):

    user_data = shared_state.get('user_data')
    if not user_data:
        user_data = create_user_data()
        requests.post(f"{BASE_URL}/user", json=user_data)

    params = {
        "email": user_data["email"]
    }

    response = requests.get(f"{BASE_URL}/user", params=params)

    assert response.status_code == 200
    user_data_response = response.json()
    assert user_data_response["email"] == user_data["email"]

    cursor.execute("SELECT * FROM users WHERE email_address = %s", (user_data["email"],))
    db_user_data = cursor.fetchone()
    assert db_user_data["email_address"] == user_data_response["email"]

def test_resetPassword(cursor, shared_state):
    user_data = shared_state.get('user_data')
    if not user_data:
        user_data = create_user_data()
        requests.post(f"{BASE_URL}/user", json=user_data)
    
    new_password = generate_random_string(15)
    reset_password_data = {
        "email": user_data["email"],
        "newPassword": new_password
    }

    response = requests.post(f"{BASE_URL}/user/resetPassword", json=reset_password_data)

    assert response.status_code == 204

    cursor.execute("SELECT * FROM users WHERE email_address = %s", (reset_password_data["email"],))
    db_user_data = cursor.fetchone()

    assert bcrypt.checkpw(new_password.encode('utf-8'), db_user_data["password"].encode('utf-8'))

    shared_state['user_data']['password'] = new_password


