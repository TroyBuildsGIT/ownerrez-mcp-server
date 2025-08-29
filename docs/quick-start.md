# OwnerRez CLI Quick Start Guide

## 🚀 **Getting Started**

The OwnerRez CLI is a global command-line tool that provides comprehensive control over your short-term rental business through the OwnerRez API v2.0.

---

## 📦 **Installation**

### **Global Installation**
```bash
# Clone the repository
git clone <your-repo-url>
cd Short-Term-Rental-MCP

# Run the global installation script
./install-global.sh

# Verify installation
ownerrez-cli --version
```

### **Manual Installation**
```bash
# Build the CLI
npm run build:cli

# Install globally
npm install -g .

# Verify installation
ownerrez-cli --version
```

---

## ⚙️ **Configuration**

### **Environment Variables**
Create a `.env` file in your project root:
```bash
# OwnerRez API Configuration
OWNERREZ_API_TOKEN=your_api_token_here
OWNERREZ_API_BASE_URL=https://api.ownerrez.com
OWNERREZ_EMAIL=your_email@example.com

# Optional: OAuth Configuration
OWNERREZ_OAUTH_CLIENT_ID=your_oauth_client_id
```

### **Verify Configuration**
```bash
# Check current configuration
ownerrez-cli config

# Test API connectivity
ownerrez-cli test connectivity
```

---

## 🧪 **Testing Your Setup**

### **Quick Health Check**
```bash
# Test basic CLI functionality
ownerrez-cli test all

# Test specific modules
ownerrez-cli test module bookings
ownerrez-cli test module properties
ownerrez-cli test module guests
```

### **Comprehensive API Testing**
```bash
# Test all API endpoints
ownerrez-cli test api

# Test with verbose output
ownerrez-cli test api --verbose

# Test specific endpoint
ownerrez-cli test api --endpoint bookings
```

### **List Available Endpoints**
```bash
# View all available API endpoints
ownerrez-cli test endpoints
```

### **Business Workflow Testing**
```bash
# Test complete workflows
ownerrez-cli test workflow guest-inquiry-to-booking
ownerrez-cli test workflow checkin-automation
ownerrez-cli test workflow pricing-adjustment
```

---

## 🔧 **Shell Testing Integration**

### **Run Comprehensive Shell Tests**
```bash
# Make the test script executable
chmod +x tests/test_ownerrez_api.sh

# Run comprehensive testing
./tests/test_ownerrez_api.sh
```

### **Test Results**
The shell testing script generates:
- **CSV Results**: `test-results/results_TIMESTAMP.csv`
- **Endpoints List**: `test-results/endpoints_TIMESTAMP.txt`
- **Comprehensive API Test**: `test-results/comprehensive_api_TIMESTAMP.txt`
- **Test Report**: `test-results/test_report_TIMESTAMP.md`

---

## 📚 **Available Commands**

### **Core Commands**
```bash
ownerrez-cli --help                    # Show main help
ownerrez-cli config                    # Show configuration
ownerrez-cli test --help               # Show test help
```

### **Testing Commands**
```bash
ownerrez-cli test all                  # Run all tests
ownerrez-cli test api                  # Test all API endpoints
ownerrez-cli test endpoints            # List available endpoints
ownerrez-cli test connectivity         # Test API connectivity
ownerrez-cli test module <module>      # Test specific module
ownerrez-cli test workflow <workflow>  # Test business workflow
```

### **Module Testing**
Available modules:
- `bookings` - Booking management
- `properties` - Property management
- `guests` - Guest management
- `financial` - Financial calculations
- `fields` - Custom fields
- `tags` - Tag management
- `inquiries` - Guest inquiries
- `quotes` - Pricing quotes
- `messages` - Communication
- `listings` - Property listings
- `reviews` - Guest reviews
- `spotrates` - Dynamic pricing
- `webhooks` - Webhook management

---

## 🔍 **API Endpoint Coverage**

The CLI tests all documented OwnerRez API v2.0 endpoints:

