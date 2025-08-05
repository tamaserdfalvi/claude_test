# AI Dev Team API

[![CI/CD Pipeline](https://github.com/tamaserdfalvi/claude_test/actions/workflows/ci.yml/badge.svg)](https://github.com/tamaserdfalvi/claude_test/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/tamaserdfalvi/claude_test/branch/main/graph/badge.svg)](https://codecov.io/gh/tamaserdfalvi/claude_test)
[![Coverage Status](https://coveralls.io/repos/github/tamaserdfalvi/claude_test/badge.svg?branch=main)](https://coveralls.io/github/tamaserdfalvi/claude_test?branch=main)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

A modern Node.js REST API built with TypeScript, Express.js, and comprehensive test coverage. This project demonstrates best practices for API development including automated testing, continuous integration, and interactive documentation.

## 🚀 Features

- **TypeScript** - Full type safety and modern JavaScript features
- **Express.js** - Fast, unopinionated web framework
- **Swagger UI** - Interactive API documentation
- **Jest Testing** - Comprehensive test suite with coverage reporting
- **ESLint** - Code quality and style enforcement
- **GitHub Actions** - Automated CI/CD pipeline
- **Security Headers** - Built-in security middleware
- **Health Check** - Monitoring endpoint for service health

## 📊 Test Coverage

Our test suite maintains high coverage standards:

- **Statements**: 80%+ coverage required
- **Branches**: 80%+ coverage required  
- **Functions**: 80%+ coverage required
- **Lines**: 80%+ coverage required

Coverage reports are automatically generated and uploaded to [Codecov](https://codecov.io/gh/tamaserdfalvi/claude_test) and [Coveralls](https://coveralls.io/github/tamaserdfalvi/claude_test) on every commit.

## 🛠️ Installation

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager

### Setup

```bash
# Clone the repository
git clone https://github.com/tamaserdfalvi/claude_test.git
cd claude_test

# Install dependencies
npm install

# Build the project
npm run build
```

## 🚦 Usage

### Development Mode

```bash
# Start development server with auto-reload
npm run dev:watch

# Start development server (single run)
npm run dev
```

### Production Mode

```bash
# Build and start production server
npm run build
npm start
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI (with coverage, no watch)
npm run test:ci
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Clean build directory
npm run clean
```

## 📚 API Documentation

Once the server is running, you can access:

- **Interactive API Docs**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/api/health
- **API Info**: http://localhost:3000/

### Available Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/` | API information | Basic API details and version |
| GET | `/api/health` | Health check | Service health status |
| GET | `/api-docs` | API documentation | Interactive Swagger UI |

### Health Check Response

```json
{
  "status": "healthy",
  "timestamp": "2025-08-05T15:18:31.000Z"
}
```

### API Info Response

```json
{
  "message": "AI Dev Team API",
  "version": "1.0.0",
  "timestamp": "2025-08-05T15:18:31.000Z",
  "documentation": "/api-docs"
}
```

## 🏗️ Project Structure

```
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD pipeline
├── src/
│   ├── routes/
│   │   └── health.ts           # Health check routes
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── app.ts                  # Express application setup
│   └── index.ts                # Application entry point
├── tests/
│   ├── app.test.ts             # Application integration tests
│   ├── health.test.ts          # Health endpoint tests
│   ├── types.test.ts           # Type definition tests
│   └── setup.ts                # Test environment setup
├── coverage/                   # Test coverage reports (generated)
├── dist/                       # Compiled JavaScript (generated)
├── .eslintrc.json              # ESLint configuration
├── jest.config.js              # Jest testing configuration
├── openapi.yaml                # OpenAPI 3.0 specification
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

## 🔧 Configuration

### Environment Variables

The application supports the following environment variables:

- `NODE_ENV` - Application environment (`development`, `production`, `test`)
- `PORT` - Server port (default: 3000)

### TypeScript Configuration

The project uses strict TypeScript configuration with:

- Target: ES2020
- Module: CommonJS
- Strict type checking enabled
- Source maps for debugging
- Declaration files generation

### Jest Configuration

Test configuration includes:

- TypeScript support with ts-jest
- Coverage thresholds (80% minimum)
- Multiple coverage reporters (text, lcov, html, json-summary)
- Test timeout: 10 seconds
- Setup files for test environment

## 🚀 CI/CD Pipeline

The project includes a comprehensive GitHub Actions workflow that:

### On Push/PR:
- **Multi-Node Testing** - Tests on Node.js 18.x and 20.x
- **Code Quality** - Runs ESLint for code quality checks
- **Type Checking** - Validates TypeScript compilation
- **Test Execution** - Runs complete test suite with coverage
- **Security Audit** - Checks for known vulnerabilities
- **Build Verification** - Ensures production build succeeds

### Coverage Reporting:
- **Codecov Integration** - Uploads coverage to Codecov
- **Coveralls Integration** - Uploads coverage to Coveralls  
- **PR Comments** - Automatically comments coverage changes on PRs
- **Artifact Storage** - Saves build artifacts for 7 days

### Security Features:
- **Dependency Audit** - Scans for vulnerable dependencies
- **Security Headers** - Implements security best practices
- **Audit CI** - Fails builds on moderate+ vulnerabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with tests
4. Ensure all tests pass (`npm test`)
5. Ensure code quality (`npm run lint`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Standards

- Follow TypeScript best practices
- Maintain test coverage above 80%
- Use ESLint configuration provided
- Add tests for new functionality
- Update documentation as needed

## 📈 Performance & Monitoring

### Health Monitoring

The `/api/health` endpoint provides:
- Service availability status
- Current timestamp for uptime verification
- Quick response time for monitoring systems

### Performance Features

- **Gzip Compression** - Reduces response sizes
- **Security Headers** - Protects against common attacks
- **Request Logging** - Tracks API usage patterns
- **Error Handling** - Graceful error responses with proper HTTP codes

## 🔐 Security

Security features implemented:

- **Helmet-style Headers** - X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- **JSON Parsing Limits** - 10MB limit to prevent large payload attacks
- **Error Sanitization** - Prevents sensitive information leakage
- **Dependency Auditing** - Regular security vulnerability scanning

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or need help with setup, please:

1. Check the [Issues](https://github.com/tamaserdfalvi/claude_test/issues) page
2. Create a new issue with detailed information
3. Review the API documentation at `/api-docs`

## 🔮 Roadmap

Future enhancements planned:

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication and authorization
- [ ] Rate limiting and request throttling
- [ ] Docker containerization
- [ ] Kubernetes deployment manifests
- [ ] Performance metrics and APM integration
- [ ] Additional API endpoints and features

---

**Built with ❤️ using TypeScript, Express.js, and modern development practices.**