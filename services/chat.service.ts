import { prisma } from "@/lib/prisma";

export async function createConversation(
  userId: string,
  title: string
) {
  return prisma.conversation.create({
    data: {
      userId,
      title,
    },
  });
}

export async function getConversation(
  conversationId: string,
  userId: string
) {
  return prisma.conversation.findFirst({
    where: {
      id: conversationId,
      userId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

export async function saveMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string
) {
  return prisma.message.create({
    data: {
      conversationId,
      role,
      content,
    },
  });
}

export async function getUserConversations(
  userId: string
) {
  return prisma.conversation.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });
}

export async function deleteConversation(
  conversationId: string,
  userId: string
) {
  return prisma.conversation.deleteMany({
    where: {
      id: conversationId,
      userId,
    },
  });
}