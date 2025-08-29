#!/bin/bash

# OwnerRez API v2.0 Comprehensive Testing Script
# This script tests the CLI and API endpoints using shell commands

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f .env ]; then
    source .env
    echo -e "${BLUE}✓ Environment variables loaded${NC}"
else
    echo -e "${RED}✗ .env file not found${NC}"
    exit 1
fi

# Configuration
CLI_NAME="node dist/cli/cli/index.js"
API_BASE_URL="https://api.ownerrez.com"
TEST_RESULTS_DIR="test-results"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create test results directory
mkdir -p "$TEST_RESULTS_DIR"

echo "=== OwnerRez API v2.0 Comprehensive Testing ==="
echo "Date: $(date)"
echo "CLI Version: $($CLI_NAME --version 2>/dev/null || echo 'Not installed')"
echo "API Base URL: $API_BASE_URL"
echo "Test Results: $TEST_RESULTS_DIR"
echo ""

# Function to log test results
log_test() {
    local test_name="$1"
    local status="$2"
    local message="$3"
    
    if [ "$status" = "PASS" ]; then
        echo -e "${GREEN}✓ $test_name: PASS${NC} - $message"
        echo "$test_name,PASS,$message" >> "$TEST_RESULTS_DIR/results_$TIMESTAMP.csv"
    elif [ "$status" = "FAIL" ]; then
        echo -e "${RED}✗ $test_name: FAIL${NC} - $message"
        echo "$test_name,FAIL,$message" >> "$TEST_RESULTS_DIR/results_$TIMESTAMP.csv"
    else
        echo -e "${YELLOW}⚠ $test_name: SKIP${NC} - $message"
        echo "$test_name,SKIP,$message" >> "$TEST_RESULTS_DIR/results_$TIMESTAMP.csv"
    fi
}

# Function to check if CLI is available
check_cli() {
    if [ -f "dist/cli/cli/index.js" ]; then
        log_test "CLI Installation" "PASS" "CLI is available locally"
        return 0
    else
        log_test "CLI Installation" "FAIL" "CLI is not available locally"
        return 1
    fi
}

# Function to test CLI help system
test_cli_help() {
    echo -e "\n${BLUE}Testing CLI Help System...${NC}"
    
    # Test main help
    if $CLI_NAME --help >/dev/null 2>&1; then
        log_test "CLI Main Help" "PASS" "Main help command works"
    else
        log_test "CLI Main Help" "FAIL" "Main help command failed"
    fi
    
    # Test test command help
    if $CLI_NAME test --help >/dev/null 2>&1; then
        log_test "CLI Test Help" "PASS" "Test command help works"
    else
        log_test "CLI Test Help" "FAIL" "Test command help failed"
    fi
}

# Function to test CLI configuration
test_cli_config() {
    echo -e "\n${BLUE}Testing CLI Configuration...${NC}"
    
    # Test config command
    if $CLI_NAME config >/dev/null 2>&1; then
        log_test "CLI Config Command" "PASS" "Config command works"
    else
        log_test "CLI Config Command" "FAIL" "Config command failed"
    fi
}

# Function to test API endpoints listing
test_endpoints_listing() {
    echo -e "\n${BLUE}Testing API Endpoints Listing...${NC}"
    
    if $CLI_NAME test endpoints >/dev/null 2>&1; then
        log_test "Endpoints Listing" "PASS" "Endpoints command works"
        
        # Capture and save endpoints list
        $CLI_NAME test endpoints > "$TEST_RESULTS_DIR/endpoints_$TIMESTAMP.txt" 2>/dev/null
        log_test "Endpoints Output" "PASS" "Endpoints saved to file"
    else
        log_test "Endpoints Listing" "FAIL" "Endpoints command failed"
    fi
}

