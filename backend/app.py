import textwrap

from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from IPython.display import display
from IPython.display import Markdown


import google.generativeai as genai

from pdfminer.high_level import extract_text

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(app.root_path, 'data.db')
app.config['UPLOAD_FOLDER'] = 'uploads'
db = SQLAlchemy(app)
CORS(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)


class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(120), nullable=False)


with app.app_context():
    db.create_all()


@app.route('/login', methods=['POST'])
def login():
    data = request.json

    print(data['username'])
    print(data['password'])

    user = User.query.filter_by(username=data['username']).first()

    if user and user.password == data['password']:
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Login failed'}), 500


@app.route('/upload', methods=['POST'])
def upload():
    files = request.files.getlist('files')
    for file in files:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        print("uploads:" + filepath)
        file.save(filepath)
        new_doc = Document(filename=file.filename)
        db.session.add(new_doc)
        db.session.commit()
    return jsonify({'message': 'Files uploaded successfully'}), 200


@app.route('/documents', methods=['GET'])
def get_documents():
    documents = Document.query.all()
    doc_list = [{'filename': doc.filename} for doc in documents]
    return jsonify(doc_list), 200


@app.route('/delete_file', methods=['POST'])
def delete_file():
    file_id = request.json.get('file_id')
    doc = Document.query.filter_by(filename=file_id).first()
    db.session.delete(doc)
    db.session.commit()
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file_id)
    os.remove(filepath)
    return '文件删除成功', 200


content = ""


def to_markdown(text):
  text = text.replace('•', '  *')
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))


@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data['message']

    print("chat:" + message)
    genai.configure(api_key=os.environ["Gemini_API_KEY"], transport="rest")
    model = genai.GenerativeModel('gemini-pro')
    global content
    if (message[-3:] == "pdf"):
        filepath = os.path.join("uploads", message)
        print("chat:" + filepath)
        content = ""
        print("content:" + content)
        content = extract_text(filepath) + "\n"
        text = content + "What does the passage mainly describe?？"
    else:
        text = content + message

    # text = to_markdown(text)
    response = model.generate_content(text)

    if response:
        reply = response.text
        return jsonify({'reply': reply}), 200
    else:
        return jsonify({'reply': 'Failed to analyze sentiment'}), 500


@app.route('/chatPDF', methods=['POST'])
def chatPDF():
    data = request.json
    message = data['message']

    print("chat:" + message)
    genai.configure(api_key=os.environ["Gemini_API_KEY"], transport="rest")
    model = genai.GenerativeModel('gemini-pro')

    message = message + "\n" + "解释上述内容"

    response = model.generate_content(message)

    if response:
        reply = response.text
        to_markdown(reply)
        return jsonify({'reply': reply}), 200
    else:
        return jsonify({'reply': 'Failed to analyze sentiment'}), 500

if __name__ == '__main__':
    app.run(debug=True)
