from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

def evaluate_model(y_true, y_pred, y_prob=None):
    """
    Prints evaluation metrics for a classification model.
    
    Args:
        y_true: True labels.
        y_pred: Predicted labels.
        y_prob: Predicted probabilities (optional, for ROC-AUC).
    """
    print("Evaluation Metrics:")
    print(f"Accuracy: {accuracy_score(y_true, y_pred):.4f}")
    print(f"Precision: {precision_score(y_true, y_pred, zero_division=0):.4f}")
    print(f"Recall: {recall_score(y_true, y_pred, zero_division=0):.4f}")
    print(f"F1 Score: {f1_score(y_true, y_pred, zero_division=0):.4f}")
    
    if y_prob is not None:
        try:
            print(f"ROC-AUC: {roc_auc_score(y_true, y_prob):.4f}")
        except ValueError:
            print("ROC-AUC: Not defined for this case (e.g. only one class in y_true)")
    
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_true, y_pred))
