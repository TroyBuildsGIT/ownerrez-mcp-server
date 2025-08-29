# 🏠 Short Term Rental CLI

A powerful **global CLI tool** that gives you intuitive control over your OwnerRez business directly from the command line.

## ✨ Features

- **📊 Analytics & Reporting**: Generate insights from your rental data
- **📅 Booking Management**: Create, update, and manage reservations
- **💬 Guest Communication**: Send messages and manage guest interactions
- **🏘️ Property Operations**: Manage property details and settings
- **💰 Financial Tracking**: Monitor revenue, expenses, and profitability
- **🔧 Workflow Automation**: Streamline repetitive tasks
- **⚙️ Configuration Management**: Easy setup and customization

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd short-term-rental-cli

# Install dependencies
npm install

# Build the CLI tool
npm run build

# Install globally (optional)
npm link
```

### Configuration

Create a `.env` file in your project root:

```bash
# OwnerRez API Configuration
OWNERREZ_API_KEY=your_api_key_here
OWNERREZ_CLIENT_ID=your_client_id_here
OWNERREZ_CLIENT_SECRET=your_client_secret_here
OWNERREZ_BASE_URL=https://api.ownerrez.com
OWNERREZ_REDIRECT_URI=http://localhost:3000/callback

# CLI Configuration
DEFAULT_PROPERTY_ID=your_default_property_id
OUTPUT_FORMAT=table
DEBUG=false
```

### Usage

```bash
# View all available commands
short-term-rental --help

# Manage properties
short-term-rental properties list
short-term-rental properties get <id>

# Handle bookings
short-term-rental bookings list --property-id <id>
short-term-rental bookings create --property-id <id> --check-in <date>

# Guest management
short-term-rental guests search "John Doe"
short-term-rental guests get <id>

# Financial reports
short-term-rental financial revenue --period monthly
short-term-rental financial expenses --property-id <id>

# Analytics
short-term-rental analytics occupancy --property-id <id> --period yearly
```

## 🛠️ Architecture

```
src/
├── api/           # OwnerRez API client
├── cli/           # CLI command implementations
├── utils/         # Configuration and utilities
└── index.ts       # Main CLI entry point
```

## 🔌 API Integration

This CLI tool integrates with the OwnerRez API v2.0 to provide:

- **Authentication**: OAuth 2.0 flow with API key support
- **Rate Limiting**: Built-in request throttling
- **Error Handling**: Comprehensive error management
- **Data Validation**: Input/output validation
- **Caching**: Local caching for improved performance

## 📚 Available Commands

### Properties
- `list` - List all properties
- `get <id>` - Get property details
- `update <id>` - Update property information
- `create` - Create new property

### Bookings
- `list` - List bookings with filters
- `get <id>` - Get booking details
- `create` - Create new booking
- `update <id>` - Update booking
- `cancel <id>` - Cancel booking

### Guests
- `search <query>` - Search for guests
- `get <id>` - Get guest details
- `create` - Create guest record
- `update <id>` - Update guest information

### Financial
- `revenue` - Revenue reports
- `expenses` - Expense tracking
- `profitability` - Profit/loss analysis
- `taxes` - Tax reporting

### Analytics
- `occupancy` - Occupancy rates
- `revenue` - Revenue trends
- `performance` - Property performance metrics

## 🔧 Development

### Building

```bash
# Build CLI tool
npm run build

# Build with watch mode
npm run dev

# Build specific configurations
npm run build:cli
npm run build:cli-clean
```

### Testing

```bash
# Run tests
npm test

# Test specific commands
npm run test:bookings
npm run test:properties
```

## 📦 Dependencies

- **commander**: CLI framework
- **axios**: HTTP client for API calls
- **dotenv**: Environment variable management
- **inquirer**: Interactive prompts

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
