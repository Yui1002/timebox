import pytest
import random
import string

invalid_email = [
    "invalidemail.com", "invalid@.com", "invalid@com", "invalid@com.", "invalid@com..com",
    "invalid@com@com.com", "invalid@com#com.com", "invalid@com!com.com", "invalid@com$com.com",
    "invalid@com%com.com", "invalid@com^com.com", "invalid@com&com.com", "invalid@com*com.com",
    "invalid@com(com.com", "invalid@com)com.com", "invalid@com+com.com", "invalid@com=com.com",
    "invalid@com{com.com", "invalid@com}com.com", "invalid@com[com.com", "invalid@com]com.com",
    "invalid@com|com.com", "invalid@com\\com.com", "invalid@com;com.com", "invalid@com:com.com",
    "invalid@com'com.com", "invalid@com\"com.com", "invalid@com,com.com", "invalid@com<com.com",
    "invalid@com>com.com", "invalid@com/com.com", "invalid@com?com.com", "invalid@com~com.com",
    "invalid@com`com.com"
]

def generate_random_email():
    return f"{generate_random_string(10)}@example.com"

def generate_random_string(length=15):
    letters = string.ascii_letters + string.digits
    return ''.join(random.choice(letters) for i in range(length))

@pytest.fixture(scope='module')
def shared_state():
    return {}