const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.use(express.static(__dirname + '/public'));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Connected to port ${PORT}`));
