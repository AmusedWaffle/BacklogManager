from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import hashlib
from flask_cors import CORS
#pip install flask flask_sqlalchemy psycopg2

app = Flask(__name__)

#Connection: MAKE SURE TO REPLACE USERNAME:PASSWORD WITH THE ONE SET UP ON YOUR OWN DEVICE
#SSH Tunnel Forward to Local Port: ssh -L 5433:127.0.0.1:5432 USERNAME@128.113.126.87
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://USERNAME:1234@127.0.0.1:5433/backlog_manager'

db = SQLAlchemy(app)

#Define basic users table
class Users(db.Model):
    email = db.Column(db.String(100), unique=True, nullable=False, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'


#Temporary table
class Preferences(db.Model):
    email = db.Column(db.String(100), unique=True, nullable=False, primary_key=True)
    prefer = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

#Create tables in the database (one-time setup for now)
with app.app_context():
    db.create_all()

#Testing insert to table
#Go to http://127.0.0.1:5000/insert_test_user on browser to activate
@app.route('/insert_test_user', methods=['GET'])
def insert_test_user():
    test_user = Users(email="test@example.com", password_hash="hashedpassword123")
    db.session.add(test_user)
    db.session.commit()
    return "Test user inserted successfully!"


def hash_password(password: str) -> str:
    """Hashes a password using SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(input_password: str, stored_hash: str) -> bool:
    """Verifies if the input password matches the stored hash."""
    return hash_password(input_password) == stored_hash

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = Users.query.filter_by(email=email).first()
    if user and verify_password(password, user.password_hash):
        return jsonify({"message": "Login successful!"}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401
    
@app.route('/create_account', methods=['POST'])
def create_account():
    data = request.json
    email = data.get("email")
    name = data.get("username")
    password = data.get("password")
    confirm_password = data.get("confirmPassword")

    new_user = Users(email=email, name=name, password_hash=hash_password(password))
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Account created successfully!"}), 201

if __name__ == '__main__':
    app.run(debug=False)