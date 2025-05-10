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

