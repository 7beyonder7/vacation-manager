import app from '../src/index.js';
import { connectDB, sequelize } from '../src/db/index.js';
import '../src/db/models/User.js';
import '../src/db/models/VacationRequest.js';
import { applyAssociations } from '../src/db/associations.js';

let server;
let baseURL;

export async function startTestServer() {
  await connectDB();
  applyAssociations();
  await sequelize.sync({ force: true });

  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const { port } = server.address();
      baseURL = `http://127.0.0.1:${port}`;
      resolve();
    });
  });

  return { server, baseURL, sequelize };
}

export async function stopTestServer() {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
    server = null;
  }
  await sequelize.close();
}

export function url(path) {
  return `${baseURL}${path}`;
}