const prisma = require("../config/prisma");

const userModel = {
  create: async (user) => {
    return prisma.user.create({ data: user });
  },

  findByEmail: async (email) => {
    return prisma.user.findUnique({ where: { email } });
  },

  findById: async (id) => {
    return prisma.user.findUnique({ where: { id: Number(id) } });
  },

  verifyUser: async (email, code) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return 0;
    if (user.verificationCode !== code) return 0;
    if (Date.now() > user.verificationExpires) return 0;

    await prisma.user.update({
      where: { email },
      data: { isVerified: 1, isActive: 1 },
    });
    return 1;
  },

  updateVerificationCode: async (email, code, expires) => {
    const result = await prisma.user.updateMany({
      where: { email },
      data: { verificationCode: code, verificationExpires: expires },
    });
    return result.count;
  },

  getAllUsers: async () => {
    return prisma.user.findMany({ orderBy: { id: "asc" } });
  },

  deactivateUser: async (id) => {
    const result = await prisma.user.updateMany({
      where: { id: Number(id) },
      data: { isActive: 0 },
    });
    return result.count;
  },

  activateUser: async (id) => {
    await prisma.user.update({
      where: { id: Number(id) },
      data: { isVerified: 1, isActive: 1 },
    });
  },

  getLogs: async () => {
    return prisma.log.findMany({ orderBy: { createdAt: "desc" } });
  },
};

module.exports = userModel;