# FollowUp AI - System Architecture


## Vision

FollowUp AI is an AI-powered knowledge workspace that transforms business documents into searchable knowledge using Retrieval-Augmented Generation (RAG).

Users can upload contracts, proposals, meeting notes, SOPs, policies, and other business documents, then ask natural language questions and receive accurate answers grounded in their own data.

The long-term vision is to evolve FollowUp AI into a collaborative AI workspace for teams, where organizational knowledge is searchable, traceable, and continuously enriched by AI.

---

# System Overview

                    +----------------------+
                    |      Next.js UI      |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |     API Routes       |
                    +----------+-----------+
                               |
          +--------------------+-------------------+
          |                                        |
          v                                        v
+----------------------+               +----------------------+
|     Cloudinary       |               |   PostgreSQL         |
|   File Storage       |               |  (Neon + Prisma)     |
+----------------------+               +----------------------+
          |                                        |
          +--------------------+-------------------+
                               |
                               v
                    +----------------------+
                    |    AI Pipeline       |
                    +----------+-----------+
---

# User Flow

1. User logs into FollowUp AI.
2. User uploads one or more documents.
3. File is uploaded to cloud storage.
4. Metadata is saved in PostgreSQL.
5. Text is extracted from the document.
6. Text is divided into semantic chunks.
7. Embeddings are generated for every chunk.
8. Embeddings are stored in pgvector.
9. User asks a question.
10. Similar chunks are retrieved.
11. Gemini receives:
    - User question
    - Relevant chunks
12. Gemini generates an accurate answer.

---

# Upload Pipeline

User

↓

Upload Document

↓

Cloudinary

↓

Save Metadata

↓

Status = UPLOADED
---

# Processing Pipeline

```
UPLOADED

↓

Extract Text

↓

Chunk Text

↓

Generate Embeddings

↓

Store Vectors

↓

READY
```

---

# Chat Pipeline

```
User Question

↓

Generate Query Embedding

↓

Similarity Search

↓

Relevant Chunks

↓

Prompt Builder

↓

Gemini AI

↓

Final Answer
```

---

# Folder Structure

app/
├── api/
│   ├── auth/
│   ├── conversations/
│   ├── documents/
│   │   ├── upload/
│   │   ├── process/
│   │   └── route.ts
│   │
│   └── chat/
│
├── dashboard/
│   ├── documents/
│   ├── new/
│   └── [id]/
│
└── (auth)/

components/
├── analysis/
├── auth/
├── dashboard/
├── documents/
├── layout/
└── ui/

lib/
├── ai/
├── auth/
├── chunking/
├── embeddings/
├── extraction/
├── storage/
├── prisma/
└── validations/

services/
├── conversation.service.ts
├── document.service.ts
├── retrieval.service.ts
└── chat.service.ts

prisma/

docs/
---

# Database Design

## User

Stores authentication information.

## Conversation

Stores raw meeting transcripts and client conversations.

## Analysis

Stores AI-generated summaries, action items, follow-up emails, and risk flags.

## Document

Stores metadata for uploaded files.

Fields include:

- title
- fileName
- fileUrl
- fileType
- fileSize
- status
- userId
- createdAt

Future additions:

- Chunk
- Embedding (pgvector)

# AI Pipeline

## Stage 1

Upload document

Status:

```
UPLOADED
```

---

## Stage 2

Extract readable text from:

- PDF
- DOCX
- TXT

Status:

```
PROCESSING
```

---

## Stage 3

Split document into semantic chunks.

Status:

```
CHUNKED
```

---

## Stage 4

Generate embeddings using Gemini Embedding API.

Status:

```
EMBEDDED
```

---

## Stage 5

Store embeddings inside PostgreSQL using pgvector.

Status:

```
READY
```

---

# Future Features

- Multi-document chat
- Conversation memory
- Team workspaces
- Role-based access control
- AI document search
- AI citations
- OCR support
- Audio transcription
- Meeting recording import
- Slack integration
- Gmail integration
- CRM integration
- Version history
- Document sharing
- Analytics dashboard

---

# Development Roadmap

## Phase 1

- Authentication
- Dashboard
- AI Conversation Analysis

## Phase 2

- Document Upload
- Metadata Storage

## Phase 3

- Text Extraction

## Phase 4

- Chunking

## Phase 5

- Embeddings

## Phase 6

- Vector Database

## Phase 7

- Retrieval

## Phase 8

- AI Chat

## Phase 9

- Memory

## Phase 10

- SaaS Features

---

# Tech Stack

Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

Backend

- Next.js API Routes
- Prisma ORM
- PostgreSQL (Neon)

Authentication

- JWT

AI

- Google Gemini
- Gemini Embedding API

Storage

- UploadThing

Vector Database

- pgvector

Deployment

- Vercel