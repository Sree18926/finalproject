# Fake News Detection Using Machine Learning

A Final Year B.Sc. Computer Science project that uses **Natural Language Processing** and a **Logistic Regression** classifier to detect whether a news article is **REAL** or **FAKE**.

Built with **Python, Flask, Scikit-learn, NLTK** (backend + ML) and **React + Tailwind CSS** (frontend).

---

## Table of Contents

1. [Features](#features)
2. [Folder Structure](#folder-structure)
3. [Requirements](#requirements)
4. [Installation (Step by Step in VS Code)](#installation-step-by-step-in-vs-code)
5. [Running the Project](#running-the-project)
6. [Connecting the Frontend to the Backend](#connecting-the-frontend-to-the-backend)
7. [Usage Guide](#usage-guide)
8. [Project Report (IEEE Format)](#project-report-ieee-format)
9. [Presentation (15 Slides)](#presentation-15-slides)
10. [Viva Questions & Answers](#viva-questions--answers)
11. [Troubleshooting](#troubleshooting)

---

## Features

- **Modern responsive UI** with Home, About, Detect, Contact and Admin pages.
- **Light & Dark mode** with system preference detection.
- **ML-powered detection** using TF-IDF + Logistic Regression.
- **Confidence percentage** displayed with every prediction.
- **Color-coded results** — green for REAL, red for FAKE.
- **Voice input** using the Web Speech API.
- **Text-to-speech** reads the prediction aloud.
- **Admin dashboard** with statistics chart, searchable history, and delete.
- **Export prediction history to PDF**.
- **REST API** built with Flask.
- **Prediction history** stored in SQLite (backend) or localStorage (preview).

---

## Folder Structure

```
project/
│── backend/
│   │── app.py                  # Flask REST API server
│   │── train_model.py          # Trains the Logistic Regression model
│   │── requirements.txt        # Python dependencies
│   │── model.pkl               # Saved model (generated after training)
│   │── vectorizer.pkl          # Saved TF-IDF vectorizer (generated)
│   │── predictions.db          # SQLite DB for history (generated)
│   │── dataset/
│   │   │── train.csv           # Kaggle Fake News dataset (download)
│   │   └── README.md
│
│── src/                        # React frontend
│   │── App.tsx                 # Root component + routing
│   │── main.tsx                # Entry point
│   │── index.css               # Tailwind + custom styles
│   │── lib/
│   │   │── api.ts              # API client (calls Flask)
│   │   │── theme.ts            # Dark/light theme hook
│   │   └── router.ts           # Hash router
│   │── components/
│   │   │── Navbar.tsx
│   │   └── Footer.tsx
│   │── pages/
│   │   │── HomePage.tsx
│   │   │── AboutPage.tsx
│   │   │── DetectPage.tsx
│   │   │── ContactPage.tsx
│   │   └── AdminPage.tsx
│
│── index.html
│── package.json
│── tailwind.config.js
│── vite.config.ts
│── README.md                   # This file
│── PROJECT_REPORT.md           # IEEE-format project report
│── PRESENTATION.md             # 15-slide outline
│── VIVA_QUESTIONS.md           # Viva Q&A
```

---

## Requirements

### Backend (Python)
- Python 3.9 or higher
- Flask, scikit-learn, pandas, numpy, nltk, flask-cors
- Kaggle Fake News dataset (`train.csv`)

### Frontend (Node.js)
- Node.js 18+ and npm
- React 18, Tailwind CSS 3, Vite 5

---

## Installation (Step by Step in VS Code)

### Part A — Backend Setup

1. **Install Python 3.9+** from [python.org](https://www.python.org/downloads/).
   Verify in a terminal:
   ```bash
   python --version
   ```

2. **Open the project folder in VS Code.**
   - `File > Open Folder` → select the `project/` folder.
   - Open a terminal in VS Code: `Terminal > New Terminal`.

3. **Create and activate a virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS / Linux:
   source venv/bin/activate
   ```

4. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Download the Kaggle Fake News dataset:**
   - Go to [Kaggle Fake News Dataset](https://www.kaggle.com/c/fake-news/data).
   - Download `train.csv` and place it in `backend/dataset/train.csv`.

6. **Train the model:**
   ```bash
   python train_model.py
   ```
   This creates `model.pkl` and `vectorizer.pkl` in the `backend/` folder.

7. **Start the Flask API:**
   ```bash
   python app.py
   ```
   The API runs on `http://127.0.0.1:5000`.

### Part B — Frontend Setup

8. **Install Node.js 18+** from [nodejs.org](https://nodejs.org/).

9. **In a NEW VS Code terminal** (keep the Flask server running):
   ```bash
   cd project      # the project root containing package.json
   npm install
   ```

10. **(Optional) Point the frontend at the Flask API.**
    Create a `.env` file in the project root:
    ```
    VITE_API_URL=http://127.0.0.1:5000/api
    ```
    If this is not set, the frontend runs in **simulation mode** (local
    heuristic predictions) so you can demo the UI without the backend.

11. **Start the frontend dev server:**
    ```bash
    npm run dev
    ```
    Open the URL shown in the terminal (usually `http://localhost:5173`).

---

## Running the Project

| Step | Command | Where |
|------|---------|-------|
| Train model | `python train_model.py` | `backend/` |
| Start API | `python app.py` | `backend/` |
| Start UI | `npm run dev` | project root |
| Build UI | `npm run build` | project root |

---

## Connecting the Frontend to the Backend

The frontend talks to the Flask API through `src/lib/api.ts`. Set
`VITE_API_URL` in a `.env` file to enable live predictions:

```
VITE_API_URL=http://127.0.0.1:5000/api
```

Without this variable the app uses a built-in heuristic so the UI is
fully demoable on its own.

---

## Usage Guide

1. Open the **Detect** page.
2. Paste a news article (or click a sample, or use **Voice** input).
3. Click **Predict**.
4. See the **REAL** (green) or **FAKE** (red) result with confidence %.
5. Enable **TTS** to hear the result read aloud.
6. Visit the **Admin** page to view history, search, delete, and export PDF.

---

## Project Report (IEEE Format)

See **[PROJECT_REPORT.md](./PROJECT_REPORT.md)** for the full IEEE-format
report (Abstract, Introduction, Literature Survey, Methodology, System
Design, Implementation, Results, Conclusion, References).

---

## Presentation (15 Slides)

See **[PRESENTATION.md](./PRESENTATION.md)** for a slide-by-slide outline
you can paste into PowerPoint or Google Slides.

---

## Viva Questions & Answers

See **[VIVA_QUESTIONS.md](./VIVA_QUESTIONS.md)** for 25 common viva
questions with model answers.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `model.pkl not found` | Run `python train_model.py` first. |
| `ModuleNotFoundError: nltk` | Run `pip install -r requirements.txt`. |
| CORS error in browser | `flask-cors` is already configured; ensure Flask is running. |
| Predictions look random | Set `VITE_API_URL` so the frontend uses the real model. |
| `train.csv not found` | Download it from Kaggle and place in `backend/dataset/`. |

---

## License

This project is for educational purposes as part of a B.Sc. Computer
Science Final Year submission.
