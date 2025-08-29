# 🏠 Short Term Rental MCP Server

A powerful **Model Context Protocol (MCP) server** for OwnerRez that enables seamless integration with AI assistants like ChatGPT.

## 🎉 **✅ DEPLOYED & LIVE**

### 🚀 **Production Deployment**
- **Status**: ✅ Successfully deployed to Vercel
- **Production URL**: `https://short-term-rental-mvnwzyki7-troy-nowaks-projects-9060401a.vercel.app`
- **ChatGPT Integration**: `https://short-term-rental-mvnwzyki7-troy-nowaks-projects-9060401a.vercel.app/api/sse`
- **GitHub Repository**: `ownerrez-mcp-server` by `TroyBuildsGIT`
- **Latest Commit**: `b6ff9ab` - "Fix OwnerRez MCP server - add required API parameters, fix date fields, add guest details"

### 🔧 **Key Features Implemented**
1. **Complete OwnerRez API Integration** - Full access to properties, bookings, and guest data
2. **Guest Details** - Full guest names with `include_guest=true` parameter
3. **Date Handling** - Proper `arrival`/`departure` date fields (not `check_in`/`check_out`)
4. **API Parameters** - Required `property_ids` and `since_utc` parameters added
5. **Response Handling** - Supports both `.items` and `.data` response formats
6. **Booking Limit** - Increased to 50 bookings to show all current/future reservations
7. **ES Module Support** - Fixed TypeScript compilation and import paths

### 🧪 **Verification Status**
✅ All 50+ bookings displaying correctly with complete guest information
✅ API endpoints responding properly
✅ Date fields formatted correctly
✅ Guest details included in responses

## ✨ Features

- **📊 Analytics & Reporting**: Generate insights from your rental data
- **📅 Booking Management**: Create, update, and manage reservations
- **💬 Guest Communication**: Send messages and manage guest interactions
- **🏘️ Property Operations**: Manage property details and settings
- **💰 Financial Tracking**: Monitor revenue, expenses, and profitability
- **🔧 Workflow Automation**: Streamline repetitive tasks
- **⚙️ Configuration Management**: Easy setup and customization

## 🚀 Quick Start

### ChatGPT Integration (Recommended)

1. **Add to ChatGPT**: Use the MCP server URL in ChatGPT's MCP configuration
2. **Server URL**: `https://short-term-rental-mvnwzyki7-troy-nowaks-projects-9060401a.vercel.app/api/sse`
3. **Available Tools**: The server provides tools for properties, bookings, and guest management

### Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd short-term-rental-mcp

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your OwnerRez API credentials

# Start development server
npm run dev
```

### Environment Configuration

Create a `.env` file with your OwnerRez API credentials:

```bash
# OwnerRez API Configuration
OWNERREZ_API_KEY=your_api_key_here
OWNERREZ_CLIENT_ID=your_client_id_here
OWNERREZ_CLIENT_SECRET=your_client_secret_here
OWNERREZ_BASE_URL=https://api.ownerrez.com
OWNERREZ_REDIRECT_URI=http://localhost:3000/callback

# Optional: Default settings
DEFAULT_PROPERTY_ID=your_default_property_id
DEBUG=false
```

### MCP Server Usage

The MCP server provides the following tools through ChatGPT:

- **Property Management**: List and get property details
- **Booking Management**: View, create, and manage reservations
- **Guest Management**: Search and manage guest information
- **Financial Reports**: Revenue and expense tracking
- **Analytics**: Occupancy rates and performance metrics

## 🛠️ Architecture

```
src/
├── api/           # OwnerRez API client
├── mcp/           # MCP server implementation
│   ├── server.ts      # Main MCP server
│   ├── tools.ts       # MCP tool definitions
│   └── or-client.ts   # OwnerRez client for MCP
├── cli/           # CLI command implementations (legacy)
├── utils/         # Configuration and utilities
└── index.ts       # Main entry point
```

### MCP Components

- **Server** (`mcp/server.ts`): Handles MCP protocol communication with ChatGPT
- **Tools** (`mcp/tools.ts`): Defines available tools (properties, bookings, guests)
- **Client** (`mcp/or-client.ts`): OwnerRez API integration with proper error handling
- **API Layer** (`api/`): Core OwnerRez API functionality

## 🔌 API Integration

This MCP server integrates with the OwnerRez API v2.0 to provide:

- **Authentication**: OAuth 2.0 flow with API key support
- **Rate Limiting**: Built-in request throttling
- **Error Handling**: Comprehensive error management
- **Data Validation**: Input/output validation
- **Response Flexibility**: Handles both `.items` and `.data` response formats
- **Guest Details**: Full guest information with `include_guest=true`
- **Date Fields**: Proper `arrival`/`departure` handling (not `check_in`/`check_out`)

## 🛠️ MCP Tools Available

### Property Tools
- `list_properties` - List all properties with details
- `get_property` - Get detailed information for a specific property
- `search_properties` - Search properties by name or location

### Booking Tools
- `list_bookings` - List all bookings with guest details and dates
- `get_booking` - Get detailed booking information
- `get_upcoming_bookings` - Get future bookings within specified days
- `get_current_bookings` - Get currently active bookings
- `search_bookings_by_guest` - Find bookings by guest name
- `get_booking_summary` - Get booking statistics and summary

### Guest Tools
- `search_guests` - Search for guests by name or email
- `get_guest` - Get detailed guest information
- `get_guest_history` - Get booking history for a specific guest

### Financial Tools
- `get_financial_summary` - Get revenue and expense summaries
- `get_property_revenue` - Get revenue data for specific properties
- `get_booking_financials` - Get financial details for bookings

### Analytics Tools
- `get_occupancy_rates` - Calculate occupancy rates for properties
- `get_property_performance` - Get performance metrics for properties
- `get_revenue_trends` - Analyze revenue trends over time

## 🔧 Development

### Building

```bash
# Build MCP server and all components
npm run build

# Build with watch mode (development)
npm run dev

# Build specific components
npm run build:mcp        # Build MCP server only
npm run build:api        # Build API client only
npm run build:cli        # Build CLI tools (legacy)
npm run build:cli-clean  # Build clean CLI version
```

### Testing

```bash
# Run all tests
npm test

# Test MCP server functionality
npm run test:mcp

# Test API integration
npm run test:api

# Test specific components
npm run test:bookings
npm run test:properties
npm run test:guests
```

### Deployment

```bash
# Deploy to Vercel (production)
npm run deploy

# Check deployment status
npm run deploy:status
```

## 📦 Dependencies

### Core Dependencies
- **@modelcontextprotocol/sdk**: MCP protocol implementation
- **axios**: HTTP client for OwnerRez API calls
- **dotenv**: Environment variable management
- **express**: Web server for MCP endpoints
- **cors**: Cross-origin resource sharing

### Development Dependencies
- **typescript**: TypeScript compilation
- **@types/node**: Node.js type definitions
- **jest**: Testing framework
- **ts-jest**: TypeScript testing support
- **commander**: CLI framework (legacy)
- **inquirer**: Interactive prompts (legacy)

## 🌟 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

ISC License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Check the API documentation
- Review the configuration guide
- Open an issue on GitHub

---

**Built with ❤️ for property managers who love the command line**
