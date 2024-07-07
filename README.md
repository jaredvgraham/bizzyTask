BizzyTask

BizzyTask is a platform designed to help you manage and organize your business tasks efficiently.

## Features
- Real-time WebSocket communication
- Integration with Firebase for data storage
- Template generation using OpenAI's GPT-4 model
- User authentication and business management

  
## Technologies Used
- Node.js
- Express
- Socket.io
- Firebase
- OpenAI API
- Next.js
- React

  
## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase account and configuration
- OpenAI API key

  
## Getting Started
### Installation
1. Clone the repository:
 ```bash
 git clone https://github.com/jaredvgraham/bizzyTask.git
 cd bizzyTask
 ```
2. Install dependencies:
 ```bash
 npm install
 ```

### Configuration
Create a `.env` file in the root directory and add the necessary environment variables:
```
PORT=3002
NEXT_PUBLIC_API_BASE_URL=<your_api_base_url>
NEXT_PUBLIC_BACKEND_BASE_URL=<your_backend_base_url>
NEXT_PUBLIC_OPENAI_API_KEY=<your_openai_api_key>
NEXT_PUBLIC_FIREBASE_API_KEY=<your_firebase_api_key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your_firebase_auth_domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your_firebase_project_id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your_firebase_storage_bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your_firebase_messaging_sender_id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your_firebase_app_id>
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=<your_firebase_measurement_id>
FIREBASE_SERVICE_ACCOUNT_KEY=<your_firebase_service_account_key>
```
Make sure to replace the placeholders with your actual values.
### Running the Application
1. Start the development server:
 ```bash
 npm run dev
 ```
2. Build the application for production:
 ```bash
 npm run build
 ```
3. Start the application in production mode:
 ```bash
 npm start
 ```

### WebSocket Server
To start the WebSocket server, run:
```bash
node index.js
```
## Deployment
BizzyTask is deployed on Vercel (for the frontend) and Render (for the backend). Any changes
pushed to the main branch will trigger an automatic redeployment.

## License
This project is licensed under the MIT License.
