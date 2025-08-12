#!/bin/bash

echo "🚀 Setting up Udyam Registration Portal Application"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "⚠️  PostgreSQL is not running. Please start PostgreSQL first."
    echo "   On macOS: brew services start postgresql"
    echo "   On Ubuntu: sudo systemctl start postgresql"
    echo "   On Windows: Start PostgreSQL service"
fi

echo "✅ Prerequisites check completed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

# Install Python scraper dependencies
echo "🐍 Installing Python scraper dependencies..."
cd scraper
pip3 install -r requirements.txt
cd ..

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating environment file..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your database credentials"
fi

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npx prisma generate

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your database credentials"
echo "2. Start PostgreSQL database"
echo "3. Run database migrations: npm run db:migrate"
echo "4. Start the application: npm run dev"
echo ""
echo "For more information, see README.md" 