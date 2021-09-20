from flask import Flask


def create_app():
    # We create the Flask application object
    app = Flask(__name__)
    # Initialize the secret key
    app.config['SECRET_KEY'] = 'thisisasecret'
    # Import the views
    from .views import views
    from .auth import auth

    # Register the blueprints
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')

    return app
