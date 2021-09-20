from flask import Blueprint, render_template, redirect, url_for, request, flash
from flask.globals import request

auth = Blueprint('auth', __name__)


@auth.route('/login', methods=['GET', 'POST'])
def login():
    data = request.form
    print(data)
    return render_template('login.html')


@auth.route('/logout')
def logout():
    return '<p>Logout</p>'


@auth.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        password_confirm = request.form.get('password_confirm')

        if len(email) < 4:
            flash('Email is too short. Must be grater than 4 characters.',
                  category='error')
        elif len(password) < 7:
            flash(
                'Password is too short. Must be grater than 7 characters.', category='error')
        elif password != password_confirm:
            flash('Passwords do not match.', category='error')
        else:
            flash('User created successfully.', category='success')

    return render_template('sign_up.html')