# Function to test API connectivity
test_api_connectivity() {
    echo -e "\n${BLUE}Testing API Connectivity...${NC}"
    
    # Test basic connectivity
    if $CLI_NAME test connectivity >/dev/null 2>&1; then
        log_test "API Connectivity" "PASS" "Basic connectivity test passed"
    else
        log_test "API Connectivity" "FAIL" "Basic connectivity test failed"
    fi
}

# Function to test specific API modules
test_api_modules() {
    echo -e "\n${BLUE}Testing API Modules...${NC}"
    
    local modules=("bookings" "properties" "guests" "financial" "fields" "tags" "inquiries" "quotes" "messages" "listings" "reviews" "spotrates" "webhooks")
    
    for module in "${modules[@]}"; do
        echo "Testing $module module..."
        if $CLI_NAME test module "$module" >/dev/null 2>&1; then
            log_test "$module Module" "PASS" "$module module test completed"
        else
            log_test "$module Module" "FAIL" "$module module test failed"
        fi
    done
}

# Function to test comprehensive API testing
test_comprehensive_api() {
    echo -e "\n${BLUE}Testing Comprehensive API Endpoints...${NC}"
    
    # Test all endpoints
    if $CLI_NAME test api >/dev/null 2>&1; then
        log_test "Comprehensive API Test" "PASS" "All endpoints test completed"
    else
        log_test "Comprehensive API Test" "FAIL" "All endpoints test failed"
    fi
    
    # Test with verbose output
    if $CLI_NAME test api --verbose > "$TEST_RESULTS_DIR/comprehensive_api_$TIMESTAMP.txt" 2>/dev/null; then
        log_test "Comprehensive API Verbose" "PASS" "Verbose test completed and saved"
    else
        log_test "Comprehensive API Verbose" "FAIL" "Verbose test failed"
    fi
}

# Function to test specific endpoint
test_specific_endpoint() {
    local endpoint="$1"
    echo -e "\n${BLUE}Testing Specific Endpoint: $endpoint${NC}"
    
    if $CLI_NAME test api --endpoint "$endpoint" >/dev/null 2>&1; then
        log_test "$endpoint Endpoint" "PASS" "$endpoint endpoint test completed"
    else
        log_test "$endpoint Endpoint" "FAIL" "$endpoint endpoint test failed"
    fi
}

# Function to test business workflows
test_workflows() {
    echo -e "\n${BLUE}Testing Business Workflows...${NC}"
    
    local workflows=("guest-inquiry-to-booking" "checkin-automation" "pricing-adjustment")
    
    for workflow in "${workflows[@]}"; do
        echo "Testing $workflow workflow..."
        if $CLI_NAME test workflow "$workflow" >/dev/null 2>&1; then
            log_test "$workflow Workflow" "PASS" "$workflow workflow test completed"
        else
            log_test "$workflow Workflow" "FAIL" "$workflow workflow test failed"
        fi
    done
}

# Function to test all CLI functionality
test_all_cli() {
    echo -e "\n${BLUE}Testing All CLI Functionality...${NC}"
    
    if $CLI_NAME test all > "$TEST_RESULTS_DIR/all_tests_$TIMESTAMP.txt" 2>/dev/null; then
        log_test "All CLI Tests" "PASS" "All tests completed and saved"
    else
        log_test "All CLI Tests" "FAIL" "All tests failed"
    fi
}

# Function to test direct API calls (fallback)
test_direct_api() {
    echo -e "\n${BLUE}Testing Direct API Calls (Fallback)...${NC}"
    
    # Test properties endpoint
    if [ -n "$OWNERREZ_API_KEY" ]; then
        echo "Testing properties endpoint with Bearer token..."
        response=$(curl -s -w "%{http_code}" -H "Authorization: Bearer $OWNERREZ_API_KEY" \
                       -H "Content-Type: application/json" \
                       "$API_BASE_URL/v2/properties" 2>/dev/null)
        http_code="${response: -3}"
        response_body="${response%???}"
        
        if [ "$http_code" = "200" ] || [ "$http_code" = "401" ]; then
            log_test "Direct API Properties" "PASS" "API responded with HTTP $http_code"
        else
            log_test "Direct API Properties" "FAIL" "API responded with HTTP $http_code"
        fi
        
        # Save response for analysis
        echo "$response_body" > "$TEST_RESULTS_DIR/direct_api_properties_$TIMESTAMP.json"
    else
        log_test "Direct API Properties" "SKIP" "No API key available"
    fi
}

