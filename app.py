from flask import Flask, render_template
import requests

app = Flask(__name__)

@app.route("/")
@app.route("/index")
def index():
    response = requests.get('https://api.github.com/users/mabushelbaia/repos')
    # update the request based on the response 
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
    app.run(debug=False)