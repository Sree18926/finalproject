# Place the Kaggle Fake News dataset here.

This folder should contain the file **train.csv** from the
[Kaggle Fake News Dataset](https://www.kaggle.com/c/fake-news/data).

Expected columns:

| Column | Description                                  |
|--------|----------------------------------------------|
| id     | Unique article id                            |
| title  | Title of the news article                    |
| author | Author of the article                        |
| text   | Full article text (used for training)        |
| label  | 0 = REAL, 1 = FAKE                           |

After downloading, rename the file to `train.csv` and place it in this
folder, then run:

```bash
python train_model.py
```

This will train the model and produce `model.pkl` and `vectorizer.pkl`
in the `backend/` folder.
