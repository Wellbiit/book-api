from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import secrets
from flask_login import LoginManager

app = Flask(__name__)
app.config["SECRET_KEY"] = secrets.token_hex(16)
app.config["JWT_SECRET_KEY"] = secrets.token_hex(16)

CORS(app)
JWTManager(app)

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)

from . import routes