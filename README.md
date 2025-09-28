Prerequisites
Node.js (v16 or higher)

MongoDB Atlas account or local MongoDB instance

npm or yarn
Backend Setup
Navigate to backend directory:

bash
cd server
Install dependencies:

bash
npm install
Run the backend:

bash
# Development mode with auto-reload
npm run dev

# Production build and start
npm run build
npm start
Frontend Setup
Navigate to frontend directory:

bash
cd front_end
Install dependencies:

bash
npm install
Run the frontend:

bash
# Development server
npm run dev

# Production build
npm run build
The frontend will start on http://localhost:3000
📋 API Documentation
Base URL
text
http://localhost:5001/api
Health Check
bash
GET /health
Response:

json
{
  "status": "OK",
  "database": "connected",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
Book Endpoints
1. Get All Books
bash
GET /books?page=1&limit=10&search=keyword&sortBy=title&sortOrder=asc&available=true
Parameters:

page - Page number (default: 1)

limit - Items per page (default: 10)

search - Search in title, author, genre, description

sortBy - Field to sort by (title, author, publishedYear, createdAt)

sortOrder - asc or desc (default: desc)

available - Filter by availability

Response:

json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
2. Get Single Book
bash
GET /books/:id
Response:

json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "9780743273565",
    "publishedYear": 1925,
    "available": true,
    "genre": "Classic",
    "description": "American novel about the Jazz Age",
    "imageUrl": "https://covers.openlibrary.org/b/isbn/9780743273565-M.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
3. Create New Book
bash
POST /books
Content-Type: application/json

{
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "isbn": "9780547928227",
  "publishedYear": 1937,
  "available": true,
  "genre": "Fantasy",
  "description": "A great adventure story",
  "imageUrl": "https://example.com/cover.jpg"
}
Required Fields: title, author, isbn, publishedYear

4. Update Book
bash
PUT /books/:id
Content-Type: application/json


{
  "title": "Updated Title",
  "available": false
}
5. Delete Book
bash
DELETE /books/:id


GET /books?page=1&limit=10&search=keyword&sortBy=title&sortOrder=asc&available=true
Parameters:

page - Page number (default: 1)

limit - Items per page (default: 10)

search - Search in title, author, genre, description

sortBy - Field to sort by (title, author, publishedYear, createdAt)

sortOrder - asc or desc (default: desc)

available - Filter by availability

Response:

json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
2. Get Single Book
bash
GET /books/:id
Response:

json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "9780743273565",
    "publishedYear": 1925,
    "available": true,
    "genre": "Classic",
    "description": "American novel about the Jazz Age",
    "imageUrl": "https://covers.openlibrary.org/b/isbn/9780743273565-M.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
3. Create New Book
bash
POST /books
Content-Type: application/json

{
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "isbn": "9780547928227",
  "publishedYear": 1937,
  "available": true,
  "genre": "Fantasy",
  "description": "A great adventure story",
  "imageUrl": "https://example.com/cover.jpg"
}
Required Fields: title, author, isbn, publishedYear

4. Update Book
bash
PUT /books/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "available": false
}
5. Delete Book
bash
DELETE /books/:id
🛠️ Example API Requests
Using curl
Create a book:

bash
curl -X POST http://localhost:5001/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "1984",
    "author": "George Orwell",
    "isbn": "9780451524935",
    "publishedYear": 1949,
    "genre": "Dystopian",
    "description": "Dystopian social science fiction"
  }'
Get books with search:

bash
curl "http://localhost:5001/api/books?search=Orwell&page=1&limit=5"
Update a book:

bash
curl -X PUT http://localhost:5001/api/books/BOOK_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"available": false}'
Using Postman Collection
Import this JSON into Postman:

json
{
  "info": {
    "name": "Book Store API",
    "description": "Complete CRUD API for Book Management"
  },
  "item": [
    {
      "name": "Create Book",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Sample Book\",\n  \"author\": \"Sample Author\",\n  \"isbn\": \"1234567890123\",\n  \"publishedYear\": 2023,\n  \"genre\": \"Fiction\"\n}"
        },
        "url": "http://localhost:5001/api/books"
      }
    },
    {
      "name": "Get All Books",
      "request": {
        "method": "GET",
        "url": "http://localhost:5001/api/books"
      }
    },
    {
      "name": "Search Books",
      "request": {
        "method": "GET",
        "url": "http://localhost:5001/api/books?search=fiction&page=1&limit=10"
      }
    }
  ]
}
🗃️ Data Model
Book Schema
typescript
{
  title: { type: String, required: true, maxlength: 200 },
  author: { type: String, required: true, maxlength: 100 },
  isbn: { type: String, required: true, unique: true },
  publishedYear: { type: Number, required: true, min: 1000 },
  available: { type: Boolean, default: true },
  genre: { type: String, maxlength: 50 },
  description: { type: String, maxlength: 1000 },
  imageUrl: { type: String, default: '' },
  imageAlt: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
Validation Rules
Title: Required, max 200 characters

Author: Required, max 100 characters

ISBN: Required, unique, 10 or 13 digits

Published Year: Required, between 1000 and current year

Genre: Optional, max 50 characters

Description: Optional, max 1000 characters

🎨 Design Choices
Backend Architecture
Express.js with TypeScript - Type safety and better developer experience

MongoDB with Mongoose - Flexible document-based storage

RESTful API Design - Standardized endpoints and HTTP methods

Middleware Pattern - Separation of concerns with validation and error handling

Environment Configuration - Secure management of sensitive data

Frontend Architecture
React with TypeScript - Component-based UI with type safety

Custom Hooks - Reusable state management logic

Axios for API Calls - Promise-based HTTP client with interceptors

Tailwind CSS - Utility-first styling for rapid UI development

Component Composition - Modular and reusable UI components

Key Features Implemented
🔍 Search & Filtering
Real-time search across multiple fields (title, author, genre, description)

Availability filtering (all, available, unavailable)

Client-side debouncing for performance

📄 Pagination
Server-side pagination for large datasets

Configurable page sizes (6, 9, 12, 24 items)

Responsive pagination controls

🎯 Sorting
Multiple sort options (title, author, year, creation date)

Ascending/descending order

Persistent sort preferences

🖼️ Book Covers
Automatic cover generation using Open Library API with ISBN

Custom image URL support

Genre-based fallback images

Loading states and error handling

🎨 UI/UX
Responsive design for all screen sizes

Loading spinners and error states

Hover effects and smooth transitions

Accessible form validation

Clean, modern interface

Error Handling
Backend: Comprehensive error middleware with appropriate HTTP status codes

Frontend: User-friendly error messages with retry options

Validation: Both client-side and server-side validation

Network: Graceful handling of connection issues

Performance Optimizations
Backend: Database indexing for search fields

Frontend: Debounced search, lazy loading images, efficient re-renders

API: Proper pagination to limit data transfer

🚀 Deployment Notes
Backend Deployment
Ensure environment variables are set in production

Use process managers like PM2 for Node.js applications

Configure CORS for your production domain

Set up MongoDB Atlas connection string

Frontend Deployment
Build the project with npm run build

Serve static files from a web server (Nginx, Apache)

Update API base URL for production environment

Consider CDN for assets

🐛 Troubleshooting
Common Issues
Backend won't start: Check if port 5001 is available

MongoDB connection failed: Verify connection string in .env file

Frontend can't connect to backend: Check CORS configuration

Search not working: Ensure MongoDB text indexes are created
