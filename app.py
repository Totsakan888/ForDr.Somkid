"""
app.py - Main Flask Application for Mini Flashcard & Quiz App
Provides both web interface rendering and RESTful JSON APIs.
Designed for local development and seamless Vercel hosting.
"""

import os
import json
from flask import Flask, render_template, request, jsonify, Response
import database

base_dir = os.path.dirname(os.path.abspath(__file__))
app = Flask(
    __name__,
    template_folder=os.path.join(base_dir, "templates"),
    static_folder=os.path.join(base_dir, "static"),
)


@app.route("/")
def index():
    """Renders the main Flashcard & Quiz web interface."""
    return render_template("index.html")


# -------------------------------------------------------------
# RESTful API Endpoints
# -------------------------------------------------------------


@app.route("/api/cards", methods=["GET"])
def list_cards():
    """Fetch all flashcards with optional category, search, or status filter."""
    category = request.args.get("category")
    search = request.args.get("search")
    mastered_str = request.args.get("mastered")

    mastered = None
    if mastered_str is not None and mastered_str != "":
        try:
            mastered = int(mastered_str)
        except ValueError:
            pass

    cards = database.get_all_cards(category=category, search=search, mastered=mastered)
    return jsonify({"success": True, "cards": cards, "count": len(cards)})


@app.route("/api/cards/<int:card_id>", methods=["GET"])
def get_card(card_id: int):
    """Retrieve a single card by ID."""
    card = database.get_card_by_id(card_id)
    if not card:
        return jsonify({"success": False, "error": "Card not found"}), 404
    return jsonify({"success": True, "card": card})


@app.route("/api/cards", methods=["POST"])
def create_card():
    """Create a new flashcard with defensive validation."""
    data = request.get_json(silent=True) or request.form
    question = data.get("question", "").strip()
    answer = data.get("answer", "").strip()
    category = data.get("category", "General").strip() or "General"
    hint = data.get("hint", "").strip()
    difficulty = data.get("difficulty", "Medium")

    if not question or not answer:
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Question and Answer are required fields.",
                }
            ),
            400,
        )

    card_id = database.add_card(
        category=category,
        question=question,
        answer=answer,
        hint=hint,
        difficulty=difficulty,
    )

    created_card = database.get_card_by_id(card_id)
    return jsonify({"success": True, "card": created_card}), 201


@app.route("/api/cards/<int:card_id>", methods=["PUT"])
def update_card(card_id: int):
    """Update an existing card."""
    data = request.get_json(silent=True) or {}
    question = data.get("question", "").strip()
    answer = data.get("answer", "").strip()
    category = data.get("category", "General").strip() or "General"
    hint = data.get("hint", "").strip()
    difficulty = data.get("difficulty", "Medium")

    if not question or not answer:
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Question and Answer cannot be empty.",
                }
            ),
            400,
        )

    updated = database.update_card(
        card_id=card_id,
        category=category,
        question=question,
        answer=answer,
        hint=hint,
        difficulty=difficulty,
    )

    if not updated:
        return jsonify({"success": False, "error": "Card not found"}), 404

    return jsonify({"success": True, "card": database.get_card_by_id(card_id)})


@app.route("/api/cards/<int:card_id>", methods=["DELETE"])
def delete_card(card_id: int):
    """Delete a flashcard."""
    deleted = database.delete_card(card_id)
    if not deleted:
        return jsonify({"success": False, "error": "Card not found"}), 404
    return jsonify({"success": True, "message": "Card deleted successfully"})


@app.route("/api/cards/<int:card_id>/toggle", methods=["POST"])
def toggle_status(card_id: int):
    """Toggle card mastered status (Like checking off a To-Do item)."""
    card = database.toggle_mastered(card_id)
    if not card:
        return jsonify({"success": False, "error": "Card not found"}), 404
    return jsonify({"success": True, "card": card})


@app.route("/api/cards/<int:card_id>/review", methods=["POST"])
def submit_review(card_id: int):
    """Record learning review result ('remembered': true/false)."""
    data = request.get_json(silent=True) or {}
    remembered = bool(data.get("remembered", False))
    card = database.record_review(card_id, remembered)
    if not card:
        return jsonify({"success": False, "error": "Card not found"}), 404
    return jsonify({"success": True, "card": card})


@app.route("/api/categories", methods=["GET"])
def get_categories():
    """Retrieve list of existing categories for filtering."""
    categories = database.get_categories()
    return jsonify({"success": True, "categories": categories})


@app.route("/api/stats", methods=["GET"])
def get_statistics():
    """Get overall mastery rate, card counts, and review metrics."""
    stats = database.get_stats()
    return jsonify({"success": True, "stats": stats})


@app.route("/api/reset", methods=["POST"])
def reset_cards():
    """Reseeds the database to default sample educational cards."""
    database.init_db(force_reseed=True)
    return jsonify({"success": True, "message": "Database reset to default seeds."})


@app.route("/api/export", methods=["GET"])
def export_cards():
    """Exports all cards as a downloadable JSON file for easy backup or sharing."""
    cards = database.get_all_cards()
    json_data = json.dumps(cards, ensure_ascii=False, indent=2)
    return Response(
        json_data,
        mimetype="application/json",
        headers={"Content-Disposition": "attachment;filename=flashcards_backup.json"},
    )


@app.route("/api/import", methods=["POST"])
def import_cards():
    """Imports cards from a JSON payload."""
    data = request.get_json(silent=True)
    if not data or not isinstance(data, list):
        return jsonify({"success": False, "error": "Invalid JSON list payload."}), 400

    imported_count = 0
    for item in data:
        q = item.get("question", "").strip()
        a = item.get("answer", "").strip()
        cat = item.get("category", "General").strip() or "General"
        hint = item.get("hint", "").strip()
        diff = item.get("difficulty", "Medium")
        if q and a:
            database.add_card(cat, q, a, hint, diff)
            imported_count += 1

    return jsonify({"success": True, "imported_count": imported_count})


if __name__ == "__main__":
    # Ensure database is prepared
    database.init_db()
    print("=======================================================")
    print("[*] FlashDr. Flashcard App is running on http://127.0.0.1:5000")
    print("=======================================================")
    app.run(host="0.0.0.0", port=5000, debug=True)
