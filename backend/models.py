from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class Contract(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    text = db.Column(db.Text, nullable=False)
    clauses = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'text': self.text,
            'clauses': self.clauses,
            'created_at': self.created_at.isoformat()
        }

class PlaybookRule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(50), nullable=False, default='Standard')
    description = db.Column(db.Text, nullable=False)
    severity = db.Column(db.String(20), nullable=False, default='medium')
    required = db.Column(db.Boolean, default=False)
    keywords = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'description': self.description,
            'severity': self.severity,
            'required': self.required,
            'keywords': self.keywords,
            'created_at': self.created_at.isoformat()
        }

class RiskAnalysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    contract_id = db.Column(db.Integer, db.ForeignKey('contract.id'), nullable=False)
    results = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    contract = db.relationship('Contract', backref=db.backref('analyses', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'contract_id': self.contract_id,
            'results': self.results,
            'created_at': self.created_at.isoformat()
        }
