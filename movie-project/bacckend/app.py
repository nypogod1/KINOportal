from flask import Flask
from config import Config
from extensions import db, cors
from routes.auth import auth_bp
from routes.movies import movies_bp
from routes.health import health_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    cors.init_app(app, origins=Config.CORS_ORIGINS, supports_credentials=True)

    # Регистрация blueprint'ов
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(movies_bp, url_prefix='/api/movies')
    app.register_blueprint(health_bp, url_prefix='/health')

    with app.app_context():
        db.create_all()

    return app


if __name__ == '__main__':
    app = create_app()
    print("Сервер запущен на http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)

