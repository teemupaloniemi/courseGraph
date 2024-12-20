#!/usr/bin/python3
from flask import Flask, send_file
import sys

app = Flask(__name__)

@app.route('/graph.js')
def serve_graph_js():
    return send_file('graph.js', mimetype='application/javascript')

@app.route('/document.js')
def serve_document_js():
    return send_file('document.js', mimetype='application/javascript')

@app.route('/reqs.json')
def serve_reqs_json():
    return send_file('reqs.json', mimetype='application/json')

@app.route('/course_acm.json')
def serve_acm_classes_json():
    return send_file('course_acm.json', mimetype='application/json')

@app.route('/modules.json')
def serve_modules_json():
    return send_file('modules.json', mimetype='application/json')

@app.route('/courses.json')
def serve_courses_json():
    return send_file('courses.json', mimetype='application/json')

@app.route('/')
def index():
    return send_file('index.html')

if __name__ == '__main__':
    port = 5000

    if len(sys.argv) > 1: 
        port = int(sys.argv[1])

    app.run(debug=True, port=port)
