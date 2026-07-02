const prisma = require("../config/prisma");

const sellerProfileController = {
  // Página de edição (só o próprio vendedor acessa)
  show: async (req, res) => {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { SellerProfile: true },
    });

    if (!user || user.role !== "vendedor") {
      return res.redirect("/");
    }

    res.render("seller-profile", {
      profile: user.SellerProfile,
      success: req.query.success || null,
      error: req.query.error || null,
    });
  },

  // Salvar dados do formulário
  save: async (req, res) => {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.role !== "vendedor") {
      return res.redirect("/");
    }

    const storeName   = String(req.body.storeName   || "").trim();
    const description = String(req.body.description || "").trim();
    const contact     = String(req.body.contact     || "").trim();
    const city        = String(req.body.city        || "").trim();
    const state       = String(req.body.state       || "").trim();
    const categories  = String(req.body.categories  || "").trim();

    if (!storeName || !description || !contact || !city || !state || !categories) {
      return res.redirect("/seller/profile?error=Preencha todos os campos obrigatorios.");
    }

    const data = { storeName, description, contact, city, state, categories };

    await prisma.sellerProfile.upsert({
      where:  { userId },
      update: data,
      create: { ...data, userId },
    });

    res.redirect("/seller/profile?success=Perfil atualizado com sucesso.");
  },

  // Perfil público — qualquer um pode ver
  showPublic: async (req, res) => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        SellerProfile: true,
        Products: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!user || user.role !== "vendedor") {
      return res.redirect("/");
    }

    res.render("seller-public", { seller: user });
  },
};

module.exports = sellerProfileController;