import { UserRepo } from "../../ports/user-repo";
import { User } from "../../user";
import crypto from "crypto";
import { prisma } from "./prisma-client";

export class PrismaUserRepo implements UserRepo {
  async find(email: string): Promise<User> {
    const userData = await prisma.user.findUnique({ where: { email: email } });
    return userData
      ? new User(userData.name, userData.email, userData.password, userData.id)
      : undefined;
  }

  async add(user: User): Promise<string> {
    const newId = crypto.randomUUID();

    await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
        id: newId,
      },
    });

    return newId;
  }

  async remove(email: string): Promise<void> {
    await prisma.user.delete({
      where: {
        email: email,
      },
    });
  }

  async list(): Promise<User[]> {
    const userList = await prisma.user.findMany();
    let users = [];

    for (const [i, user] of userList.entries()) {
      users[i] = new User(user.name, user.email, user.password, user.id);
    }

    return users;
  }
}
