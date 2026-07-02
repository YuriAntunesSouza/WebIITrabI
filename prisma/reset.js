const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  console.log("Apagando todos os dados...");

  // Apaga na ordem correta (respeita foreign keys)
  await prisma.commentLike.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.buyerProfile.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.log.deleteMany();
  await prisma.user.deleteMany();

  console.log("Banco zerado.");

  // Limpa arquivos de uploads
  for (const dir of ["uploads/products", "uploads/comments"]) {
    const fullPath = path.resolve(__dirname, "..", dir);
    if (fs.existsSync(fullPath)) {
      for (const file of fs.readdirSync(fullPath)) {
        fs.unlinkSync(path.join(fullPath, file));
      }
    }
  }
  console.log("Uploads limpos.");

  // Recria usuários de teste
  const usuarios = [
    {
      name: "Admin Teste",
      email: "admin@marketmvp.com",
      password: "$2b$10$4jOQ9fHUsc6sn6BydR7OyeyBnlOww8O1CKpDgd95v/GYTV9e05UO6",
      role: "administrador",
    },
    {
      name: "Comprador Teste",
      email: "comprador@marketmvp.com",
      password: "$2b$10$ic6/.o5v8Kx0xg50mcypcO1yxhkTv4Ujo7lfwmFH8MBjH2U/xUUei",
      role: "comprador",
    },
    {
      name: "Vendedor Teste",
      email: "vendedor@marketmvp.com",
      password: "$2b$10$HL7UD3pnnOcqMysp2lbVT.UfM9gbFQEezLBZPTkHsO89kmHBJ8vES", 
      role: "vendedor",
    },
  ];

  for (const u of usuarios) {
    await prisma.user.create({ data: { ...u, isActive: 1, isVerified: 1 } });
  }

  console.log("Usuários de teste criados:");
  console.log("  admin@marketmvp.com       / Admin@123");
  console.log("  comprador@marketmvp.com   / Comprador@123");
  console.log("  vendedor@marketmvp.com    / Vendedor@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
