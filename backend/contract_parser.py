def parse_contract(text):
    """
    Parse contract text into clauses
    """
    lines = text.split('\n')
    clauses = []
    current_clause = None
    clause_number = 1

    for index, line in enumerate(lines):
        trimmed_line = line.strip()
        # Detect clause headers (e.g., "1. GRANT OF LICENSE" or "GRANT OF LICENSE")
        clause_match = trimmed_line.match(r'^(\d+\.?\s*)?([A-Z][A-Z\s]+)$') if hasattr(trimmed_line, 'match') else None
        
        # Manual regex match
        import re
        clause_match = re.match(r'^(\d+\.?\s*)?([A-Z][A-Z\s]+)$', trimmed_line)
        
        if clause_match and len(trimmed_line) > 5:
            if current_clause:
                clauses.append(current_clause)
            current_clause = {
                'id': clause_number,
                'number': clause_match.group(1) or f"{clause_number}.",
                'title': clause_match.group(2).strip(),
                'content': trimmed_line,
                'lineStart': index + 1,
                'lineEnd': index + 1,
                'type': 'standard',
                'riskLevel': 'low'
            }
            clause_number += 1
        elif current_clause and trimmed_line:
            current_clause['content'] += '\n' + trimmed_line
            current_clause['lineEnd'] = index + 1

    if current_clause:
        clauses.append(current_clause)

    return clauses
