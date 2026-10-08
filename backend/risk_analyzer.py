def analyze_risks(clauses, playbook_rules):
    """
    Analyze contract clauses against playbook rules
    """
    analysis = []

    for rule in playbook_rules:
        matching_clauses = []
        for clause in clauses:
            clause_lower = clause.get('content', '').lower()
            for keyword in rule.get('keywords', []):
                if keyword.lower() in clause_lower:
                    matching_clauses.append(clause)
                    break

        if matching_clauses:
            for clause in matching_clauses:
                matched_keywords = []
                clause_lower = clause.get('content', '').lower()
                for keyword in rule.get('keywords', []):
                    if keyword.lower() in clause_lower:
                        matched_keywords.append(keyword)

                analysis.append({
                    'id': f"{rule['id']}-{clause['id']}",
                    'rule': rule,
                    'clause': clause,
                    'status': 'found',
                    'severity': rule['severity'],
                    'matchedKeywords': matched_keywords
                })
        elif rule.get('required', False):
            analysis.append({
                'id': f"missing-{rule['id']}",
                'rule': rule,
                'clause': None,
                'status': 'missing',
                'severity': rule['severity'],
                'matchedKeywords': []
            })

    # Check for unreviewed clauses
    for clause in clauses:
        has_match = False
        clause_lower = clause.get('content', '').lower()
        
        for rule in playbook_rules:
            for keyword in rule.get('keywords', []):
                if keyword.lower() in clause_lower:
                    has_match = True
                    break
            if has_match:
                break
        
        if not has_match and len(clause.get('content', '')) > 100:
            analysis.append({
                'id': f"unreviewed-{clause['id']}",
                'rule': {
                    'name': 'Unreviewed Clause',
                    'category': 'Unknown',
                    'description': 'This clause was not matched against any playbook rule',
                    'severity': 'medium',
                    'required': False
                },
                'clause': clause,
                'status': 'unreviewed',
                'severity': 'medium',
                'matchedKeywords': []
            })

    return analysis
