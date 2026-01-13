from flask import Blueprint, request, jsonify
from ..models.movie import Movie
from ..utils.auth_helpers import get_current_user
from ..extensions import db

movies_bp = Blueprint('movies', __name__)


@movies_bp.route('/movies', methods=['POST'])
def add_movie():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Необходима авторизация'}), 401

    data = request.json
    required = ['title', 'rating', 'genre', 'year']
    if not all(data.get(f) for f in required):
        return jsonify({'error': 'Все поля обязательны'}), 400

    if not (1 <= float(data['rating']) <= 10):
        return jsonify({'error': 'Рейтинг должен быть от 1 до 10'}), 400

    movie = Movie(
        title=data['title'],
        rating=float(data['rating']),
        genre=data['genre'],
        year=int(data['year']),
        description=data.get('description'),
        user_id=user.id
    )
    db.session.add(movie)
    db.session.commit()

    return jsonify({'message': 'Фильм добавлен', 'movie': movie.to_dict()}), 201


@movies_bp.route('/movies', methods=['GET'])
def get_movies():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Необходима авторизация'}), 401

    genre = request.args.get('genre')
    min_rating = request.args.get('min_rating')

    query = Movie.query.filter_by(user_id=user.id)
    if genre:
        query = query.filter(Movie.genre == genre)
    if min_rating:
        query = query.filter(Movie.rating >= float(min_rating))

    movies = query.all()
    return jsonify([m.to_dict() for m in movies]), 200


@movies_bp.route('/genres', methods=['GET'])
def get_genres():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Необходима авторизация'}), 401

    genres = db.session.query(Movie.genre).filter_by(user_id=user.id).distinct().all()
    return jsonify([g[0] for g in genres]), 200

