# Short Term Rental MCP CLI

A comprehensive CLI tool for managing short-term rental properties through OwnerRez integration, designed to streamline property management operations directly from Cursor.

## 🏠 Overview

This CLI connects to your OwnerRez account to manage properties hosted on Airbnb, VRBO, and your custom website [dunedinduo.com](https://dunedinduo.com). The tool provides centralized control over pricing, settings, booking trends, utility usage, accounting, and guest communication.

## 🎯 Purpose

Built for your short-term rental team to handle common issues and automate all aspects of property management directly from Cursor, including:
- **Accounting & Financial Management**
- **Supply Stocking & Inventory**
- **Guest Request Handling**
- **Tax Payments & Compliance**
- **Form Management & Updates**
- **Utility Monitoring & Billing**

## 🚀 Features

### Core Functionality
- **OwnerRez Integration**: REST API connections to your OwnerRez backend
- **Multi-Platform Management**: Unified control over Airbnb, VRBO, and custom website listings
- **Real-time Monitoring**: Track booking trends, pricing, and property performance
- **Guest Communication**: Automated responses and question handling

### Automation & Integration
- **Utility Company APIs**: Direct connections to all utility providers
- **Smart Home Integration**: Nest, Ring doorbell, and NoiseAware monitoring
- **Playwright MCP Integration**: Automated web scraping and form filling when needed
- **Process Automation**: Streamlined workflows for common property management tasks

## 🛠 Technical Architecture

### API Connections
- OwnerRez REST API for property management
- Utility company APIs for billing and usage monitoring
- Smart home device APIs for monitoring and control

### MCP Integration
- **Current**: CLI tool for direct property management
- **Future**: Custom MCP server hosted on dunedinduo.com for seamless Cursor integration

### Automation Tools
- Playwright MCP for web automation and data collection
- Process automation for standard operating procedures
- Contact management for maintenance and service providers

## 📁 Project Structure

```
Short Term Rental MCP/
├── README.md
├── api/                    # REST API implementations
├── config/                 # Configuration files
├── processes/              # Standard operating procedures
├── integrations/           # Third-party service connections
├── utilities/              # Utility company integrations
├── smart-home/            # Nest, Ring, NoiseAware integrations
└── docs/                  # Documentation and API references
```

## 🔧 Setup & Configuration

### Prerequisites
- Node.js and npm
- OwnerRez account credentials
- Access to utility company accounts
- Smart home device credentials

### Environment Variables
Configure your `.env` file with:
- OwnerRez API keys
- Utility company credentials
- Smart home device tokens
- Service provider contact information

## 📚 Usage Examples

### Property Management
```bash
# Check booking status across all platforms
rental-cli bookings status

# Update pricing for specific properties
rental-cli pricing update --property="Beach House" --rate=250

# Monitor utility usage
rental-cli utilities status --property="Mountain Cabin"
```

### Guest Communication
```bash
# Handle common guest questions
rental-cli guest respond --question="WiFi password" --property="Beach House"

# Send automated check-in instructions
rental-cli guest checkin --property="Mountain Cabin"
```

### Financial Management
```bash
# Generate monthly accounting reports
rental-cli accounting report --month="2024-01"

# Process tax payments
rental-cli taxes process --quarter="Q1"
```

## 🔄 Workflow Integration

### Standard Operating Procedures
The CLI includes automated processes for:
- **Check-in/Check-out Procedures**
- **Maintenance Request Routing**
- **Emergency Contact Protocols**
- **Supply Replenishment**
- **Cleaning Service Coordination**

### Team Collaboration
- Shared access to property information
- Standardized response templates
- Automated task assignment
- Performance tracking and reporting

## 🚧 Future Development

### Phase 1: CLI Tool (Current)
- Core property management functionality
- Basic automation and monitoring
- Team access and collaboration features

### Phase 2: Custom MCP Server
- Hosted on dunedinduo.com
- Seamless Cursor integration
- Advanced automation workflows
- Real-time property monitoring dashboard

## 🤝 Team Access

This tool is designed for your entire short-term rental team to:
- Handle guest inquiries efficiently
- Monitor property performance
- Manage maintenance and repairs
- Process financial transactions
- Maintain compliance and documentation

## 📞 Support & Maintenance

### Contact Information
- **Maintenance**: [Contact details for maintenance services]
- **Utilities**: [Utility company contact information]
- **Emergency**: [Emergency contact protocols]
- **Technical Support**: [Development team contact]

### Documentation
- API references for all integrations
- Process documentation for common tasks
- Troubleshooting guides
- Training materials for team members

## 🔒 Security & Compliance

- Secure API key management
- Encrypted communication channels
- Audit logging for all operations
- GDPR compliance for guest data
- Secure access controls for team members

---

**Built for efficiency, designed for your team, powered by automation.**
