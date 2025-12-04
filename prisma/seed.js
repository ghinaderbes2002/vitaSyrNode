import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@example.com"; // غيّر على حسب الحاجة
  const adminPassword = "12345678"; // غيّر على حسب الحاجة
  const adminFullName = "Admin User";
  const adminPhone = "0000000000";

  // تحقق إذا مستخدم ADMIN موجود
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    // تشفير الباسورد
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hashedPassword,
        fullName: adminFullName,
        role: "ADMIN",
        phone: adminPhone,
        isActive: true,
      },
    });

    console.log(`Admin user ${adminEmail} created successfully.`);
  } else {
    console.log(`Admin user ${adminEmail} already exists.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
