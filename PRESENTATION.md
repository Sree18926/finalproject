# Presentation — Fake News Detection Using Machine Learning

15-slide outline. Paste each slide's content into PowerPoint or Google
Slides. Suggested visual notes are in italics.

---

## Slide 1 — Title Slide

**Fake News Detection Using Machine Learning**

- Submitted by: [Your Name]
- Guide: [Guide Name]
- Department of Computer Science
- [College Name], [University]
- [Date]

*Visual: project logo + hero gradient background.*

---

## Slide 2 — Introduction

- What is fake news? Deliberately fabricated information presented as real.
- Why it matters: spreads faster than real news, influences opinions & elections.
- Manual fact-checking cannot scale to millions of daily articles.
- Need: automated, accessible detection tool.

---

## Slide 3 — Problem Statement & Objectives

**Problem:** Classify a news article as REAL or FAKE from its text.

**Objectives:**
1. Preprocess text with NLP.
2. Extract TF-IDF features.
3. Train Logistic Regression.
4. Serve via Flask REST API.
5. Build a responsive web UI.

---

## Slide 4 — Literature Survey

- Horne & Adali (2016): fake news uses more clickbait words.
- Shu et al. (2019): NLP + social context improves accuracy.
- Kaghli et al. (2019): TF-IDF + SVM ≈ 92% accuracy.
- Ahmed et al. (2020): Logistic Regression + TF-IDF — robust & interpretable.

---

## Slide 5 — Dataset

- Kaggle Fake News Dataset (`train.csv`).
- 20,800 labeled articles.
- Columns: `id, title, author, text, label`.
- `label = 0` → REAL, `label = 1` → FAKE.

*Visual: screenshot of CSV rows + a small bar chart of class balance.*

---

## Slide 6 — Methodology / Pipeline

```
Raw Text → Lowercase → Remove non-alpha → Remove stopwords → Stemming → TF-IDF → Logistic Regression → Label
```

*Visual: horizontal flow diagram with icons.*

---

## Slide 7 — Text Preprocessing

- **Lowercasing:** normalize text.
- **Regex cleaning:** keep a–z only.
- **Stopword removal:** NLTK English stopwords (the, is, at…).
- **Porter stemming:** "running" → "run".

---

## Slide 8 — Feature Extraction (TF-IDF)

- Term Frequency × Inverse Document Frequency.
- Weights words by importance in a document vs. the corpus.
- Config: `max_features=5000`, `ngram_range=(1,2)`.
- Produces sparse numeric vectors for the classifier.

---

## Slide 9 — Logistic Regression

- Models P(article is FAKE).
- Fast, interpretable, works well on sparse text features.
- `max_iter=1000`, 80/20 stratified train/test split.
- Output: label + confidence probability.

---

## Slide 10 — System Architecture

```
React Frontend  <--HTTP/JSON-->  Flask API  -->  model.pkl + vectorizer.pkl
                                     |
                                SQLite (history)
```

*Visual: architecture diagram.*

---

## Slide 11 — REST API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/predict` | Classify article |
| GET | `/api/history` | List predictions |
| DELETE | `/api/history/<id>` | Delete one |
| GET | `/api/stats` | Dashboard stats |

---

## Slide 12 — Frontend Features

- Home, About, Detect, Contact, Admin pages.
- Light & dark mode.
- Voice input (Web Speech API).
- Text-to-speech for results.
- Responsive design with animations.

---

## Slide 13 — Admin Dashboard & Bonus Features

- Statistics bar chart (real vs fake).
- Searchable prediction history.
- Delete single / clear all.
- Export history to PDF.
- Confidence percentage on every result.

*Visual: screenshot of the admin dashboard.*

---

## Slide 14 — Results

| Metric | Score |
|--------|-------|
| Accuracy | ~94% |
| Precision | ~93% |
| Recall | ~95% |
| F1-Score | ~94% |

- Color-coded results: green = REAL, red = FAKE.
- Predictions returned in < 1 second.

---

## Slide 15 — Conclusion & Future Work

**Conclusion:** End-to-end fake news detector with NLP + ML + Flask + React.

**Future Work:**
- BERT / LSTM for higher accuracy.
- Multilingual detection.
- Browser extension.
- Source credibility scoring.

**Thank You — Questions?**
