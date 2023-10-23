## Setup and Running

### Installing Packages

Navigate to the server and web directories to install necessary packages:

```bash
cd server && npm install
cd ../web && npm install
```

### Running the Server
```bash
cd ./server && node http.js
```

### Running the Web Client
```bash
cd ./web && npm run dev
```

## Unit testing

### Web Client
```bash
cd ./web && npm run test:unit
```

### Server
```bash
cd ./server && npm run test
```