const UserModel = require("../models/UserModel");
const LogModel = require("../models/logModel");

const AdminController = {
  dashboard: (req, res) => {
    UserModel.getAllUsers((err, users) => {
      if (err) {
        return res.send("Erro ao buscar usuários");
      }

      res.render("admin-dashboard", { users });
    });
  },

  deactivateUser: (req, res) => {
    const { id } = req.params;
    UserModel.deactivateUser(id, (err, changes) => {
        if (err || changes === 0) {
        return res.send("Erro ao desativar usuário");
        }

        res.redirect("/admin");
    });
    },
    logs: (req, res) => {
    UserModel.getLogs((err, logs) => {
      if (err) {
        return res.send("Erro ao buscar logs");
      }
      res.render("logs", { logs });
    });
  },

    verify: (req, res) => {
    let { email, code } = req.body;
    code = code.trim();
    UserModel.findByEmail(email, (err, user) => {
        if (err || !user) {
        return res.send("Usuário não encontrado");
        }
        if (user.verificationCode !== code) {
        return res.send("Código inválido");
        }
        if (Date.now() > user.verificationExpires) {
        return res.send("Código expirado");
        }
        UserModel.activateUser(user.id, (err) => {
        if (err) {
            return res.send("Erro ao ativar usuário");
        }
        res.redirect("/login");
        });
    });
    logs: (req, res) => {
    LogModel.getAll((err, logs) => {
        if (err) {
        return res.send("Erro ao buscar logs");
        }

        res.render("logs", { logs });
    });};
}
};

module.exports = AdminController;