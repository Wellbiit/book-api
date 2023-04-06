from sqlalchemy import Column, String, Date, Integer, create_engine, ForeignKey
from flask_login import UserMixin
from sqlalchemy.orm import declarative_base, sessionmaker

engine = create_engine("sqlite:///app.db?check_same_thread=False")
Base = declarative_base()
Session = sessionmaker(bind=engine)
session = Session()


class User(UserMixin, Base):
    __tablename__ = "users"

    id = Column("id", Integer, primary_key=True)
    nickname = Column("nickname", String)
    password = Column("password", String)
    email = Column("email", String)

    def __init__(self, nickname, password, email):
        super().__init__()
        self.nickname = nickname
        self.password = password
        self.email = email


class Book(Base, UserMixin):
    __tablename__ = "book"

    id = Column("id", Integer, primary_key=True)
    title = Column("title", String)
    user = Column("user", Integer, ForeignKey("users.id"))

    def __init__(self, title, user):
        super().__init__
        self.title = title
        self.user = user


Base.metadata.create_all(engine)
print("Done!")
