from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import hashlib
import requests
#pip install flask flask_sqlalchemy psycopg2 flask_cors

app = Flask(__name__)
CORS(app)

#Connection: MAKE SURE TO REPLACE USERNAME:PASSWORD WITH THE ONE SET UP ON YOUR OWN DEVICE
#SSH Tunnel Forward to Local Port: ssh -L 5433:127.0.0.1:5432 USERNAME@128.113.126.87
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://zhengd3:1234@127.0.0.1:5433/backlog_manager'

db = SQLAlchemy(app)

API_KEY = "1af69e1cf8664df59d23e49cd5aca2ea"

'''
example use of RAWG API call
url = f"https://api.rawg.io/api/platforms?key={API_KEY}"
response = requests.get(url)
data = response.json()
print(data)'
'''

#Define basic users table
class Users(db.Model):
    email = db.Column(db.String(100), unique=True, nullable=False, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'
    
    def set_password(self, password: str):
        """Hashes and stores the password."""
        self.password_hash = hashlib.sha256(password.encode()).hexdigest()

    def verify_password(self, input_password: str) -> bool:
        """Checks if the given password matches the stored hash."""
        return self.password_hash == hashlib.sha256(input_password.encode()).hexdigest()

#Temporary table
class Preferences(db.Model):
    email = db.Column(db.String(100), unique=True, nullable=False, primary_key=True)
    prefer = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

#Create tables in the database (one-time setup for now)
with app.app_context():
    db.create_all()

#API route to register a new user: http://127.0.0.1:5000/register
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    existing_user = Users.query.filter((Users.email == data['email'])).first()
    if existing_user:
        return jsonify({"error": "User already exists!"}), 400

    new_user = Users(email=data['email'], name=data['name'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully!"}), 201

#Temp API route to add game for a user: http://127.0.0.1:5000/add_game
@app.route('/add_game', methods=['POST'])
def add_game():
    data = request.json
    user_id = data['email']
    rawg_id = data['game']

if __name__ == '__main__':
    app.run(debug=False)
