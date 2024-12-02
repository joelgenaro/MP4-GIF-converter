# MP4 to GIF Converter

## Local Development

1. Clone the repository
   ```
   git clone https://github.com/joelgenaro/Tom-Renneberg.git
   ```
2. Install dependencies for both frontend and backend

```
cd backend
npm install
cd ../frontend
npm install
```

3. Start the backend server

```
cd backend
node index.js
```

4. Start the worker:

```
cd backend
node worker.js
```

5. Start the frontend server:

```
cd frontend
npm start
```

## Production Development

1. Build the Docker images:

```
docker-compose build
```

2. Start the services

```
docker-compose up -d
```

3. Access the application at `http://your-domain.com`

## Cypress Load Test

1. Ensure the backend server is running
```
cd backend
node index.js
node worker.js
```
2. Run the Cypress load test:
```
npx cypress run --spec cypress/integration/spec.cy.js
```

## Docker Swarm Deployment

1. Initialize Docker Swarm (if not already initialized)
```
docker swarm init
```
2. Deploy the stack:
```
docker stack deploy -c docker-compose.yml mp4-to-gif
```
3. Verify the services
```
docker service ls
```
