const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const authController = {
  register: async (req, res) => {
    const { name, lastname, email, password, role } = req.body;
    const fullName = `${name} ${lastname}`;

    if (!name || !lastname || !email || !password || !role) {
      return res.send("Preencha todos os campos");
    }

    const existing = await UserModel.findByEmail(email);
    if (existing) {
      return res.send("Email já cadastrado");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = generateCode();
    const expires = Date.now() + 15 * 60 * 1000;

    try {
      await UserModel.create({
        name: fullName,
        email,
        password: hashedPassword,
        role,
        verificationCode: code,
        verificationExpires: expires,
      });
      console.log("Código de verificação:", code);
      res.redirect(`/verify?email=${email}`);
    } catch (err) {
      console.error(err);
      res.send("Erro ao cadastrar");
    }
  },

  login: async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.send("Preencha todos os campos");
    }

    const user = await UserModel.findByEmail(email);

    if (!user) return res.send("Usuário não encontrado");
    if (user.role !== role) return res.send("Tipo de usuário incorreto");
    if (!user.isActive) return res.send("Usuário desativado");
    if (!user.isVerified) return res.send("Email não verificado");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send("Senha inválida");

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token);

    if (user.role === "administrador") return res.redirect("/admin");
    return res.redirect("/");
  },

  verify: async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.send("Preencha todos os campos");
    }

    const changes = await UserModel.verifyUser(email, code.trim());

    if (changes === 0) {
      return res.send("Código inválido ou expirado");
    }

    res.redirect("/login");
  },

  resendCode: async (req, res) => {
    const { email } = req.body;

    if (!email) return res.send("Email é obrigatório");

    const code = generateCode();
    const expires = Date.now() + 15 * 60 * 1000;

    const changes = await UserModel.updateVerificationCode(email, code, expires);

    if (changes === 0) return res.send("Erro ao reenviar código");

    console.log("Novo código de verificação:", code);
    res.send("Novo código enviado!");
  },
};

module.exports = authController;