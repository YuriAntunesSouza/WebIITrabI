const UserModel = require("../models/UserModel");

const AdminController = {
  dashboard: async (req, res) => {
    const users = await UserModel.getAllUsers();
    const totalAccounts = users.length;
    const activeAccounts = users.filter((u) => u.isActive).length;
    const deactivatedAccounts = totalAccounts - activeAccounts;
    res.render("admin-dashboard", { users, totalAccounts, activeAccounts, deactivatedAccounts });
  },

  deactivateUser: async (req, res) => {
    const { id } = req.params;
    const target = await UserModel.findById(id);
    if (!target || target.role === "administrador") return res.redirect("/admin");
    const changes = await UserModel.deactivateUser(id);
    if (changes === 0) return res.send("Erro ao desativar usuário");
    res.redirect("/admin");
  },

  activateUser: async (req, res) => {
    const { id } = req.params;
    await UserModel.activateUser(id);
    res.redirect("/admin");
  },

  logs: async (req, res) => {
    const logs = await UserModel.getLogs();
    res.render("logs", { logs });
  },
};

module.exports = AdminController;