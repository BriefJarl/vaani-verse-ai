
# Vaani Verse AI Study Assistant — System Design (Judge‑Grade)

## 1. Design Objectives
- Voice-first  
- Modular AI agents  
- Low latency  
- Scalable MVP architecture  
- Implementation ready  

---

## 2. High Level Architecture

User  
 → Voice Interface  
 → Intent + Agent Layer  
 → Backend Services  
 → Database  
 → Reports / Calendar / Notifications  

---

## 3. Core Layers

### 3.1 Voice & NLP Layer
- Whisper / STT  
- Language detection  
- Intent extraction  

---

### 3.2 AI Agent Layer

| Agent | Function |
|-------|----------|
| Planner | Build schedules |
| Rescheduler | Recover backlog |
| Tutor | Quiz & validate |
| Analytics | Reports & KPIs |

---

### 3.3 Backend Services

- Auth Service  
- Goal Service  
- Task Engine  
- Quiz Engine  
- Notification Service  

Framework: Node.js + Express  

---

### 3.4 Data Model (Key Tables)

- User(id, language, prefs)  
- Goal(id, user, deadline)  
- Task(id, goal, status, date)  
- Quiz(id, task, score)  
- Report(id, metrics, week)  

---

## 4. Core Workflow

1. User speaks  
2. Speech → Intent  
3. Planner generates schedule  
4. Tasks stored  
5. Execution  
6. Tutor validates  
7. Analytics updates  

---

## 5. Rescheduling Logic (Judge Interest)

Algorithm:
- Detect missed tasks  
- Compute remaining capacity  
- Weight by priority + difficulty  
- Redistribute without overload  

Guarantee:
- No day exceeds capacity  
- Critical tasks preserved  

---

## 6. Security & Reliability

- JWT Auth  
- Role based access  
- Encrypted DB  
- Retry queues  
- Daily backups  

---

## 7. Deployment

- Frontend: React Native  
- Backend: Serverless (AWS Lambda)  
- DB: Supabase PostgreSQL  
- Notifications: FCM  
- Reports: PDF + Sheets  

---

## 8. Why This Design Wins (Judge View)

- Multi‑agent AI = modular + scalable  
- Validation‑based completion = unique  
- Voice‑first = accessibility  
- Low‑bandwidth friendly  

---

## 9. Limitations

- STT accuracy dependency  
- Quiz quality model‑dependent  
- Partial offline only  

---

## 10. Future Enhancements

- On‑device STT  
- RL scheduling  
- Personalized tutor models  
- Offline‑first sync  
