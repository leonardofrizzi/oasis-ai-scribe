# AI Scribe for Home Health OASIS Assessments

**🎥 Watch the presentation**: [Oasis AI Scribe - Demo Video](https://vimeo.com/1107209554)  
**🌐 Access online**: 👉 http://44.211.255.104:3000

---

## Repository
https://github.com/leonardofrizzi/oasis-ai-scribe

---

## Stack
- **Frontend**: Next.js + TailwindCSS  
- **Backend**: Node.js + TypeScript + Express  
- **Database**: PostgreSQL + Prisma ORM  
- **Infrastructure**: Docker + Docker Compose + AWS EC2  
- **Audio Transcription**: Whisper API (OpenAI)  

---

## Main Endpoints

### Patients
- **GET** `/patients` → List all patients
- **GET** `/patients/:id` → Get patient details
- **GET** `/patients/:id/notes` → List notes for a patient

### Notes
- **POST** `/notes` → Create a new note with audio upload
- **GET** `/notes/:id` → Get note details
- **PATCH** `/notes/:id` → Update a note
- **DELETE** `/notes/:id` → Delete a note

---

## Notes
- Only **Section G** of the OASIS form is implemented.  
- Initial patients are created via seed.  
- Audio is stored locally (not integrated with S3).  
- Project focused on demonstrating core functional flow.  

---

## Running Locally

### Prerequisites
- Node.js 18+
- Docker & Docker Compose installed
- OpenAI API key (for Whisper)

### Steps
```bash
# 1. Clone the repository
git clone https://github.com/leonardofrizzi/oasis-ai-scribe
cd oasis-ai-scribe

# 2. Create .env files

# Backend (server/.env)
DATABASE_URL="postgresql://postgres:password@db:5432/oasisdb"
OPENAI_API_KEY="YOUR_OPENAI_KEY"

# Frontend (client/.env)
NEXT_PUBLIC_API_URL=http://localhost:4000

# 3. Start containers
docker compose up -d --build

# 4. Apply migrations and seed
docker compose exec api npx prisma migrate deploy
docker compose exec api node prisma/seed.js