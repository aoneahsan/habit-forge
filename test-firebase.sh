#!/bin/bash

TIMESTAMP=$(date +%s)
EMAIL="test${TIMESTAMP}@example.com"

echo "Testing Firebase Auth API..."
echo "Creating account with email: $EMAIL"

RESPONSE=$(curl -s -X POST \
  "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBwzGMeSmBdve0v7WRn3L1eEqe1GHBr4qU" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"TestPass123!\",\"returnSecureToken\":true}")

if echo "$RESPONSE" | grep -q "idToken"; then
  echo "✅ Firebase Auth is working!"
  echo "Account created successfully"
else
  echo "❌ Firebase Auth failed"
  echo "Response: $RESPONSE"
fi