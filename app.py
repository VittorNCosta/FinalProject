from config import app
from controllers.cinema_controller import cinema_bp
from flask import render_template
import secrets
#Vittor Niquele da Costa
#Leonardo Castilho
#Lucas França

# Registrar blueprints
app.register_blueprint(cinema_bp)

@app.route("/")
def index():
    return render_template("home.html")

if __name__ == "__main__":
    app.run(debug=True)

