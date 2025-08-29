# OwnerRez CLI Testing Plan

## 🎯 **Testing Overview**

This document outlines a comprehensive testing strategy for the OwnerRez CLI tool, designed to ensure reliable business control through Cursor integration.

---

## 🧪 **Phase 1: Core Functionality Testing (Week 1)**

### **1.1 Installation & Setup Testing**
```bash
# Test global installation
./install-global.sh
ownerrez-cli --version

# Test configuration
ownerrez-cli config get
ownerrez-cli config set --token "test-token"
ownerrez-cli config set --base-url "https://api.ownerrez.com"
ownerrez-cli config test
```

**Expected Results:**
- ✅ CLI installs globally and is accessible from any directory
- ✅ Configuration saves and loads correctly
- ✅ API connectivity test passes with valid token

### **1.2 Basic API Connectivity Testing**
```bash
# Test API ping
ownerrez-cli config test

# Test with invalid token
ownerrez-cli config set --token "invalid-token"
ownerrez-cli config test
```

**Expected Results:**
- ✅ Valid token connects successfully
- ✅ Invalid token shows authentication error
- ✅ Rate limiting handled gracefully

### **1.3 Command Structure Testing**
```bash
# Test help system
ownerrez-cli --help
ownerrez-cli config --help
ownerrez-cli bookings --help
ownerrez-cli properties --help
ownerrez-cli test --help
```

**Expected Results:**
- ✅ All commands show proper help text
- ✅ Command structure is intuitive
- ✅ Options and arguments are clearly documented

---

## 🔍 **Phase 2: Module Testing (Week 2)**

### **2.1 Bookings Module Testing**
```bash
# Test bookings list
ownerrez-cli bookings list --limit 5
ownerrez-cli bookings list --status "confirmed"
ownerrez-cli bookings list --property "Clearwater"
ownerrez-cli bookings list --from "2025-01-01" --to "2025-01-31"

# Test single booking operations
ownerrez-cli bookings get "booking-id-123"
ownerrez-cli bookings update "booking-id-123" --status "cancelled"
ownerrez-cli bookings cancel "booking-id-123"
```

**Test Cases:**
- ✅ List bookings with various filters
- ✅ Handle empty results gracefully
- ✅ Error handling for invalid booking IDs
- ✅ Date filtering works correctly
- ✅ Status updates persist

### **2.2 Properties Module Testing**
```bash
# Test properties list
ownerrez-cli properties list
ownerrez-cli properties list --active
ownerrez-cli properties list --status "available"

# Test single property operations
ownerrez-cli properties get "property-id-456"
```

**Test Cases:**
- ✅ List all properties
- ✅ Filter by status and activity
- ✅ Property details display correctly
- ✅ Handle missing properties gracefully

### **2.3 Financial Module Testing**
```bash
# Test financial queries through chat
ownerrez-cli chat "What's my income this month?"
ownerrez-cli chat "Show me this week's revenue"
ownerrez-cli chat "What's my profit this year?"
```

**Test Cases:**
- ✅ Natural language parsing works
- ✅ Date period extraction is accurate
- ✅ Financial calculations are correct
- ✅ Results are formatted clearly

---

## 🚀 **Phase 3: Business Workflow Testing (Week 3)**

### **3.1 Guest Inquiry to Booking Workflow**
```bash
# Test complete workflow
ownerrez-cli test workflow guest-inquiry-to-booking --verbose
```

**Workflow Steps:**
1. ✅ Receive guest inquiry
2. ✅ Check property availability
3. ✅ Create booking record
4. ✅ Send confirmation
5. ✅ Update property status

### **3.2 Checkin Automation Workflow**
```bash
# Test checkin workflow
ownerrez-cli test workflow checkin-automation --verbose
```

**Workflow Steps:**
1. ✅ Identify upcoming checkins
2. ✅ Prepare checkin instructions
3. ✅ Send automated messages
4. ✅ Update property status

### **3.3 Pricing Adjustment Workflow**
```bash
# Test pricing workflow
ownerrez-cli test workflow pricing-adjustment --verbose
```

**Workflow Steps:**
1. ✅ Analyze market data
2. ✅ Check competitor pricing
3. ✅ Calculate optimal rates
4. ✅ Update property pricing

---

## 🧠 **Phase 4: Natural Language Processing Testing (Week 4)**

### **4.1 Chat Command Testing**
```bash
# Test various query types
ownerrez-cli chat "What's my income this month?"
ownerrez-cli chat "Show me unread guest messages"
ownerrez-cli chat "Update Clearwater pricing to $250/night"
ownerrez-cli chat "Create a new booking for next weekend"
ownerrez-cli chat "Generate monthly financial report"
```

**Test Cases:**
- ✅ Financial queries parse correctly
- ✅ Booking queries work
- ✅ Property queries function
- ✅ Message queries handled
- ✅ Status queries provide overview

### **4.2 Query Pattern Recognition**
```bash
# Test pattern matching
ownerrez-cli chat "How much money did I make?"
ownerrez-cli chat "What's my revenue?"
ownerrez-cli chat "Show me my earnings"
```

**Expected Results:**
- ✅ Synonyms for "income" are recognized
- ✅ Time periods are extracted correctly
- ✅ Intent classification works accurately

---

## 🔧 **Phase 5: Integration Testing (Week 5)**

### **5.1 Cursor Integration Testing**
```bash
# Test from Cursor terminal
# These commands should work seamlessly in Cursor
ownerrez-cli chat "What's happening with my business?"
ownerrez-cli test all --verbose
```

**Integration Points:**
- ✅ Commands work in Cursor terminal
- ✅ Output formatting is Cursor-friendly
- ✅ Error messages are clear and actionable

