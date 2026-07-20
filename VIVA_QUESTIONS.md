# Viva Questions & Answers

25 common viva questions for the Fake News Detection project, with
model answers.

---

### 1. What is fake news?
Fake news is deliberately fabricated information presented as real news,
intended to mislead readers, often for political or financial gain.

### 2. Why is fake news detection important?
It spreads faster than real news, can influence elections and public
opinion, and can cause panic or harm. Automated detection helps readers
assess credibility at scale.

### 3. What dataset did you use?
The Kaggle Fake News dataset (`train.csv`) with 20,800 labeled articles.
`label = 0` is REAL, `label = 1` is FAKE.

### 4. What machine learning algorithm did you use?
Logistic Regression — a linear classifier that models the probability of
an article being FAKE.

### 5. Why Logistic Regression over deep learning?
It is fast, interpretable, works well on sparse TF-IDF features, and
requires far less compute — ideal for an educational tool.

### 6. What is TF-IDF?
Term Frequency–Inverse Document Frequency. It weights words by how
important they are in a document relative to the whole corpus. Common
words get low weights; distinctive words get high weights.

### 7. What are stopwords?
Common words like "the", "is", "at" that carry little meaning. We remove
them using the NLTK English stopwords list.

### 8. What is stemming?
Reducing a word to its root form. The Porter stemmer turns "running" →
"run", "articles" → "articl". It reduces vocabulary size.

### 9. Stemming vs. lemmatization?
Stemming is a crude rule-based chop; lemmatization uses a dictionary to
return a real root word. Stemming is faster; lemmatization is more
accurate.

### 10. What preprocessing steps did you apply?
Lowercasing → regex cleaning (keep a–z) → stopword removal → Porter
stemming → TF-IDF vectorization.

### 11. How did you split the data?
80% training, 20% testing, with stratified sampling to preserve the
class balance.

### 12. What evaluation metrics did you use?
Accuracy, precision, recall, F1-score, and the confusion matrix.

### 13. What accuracy did you achieve?
Approximately 94% on the test set.

### 14. What is a confusion matrix?
A 2×2 table showing true positives, true negatives, false positives, and
false negatives — used to compute precision, recall, and accuracy.

### 15. How is the model saved?
Using Python's `pickle` module — `model.pkl` and `vectorizer.pkl` store
the trained classifier and the fitted TF-IDF vectorizer.

### 16. What is Flask?
A lightweight Python web framework. I used it to build a REST API that
serves predictions to the frontend.

### 17. What is a REST API?
An API that follows REST conventions, using HTTP methods (GET, POST,
DELETE) and JSON payloads over HTTP.

### 18. How does the frontend talk to the backend?
The React app sends a POST request with the article text to
`/api/predict`; the Flask API returns `{ label, confidence }` as JSON.

### 19. How did you handle CORS?
Using the `flask-cors` package, which adds the `Access-Control-Allow-Origin`
header so the browser permits cross-origin requests.

### 20. What is pickle and why use it?
Pickle serializes Python objects to a file. We use it to save the
trained model so we don't have to retrain on every server start.

### 21. What are the limitations of your project?
- Only English text.
- Only analyzes text content, not images or source URLs.
- May misclassify satire or newly emerging fake-news styles.

### 22. How does voice input work?
Using the browser's Web Speech API (`SpeechRecognition`), which
transcribes speech to text that is then sent for prediction.

### 23. How does text-to-speech work?
Using the Web Speech API (`speechSynthesis`), the browser reads the
prediction result aloud for accessibility.

### 24. How is prediction history stored?
In the backend, in a SQLite database. In the preview mode (no backend),
in the browser's localStorage.

### 25. Future enhancements?
Deep learning (BERT/LSTM), multilingual support, a browser extension,
and source credibility / URL analysis.
