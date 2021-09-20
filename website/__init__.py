from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path

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
