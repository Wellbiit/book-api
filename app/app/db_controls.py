from .database import session, User, Book
from flask import jsonify
import json


def create_json_from(obj):
    book_dict = obj.__dict__

    # Видаляємо ключ "_sa_instance_state", який додає SQLAlchemy
    book_dict.pop('_sa_instance_state', None)

    #Перетворюємо дату на рядки, щоб повернути її користувачу
    book_dict['date'] = book_dict['date'].strftime('%Y-%m-%d')

    json_string = json.dumps(book_dict)
    return json_string


def add_new_item(obj):
    session.add(obj)
    session.commit()


def check_if_user_exist(nickname: str):
    user = session.query(User).where(User.nickname == nickname).first
    return user


def get_books_by(date):
    books = session.query(Book).filter(Book.date == date, Book.user == 1).all() #.
    jsonified_books = []
    for book in books:
        jsonified_books.append(create_json_from(book))
    return jsonified_books


def delete_user(nickname):
    session.query(User).filter(User.nickname == nickname).delete()