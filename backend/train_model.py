"""
train_model.py
================
Trains a Logistic Regression classifier to detect fake news using the
Kaggle Fake News dataset (dataset/train.csv).

Pipeline:
  1. Load the dataset with pandas.
  2. Clean the text (lowercase, remove non-alphabetic characters).
  3. Remove English stopwords using NLTK.
  4. Apply Porter stemming to reduce words to their root form.
  5. Convert text into numeric features with TF-IDF Vectorizer.
  6. Train a Logistic Regression model.
  7. Evaluate accuracy, precision, recall and F1-score.
  8. Save the trained model and vectorizer to disk using pickle.

Run this file once before starting the Flask server:
    python train_model.py
"""

import os
import re
import pickle

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score, precision_score,
                             recall_score, f1_score, confusion_matrix)

import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer


# ----------------------------------------------------------------------
# Configuration
# ----------------------------------------------------------------------
DATASET_PATH = os.path.join("dataset", "train.csv")  # Input CSV file
MODEL_PATH = "model.pkl"                             # Output model file
VECTORIZER_PATH = "vectorizer.pkl"                   # Output vectorizer file
RANDOM_STATE = 42                                    # For reproducibility
MAX_FEATURES = 5000                                   # TF-IDF feature limit


def download_nltk_resources():
    """Download required NLTK resources (stopwords) if not already present."""
    try:
        nltk.download("stopwords", quiet=True)
        print("[INFO] NLTK stopwords ready.")
    except Exception as exc:
        print(f"[WARN] Could not download NLTK stopwords: {exc}")


def load_dataset(path):
    """
    Load the Kaggle Fake News dataset from a CSV file.

    The dataset is expected to have at least these columns:
        - id, title, author, text, label
    where label = 0 means REAL and label = 1 means FAKE.

    Returns:
        texts  : list of article text strings
        labels : list of integer labels (0 = real, 1 = fake)
    """
    if not os.path.exists(path):
        raise FileNotFoundError(
            f"Dataset not found at '{path}'. "
            "Please download the Kaggle Fake News dataset and place "
            "train.csv inside the 'dataset/' folder."
        )

    df = pd.read_csv(path)
    print(f"[INFO] Loaded {len(df)} rows from {path}")

    # Fill any missing text with an empty string.
    df = df.fillna("")

    # Use the 'text' column for the article body. Fall back to 'title'
    # if the 'text' column is missing.
    text_col = "text" if "text" in df.columns else "title"
    label_col = "label" if "label" in df.columns else df.columns[-1]

    texts = df[text_col].astype(str).tolist()
    labels = df[label_col].astype(int).tolist()
    return texts, labels


def clean_text(text):
    """
    Clean a single piece of text.

    Steps:
        - Convert to lowercase.
        - Remove all non-alphabetic characters (keep a-z and spaces).
        - Remove English stopwords.
        - Apply Porter stemming to reduce words to their root.

    Args:
        text (str): Raw article text.

    Returns:
        str: Cleaned and stemmed text.
    """
    # Lowercase the text.
    text = text.lower()

    # Keep only alphabetic characters and spaces.
    text = re.sub("[^a-z]", " ", text)

    # Tokenize into words.
    words = text.split()

    # Remove English stopwords.
    stop_words = set(stopwords.words("english"))
    words = [w for w in words if w not in stop_words]

    # Apply Porter stemming.
    stemmer = PorterStemmer()
    words = [stemmer.stem(w) for w in words]

    # Rejoin into a single string.
    return " ".join(words)


def preprocess_corpus(texts):
    """Apply clean_text to every article in the list."""
    cleaned = []
    for i, text in enumerate(texts):
        cleaned.append(clean_text(text))
        if (i + 1) % 2000 == 0:
            print(f"[INFO] Preprocessed {i + 1}/{len(texts)} articles...")
    return cleaned


def train_and_evaluate(texts, labels):
    """
    Vectorize the text with TF-IDF, train a Logistic Regression model,
    and print evaluation metrics on a held-out test set.

    Returns:
        vectorizer : fitted TfidfVectorizer
        model      : fitted LogisticRegression
        accuracy   : float test accuracy
    """
    # Split into training and testing sets (80/20).
    x_train, x_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.2, random_state=RANDOM_STATE, stratify=labels
    )

    # Convert text to TF-IDF feature vectors.
    vectorizer = TfidfVectorizer(max_features=MAX_FEATURES, ngram_range=(1, 2))
    x_train_vec = vectorizer.fit_transform(x_train)
    x_test_vec = vectorizer.transform(x_test)

    # Train the Logistic Regression classifier.
    model = LogisticRegression(max_iter=1000, random_state=RANDOM_STATE)
    model.fit(x_train_vec, y_train)

    # Evaluate on the test set.
    y_pred = model.predict(x_test_vec)
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)

    print("\n========== MODEL EVALUATION ==========")
    print(f"Accuracy  : {accuracy:.4f}")
    print(f"Precision : {precision:.4f}")
    print(f"Recall    : {recall:.4f}")
    print(f"F1-Score  : {f1:.4f}")
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    print("=====================================\n")

    return vectorizer, model, accuracy


def save_model(vectorizer, model, accuracy):
    """Serialize the vectorizer and model to disk using pickle."""
    with open(VECTORIZER_PATH, "wb") as f:
        pickle.dump(vectorizer, f)
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)
    print(f"[INFO] Saved vectorizer -> {VECTORIZER_PATH}")
    print(f"[INFO] Saved model      -> {MODEL_PATH}")
    print(f"[INFO] Test accuracy    : {accuracy:.4f}")


def main():
    """Entry point: run the full training pipeline."""
    print("=" * 50)
    print("  Fake News Detection — Model Training")
    print("=" * 50)

    download_nltk_resources()

    # 1. Load data
    texts, labels = load_dataset(DATASET_PATH)

    # 2. Preprocess text
    print("[INFO] Preprocessing text (this may take a minute)...")
    cleaned_texts = preprocess_corpus(texts)

    # 3. Train + evaluate
    vectorizer, model, accuracy = train_and_evaluate(cleaned_texts, labels)

    # 4. Save artifacts
    save_model(vectorizer, model, accuracy)

    print("\n[DONE] Training complete. You can now run the Flask app:")
    print("       python app.py")


if __name__ == "__main__":
    main()
