import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.patient.createMany({
    data: [
      { name: "John Doe",     dob: new Date("1975-04-12") },
      { name: "Jane Smith",   dob: new Date("1980-11-30") },
      { name: "Robert Johnson", dob: new Date("1992-07-19") },
    ],
    skipDuplicates: true,
  });
  console.log("Patients seeded");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());