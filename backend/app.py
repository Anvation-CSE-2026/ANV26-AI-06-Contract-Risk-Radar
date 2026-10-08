from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Contract, PlaybookRule, RiskAnalysis
from contract_parser import parse_contract
from risk_analyzer import analyze_risks
import os

app = Flask(__name__)
CORS(app)

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'contract_radar.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Backend is running'})

@app.route('/api/contracts', methods=['POST'])
def create_contract():
    data = request.json
    contract_text = data.get('text')
    contract_name = data.get('name', 'Uploaded Contract')
    
    if not contract_text:
        return jsonify({'error': 'Contract text is required'}), 400
    
    # Parse contract
    clauses = parse_contract(contract_text)
    
    # Save to database
    contract = Contract(
        name=contract_name,
        text=contract_text,
        clauses=clauses
    )
    db.session.add(contract)
    db.session.commit()
    
    return jsonify({
        'id': contract.id,
        'name': contract.name,
        'clauses': contract.clauses,
        'created_at': contract.created_at.isoformat()
    }), 201

@app.route('/api/contracts/<int:contract_id>', methods=['GET'])
def get_contract(contract_id):
    contract = Contract.query.get_or_404(contract_id)
    return jsonify({
        'id': contract.id,
        'name': contract.name,
        'text': contract.text,
        'clauses': contract.clauses,
        'created_at': contract.created_at.isoformat()
    })

@app.route('/api/contracts', methods=['GET'])
def list_contracts():
    contracts = Contract.query.order_by(Contract.created_at.desc()).all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'created_at': c.created_at.isoformat(),
        'clause_count': len(c.clauses) if c.clauses else 0
    } for c in contracts])

@app.route('/api/playbook/rules', methods=['POST'])
def create_playbook_rule():
    data = request.json
    
    rule = PlaybookRule(
        name=data.get('name'),
        category=data.get('category', 'Standard'),
        description=data.get('description'),
        severity=data.get('severity', 'medium'),
        required=data.get('required', False),
        keywords=data.get('keywords', [])
    )
    
    db.session.add(rule)
    db.session.commit()
    
    return jsonify({
        'id': rule.id,
        'name': rule.name,
        'category': rule.category,
        'description': rule.description,
        'severity': rule.severity,
        'required': rule.required,
        'keywords': rule.keywords
    }), 201

@app.route('/api/playbook/rules', methods=['GET'])
def list_playbook_rules():
    rules = PlaybookRule.query.all()
    return jsonify([{
        'id': r.id,
        'name': r.name,
        'category': r.category,
        'description': r.description,
        'severity': r.severity,
        'required': r.required,
        'keywords': r.keywords
    } for r in rules])

@app.route('/api/playbook/rules/<int:rule_id>', methods=['DELETE'])
def delete_playbook_rule(rule_id):
    rule = PlaybookRule.query.get_or_404(rule_id)
    db.session.delete(rule)
    db.session.commit()
    return jsonify({'message': 'Rule deleted successfully'})

@app.route('/api/analysis', methods=['POST'])
def perform_risk_analysis():
    data = request.json
    contract_id = data.get('contract_id')
    
    if not contract_id:
        return jsonify({'error': 'Contract ID is required'}), 400
    
    contract = Contract.query.get_or_404(contract_id)
    playbook_rules = PlaybookRule.query.all()
    
    # Convert to dict format
    rules_list = [{
        'id': r.id,
        'name': r.name,
        'category': r.category,
        'description': r.description,
        'severity': r.severity,
        'required': r.required,
        'keywords': r.keywords
    } for r in playbook_rules]
    
    # Perform analysis
    analysis_results = analyze_risks(contract.clauses, rules_list)
    
    # Save analysis
    risk_analysis = RiskAnalysis(
        contract_id=contract.id,
        results=analysis_results
    )
    db.session.add(risk_analysis)
    db.session.commit()
    
    return jsonify({
        'id': risk_analysis.id,
        'contract_id': contract.id,
        'results': analysis_results,
        'created_at': risk_analysis.created_at.isoformat()
    }), 201

@app.route('/api/analysis/<int:analysis_id>', methods=['GET'])
def get_analysis(analysis_id):
    analysis = RiskAnalysis.query.get_or_404(analysis_id)
    return jsonify({
        'id': analysis.id,
        'contract_id': analysis.contract_id,
        'results': analysis.results,
        'created_at': analysis.created_at.isoformat()
    })

@app.route('/api/contracts/<int:contract_id>/analysis', methods=['GET'])
def get_contract_analysis(contract_id):
    analysis = RiskAnalysis.query.filter_by(contract_id=contract_id).order_by(RiskAnalysis.created_at.desc()).first()
    
    if not analysis:
        return jsonify({'error': 'No analysis found for this contract'}), 404
    
    return jsonify({
        'id': analysis.id,
        'contract_id': analysis.contract_id,
        'results': analysis.results,
        'created_at': analysis.created_at.isoformat()
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
