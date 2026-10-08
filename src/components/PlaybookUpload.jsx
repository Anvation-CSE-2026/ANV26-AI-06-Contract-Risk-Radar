import React, { useState, useEffect } from 'react'
import { BookOpen, Upload, Plus, Trash2, Loader2 } from 'lucide-react'
import { api } from '../api'

const PlaybookUpload = ({ onUpload }) => {
  const [rules, setRules] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [newRule, setNewRule] = useState({
    name: '',
    category: 'Standard',
    description: '',
    severity: 'medium',
    required: false,
    keywords: ''
  })

  useEffect(() => {
    loadRules()
  }, [])

  const loadRules = async () => {
    try {
      const data = await api.listPlaybookRules()
      setRules(data)
    } catch (error) {
      console.error('Failed to load rules:', error)
      // Set default rules if backend is not available
      setRules([
        {
          id: 1,
          name: 'Limitation of Liability Cap',
          category: 'Risk',
          description: 'This clause limits the maximum amount your company can be held responsible for if something goes wrong. Without it, you could face unlimited financial liability. The cap should be based on the contract value (e.g., 12 months of fees) to protect your company from excessive damages claims.',
          severity: 'high',
          required: true,
          keywords: ['limitation of liability', 'liability cap', 'shall not exceed']
        },
        {
          id: 2,
          name: 'Indemnification Clause',
          category: 'Standard',
          description: 'This clause protects your company from legal claims and losses caused by the other party. It should clearly state who will pay for damages, legal fees, and other costs if problems arise during the contract. Mutual indemnification means both parties agree to protect each other from third-party claims.',
          severity: 'medium',
          required: true,
          keywords: ['indemnify', 'indemnification', 'hold harmless']
        },
        {
          id: 3,
          name: 'Termination for Convenience',
          category: 'Standard',
          description: 'Termination for Convenience',
          severity: 'low',
          required: false,
          keywords: ['terminate for convenience', 'termination without cause']
        },
        {
          id: 4,
          name: 'Governing Law',
          category: 'Standard',
          description: 'This specifies which country\'s or state\'s laws apply to the contract and where any legal disputes will be resolved. This is critical for knowing your legal rights and where you would need to go to court if disputes arise. Choose a jurisdiction favorable to your company and familiar with your business operations.',
          severity: 'medium',
          required: true,
          keywords: ['governing law', 'governed by', 'jurisdiction']
        },
        {
          id: 5,
          name: 'Force Majeure',
          category: 'Standard',
          description: 'This clause protects both parties if unexpected events beyond their control (like natural disasters, wars, pandemics, or government actions) prevent them from fulfilling the contract. It should list qualifying events and explain contract suspension or termination rights, ensuring neither party is penalized for circumstances they cannot control.',
          severity: 'low',
          required: true,
          keywords: ['force majeure', 'act of god', 'unforeseeable']
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const addRule = async () => {
    if (newRule.name && newRule.description) {
      const ruleData = {
        ...newRule,
        keywords: newRule.keywords.split(',').map(k => k.trim()).filter(k => k)
      }
      
      try {
        const result = await api.createPlaybookRule(ruleData)
        setRules([...rules, result])
      } catch (error) {
        console.error('Failed to create rule:', error)
        // Fallback to local state if backend fails
        setRules([
          ...rules,
          {
            ...ruleData,
            id: rules.length + 1
          }
        ])
      }
      
      setNewRule({
        name: '',
        category: 'Standard',
        description: '',
        severity: 'medium',
        required: false,
        keywords: ''
      })
    }
  }

  const removeRule = async (id) => {
    try {
      await api.deletePlaybookRule(id)
      setRules(rules.filter(rule => rule.id !== id))
    } catch (error) {
      console.error('Failed to delete rule:', error)
      // Fallback to local state if backend fails
      setRules(rules.filter(rule => rule.id !== id))
    }
  }

  const handleSubmit = () => {
    onUpload(rules)
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700'
      case 'low':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Risk':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'Standard':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Optional':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-purple-100 p-2 rounded-lg">
          <BookOpen className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Playbook Rules</h2>
          <p className="text-sm text-gray-500">
            Define rules and requirements for contract review
          </p>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-3 mb-6">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-gray-900">{rule.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(rule.category)}`}>
                    {rule.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(rule.severity)}`}>
                    {rule.severity}
                  </span>
                  {rule.required && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
                <div className="flex flex-wrap gap-1">
                  {rule.keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => removeRule(rule.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      ) : (
        <>
          {/* Add New Rule */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add New Rule</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rule Name
                </label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Data Protection Clause"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newRule.category}
                  onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                  className="input-field"
                >
                  <option value="Standard">Standard</option>
                  <option value="Risk">Risk</option>
                  <option value="Optional">Optional</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <select
                  value={newRule.severity}
                  onChange={(e) => setNewRule({ ...newRule, severity: e.target.value })}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={newRule.keywords}
                  onChange={(e) => setNewRule({ ...newRule, keywords: e.target.value })}
                  className="input-field"
                  placeholder="e.g., data protection, privacy, GDPR"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  className="input-field h-20"
                  placeholder="Describe the rule requirement..."
                />
              </div>
              <div className="md:col-span-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={newRule.required}
                  onChange={(e) => setNewRule({ ...newRule, required: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <label htmlFor="required" className="text-sm text-gray-700">
                  This rule is required
                </label>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={addRule}
                className="btn-secondary"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Add Rule
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              className="btn-primary"
            >
              Save Playbook
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default PlaybookUpload