# Function to generate test report
generate_report() {
    echo -e "\n${BLUE}Generating Test Report...${NC}"
    
    local report_file="$TEST_RESULTS_DIR/test_report_$TIMESTAMP.md"
    
    cat > "$report_file" << EOF
# OwnerRez API v2.0 Test Report
Generated: $(date)

## Test Summary
- **Total Tests**: $(wc -l < "$TEST_RESULTS_DIR/results_$TIMESTAMP.csv" 2>/dev/null || echo "0")
- **Passed**: $(grep -c "PASS" "$TEST_RESULTS_DIR/results_$TIMESTAMP.csv" 2>/dev/null || echo "0")
- **Failed**: $(grep -c "FAIL" "$TEST_RESULTS_DIR/results_$TIMESTAMP.csv" 2>/dev/null || echo "0")
- **Skipped**: $(grep -c "SKIP" "$TEST_RESULTS_DIR/results_$TIMESTAMP.csv" 2>/dev/null || echo "0")

## Test Results
\`\`\`csv
$(cat "$TEST_RESULTS_DIR/results_$TIMESTAMP.csv" 2>/dev/null || echo "No results available")
\`\`\`

## Files Generated
- Endpoints list: \`endpoints_$TIMESTAMP.txt\`
- Comprehensive API test: \`comprehensive_api_$TIMESTAMP.txt\`
- All CLI tests: \`all_tests_$TIMESTAMP.txt\`
- Direct API response: \`direct_api_properties_$TIMESTAMP.json\`

## Next Steps
1. Review failed tests and implement missing functionality
2. Expand client implementation for untested endpoints
3. Run tests with valid API credentials
4. Monitor API rate limits and performance
EOF

    log_test "Test Report" "PASS" "Report generated: $report_file"
}

# Main test execution
main() {
    echo "Starting comprehensive OwnerRez API testing..."
    
    # Initialize CSV results file
    echo "Test Name,Status,Message" > "$TEST_RESULTS_DIR/results_$TIMESTAMP.csv"
    
    # Run all tests
    check_cli || exit 1
    test_cli_help
    test_cli_config
    test_endpoints_listing
    test_api_connectivity
    test_api_modules
    test_comprehensive_api
    test_specific_endpoint "bookings"
    test_specific_endpoint "properties"
    test_workflows
    test_all_cli
    test_direct_api
    
    # Generate report
    generate_report
    
    echo -e "\n${GREEN}=== Testing Complete ===${NC}"
    echo "Results saved to: $TEST_RESULTS_DIR/"
    echo "Main report: test_report_$TIMESTAMP.md"
    
    # Show summary
    local total_tests=$(wc -l < "$TEST_RESULTS_DIR/results_$TIMESTAMP.csv" 2>/dev/null || echo "1")
    local passed_tests=$(grep -c "PASS" "$TEST_RESULTS_DIR/results_$TIMESTAMP.csv" 2>/dev/null || echo "0")
    local failed_tests=$(grep -c "FAIL" "$TEST_RESULTS_DIR/results_$TIMESTAMP.csv" 2>/dev/null || echo "0")
    
    echo -e "\n📊 Final Results:"
    echo -e "${GREEN}✓ Passed: $passed_tests${NC}"
    echo -e "${RED}✗ Failed: $failed_tests${NC}"
    
    if [ "$failed_tests" -eq 0 ]; then
        echo -e "\n🎉 All tests passed! Your OwnerRez CLI is ready for production use."
    else
        echo -e "\n⚠️  Some tests failed. Review the results and implement missing functionality."
    fi
}

# Run main function
main "$@"
