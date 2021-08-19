const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const startServer = async () => {
  mongoServer = await MongoMemoryServer.create();

  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    dbName: 'TestDB',
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
};

const stopServer = async () => {
  await mongoose.connection.close();
  await mongoose.disconnect();
  await mongoServer.stop();
};

const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

module.exports = {
  startServer,
  stopServer,
  clearDatabase,
};
