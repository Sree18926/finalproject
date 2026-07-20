"""
app.py
=======
Flask REST API for the Fake News Detection project.

Endpoints
---------
GET  /            -> serves a simple status page (optional)
GET  /api/health  -> health check
POST /api/predict -> classify a news article as REAL or FAKE
GET  /api/history -> list all stored predictions
DELETE /api/history/<id> -> delete a single prediction
DELETE /api/history      -> clear all prediction history
GET  /api/stats          -> aggregate prediction statistics

The trained model (model.pkl) and vectorizer (vectorizer.pkl) are loaded
once at startup. Predictions are stored in a local SQLite database so the
admin dashboard can display history and statistics.

Run:
    python app.py
The server starts on http://127.0.0.1:5000
"""

import os
import re
import pickle
import sqlite3
import uuid
from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer

# ----------------------------------------------------------------------
# Configuration
# ----------------------------------------------------------------------
MODEL_PATH = "model.pkl"
VECTORIZER_PATH = "vectorizer.pkl"
DB_PATH = "predictions.db"

app = Flask(__name__)
# Allow the React frontend (running on another port) to call this API.
CORS(app)

# ----------------------------------------------------------------------
# Load model + vectorizer once at startup
# ----------------------------------------------------------------------
try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    with open(VECTORIZER_PATH, "rb") as f:
        vectorizer = pickle.load(f)
    print(f"[INFO] Loaded model from {MODEL_PATH}")
    print(f"[INFO] Loaded vectorizer from {VECTORIZER_PATH}")
except FileNotFoundError:
    print("[ERROR] model.pkl or vectorizer.pkl not found.")
    print("        Run 'python train_model.py' first to train the model.")
    model = None
    vectorizer = None

# Download NLTK stopwords (used during preprocessing).
try:
    nltk.download("stopwords", quiet=True)
except Exception as exc:
    print(f"[WARN] Could not download NLTK stopwords: {exc}")

stemmer = PorterStemmer()
stop_words = set(stopwords.words("english"))


# ----------------------------------------------------------------------
# Database helpers (SQLite)
# ----------------------------------------------------------------------
def init_db():
    """Create the predictions table if it does not already exist."""
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id TEXT PRIMARY KEY,
            text TEXT NOT NULL,
            label TEXT NOT NULL,
            confidence REAL NOT NULL,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


def save_prediction(text, label, confidence):
    """Insert a prediction row into the database."""
    conn = sqlite3.connect(DB_PATH)
    pred_id = str(uuid.uuid4())
    created_at = datetime.utcnow().isoformat()
    conn.execute(
        "INSERT INTO predictions (id, text, label, confidence, created_at) VALUES (?, ?, ?, ?, ?)",
        (pred_id, text, label, confidence, created_at),
    )
    conn.commit()
    conn.close()
    return pred_id, created_at


def fetch_history():
    """Return all predictions, newest first."""
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute(
        "SELECT id, text, label, confidence, created_at FROM predictions ORDER BY created_at DESC"
    ).fetchall()
    conn.close()
    return [
        {
            "id": r[0],
            "text": r[1],
            "label": r[2],
            "confidence": r[3],
            "createdAt": r[4],
        }
        for r in rows
    ]


def delete_prediction(pred_id):
    """Delete a single prediction by id."""
    conn = sqlite3.connect(DB_PATH)
    conn.execute("DELETE FROM predictions WHERE id = ?", (pred_id,))
    conn.commit()
    conn.close()


def clear_all_predictions():
    """Delete every prediction row."""
    conn = sqlite3.connect(DB_PATH)
    conn.execute("DELETE FROM predictions")
    conn.commit()
    conn.close()


def fetch_stats():
    """Return total, real and fake prediction counts."""
    conn = sqlite3.connect(DB_PATH)
    total = conn.execute("SELECT COUNT(*) FROM predictions").fetchone()[0]
    real = conn.execute("SELECT COUNT(*) FROM predictions WHERE label = 'REAL'").fetchone()[0]
    fake = conn.execute("SELECT COUNT(*) FROM predictions WHERE label = 'FAKE'").fetchone()[0]
    conn.close()
    return {"total": total, "real": real, "fake": fake}


# ----------------------------------------------------------------------
# Text preprocessing (must match train_model.py)
# ----------------------------------------------------------------------
def clean_text(text):
    """
    Clean text for prediction:
      - lowercase
      - remove non-alphabetic characters
      - remove stopwords
      - apply Porter stemming
    """
    text = text.lower()
    text = re.sub("[^a-z]", " ", text)
    words = text.split()
    words = [w for w in words if w not in stop_words]
    words = [stemmer.stem(w) for w in words]
    return " ".join(words)


# ----------------------------------------------------------------------
# Routes
# ----------------------------------------------------------------------
@app.route("/")
def index():
    """Simple landing page confirming the API is running."""
    return jsonify({
        "status": "ok",
        "service": "Fake News Detection API",
        "endpoints": ["/api/health", "/api/predict", "/api/history", "/api/stats"],
    })


@app.route("/api/health")
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "model_loaded": model is not None})


@app.route("/api/predict", methods=["POST"])
def predict():
    """
    Classify a news article as REAL or FAKE.

    Request JSON body:
        { "text": "the news article text" }

    Response JSON:
        { "label": "REAL" | "FAKE", "confidence": 0.0-1.0 }
    """
    if model is None or vectorizer is None:
        return jsonify({"error": "Model not loaded. Run train_model.py first."}), 503

    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()

    if not text:
        return jsonify({"error": "No text provided. Send a 'text' field."}), 400

    try:
        # Preprocess and vectorize the input text.
        cleaned = clean_text(text)
        vectorized = vectorizer.transform([cleaned])

        # Predict the label and probability.
        prediction = model.predict(vectorized)[0]
        probabilities = model.predict_proba(vectorized)[0]
        confidence = float(max(probabilities))

        # label: 1 = FAKE, 0 = REAL (per the Kaggle dataset).
        label = "FAKE" if prediction == 1 else "REAL"

        # Persist to history.
        save_prediction(text, label, confidence)

        return jsonify({"label": label, "confidence": round(confidence, 4)})
    except Exception as exc:
        return jsonify({"error": f"Prediction failed: {str(exc)}"}), 500


@app.route("/api/history")
def history():
    """Return all stored predictions."""
    return jsonify(fetch_history())


@app.route("/api/history/<pred_id>", methods=["DELETE"])
def remove_one(pred_id):
    """Delete a single prediction by id."""
    delete_prediction(pred_id)
    return jsonify({"status": "deleted", "id": pred_id})


@app.route("/api/history", methods=["DELETE"])
def remove_all():
    """Clear all prediction history."""
    clear_all_predictions()
    return jsonify({"status": "cleared"})


@app.route("/api/stats")
def stats():
    """Return aggregate prediction statistics for the dashboard."""
    return jsonify(fetch_stats())


# ----------------------------------------------------------------------
# Entry point
# ----------------------------------------------------------------------
if __name__ == "__main__":
    init_db()
    print("[INFO] Starting Flask server on http://127.0.0.1:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
