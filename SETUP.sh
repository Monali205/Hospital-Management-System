#!/bin/bash

echo "=========================================="
echo "Hospital Management System - Setup Guide"
echo "=========================================="
echo ""

echo "1. Installing Backend Dependencies..."
cd backend
npm install
echo "✓ Backend dependencies installed"
echo ""

echo "2. Configuring Environment Variables"
echo "Please update the .env file with your MongoDB connection string:"
echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital_management?retryWrites=true&w=majority"
echo ""

echo "3. Starting Backend Server..."
echo "To start the backend, run: npm start"
echo ""

echo "4. Frontend Setup"
echo "The frontend is already configured and ready to use."
echo "Open frontend/pages/index.html in your browser or use Live Server."
echo ""

echo "=========================================="
echo "Quick Start Commands"
echo "=========================================="
echo ""
echo "Backend:"
echo "  cd backend && npm install && npm start"
echo ""
echo "Frontend:"
echo "  Open frontend/pages/index.html in browser"
echo ""
echo "=========================================="