### **Core Resources**
- **Bookings**: 4 endpoints (GET, POST, GET by ID, PATCH)
- **Properties**: 2 endpoints (GET list, GET by ID)
- **Guests**: 5 endpoints (GET, POST, GET by ID, PATCH, DELETE)

### **Management Resources**
- **FieldDefinitions**: 5 endpoints (CRUD operations)
- **Fields**: 6 endpoints (CRUD + special operations)
- **Tags**: 5 endpoints (CRUD + special operations)
- **TagDefinitions**: 5 endpoints (CRUD operations)

### **Business Logic**
- **Inquiries**: 2 endpoints (GET list, GET by ID)
- **Quotes**: 2 endpoints (GET list, GET by ID)
- **Messages**: 3 endpoints (GET, POST, GET by ID)
- **SpotRates**: 1 endpoint (PATCH for updates)

### **Content & Search**
- **Listings**: 2 endpoints (GET list, GET by ID)
- **Reviews**: 2 endpoints (GET list, GET by ID)
- **PropertySearch**: 1 endpoint (Advanced search)

### **System Resources**
- **Users**: 1 endpoint (GET current user)
- **WebhookSubscriptions**: 5 endpoints (CRUD + categories)

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **CLI Not Found**
```bash
# Check if CLI is installed globally
which ownerrez-cli

# Reinstall if needed
./install-global.sh
```

#### **Authentication Errors**
```bash
# Check your API token
ownerrez-cli config

# Verify token format and permissions
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.ownerrez.com/v2/properties
```

#### **Module Tests Failing**
```bash
# Run with verbose output for details
ownerrez-cli test module bookings --verbose

# Check specific endpoint
ownerrez-cli test api --endpoint bookings
```

### **Debug Mode**
```bash
# Enable debug output
ownerrez-cli --debug test all

# Check environment variables
env | grep OWNERREZ
```

---

## 📊 **Performance Monitoring**

### **Response Time Targets**
- **API Calls**: < 2 seconds
- **Command Execution**: < 1 second
- **Test Suite**: < 30 seconds

### **Resource Usage**
- **Memory**: < 100MB peak usage
- **CPU**: < 10% during normal operation

---

## 🔄 **Continuous Testing**

### **Daily Testing**
```bash
# Quick health check
ownerrez-cli test connectivity
ownerrez-cli test module bookings
```

### **Weekly Testing**
```bash
# Full test suite
ownerrez-cli test all --verbose
./tests/test_ownerrez_api.sh
```

### **Monthly Testing**
```bash
# Comprehensive testing with all endpoints
ownerrez-cli test api --verbose
# Review test reports in test-results/
```

---

## 📈 **Next Steps**

### **Phase 1: Basic Setup**
1. ✅ Install CLI globally
2. ✅ Configure environment variables
3. ✅ Test basic connectivity
4. ✅ Run module tests

### **Phase 2: API Integration**
1. 🔄 Test all API endpoints
2. 🔄 Implement missing client methods
3. 🔄 Validate business workflows
4. 🔄 Monitor performance

### **Phase 3: Production Use**
1. 🔄 Deploy to production environment
2. 🔄 Set up monitoring and alerting
3. 🔄 Train team members
4. 🔄 Establish testing schedule

---

## 🆘 **Support**

### **Documentation**
- **API Docs**: `docs/api/ownerrez-api-v2.0.md`
- **Test Report**: `docs/api/ownerrez-api-test-report.md`
- **Testing Plan**: `docs/testing/ownerrez-cli-testing-plan.md`

### **Getting Help**
```bash
# Show all available commands
ownerrez-cli --help

# Show test command help
ownerrez-cli test --help

# List available endpoints
ownerrez-cli test endpoints
```

---

## 🎯 **Success Criteria**

Your OwnerRez CLI is ready for production when:
- ✅ All tests pass with >95% success rate
- ✅ API response times meet targets
- ✅ Error handling is robust
- ✅ Documentation is complete
- ✅ Team is trained and comfortable

---

*This quick start guide gets you up and running with comprehensive OwnerRez API testing and business control through the CLI.*
