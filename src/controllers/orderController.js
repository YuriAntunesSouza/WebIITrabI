const prisma = require("../config/prisma");

function getCart(req) {
  try {
    return JSON.parse(req.cookies.cart || "[]");
  } catch {
    return [];
  }
}

function setCart(res, cart) {
  res.cookie("cart", JSON.stringify(cart), { httpOnly: true, path: "/" });
}

const orderController = {
  addToCart: (req, res) => {
    const productId = parseInt(req.body.productId);
    const quantity = parseInt(req.body.quantity) || 1;
    if (!productId) return res.redirect("back");
    const cart = getCart(req);
    const existing = cart.find((i) => i.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }
    setCart(res, cart);
    res.redirect("/cart");
  },

  removeFromCart: (req, res) => {
    const productId = parseInt(req.body.productId);
    const cart = getCart(req).filter((i) => i.productId !== productId);
    setCart(res, cart);
    res.redirect("/cart");
  },

  showCart: async (req, res) => {
    const cart = getCart(req);
    if (cart.length === 0) return res.render("cart", { items: [], total: 0 });
    const products = await prisma.product.findMany({
      where: { id: { in: cart.map((i) => i.productId) } },
      include: { Images: true },
    });
    const items = cart
      .map((c) => {
        const product = products.find((p) => p.id === c.productId);
        return product
          ? { product, quantity: c.quantity, subtotal: product.price * c.quantity }
          : null;
      })
      .filter(Boolean);
    const total = items.reduce((acc, i) => acc + i.subtotal, 0);
    res.render("cart", { items, total });
  },

  showCheckout: async (req, res) => {
    const cart = getCart(req);
    if (cart.length === 0) return res.redirect("/cart");
    const products = await prisma.product.findMany({
      where: { id: { in: cart.map((i) => i.productId) } },
      include: { Images: true },
    });
    const items = cart
      .map((c) => {
        const product = products.find((p) => p.id === c.productId);
        return product
          ? { product, quantity: c.quantity, subtotal: product.price * c.quantity }
          : null;
      })
      .filter(Boolean);
    const total = items.reduce((acc, i) => acc + i.subtotal, 0);
    const profile = await prisma.buyerProfile.findUnique({
      where: { userId: req.user.id },
    });
    res.render("checkout", { items, total, profile: profile || null });
  },

  createOrder: async (req, res) => {
    const cart = getCart(req);
    if (cart.length === 0) return res.redirect("/cart");
    const productIds = cart.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const items = cart
      .map((c) => {
        const product = products.find((p) => p.id === c.productId);
        return product
          ? { productId: c.productId, quantity: c.quantity, price: product.price }
          : null;
      })
      .filter(Boolean);
    const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    await prisma.order.create({
      data: {
        userId: req.user.id,
        total,
        Items: { create: items },
      },
    });
    setCart(res, []);
    res.redirect("/orders");
  },

  listOrders: async (req, res) => {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { Items: { include: { Product: { include: { Images: true } } } } },
      orderBy: { createdAt: "desc" },
    });
    res.render("orders", { orders });
  },

  updateOrderStatus: async (req, res) => {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    const allowed = ["pendente", "enviado", "entregue", "cancelado"];
    if (!allowed.includes(status)) return res.redirect("/seller");
    // Verifica que pelo menos um item do pedido é do vendedor logado
    const order = await prisma.order.findFirst({
      where: { id: orderId, Items: { some: { Product: { userId: req.user.id } } } },
    });
    if (!order) return res.redirect("/seller");
    await prisma.order.update({ where: { id: orderId }, data: { status } });
    res.redirect("/seller");
  },
};

module.exports = orderController;
