const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Health check
  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },

  // Contracts
  createContract: async (contractData) => {
    const response = await fetch(`${API_BASE_URL}/contracts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contractData)
    });
    if (!response.ok) throw new Error('Failed to create contract');
    return response.json();
  },

  getContract: async (contractId) => {
    const response = await fetch(`${API_BASE_URL}/contracts/${contractId}`);
    if (!response.ok) throw new Error('Failed to get contract');
    return response.json();
  },

  listContracts: async () => {
    const response = await fetch(`${API_BASE_URL}/contracts`);
    return response.json();
  },

  // Playbook Rules
  createPlaybookRule: async (ruleData) => {
    const response = await fetch(`${API_BASE_URL}/playbook/rules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ruleData)
    });
    if (!response.ok) throw new Error('Failed to create rule');
    return response.json();
  },

  listPlaybookRules: async () => {
    const response = await fetch(`${API_BASE_URL}/playbook/rules`);
    return response.json();
  },

  deletePlaybookRule: async (ruleId) => {
    const response = await fetch(`${API_BASE_URL}/playbook/rules/${ruleId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete rule');
    return response.json();
  },

  // Risk Analysis
  performAnalysis: async (contractId) => {
    const response = await fetch(`${API_BASE_URL}/analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contract_id: contractId })
    });
    if (!response.ok) throw new Error('Failed to perform analysis');
    return response.json();
  },

  getAnalysis: async (analysisId) => {
    const response = await fetch(`${API_BASE_URL}/analysis/${analysisId}`);
    if (!response.ok) throw new Error('Failed to get analysis');
    return response.json();
  },

  getContractAnalysis: async (contractId) => {
    const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/analysis`);
    if (!response.ok) throw new Error('Failed to get contract analysis');
    return response.json();
  }
};
