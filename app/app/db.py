from database import session, User, Book


book = session.query(User).first()
print(book, "query")