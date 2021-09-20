from flask import Blueprint, render_template, redirect, url_for, request, flash
from flask.globals import request
from .models import User, Note
from werkzeug.security import generate_password_hash, check_password_hash
from website import db
from flask_login import login_user, logout_user, login_required, current_user

auth = Blueprint('auth', __name__)


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        # After authentication it will check if there is a username already in the database
        user = User.query.filter_by(username=username).first()
        if user:
            # The program check if the password is correct by using the check_password_hash function
            if check_password_hash(user.password, password):
                flash('You are now logged in', 'success')
                login_user(user, remember=True)
                return redirect(url_for('views.home'))
            else:
                flash('Incorrect password', category='error')
        else:
            flash('User not found', category='error')

    return render_template('login.html', boolean=True)


@auth.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('auth.login'))


@auth.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        password_confirm = request.form.get('password_confirm')

        # After authentication it will check if there is a username already in the database
        user = User.query.filter_by(username=username).first()
        email_user = User.query.filter_by(email=email).first()
        if user or email_user:
            flash('Username or email already exists')
        elif len(email) < 4:
            flash('Email is too short. Must be grater than 4 characters.',
                  category='error')
        elif len(password) < 7:
            flash(
                'Password is too short. Must be grater than 7 characters.', category='error')
        elif password != password_confirm:
            flash('Passwords do not match.', category='error')
        else:
            # We create the account and use the generate_password_hash function to hash the password and store it safely in the database.
            new_user = User(username=username, email=email, password=generate_password_hash(
                password, method='sha256'))
            db.session.add(new_user)
            db.session.commit()
            flash('User created successfully.', category='success')
            return redirect(url_for('views.home'))

    return render_template('sign_up.html')
