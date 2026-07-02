const prisma = require("../config/prisma");

const buyerProfileController = {
  show: async (req, res) => {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { BuyerProfile: true },
    });

    if (!user || user.role !== "comprador") {
      return res.redirect("/");
    }

    res.render("buyer-profile", {
      profile: user.BuyerProfile,
      success: req.query.success || null,
      error: req.query.error || null,
    });
  },

  save: async (req, res) => {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.role !== "comprador") {
      return res.redirect("/");
    }

    const phone         = String(req.body.phone         || "").trim();
    const address       = String(req.body.address       || "").trim();
    const city          = String(req.body.city          || "").trim();
    const state         = String(req.body.state         || "").trim();
    const zipCode       = String(req.body.zipCode       || "").trim();
    const paymentMethod = String(req.body.paymentMethod || "").trim();

    if (!phone || !address || !city || !state || !zipCode || !paymentMethod) {
      return res.redirect("/buyer/profile?error=Preencha todos os campos obrigatorios.");
    }

    const data = { phone, address, city, state, zipCode, paymentMethod };

    await prisma.buyerProfile.upsert({
      where:  { userId },
      update: data,
      create: { ...data, userId },
    });

    res.redirect("/buyer/profile?success=Perfil atualizado com sucesso.");
  },
};

module.exports = buyerProfileController;