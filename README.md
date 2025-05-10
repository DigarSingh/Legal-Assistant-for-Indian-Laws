# 🇮🇳 RAGify India: Legal Assistant for Indian Laws

> “AI-Powered Legal Assistant for Navigating Indian Laws”

Combines:
✅ Retrieval-Augmented Generation (RAG)  
✅ Legal data from India Code & legal databases  
✅ Multi-lingual support for Indian languages

![RAGify India Logo](A_2D_digital_graphic_design_logo_for_"RAGify_India.png)

---

## 🧱 MODULES & WORKFLOW

### 🔹 1. User Query Handling

- User chats via WhatsApp or web-based chatbot.
- Backend parses query → identifies legal topic.
- Uses RAG (BERT + Mistral-7B) to fetch & generate a context-aware response.
- Returns answer with citations from India Code/legal databases.

**Tech Stack:**
- Frontend: WhatsApp API / Web UI
- Backend: Node.js + Express
- RAG: Mistral-7B (generation) + BERT (retrieval)
- Data: India Code API, legal CSVs

---

### 🔹 2. Multi-lingual Support

- Detects & translates 10+ Indian languages (Hindi, Tamil, Bengali, etc.).
- Translates query → English → Processes via RAG → Translates back to user’s language.

**Tech Stack:**
- Translation: IndicBERT + Whisper (for voice)
- Detection: AI4Bharat Models
- Response: OpenLLM + Legal data

---

### 🔹 3. Citations & Legal Context

- Responses include links or section numbers from official sources.
- Uses India Code API to fetch and embed relevant citations.

---

### 🔹 4. Special Features

#### 🌐 Multi-lingual Query Support
- Native-language questions answered in the same language.

#### 🌾 Crop Price Lookup
- Integrated with Agmarknet API for real-time mandi prices.

#### 📝 Exam Results Checker
- Queries board/university results from [data.gov.in](https://data.gov.in/).

---

### 🔹 5. Admin Dashboard

**Features:**
- Monitor chatbot usage
- View section-wise query analytics
- Manage training datasets/API integrations

**Tech:**
- React (Frontend) + Node.js (Backend)
- PostgreSQL + Google Analytics

---

## 🌐 ARCHITECTURE OVERVIEW

[User Query]
↓
[Frontend: WhatsApp/Web UI]
↓
[Backend: Node.js + Express]
↓
┌────────────────────┬────────────────────┬────────────────────────┐
│ BERT Retrieval │ Mistral-7B Gen │ IndicBERT/Whisper │
└────────────────────┴────────────────────┴────────────────────────┘
↓ ↓ ↓
[India Code / CSVs] [Generated Response] [User Language Output]

yaml
Copy
Edit


---

## 📦 DEPLOYMENT STACK

| Component         | Tool                                                |
|------------------|-----------------------------------------------------|
| Frontend          | WhatsApp API / Web UI                              |
| Backend           | Node.js + Express                                   |
| AI Layer          | BERT, Mistral-7B, OpenLLM                           |
| Translation       | IndicBERT, Whisper                                  |
| Data Source       | India Code API, CSVs, Agmarknet, data.gov.in       |
| DB                | PostgreSQL                                          |
| Hosting           | Vercel (Frontend), Railway (Backend)               |

---

## ⚖️ LEGAL CONSIDERATIONS

- **Informational Use Only**: No legal advice is provided.
- **Data Privacy**: Follows GDPR and Indian data protection norms.

---

## 💸 MONETIZATION OPTIONS

- Premium subscription: Personalized legal help
- Legal document generation (e.g., rent agreements, notices)
- Legal research tool for professionals

---

## 🛠️ Contributors

> Developed with ❤️ by Team WeDevBytes from Graphic Era Deemed to Be University.
