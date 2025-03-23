import pytest
import requests
import random
import string
from dotenv import load_dotenv
import bcrypt
from test_utils import db_connection, cursor, generate_jwt, BASE_URL
from test_helper import generate_random_email, generate_random_string, invalid_email, shared_state

#region generate functions
def generate_random_first_name():
    return generate_random_string(7).capitalize()

def generate_auth_header():
    jwt = generate_jwt()
    return {"Authorization": f"Bearer {jwt}"}

def generate_random_last_name():
    return generate_random_string(10).capitalize()

def generate_random_password():
    password = (
        random.choice(string.ascii_lowercase) +
        random.choice(string.ascii_uppercase) +
        random.choice(string.digits) +
        ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(5))
    )
    return ''.join(random.sample(password, len(password)))

def create_user_data(email=None, password=None, firstName=None, lastName=None):
    if email is None:
        email = generate_random_email()
    if password is None:
        password = generate_random_password()
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
#endregion

#region create variable
invalid_password = [
    "short", "alllowercase1", "ALLUPPERCASE1", "NoNumbers", "12345678", "NoSpecialChar1",
    "NoUppercase123", "nouppercase123", "NOLOWERCASE123", "NoNumbersUppercase"
]
#endregion

#region test set user api 
def test_set_user_happy_path(cursor, shared_state):
    user_data = create_user_data()
    response = requests.post(f"{BASE_URL}/user", json=user_data, headers=generate_auth_header())
    assert response.status_code == 204

    cursor.execute("SELECT * FROM users WHERE email_address = %s", (user_data["email"],))
    db_user_data = cursor.fetchone()
    assert db_user_data["email_address"] == user_data["email"]

    shared_state['user_data'] = user_data

@pytest.mark.parametrize("fieldName", [("firstName"), ("lastName"), ("email"), ("password")])
def test_set_user_missing_params(fieldName):
    user_data = create_user_data()
    del user_data[fieldName]
    response = requests.post(f"{BASE_URL}/user", json=user_data, headers=generate_auth_header())
    assert response.status_code == 400

#endregion

#region test sign in user api
def test_sign_in_user(cursor, shared_state):
    user_data = shared_state.get('user_data')
    if not user_data:
        user_data = create_user_data()
        requests.post(f"{BASE_URL}/user", json=user_data, headers=generate_auth_header())

    sign_in_data = {
        "email": user_data["email"],
        "password": user_data["password"]
    }

    response = requests.post(f"{BASE_URL}/user/signIn", json=sign_in_data, headers=generate_auth_header())
    assert response.status_code == 200

    shared_state['user_data'] = user_data
#endregion

#region test get user api
def test_getUser(cursor, shared_state):
    user_data = shared_state.get('user_data')
    headers = generate_auth_header()
    print("auth headers", headers)
    if not user_data:
        user_data = create_user_data()
        requests.post(f"{BASE_URL}/user", json=user_data, headers=generate_auth_header())

    params = {
        "email": user_data["email"]
    }

    response = requests.get(f"{BASE_URL}/user", params=params, headers=generate_auth_header())

    assert response.status_code == 200
    user_data_response = response.json()
    assert user_data_response["email"] == user_data["email"]

    cursor.execute("SELECT * FROM users WHERE email_address = %s", (user_data["email"],))
    db_user_data = cursor.fetchone()
    assert db_user_data["email_address"] == user_data_response["email"]
#endregion

#region test reset password api
def test_reset_password(cursor, shared_state):
    user_data = shared_state.get('user_data')
    if not user_data:
        user_data = create_user_data()
        requests.post(f"{BASE_URL}/user", json=user_data, headers=generate_auth_header())
    
    new_password = generate_random_string(15)
    reset_password_data = {
        "email": user_data["email"],
        "newPassword": new_password
    }

    response = requests.post(f"{BASE_URL}/user/resetPassword", json=reset_password_data, headers=generate_auth_header())

    assert response.status_code == 204

    cursor.execute("SELECT * FROM users WHERE email_address = %s", (reset_password_data["email"],))
    db_user_data = cursor.fetchone()

    assert bcrypt.checkpw(new_password.encode('utf-8'), db_user_data["password"].encode('utf-8'))

    shared_state['user_data']['password'] = new_password
#endregion

#region test invalid email
@pytest.mark.parametrize("invalid_email", invalid_email)
@pytest.mark.parametrize("endpoint", [
    ("/user", "POST"),
    ("/user/signIn", "POST"),
    ("/user", "GET"),
    ("/user/resetPassword", "POST")
])
def test_api_invalid_email_format(invalid_email, endpoint, shared_state):
    user_data = shared_state.get('user_data')
    if not user_data:
        user_data = create_user_data(email=invalid_email)
        requests.post(f"{BASE_URL}/user", json=user_data, headers=generate_auth_header())
    else:
        user_data["email"] = invalid_email

    url, method = endpoint
    
    match url:
        case "/user":
            match method:
                case "GET":
                    response = requests.get(f"{BASE_URL}/user?email={invalid_email}", headers=generate_auth_header())
                case 'POST':
                    response = requests.post(f"{BASE_URL}/user", json=user_data, headers=generate_auth_header())
        case "/user/signIn":
            params = {
                "email": invalid_email,
                "password": user_data["password"]
            }
            response = requests.post(f"{BASE_URL}/user/signIn", json=params, headers=generate_auth_header())
        case "/user/resetPassword":
            params = {
                "email": invalid_email,
                "newPassword": user_data["password"]
            }
            response = requests.post(f"{BASE_URL}/user/resetPassword", json=params, headers=generate_auth_header())
    assert response.status_code == 400
#endregion

#region test invalid password
@pytest.mark.parametrize("invalid_password", invalid_password)
@pytest.mark.parametrize("endpoint", [
    ("/user", "POST"),
    ("/user/signIn", "POST"),
    ("/user/resetPassword", "POST")
])
def test_api_invalid_password_format(invalid_password, endpoint, shared_state):
    user_data = shared_state.get('user_data')
    if not user_data:
        user_data = create_user_data(email=invalid_password)
        requests.post(f"{BASE_URL}/user", json=user_data, headers=generate_auth_header())
    else:
        user_data["password"] = invalid_password

    url, method = endpoint
    
    match url:
        case "/user":
            response = requests.post(f"{BASE_URL}/user", json=user_data, headers=generate_auth_header())
        case "/user/signIn":
            params = {
                "email": user_data["email"],
                "password": invalid_password
            }
            response = requests.post(f"{BASE_URL}/user/signIn", json=params, headers=generate_auth_header())
        case "/user/resetPassword":
            params = {
                "email": user_data["email"],
                "newPassword": invalid_password
            }
            response = requests.post(f"{BASE_URL}/user/resetPassword", json=params, headers=generate_auth_header())
    assert response.status_code == 400
#endregion