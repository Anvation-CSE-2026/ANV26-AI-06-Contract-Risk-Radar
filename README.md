# Contract Risk Radar

Evidence-Grounded Contract Risk & Obligation Intelligence System

## Overview

This web application helps review contracts by identifying risks, obligations, and discrepancies based on source clauses and a predefined playbook. It provides:

- **Clause Inventory**: Extracts and displays all contract clauses with source traceability
- **Risk Analysis**: Compares contract clauses against playbook rules to identify risks
- **Missing Clause Detection**: Identifies required clauses that are absent from the contract
- **Traceability**: Live traceability to source clauses and playbook rules
- **Suggested Actions**: Actionable recommendations for each identified risk

## Features

- Upload contract documents (TXT, MD) or use sample contracts
- Define custom playbook rules with categories, severity levels, and keywords
- Real-time clause parsing and analysis
- Filter and search through clauses and risks
- Visual risk indicators (high/medium/low)
- Source traceability to specific line numbers
- **Backend API**: Python Flask backend with SQLite database for persistent storage

## Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- Lucide React (icons)

### Backend
- Python 3
- Flask
- Flask-SQLAlchemy
- SQLite

## Installation

### Frontend Setup

1. Install frontend dependencies:
```bash
npm install
```

2. Start the frontend development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (optional but recommended):
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

4. Install Python dependencies:
```bash
pip install -r requirements.txt
```

5. Start the Flask backend server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

## Usage

1. **Start Backend**: Run the Python Flask server (port 5000)
2. **Start Frontend**: Run the React development server (port 3000)
3. **Upload Contract**: Either upload a contract file or select a sample contract
4. **Define Playbook**: Add playbook rules with categories, severity, and keywords
5. **View Clause Inventory**: Browse all extracted clauses with source traceability
6. **Analyze Risks**: Review risk analysis with traceability to both contract clauses and playbook rules

## API Endpoints

### Health Check
- `GET /api/health` - Check if backend is running

### Contracts
- `POST /api/contracts` - Create a new contract
- `GET /api/contracts` - List all contracts
- `GET /api/contracts/:id` - Get a specific contract

### Playbook Rules
- `POST /api/playbook/rules` - Create a new playbook rule
- `GET /api/playbook/rules` - List all playbook rules
- `DELETE /api/playbook/rules/:id` - Delete a playbook rule

### Risk Analysis
- `POST /api/analysis` - Perform risk analysis on a contract
- `GET /api/analysis/:id` - Get a specific analysis
- `GET /api/contracts/:id/analysis` - Get analysis for a contract

## Project Structure

```
.
├── backend/
│   ├── app.py                 # Flask application and API endpoints
│   ├── models.py              # SQLAlchemy database models
│   ├── contract_parser.py     # Contract parsing logic
│   ├── risk_analyzer.py       # Risk analysis logic
│   ├── requirements.txt       # Python dependencies
│   └── contract_radar.db      # SQLite database (created automatically)
├── src/
│   ├── components/
│   │   ├── ContractUpload.jsx    # Contract upload and parsing
│   │   ├── PlaybookUpload.jsx    # Playbook rule management
│   │   ├── ClauseInventory.jsx   # Clause display and filtering
│   │   └── RiskAnalysis.jsx      # Risk analysis and traceability
│   ├── api.js                # API client for backend communication
│   ├── App.jsx               # Main application component
│   ├── main.jsx              # React entry point
│   └── index.css             # TailwindCSS styles
├── package.json
├── vite.config.js
└── README.md
```

## License

MIT