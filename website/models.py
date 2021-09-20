from website import db  # import the database
from flask_login import UserMixin  # import the UserMixin class
from sqlalchemy.sql import func


class Note(db.Model):
    """
    Note class for the notes table
    """
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.String(10000))
    date = db.Column(db.DateTime(timezone=True), default=func.now())
    # With the user_id we can store the user that created the note
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


class User(db.Model, UserMixin):  # create the User class
    """
    User class for the user table
    """
    id = db.Column(db.Integer, primary_key=True)  # create the id column
    # create the username column
    username = db.Column(db.String(20), unique=True, nullable=False)
    # create the email column, unique=True means that the email cannot be duplicated
    email = db.Column(db.String(100), unique=True)
    # create the password column
    password = db.Column(db.String(100))
    # create the admin column
    admin = db.Column(db.Boolean)
    # create the relationship between the user and the notes
    notes = db.relationship('Note')
