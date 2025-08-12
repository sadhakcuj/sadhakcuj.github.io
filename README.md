# Udyam Registration Portal

A comprehensive web application that replicates the first two steps of the Udyam registration process with modern web technologies and responsive design.

## 🚀 Features

### Core Functionality
- **Step 1**: Aadhaar + OTP Validation
- **Step 2**: PAN Validation and Business Details
- **Real-time Form Validation**: Client and server-side validation
- **Progress Tracking**: Visual step indicator with progress bar
- **Responsive Design**: Mobile-first approach with 100% responsiveness

### Technical Features
- **Web Scraping**: Python-based scraper for extracting form structure
- **Modern Frontend**: React with TypeScript and responsive CSS
- **Robust Backend**: Node.js with Express and Prisma ORM
- **Database**: PostgreSQL with optimized schema
- **Validation**: Comprehensive form validation with Joi schemas
- **Security**: Rate limiting, CORS, and security headers
- **Testing**: Jest-based unit tests for validation logic

### UI/UX Enhancements
- **Auto-fill Suggestions**: City/state based on pincode
- **Smooth Transitions**: CSS animations and hover effects
- **Error Handling**: User-friendly error messages and validation feedback
- **Accessibility**: ARIA labels, focus management, and keyboard navigation

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Hook Form** for form management
- **Axios** for API communication
- **React Toastify** for notifications
- **Responsive CSS** with modern design patterns

### Backend
- **Node.js** with Express
- **Prisma ORM** for database operations
- **Joi** for validation schemas
- **PostgreSQL** database
- **Rate limiting** and security middleware

### Web Scraping
- **Python 3** with Selenium
- **BeautifulSoup** for HTML parsing
- **Chrome WebDriver** for dynamic content

### DevOps
- **Docker** containerization
- **Docker Compose** for multi-service setup
- **Health checks** and monitoring

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- PostgreSQL 15+
- Docker and Docker Compose (optional)
- Chrome/Chromium browser (for web scraping)

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd udyam-registration-app
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

### Option 2: Manual Setup

1. **Install dependencies**
   ```bash
   # Backend dependencies
   npm install
   
   # Frontend dependencies
   cd client
   npm install
   cd ..
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

3. **Set up database**
   ```bash
   # Start PostgreSQL and create database
   createdb udyam_registration
   
   # Run Prisma migrations
   npm run db:migrate
   npm run db:generate
   ```

4. **Start the application**
   ```bash
   # Start backend (in one terminal)
   npm run server:dev
   
   # Start frontend (in another terminal)
   npm run client:dev
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/udyam_registration"

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Security
JWT_SECRET=your-super-secret-jwt-key-here
SESSION_SECRET=your-session-secret-key-here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# External APIs
PINCODE_API_URL=https://api.postpincode.in/pincode
PINCODE_API_KEY=your-pincode-api-key-here
```

### Database Schema

The application uses Prisma with the following main models:

- **FormSubmission**: Stores form data for each step
- **ValidationLog**: Tracks validation attempts
- **PincodeCache**: Caches pincode data for performance

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- validation.test.js
```

### Test Coverage
The test suite covers:
- Form validation logic
- Field-level validation
- API endpoint validation
- Error handling scenarios

## 📱 API Endpoints

### Form Endpoints
- `GET /api/form/schema` - Get form structure
- `POST /api/form/submit` - Submit form data
- `GET /api/form/submission/:id` - Get submission by ID
- `GET /api/form/submissions` - List all submissions

### Validation Endpoints
- `POST /api/validation/field` - Validate individual field
- `GET /api/validation/pincode/:pincode` - Get pincode data
- `POST /api/validation/pan` - Validate PAN number
- `POST /api/validation/aadhaar` - Validate Aadhaar number
- `POST /api/validation/mobile` - Validate mobile number
- `POST /api/validation/otp` - Validate OTP

### Health Check
- `GET /health` - Application health status

## 🌐 Web Scraping

### Run the Scraper
```bash
cd scraper
pip install -r requirements.txt
python udyam_scraper.py
```

The scraper will:
- Extract form fields and validation rules
- Identify UI components and structure
- Save data to `scraped_form_data.json`
- Handle dynamic content with Selenium

## 🚀 Deployment

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```bash
   NODE_ENV=production
   DATABASE_URL=your-production-db-url
   ```

3. **Deploy with Docker**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Platform Deployment

- **Frontend**: Deploy to Vercel, Netlify, or any static hosting
- **Backend**: Deploy to Heroku, Railway, or any Node.js hosting
- **Database**: Use managed PostgreSQL services (AWS RDS, Heroku Postgres)

## 📊 Performance & Monitoring

### Performance Features
- **Rate Limiting**: Prevents abuse and ensures fair usage
- **Database Indexing**: Optimized queries with Prisma
- **Caching**: Pincode data caching for faster responses
- **Compression**: Gzip compression for API responses

### Monitoring
- **Health Checks**: Built-in health monitoring
- **Error Logging**: Comprehensive error tracking
- **Performance Metrics**: Response time monitoring

## 🔒 Security Features

- **Input Validation**: Server-side validation with Joi
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Controlled cross-origin access
- **Security Headers**: Helmet.js for security headers
- **SQL Injection Protection**: Prisma ORM with parameterized queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Udyam Registration Portal for the form structure reference
- React and Node.js communities for excellent tooling
- Prisma team for the amazing ORM
- All contributors and maintainers

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation and examples
- Review the test cases for usage patterns

---

**Note**: This is a demonstration application and should not be used for actual Udyam registrations. Always use the official government portal for real registrations. 