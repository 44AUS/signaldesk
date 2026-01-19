#!/usr/bin/env python3
"""
SignalDesk AI Backend API Testing Suite
Tests all backend endpoints for the premium trading signal app
"""
import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any, Optional

class SignalDeskAPITester:
    def __init__(self, base_url: str = "https://expo-prop-error.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        
        # Test credentials from the request
        self.test_user = {
            "email": "testuser@signaldesk.ai",
            "password": "testpass123",
            "name": "Test User"
        }

    def log_test(self, name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "response_data": response_data
        })

    def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, 
                    expected_status: int = 200, auth_required: bool = False) -> tuple[bool, Dict]:
        """Make HTTP request and validate response"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=headers, timeout=30)
            else:
                return False, {"error": f"Unsupported method: {method}"}

            success = response.status_code == expected_status
            try:
                response_data = response.json()
            except:
                response_data = {"raw_response": response.text}
            
            if not success:
                print(f"   Status: {response.status_code}, Expected: {expected_status}")
                print(f"   Response: {response_data}")
            
            return success, response_data

        except requests.exceptions.Timeout:
            return False, {"error": "Request timeout"}
        except requests.exceptions.ConnectionError:
            return False, {"error": "Connection error"}
        except Exception as e:
            return False, {"error": str(e)}

    def test_health_check(self):
        """Test /api/health endpoint"""
        success, response = self.make_request('GET', 'health')
        
        if success and response.get('status') == 'healthy':
            self.log_test("Health Check", True, "Backend is healthy")
        else:
            self.log_test("Health Check", False, f"Health check failed: {response}")

    def test_user_registration(self):
        """Test user registration"""
        success, response = self.make_request(
            'POST', 
            'auth/register', 
            self.test_user,
            expected_status=200
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response.get('user', {}).get('user_id')
            self.log_test("User Registration", True, "User registered successfully")
        else:
            self.log_test("User Registration", False, f"Registration failed: {response}")

    def test_user_login(self):
        """Test user login"""
        login_data = {
            "email": self.test_user["email"],
            "password": self.test_user["password"]
        }
        
        success, response = self.make_request(
            'POST', 
            'auth/login', 
            login_data,
            expected_status=200
        )
        
        if success and 'access_token' in response:
            if not self.token:  # Only set if not already set from registration
                self.token = response['access_token']
                self.user_id = response.get('user', {}).get('user_id')
            self.log_test("User Login", True, "Login successful")
        else:
            self.log_test("User Login", False, f"Login failed: {response}")

    def test_get_current_user(self):
        """Test GET /api/auth/me"""
        if not self.token:
            self.log_test("Get Current User", False, "No auth token available")
            return
            
        success, response = self.make_request(
            'GET', 
            'auth/me', 
            auth_required=True
        )
        
        if success and 'user_id' in response:
            self.log_test("Get Current User", True, "User data retrieved successfully")
        else:
            self.log_test("Get Current User", False, f"Failed to get user: {response}")

    def test_generate_ai_signal(self):
        """Test AI signal generation"""
        if not self.token:
            self.log_test("Generate AI Signal", False, "No auth token available")
            return
            
        signal_request = {
            "asset": "BTCUSDT",
            "timeframe": "Intraday"
        }
        
        success, response = self.make_request(
            'POST', 
            'signals/generate', 
            signal_request,
            auth_required=True
        )
        
        if success and 'id' in response and 'signal' in response:
            self.signal_id = response['id']
            self.log_test("Generate AI Signal", True, f"Signal generated: {response['signal']} for {response['asset']}")
        else:
            self.log_test("Generate AI Signal", False, f"Signal generation failed: {response}")

    def test_get_signals_list(self):
        """Test GET /api/signals"""
        if not self.token:
            self.log_test("Get Signals List", False, "No auth token available")
            return
            
        success, response = self.make_request(
            'GET', 
            'signals', 
            auth_required=True
        )
        
        if success and 'signals' in response:
            signal_count = len(response['signals'])
            self.log_test("Get Signals List", True, f"Retrieved {signal_count} signals")
        else:
            self.log_test("Get Signals List", False, f"Failed to get signals: {response}")

    def test_get_dashboard_data(self):
        """Test GET /api/dashboard"""
        if not self.token:
            self.log_test("Get Dashboard Data", False, "No auth token available")
            return
            
        success, response = self.make_request(
            'GET', 
            'dashboard', 
            auth_required=True
        )
        
        if success and 'subscription' in response:
            self.log_test("Get Dashboard Data", True, "Dashboard data retrieved successfully")
        else:
            self.log_test("Get Dashboard Data", False, f"Failed to get dashboard: {response}")

    def test_get_performance_stats(self):
        """Test GET /api/performance"""
        if not self.token:
            self.log_test("Get Performance Stats", False, "No auth token available")
            return
            
        success, response = self.make_request(
            'GET', 
            'performance', 
            auth_required=True
        )
        
        if success and 'total_signals' in response:
            self.log_test("Get Performance Stats", True, f"Performance stats: {response['total_signals']} total signals")
        else:
            self.log_test("Get Performance Stats", False, f"Failed to get performance: {response}")

    def test_get_subscription_status(self):
        """Test GET /api/subscription"""
        if not self.token:
            self.log_test("Get Subscription Status", False, "No auth token available")
            return
            
        success, response = self.make_request(
            'GET', 
            'subscription', 
            auth_required=True
        )
        
        if success and 'is_active' in response:
            is_active = response['is_active']
            plan = response.get('plan', 'unknown')
            self.log_test("Get Subscription Status", True, f"Subscription: {plan} (active: {is_active})")
        else:
            self.log_test("Get Subscription Status", False, f"Failed to get subscription: {response}")

    def test_get_available_assets(self):
        """Test GET /api/assets"""
        success, response = self.make_request('GET', 'assets')
        
        if success and 'assets' in response:
            asset_count = len(response['assets'])
            self.log_test("Get Available Assets", True, f"Retrieved {asset_count} available assets")
        else:
            self.log_test("Get Available Assets", False, f"Failed to get assets: {response}")

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting SignalDesk AI Backend API Tests")
        print(f"📡 Testing backend at: {self.base_url}")
        print("=" * 60)
        
        # Test sequence
        self.test_health_check()
        self.test_user_registration()
        self.test_user_login()
        self.test_get_current_user()
        self.test_generate_ai_signal()
        self.test_get_signals_list()
        self.test_get_dashboard_data()
        self.test_get_performance_stats()
        self.test_get_subscription_status()
        self.test_get_available_assets()
        
        # Print summary
        print("=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed - check logs above")
            return 1

def main():
    """Main test runner"""
    tester = SignalDeskAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())