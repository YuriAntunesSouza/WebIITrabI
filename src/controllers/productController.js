const prisma = require("../config/prisma");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const productUploadDir = path.resolve(__dirname, "../../uploads/products");

const productController = {
  // Lista produtos do vendedor logado
  dashboard: async (req, res) => {
    const userId = req.user.id;
    const [products, orders] = await Promise.all([
      prisma.product.findMany({
        where: { userId },
        include: { Images: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.findMany({
        where: { Items: { some: { Product: { userId } } } },
        include: {
          User: true,
          Items: {
            where: { Product: { userId } },
            include: { Product: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    res.render("seller-dashboard", {
      products,
      orders,
      success: req.query.success || null,
      error: req.query.error || null,
    });
  },

  // Cria produto com múltiplas fotos
  create: async (req, res) => {
    const userId = req.user.id;
    const name        = String(req.body.name        || "").trim();
    const description = String(req.body.description || "").trim();
    const category    = String(req.body.category    || "").trim();
    const price       = parseFloat(String(req.body.price || "").replace(",", "."));
    const stock       = parseInt(String(req.body.stock || ""), 10);

    if (!name || !description || !category || isNaN(price) || isNaN(stock)) {
      return res.redirect("/seller?error=Preencha todos os campos do produto.");
    }

    // Cria o produto
    const product = await prisma.product.create({
      data: { name, description, category, price, stock, userId },
    });

    // Processa e salva cada imagem com sharp (800×500, webp)
    if (req.files && req.files.length > 0) {
      const imageData = [];
      for (let i = 0; i < req.files.length; i++) {
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
        const filepath = path.join(productUploadDir, filename);
        await sharp(req.files[i].buffer)
          .resize(800, 500, { fit: "cover", position: "centre" })
          .webp({ quality: 85 })
          .toFile(filepath);
        imageData.push({
          imageUrl: `/uploads/products/${filename}`,
          isPrimary: i === 0 ? 1 : 0,
          productId: product.id,
        });
      }
      await prisma.productImage.createMany({ data: imageData });
    }

    res.redirect("/seller?success=Produto cadastrado com sucesso.");
  },

  // Deleta produto e suas imagens
  delete: async (req, res) => {
    const userId = req.user.id;
    const productId = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { Images: true },
    });

    if (!product || product.userId !== userId) {
      return res.redirect("/seller?error=Produto nao encontrado.");
    }

    // Remove arquivos físicos
    for (const img of product.Images) {
      const filePath = path.resolve(__dirname, "../../", img.imageUrl.replace(/^\//, ""));
      fs.unlink(filePath, () => {}); // ignora erro se já não existir
    }

    await prisma.productImage.deleteMany({ where: { productId } });
    await prisma.product.delete({ where: { id: productId } });

    res.redirect("/seller?success=Produto removido com sucesso.");
  },

  // Detalhe de um produto (página pública)
  show: async (req, res) => {
    const userId = res.locals.user?.id || null; // usa o usuário decodificado globalmente
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        Images: true,
        User: { include: { SellerProfile: true } },
        Comments: {
          include: {
            User: { select: { id: true, name: true } },
            Likes: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  if (!product) return res.redirect("/");

  res.render("product-details", { product, userId });
}}

module.exports = productController;