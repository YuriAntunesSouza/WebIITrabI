const prisma = require("../config/prisma");

const LogModel = {
  create: async ({ userId, method, route, description }) => {
    await prisma.log.create({
      data: {
        userId: userId || null,
        method,
        route,
        description,
      },
    });
  },
};

module.exports = LogModel;