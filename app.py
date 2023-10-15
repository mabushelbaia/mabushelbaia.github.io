from flask import Flask, render_template
import requests

app = Flask(__name__)

@app.route("/")
@app.route("/index")
def index():
	return render_template("index.html", projects=featured)

if __name__ == '__main__':
    response = requests.get('https://api.github.com/users/mabushelbaia/repos')
    repos = response.json()
    featured = []
    for repo in repos:
        if repo['name'] in ["Ants-Simulator",  "Course-Schedule", "Padding-Oracle-Attack", "PIC16F877A-Calculator"]:
            featured.append(repo)
    app.run(debug=True, port=5050)