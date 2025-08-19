#!/bin/bash

# Load environment variables
source .env

echo "=== OwnerRez API Test ==="
echo "API Key: ${OWNERREZ_API_KEY:0:10}..."
echo "Email: $OWNERREZ_EMAIL"
echo "Base URL: $OWNERREZ_API_BASE_URL"
echo ""

echo "Testing API endpoints:"
echo "1. Properties endpoint:"
curl -s -H "Authorization: Bearer $OWNERREZ_API_KEY" \
     -H "Content-Type: application/json" \
     "https://app.ownerrez.com/api/properties" | jq '.' 2>/dev/null || echo "Response: $(curl -s -H "Authorization: Bearer $OWNERREZ_API_KEY" -H "Content-Type: application/json" "https://app.ownerrez.com/api/properties")"

echo ""
echo "2. Different auth header:"
curl -s -H "X-API-Key: $OWNERREZ_API_KEY" \
     -H "Content-Type: application/json" \
     "https://app.ownerrez.com/api/properties" | jq '.' 2>/dev/null || echo "Response: $(curl -s -H "X-API-Key: $OWNERREZ_API_KEY" -H "Content-Type: application/json" "https://app.ownerrez.com/api/properties")"

echo ""
echo "3. Check API documentation:"
curl -s "https://www.ownerrez.com/support/articles/api-oauth-app" | grep -i "api\|auth\|token" | head -5
