import requests

def run_test():
    url = "http://localhost:8001/api/chat"
    payload = {
        "message": "Hello, I am testing the HoloKai Orchestrator. Can you confirm you are online?",
        "context": {"user_id": "test_user_1"}
    }
    try:
        response = requests.post(url, json=payload, timeout=30)
        print("Status Code:", response.status_code)
        print("Response JSON:", response.json())
    except Exception as e:
        print("Error connecting to Orchestrator:", e)

if __name__ == "__main__":
    run_test()
