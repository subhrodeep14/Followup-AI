import { prisma } from "@/lib/prisma";
import { DocumentStatus } from "@prisma/client";

type CreateDocumentInput = {
  title: string;
  fileName: string;
  fileUrl: string;
  publicId: string;
  fileType: string;
  fileSize: number;
  userId: string;
};

export async function createDocument(data: CreateDocumentInput) {
  return prisma.document.create({
    data: {
      title: data.title,
      fileName: data.fileName,
      fileUrl: data.fileUrl,
      publicId: data.publicId,
      fileType: data.fileType,
      fileSize: data.fileSize,
      userId: data.userId,
      status: DocumentStatus.UPLOADED,
    },
  });
}

export async function getDocuments(userId: string) {
  return prisma.document.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getDocumentById(
  id: string,
  userId: string
) {
  return prisma.document.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export async function updateDocumentStatus(
  id: string,
  status: DocumentStatus
) {
  return prisma.document.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
}

export async function deleteDocument(id: string, userId: string) {
  return prisma.document.deleteMany({
    where: {
      id,
      userId,
    },
  });
}