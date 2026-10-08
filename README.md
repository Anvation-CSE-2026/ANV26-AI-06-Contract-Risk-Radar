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

## Tech Stack

- React 18
- Vite
- TailwindCSS
- Lucide React (icons)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

## Usage

1. **Upload Contract**: Either upload a contract file or select a sample contract
2. **Define Playbook**: Add playbook rules with categories, severity, and keywords
3. **View Clause Inventory**: Browse all extracted clauses with source traceability
4. **Analyze Risks**: Review risk analysis with traceability to both contract clauses and playbook rules

## Project Structure

```
src/
├── components/
│   ├── ContractUpload.jsx    # Contract upload and parsing
│   ├── PlaybookUpload.jsx    # Playbook rule management
│   ├── ClauseInventory.jsx   # Clause display and filtering
│   └── RiskAnalysis.jsx      # Risk analysis and traceability
├── App.jsx                   # Main application component
├── main.jsx                  # React entry point
└── index.css                 # TailwindCSS styles
```

## License

MIT