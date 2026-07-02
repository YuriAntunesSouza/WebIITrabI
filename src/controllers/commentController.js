const prisma = require("../config/prisma");
const fs = require("fs");
const path = require("path");

const commentController = {
  // Criar comentário
  create: async (req, res) => {
    const userId = req.user.id;
    const productId = Number(req.body.productId);
    const text = String(req.body.text || "").trim();

    if (!text) {
      return res.redirect(`/products/${productId}?error=Comentario nao pode ser vazio.`);
    }

    const imageUrl = req.file
      ? `/uploads/comments/${req.file.filename}`
      : null;

    await prisma.comment.create({
      data: { text, imageUrl, productId, userId },
    });

    res.redirect(`/products/${productId}#comentarios`);
  },

  // Deletar comentário
  delete: async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;
    const commentId = Number(req.params.id);

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) return res.redirect("back");

    if (comment.userId !== userId && role !== "administrador") {
      return res.redirect("back");
    }

    // Remove imagem
    if (comment.imageUrl) {
      const filePath = path.resolve(__dirname, "../../", comment.imageUrl.replace(/^\//, ""));
      fs.unlink(filePath, () => {});
    }

    await prisma.commentLike.deleteMany({ where: { commentId } });
    await prisma.comment.delete({ where: { id: commentId } });

    res.redirect(`/products/${comment.productId}#comentarios`);
  },

  // Curtida
  toggleLike: async (req, res) => {
    const userId = req.user.id;
    const commentId = Number(req.params.id);

    const existing = await prisma.commentLike.findUnique({
      where: { commentId_userId: { commentId, userId } },
    });

    if (existing) {
      await prisma.commentLike.delete({
        where: { commentId_userId: { commentId, userId } },
      });
    } else {
      await prisma.commentLike.create({
        data: { commentId, userId },
      });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { productId: true },
    });

    res.redirect(`/products/${comment.productId}#comentarios`);
  },
};

module.exports = commentController;