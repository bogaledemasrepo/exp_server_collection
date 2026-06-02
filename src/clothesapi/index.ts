import express from 'express';

const clothesServer = express.Router();

clothesServer.use('/orders', () => {});

export default clothesServer;
