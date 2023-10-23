import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createUser = async function () {
  const newUser = await prisma.user.create({
    data: {
      email: "david@null.net",
      name: "david",
      password: "david",
      id: "asdas",
    },
  });
};

createUser();
