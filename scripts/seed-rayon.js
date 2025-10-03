const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedRayon() {
  try {
    console.log("🌱 Seeding rayon data...");
    const rayonData = [
      { namaRayon: "Rayon 1" },
      { namaRayon: "Rayon 2" },
      { namaRayon: "Rayon 3" },
      { namaRayon: "Rayon 4" },
      { namaRayon: "Rayon 5" },
      { namaRayon: "Rayon 6" },
      { namaRayon: "Rayon 7" },
      { namaRayon: "Rayon 8" },
      { namaRayon: "Rayon 9" },
      { namaRayon: "Rayon 10" },
      { namaRayon: "Rayon 11" },
      { namaRayon: "Rayon 12" },
      { namaRayon: "Rayon 13" },
      { namaRayon: "Rayon 14" },
      { namaRayon: "Rayon 15" },
      { namaRayon: "Rayon 16" },
      { namaRayon: "Rayon 17" },
      { namaRayon: "Rayon 18" },
    ];

    for (const rayon of rayonData) {
      await prisma.rayon.create({ data: rayon });
      console.log(`✅ Created rayon: ${rayon.name}`);
    }
  } catch (error) {
    console.error("❌ Error seeding rayon data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedRayon();
