from .extensions import db

class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    genre = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'rating': self.rating,
            'genre': self.genre,
            'year': self.year,
            'description': self.description,
            'user_id': self.user_id
        }