### **5.2 Environment Variable Testing**
```bash
# Test environment variable fallback
unset OWNERREZ_API_TOKEN
ownerrez-cli config get
export OWNERREZ_API_TOKEN="test-token"
ownerrez-cli config get
```

**Expected Results:**
- ✅ CLI falls back to config file
- ✅ Environment variables override config
- ✅ Graceful handling of missing credentials

---

## 📊 **Phase 6: Performance & Stress Testing (Week 6)**

### **6.1 API Rate Limiting**
```bash
# Test rate limit handling
for i in {1..20}; do
  ownerrez-cli bookings list --limit 1
  sleep 0.1
done
```

**Test Cases:**
- ✅ Rate limits are respected
- ✅ Retry logic works correctly
- ✅ Error messages are helpful

### **6.2 Large Dataset Handling**
```bash
# Test with large result sets
ownerrez-cli bookings list --limit 100
ownerrez-cli properties list
```

**Test Cases:**
- ✅ Large datasets load efficiently
- ✅ Memory usage is reasonable
- ✅ Output formatting handles volume

---

## 🧪 **Automated Testing Suite**

### **6.1 Test Command Integration**
```bash
# Run comprehensive test suite
ownerrez-cli test all --verbose
ownerrez-cli test module bookings --verbose
ownerrez-cli test module properties --verbose
ownerrez-cli test module guests --verbose
ownerrez-cli test module financial --verbose
```

### **6.2 Test Result Validation**
```bash
# Validate test outputs
ownerrez-cli test all | grep "Success Rate"
ownerrez-cli test all | grep "Duration"
```

---

## 📋 **Testing Checklist**

### **Core Functionality**
- [ ] Global installation works
- [ ] Configuration management functions
- [ ] API connectivity is reliable
- [ ] Help system is comprehensive

### **Module Operations**
- [ ] Bookings CRUD operations
- [ ] Properties listing and details
- [ ] Financial calculations
- [ ] Guest management

### **Business Workflows**
- [ ] Guest inquiry to booking
- [ ] Checkin automation
- [ ] Pricing adjustments
- [ ] Maintenance requests

### **Natural Language**
- [ ] Query parsing accuracy
- [ ] Intent recognition
- [ ] Response generation
- [ ] Error handling

### **Integration**
- [ ] Cursor compatibility
- [ ] Environment variable handling
- [ ] Performance under load
- [ ] Error recovery

---

## 🎯 **Success Criteria**

### **Week 1-2: Core Functionality**
- ✅ CLI installs and runs globally
- ✅ All basic commands function
- ✅ API connectivity is stable
- ✅ Error handling is robust

### **Week 3-4: Business Logic**
- ✅ Workflows execute correctly
- ✅ Natural language processing works
- ✅ Business rules are enforced
- ✅ Data integrity is maintained

### **Week 5-6: Production Ready**
- ✅ Performance meets requirements
- ✅ Integration is seamless
- ✅ Testing coverage is comprehensive
- ✅ Documentation is complete

---

## 🚨 **Error Handling & Recovery**

### **Common Error Scenarios**
1. **Authentication Failures**
   - Invalid API token
   - Expired credentials
   - Rate limit exceeded

2. **Network Issues**
   - Connection timeouts
   - DNS resolution failures
   - SSL certificate problems

3. **Data Validation**
   - Invalid booking dates
   - Missing required fields
   - Malformed API responses

### **Recovery Procedures**
- ✅ Automatic retry with exponential backoff
- ✅ Clear error messages with actionable advice
- ✅ Graceful degradation when possible
- ✅ Comprehensive logging for debugging

---

## 📈 **Performance Benchmarks**

### **Response Time Targets**
- **API Calls**: < 2 seconds
- **Command Execution**: < 1 second
- **Natural Language Processing**: < 500ms
- **Workflow Execution**: < 5 seconds

### **Resource Usage Limits**
- **Memory**: < 100MB peak usage
- **CPU**: < 10% during normal operation
- **Network**: Efficient API usage with minimal overhead

---

## 🔄 **Continuous Testing**

### **Daily Testing**
- ✅ Basic connectivity test
- ✅ Core command validation
- ✅ Quick workflow test

### **Weekly Testing**
- ✅ Full test suite execution
- ✅ Performance benchmarking
- ✅ Integration testing

### **Monthly Testing**
- ✅ End-to-end workflow validation
- ✅ Stress testing
- ✅ Security audit

---

## 📚 **Documentation Requirements**

### **User Documentation**
- ✅ Installation guide
- ✅ Command reference
- ✅ Examples and use cases
- ✅ Troubleshooting guide

### **Developer Documentation**
- ✅ API documentation
- ✅ Architecture overview
- ✅ Testing procedures
- ✅ Deployment guide

---

## 🎉 **Completion Criteria**

The OwnerRez CLI is considered **production-ready** when:

1. ✅ **All test phases pass** with >95% success rate
2. ✅ **Performance benchmarks** are met consistently
3. ✅ **Error handling** is robust and user-friendly
4. ✅ **Documentation** is complete and accurate
5. ✅ **Integration** with Cursor is seamless
6. ✅ **Business workflows** execute reliably
7. ✅ **Natural language processing** is accurate
8. ✅ **Security** measures are implemented

---

## 🚀 **Next Steps After Testing**

1. **Deploy to Production**
   - Global installation for all users
   - Environment configuration
   - Monitoring setup

2. **User Training**
   - Cursor integration training
   - Business workflow training
   - Troubleshooting support

3. **Ongoing Maintenance**
   - Regular testing schedule
   - Performance monitoring
   - Feature updates

---

*This testing plan ensures your OwnerRez CLI provides reliable, intuitive business control through Cursor, meeting all requirements for short-term rental property management.*
