from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager

db = SQLAlchemy()
DB_NAME = 'database.db'


def create_app():
    # We create the Flask application object
    app = Flask(__name__)
    # Initialize the secret key
    app.config['SECRET_KEY'] = 'thisisthesecretkey'
    # Specifying the database name and location
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    # Initialize the database
    db.init_app(app)

    # Initialize the login manager
    login_manager = LoginManager()
    # This will redirect users to the login page
    login_manager.login_view = 'auth.login'
    # Initialize the login manager
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))

    # Import the views
    from .views import views
    from .auth import auth

    # Register the blueprints
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')

    from .models import User, Note

    create_db(app)

    return app


def create_db(app):
    if not path.exists('website/' + DB_NAME):
        db.create_all(app=app)
        print('Database created!')
