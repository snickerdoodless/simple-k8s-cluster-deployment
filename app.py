from flask import jsonify
from flask import Flask, render_template
import os
import redis
import socket

app = Flask(__name__)

# CONFIG
redis_host = os.environ.get('REDIS_HOST', 'localhost') 
redis_port = int(os.environ.get('REDIS_PORT', 6379))

# Connection
conn = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)

# POD NAME
pod_name = os.environ.get('HOSTNAME', socket.gethostname())

@app.route('/')
def index():
    try:
        count = conn.incr('hits')
    except redis.exceptions.ConnectionError:
        count = 0  # Fallback if Redis is not running
        
    return render_template('index.html', count=count)

@app.route('/index')
def home():
    try:
        count = conn.incr('hits')
    except redis.exceptions.ConnectionError:
        count = 0  # Fallback if Redis is not running
        
    return render_template('index.html', count=count)

@app.route('/architecture')
def architecture():
    return render_template('architecture-diagram.html')

@app.route('/api/visit', methods=['POST'])
def register_visit():
    try:
        count = conn.incr('hits')
        return jsonify({'count': count, "pod": pod_name})
    except redis.exceptions.ConnectionError:
        return jsonify({'success': False}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        count = conn.get('hits')
        return jsonify({'count': count, "pod": pod_name})
    except redis.exceptions.ConnectionError:
        return jsonify({'success': False}), 500
        
if __name__ == '__main__':  
    app.run(debug=True, port=5000)