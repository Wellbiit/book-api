import json

import requests
from datetime import datetime, timedelta
from app import app
from flask import jsonify
from .database import User, Book, session
from .db_controls import add_new_item, get_books_by, delete_user
from flask import render_template, request, redirect, make_response
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


def convert_date_to_object(date):
    return datetime.strptime(date, "%Y-%m-%d").date()


def add_book_to_database(book_data):
    book_data["date"] = convert_date_to_object(book_data["date"])
    book_data["user"] = 1
    book = Book(**book_data)
    add_new_item(book)


def create_response(status_code):
    response = make_response()
    response.status_code = status_code
    return response


@app.route("/create_book", methods=["POST"])
def create_book():
    data_from_request = request.get_json()
    print(data_from_request)
    try:
        add_book_to_database(data_from_request)
        response = make_response({"isAdded": True})
        response.status_code = 200
    except Exception as e:
        print(e)
        response = make_response({"isAdded": False, "exception": e})
        response.status_code = 500
    return response


@app.route("/get_books_by_date/<date>")
# TODO add jwt_required
@jwt_required()
def get_books_by_date(date):
    print(date)
    date = date[0:10]
    # date = datetime.fromisoformat(date)
    # date = date[0:10]
    data = get_books_by(date)
    response = make_response(data)
    return response

@app.route("/get_user_by_nickname")
def get_user_by_nickname(nickname: str):
    user = session.query(User).where(User.nickname == nickname).first
    return user


@app.route("/login", methods=["POST"])
def login():
    data_from_request = request.get_json()
    nickname = data_from_request["nickname"]
    password = data_from_request["password"]
    user_check = session.query(User).where(User.nickname == nickname).first()
    if user_check:
        if check_password_hash(user_check.password, password):
            token = create_access_token(identity=user_check.id, expires_delta=timedelta(days=30))
            print(token)
            response = make_response(jsonify({"isLogged": True, "token": token}), 200)
            print(response)
            print(response.get_json())
            return response
    response = make_response({"isLogged": False}, 401)
    return response


@app.route("/index")
@jwt_required()
def index():
    protected_data = "protected"
    id_user = get_jwt_identity()
    response = make_response(jsonify({"protected": protected_data, "id": id_user}), 200)
    return response


@app.route("/signup", methods=["POST"])
def signup():
    data_from_request = request.get_json()
    print(data_from_request)
    nickname = data_from_request["nickname"]
    user_check = session.query(User).where(User.nickname == nickname).first()
    if user_check:
        response = make_response(jsonify({"isRegistered": False, "reason": "userExists"}), 409)
        return response
    data_from_request["password"] = generate_password_hash(data_from_request["password"])
    new_user = User(**data_from_request)
    add_new_item(new_user)
    response = make_response(jsonify({"isRegistered": True}), 200)
    return response


@app.route("/delete_user_by/<nickname>")
def delete_user_by(nickname):
    try:
        delete_user(nickname)
        response_json = {"isDeleted": True}
        status = 200
    except:
        response_json = {"isDeleted": False}
        status = 500

    response = make_response(response_json, status)
    return response