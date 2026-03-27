# Messenger System Technical Specification

This document details the architecture and implementation plan for a real-time messaging system integrated into a NestJS, PostgreSQL, and TypeORM stack.

## 1. System Architecture

The system uses a Modular NestJS approach. Socket.io handles real-time communication, while TypeORM manages the persistence of messages and conversation metadata.

```mermaid
graph TD
    Client((Chat Client)) -- WebSocket/Socket.io --> Gateway[Chat Gateway]
    Client -- REST API --> AuthCtrl[Auth Controller]

    subgraph NestJS Backend
        Gateway --> ChatSvc[Chat Service]
        ChatSvc --> RoomSvc[Room/Participant Service]
        ChatSvc --> MsgSvc[Message Service]

        RoomSvc --> TypeORM[(TypeORM / PostgreSQL)]
        MsgSvc --> TypeORM
    end

    subgraph Database Tables
        TypeORM --> Users
        TypeORM --> Conversations
        TypeORM --> Participants
        TypeORM --> Messages
    end
```

## 2. Database Schema (ERD)

To support both Peer-to-Peer (P2P) and Groups, we utilize a polymorphic "Conversation" model. A "Participant" link-table determines a user's role and access rights within that conversation.

**Note:** The `User` entity references the existing Identity module.

```mermaid
erDiagram
    USER ||--o{ PARTICIPANT : "member of"
    CONVERSATION ||--o{ PARTICIPANT : "has"
    CONVERSATION ||--o{ MESSAGE : "contains"
    USER ||--o{ MESSAGE : "sends"

    USER {
        uuid id PK
        string fullName
        string email
        string designation
    }
    CONVERSATION {
        uuid id PK
        enum type "P2P | GROUP"
        boolean isRestricted "If true, only ADMINs can message"
        timestamp createdAt
    }
    PARTICIPANT {
        uuid id PK
        uuid userId FK
        uuid conversationId FK
        enum role "ADMIN | MEMBER"
        timestamp lastReadAt
    }
    MESSAGE {
        uuid id PK
        uuid senderId FK
        uuid conversationId FK
        text content
        timestamp createdAt
    }
```

## 3. Core Logic & Sequence Diagrams

### 3.1. Peer-to-Peer (P2P) Messaging

In P2P mode, the system first checks if a private conversation exists between the two users. If not, it creates one.

```mermaid
sequenceDiagram
    participant A as User A (Sender)
    participant G as NestJS Gateway
    participant S as Chat Service
    participant DB as PostgreSQL
    participant B as User B (Receiver)

    A->>G: send_message(receiverId, content)
    G->>S: getOrCreateP2PConversation(senderId, receiverId)
    S->>DB: Query Conversation (type=P2P) involving both IDs
    alt Conversation Not Found
        S->>DB: Create New Conversation & Add Participants
    end
    DB-->>S: Conversation ID
    S->>DB: Save Message(content, conversationId)
    DB-->>S: Saved Message
    S-->>G: Success
    G->>B: emit 'new_message' (Room: UserB_ID)
    G->>A: emit 'message_sent' (Ack)
```

### 3.2. Restricted Group Messaging

This flow implements the requirement: "Group with only specific peers can message." The system checks the `isRestricted` flag on the conversation and the sender's role in the Participant table.

```mermaid
sequenceDiagram
    participant U as User (Member)
    participant G as NestJS Gateway
    participant S as Chat Service
    participant DB as PostgreSQL

    U->>G: send_message(groupId, content)
    G->>S: validatePermissions(userId, groupId)
    S->>DB: Query Participant (userId + groupId)
    DB-->>S: Return Participant (Role: MEMBER, Conv: isRestricted=true)

    alt User is MEMBER and Group is Restricted
        S-->>G: Throw ForbiddenException
        G-->>U: emit 'error' (Only admins can post messages here)
    else User is ADMIN OR Group is Open
        S->>DB: Save Message
        S-->>G: Success
        G->>G: io.to(groupId).emit('new_message')
    end
```

## 4. Implementation Strategy (TypeORM)

### Restricted Check Logic

Inside your `ChatService`, you can implement the permission check efficiently:

```typescript
async function canUserSendMessage(
  userId: string,
  conversationId: string,
): Promise<boolean> {
  const conversation = await this.conversationRepo.findOne({
    where: { id: conversationId },
  });

  // If it's a standard open group or P2P, allow
  if (!conversation.isRestricted) return true;

  // Check if user is an ADMIN
  const participant = await this.participantRepo.findOne({
    where: { userId, conversationId },
  });

  return participant?.role === 'ADMIN';
}
```

## 5. Deployment & Scalability Notes

- **WebSocket Rooms**: Upon connection, use `socket.join(user.id)` to make targeting P2P messages easy. For groups, use `socket.join(group.id)`.
- **Indexing**: Create a composite index in PostgreSQL on `(conversationId, createdAt DESC)` for the Messages table to ensure fast loading of chat history.
- **Authentication**: Pass the JWT token in the WebSocket handshake. Verify it in a `WsGuard` before allowing the connection.
- **Redis**: If you scale horizontally (multiple server instances), use the Socket.io Redis Adapter to synchronize events across nodes.
