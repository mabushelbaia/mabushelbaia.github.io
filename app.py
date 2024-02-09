from flask import Flask, render_template
from flask_frozen import Freezer
import requests

app = Flask(__name__)
freezer = Freezer(app)

@app.route("/")
@app.route("/index")
def index():
    response = requests.get('https://api.github.com/users/mabushelbaia/repos')
    repos = response.json()
    featured = []
    for repo in repos:
        if 'featured' in repo['topics']:
            featured.append(repo)
    lists = []
    for index, element in enumerate(featured):
        if index % 2 == 0:
            lists.append([])
        lists[-1].append(element)
    return render_template("index.html", projects=lists)

if __name__ == '__main__':
    freezer.freeze()
