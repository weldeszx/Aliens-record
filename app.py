import os

from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

#DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:////tmp/flask_app.db')
DATABASE_URL = "postgres://tmlbegjycyjyal:b67285e2dab7bf4d476e0575d242435c932e6d7a98a0c38a51490487ea032b14@ec2-50-17-206-214.compute-1.amazonaws.com:5432/d4ui80ulr8l10s"

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
db = SQLAlchemy(app)


class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(100))
  email = db.Column(db.String(100))

  def __init__(self, name, email):
    self.name = name
    self.email = email


@app.route('/', methods=['GET'])
def index():
  return render_template('index.html', users=User.query.all())


@app.route('/user', methods=['POST'])
def user():
  u = User(request.form['name'], request.form['email'])
  db.session.add(u)
  db.session.commit()
  return redirect(url_for('index'))

if __name__ == '__main__':
  db.create_all()
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port, debug=True)