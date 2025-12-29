Easy Server
A lightweight Express.js framework with TypeScript decorators for rapid API development.

📖 What This Actually Does
Easy Server automatically:

Scans your controllers/ folder for files

Registers routes using decorators like @GET, @POST

Handles JWT authentication with @Auth()

Manages dependency injection with @Autowire and @Inject

Generates API documentation at /api-docs

🏗️ REAL WORKING EXAMPLE
FILE 1: Create a Service (services/UserService.ts)
Create this file in: services/ folder

typescript
// services/UserService.ts
import { Autowire } from 'easy_server';

@Autowire('UserService') // Registers this as an injectable service
export class UserService {

// REQUIRED: This method is called when the service is registered
public static configure() {
return new UserService();
}

getUsers() {
return [
{ id: 1, name: 'Alice' },
{ id: 2, name: 'Bob' }
];
}
}
FILE 2: Create a Controller (controllers/UserController.ts)
Create this file in: controllers/ folder

typescript
// controllers/UserController.ts
import { GET, POST, Auth, Inject } from 'easy_server';
import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {

// Inject UserService into this static property
@Inject('UserService', 'userService')
static userService: UserService;

// Public endpoint: GET /api/users
@GET('/api/users')
static getAllUsers(req: Request, res: Response) {
const users = UserController.userService.getUsers();
res.json(users);
}

// Protected endpoint: POST /api/users (requires JWT)
@POST('/api/users')
@Auth() // Requires valid JWT token
static createUser(req: Request, res: Response) {
const newUser = req.body;
res.status(201).json({ message: 'User created', user: newUser });
}

// Protected with permissions: GET /api/users/admin
@GET('/api/users/admin')
@Auth(['admin']) // Requires 'admin' permission in JWT
static getAdminUsers(req: Request, res: Response) {
res.json({ message: 'Admin users only' });
}
}
FILE 3: Create Server Entry Point (server.ts)
Create this file in: Project ROOT folder (same as package.json)

typescript
// server.ts
import { EasyServe } from 'easy_server';

const server = new EasyServe({
port: 3000, // Server runs on port 3000
key: 'your-jwt-secret-key', // REQUIRED: For JWT encryption
service: 'My API Service', // Optional: Service name
controller: {
root: './controllers' // REQUIRED: Where controllers are
},
swagger: {
url: '/api-docs', // Swagger UI URL
spec: require('./swaggerSpec.json')
}
});

server.start();
console.log('✅ Server running: http://localhost:3000');
console.log('📚 API Docs: http://localhost:3000/api-docs');
🗂️ PROJECT STRUCTURE
text
your-project/
├── controllers/ # YOUR controller files go here
│ └── UserController.ts
├── services/ # YOUR service files go here
│ └── UserService.ts
├── src/ # FRAMEWORK source (don't touch)
│ ├── annotations/ # @GET, @POST, @Auth decorators
│ ├── interfaces/ # TypeScript interfaces
│ └── util/ # Utility functions
├── server.ts # YOUR server startup file
├── package.json # Dependencies
└── tsconfig.json # TypeScript config
🛠️ STEP-BY-STEP SETUP GUIDE
STEP 1: Install Dependencies
bash
npm install
What this does: Installs Express.js, JWT, Swagger, and all required packages.

STEP 2: Build TypeScript
bash
npm run build
What this does: Compiles TypeScript (.ts) files to JavaScript (.js) in dist/ folder.

STEP 3: Create Required Folders
bash
mkdir controllers services
What this does: Creates folders where YOUR code goes.

STEP 4: Create Server File
bash

# Create server.js in root folder

cat > server.js << 'EOF'
const { EasyServe } = require('./dist/index');

const server = new EasyServe({
port: 3000,
key: 'my-secret-key-123',
controller: { root: './controllers' }
});

server.start();
console.log('Server: http://localhost:3000');
EOF
STEP 5: Create a Simple Controller
bash

# Create controllers/HelloController.js

cat > controllers/HelloController.js << 'EOF'
const { GET } = require('../src/annotations/get');

class HelloController {
@GET('/hello')
static sayHello(req, res) {
res.json({ message: 'Hello World!' });
}
}

module.exports = HelloController;
EOF
STEP 6: Run the Server
bash
node server.js
STEP 7: Test in Browser
Open: http://localhost:3000/hello

🔧 AVAILABLE DECORATORS
HTTP Method Decorators (in src/annotations/)
@GET('/path') - Handle GET requests

@POST('/path') - Handle POST requests

@PUT('/path') - Handle PUT requests

@DELETE('/path') - Handle DELETE requests

@PATCH('/path') - Handle PATCH requests

@OPTIONS('/path') - Handle OPTIONS requests

@HEAD('/path') - Handle HEAD requests

Authentication Decorator
@Auth() - Requires valid JWT token

@Auth(['admin', 'write']) - Requires specific permissions

Dependency Injection
@Autowire('ServiceName') - Register class as injectable service

@Inject('ServiceName', 'propertyName') - Inject service into static property

❗ COMMON ERRORS & FIXES
Error What's Wrong Fix
JWT ENCRYPTION KEY not provied Missing key in config Add key: 'your-secret'
Cannot read properties of undefined (reading 'root') Missing controller config Add controller: { root: './controllers' }
startServer is not a function Wrong method name Use server.start() not startServer()
EasyServer is not a constructor Wrong class name Use EasyServe not EasyServer
🔐 HOW AUTHENTICATION WORKS
Login: User gets JWT token from /login endpoint

Request: Token sent in header: Authorization: Bearer <token>

Validation: @Auth() checks token validity

Access: If valid, user data added to req.body.user

Permissions: @Auth(['admin']) checks user has 'admin' permission

📊 DEPENDENCY INJECTION FLOW
typescript
// 1. SERVICE registers itself
@Autowire('DatabaseService')
class DatabaseService {
static configure() { return new DatabaseService(); }
}

// 2. CONTROLLER injects the service
@Inject('DatabaseService', 'db')
class UserController {
static db: DatabaseService;

@GET('/users')
static getUsers() {
return UserController.db.query(); // Use injected service
}
}
📝 REAL PROJECT CHECKLIST
Run npm install

Run npm run build

Create controllers/ and services/ folders

Create server.js with EasyServe config

Create at least one controller file

Run node server.js

Test: http://localhost:3000

📜 LICENSE
ISC License
