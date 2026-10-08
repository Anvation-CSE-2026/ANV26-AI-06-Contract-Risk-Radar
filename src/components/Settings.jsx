import React, { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Globe, Save, CheckCircle, Plus, Trash2, Building2 } from 'lucide-react'

const COUNTRIES = [
  { code: 'US', name: 'United States', governingLaw: 'State Law (e.g., Delaware, New York)' },
  { code: 'UK', name: 'United Kingdom', governingLaw: 'English Law' },
  { code: 'CA', name: 'Canada', governingLaw: 'Provincial Law (e.g., Ontario, Quebec)' },
  { code: 'AU', name: 'Australia', governingLaw: 'State/Territory Law (e.g., NSW, Victoria)' },
  { code: 'DE', name: 'Germany', governingLaw: 'German Law' },
  { code: 'FR', name: 'France', governingLaw: 'French Law' },
  { code: 'IN', name: 'India', governingLaw: 'Indian Law' },
  { code: 'SG', name: 'Singapore', governingLaw: 'Singapore Law' },
  { code: 'JP', name: 'Japan', governingLaw: 'Japanese Law' },
  { code: 'CH', name: 'Switzerland', governingLaw: 'Swiss Law' },
  { code: 'NL', name: 'Netherlands', governingLaw: 'Dutch Law' },
  { code: 'IE', name: 'Ireland', governingLaw: 'Irish Law' },
]

const SettingsPanel = ({ settings, onSave, onClose }) => {
  const [localSettings, setLocalSettings] = useState({
    country: settings?.country || 'US',
    governingLaw: settings?.governingLaw || COUNTRIES[0].governingLaw,
    companyName: settings?.companyName || '',
    defaultSeverity: settings?.defaultSeverity || 'medium',
    requireAllRules: settings?.requireAllRules !== false,
    customClauses: settings?.customClauses || [],
    crossCheckPolicies: settings?.crossCheckPolicies || []
  })

  // Update local settings when props change
  useEffect(() => {
    if (settings) {
      const country = COUNTRIES.find(c => c.code === settings.country)
      setLocalSettings({
        country: settings.country || 'US',
        governingLaw: country ? country.governingLaw : COUNTRIES[0].governingLaw,
        companyName: settings.companyName || '',
        defaultSeverity: settings.defaultSeverity || 'medium',
        requireAllRules: settings.requireAllRules !== false,
        customClauses: settings.customClauses || [],
        crossCheckPolicies: settings.crossCheckPolicies || []
      })
    }
  }, [settings])

  const [saved, setSaved] = useState(false)
  const [newCustomClause, setNewCustomClause] = useState({ name: '', description: '', keywords: '' })
  const [newPolicy, setNewPolicy] = useState({ companyName: '', country: '', requirements: '' })

  const handleCountryChange = (e) => {
    const countryCode = e.target.value
    const country = COUNTRIES.find(c => c.code === countryCode)
    if (country) {
      setLocalSettings({
        ...localSettings,
        country: countryCode,
        governingLaw: country.governingLaw
      })
    }
  }

  const addCustomClause = () => {
    if (newCustomClause.name && newCustomClause.description) {
      setLocalSettings({
        ...localSettings,
        customClauses: [
          ...localSettings.customClauses,
          {
            ...newCustomClause,
            id: Date.now(),
            keywords: newCustomClause.keywords.split(',').map(k => k.trim()).filter(k => k)
          }
        ]
      })
      setNewCustomClause({ name: '', description: '', keywords: '' })
    }
  }

  const removeCustomClause = (id) => {
    setLocalSettings({
      ...localSettings,
      customClauses: localSettings.customClauses.filter(c => c.id !== id)
    })
  }

  const addPolicy = () => {
    if (newPolicy.companyName && newPolicy.country) {
      setLocalSettings({
        ...localSettings,
        crossCheckPolicies: [
          ...localSettings.crossCheckPolicies,
          {
            ...newPolicy,
            id: Date.now(),
            requirements: newPolicy.requirements.split('\n').filter(r => r.trim())
          }
        ]
      })
      setNewPolicy({ companyName: '', country: '', requirements: '' })
    }
  }

  const removePolicy = (id) => {
    setLocalSettings({
      ...localSettings,
      crossCheckPolicies: localSettings.crossCheckPolicies.filter(p => p.id !== id)
    })
  }

  const handleSave = () => {
    onSave(localSettings)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 1500)
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <SettingsIcon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <p className="text-sm text-gray-500">Configure your contract review preferences</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Country Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Country / Jurisdiction</span>
          </label>
          <select
            value={localSettings.country}
            onChange={handleCountryChange}
            className="input-field"
          >
            {COUNTRIES.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-500">
            Governing Law: <span className="font-medium text-gray-700">{localSettings.governingLaw}</span>
          </p>
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={localSettings.companyName}
            onChange={(e) => setLocalSettings({ ...localSettings, companyName: e.target.value })}
            className="input-field"
            placeholder="Enter your company name"
          />
        </div>

        {/* Default Severity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Risk Severity Threshold
          </label>
          <select
            value={localSettings.defaultSeverity}
            onChange={(e) => setLocalSettings({ ...localSettings, defaultSeverity: e.target.value })}
            className="input-field"
          >
            <option value="low">Low - Show all risks</option>
            <option value="medium">Medium - Show medium and high risks</option>
            <option value="high">High - Show only high risks</option>
          </select>
        </div>

        {/* Require All Rules */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="requireAllRules"
            checked={localSettings.requireAllRules}
            onChange={(e) => setLocalSettings({ ...localSettings, requireAllRules: e.target.checked })}
            className="w-4 h-4 text-primary-600 rounded"
          />
          <label htmlFor="requireAllRules" className="text-sm text-gray-700">
            Mark all playbook rules as required by default
          </label>
        </div>

        {/* Custom Clauses */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Custom Clause Requirements</span>
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newCustomClause.name}
              onChange={(e) => setNewCustomClause({ ...newCustomClause, name: e.target.value })}
              className="input-field"
              placeholder="Clause name (e.g., Payment Terms)"
            />
            <textarea
              value={newCustomClause.description}
              onChange={(e) => setNewCustomClause({ ...newCustomClause, description: e.target.value })}
              className="input-field h-20"
              placeholder="Detailed description of requirements (e.g., Payment must be made within 15 days or 5% interest penalty)"
            />
            <input
              type="text"
              value={newCustomClause.keywords}
              onChange={(e) => setNewCustomClause({ ...newCustomClause, keywords: e.target.value })}
              className="input-field"
              placeholder="Keywords (comma-separated, e.g., payment, fee, salary)"
            />
            <button
              onClick={addCustomClause}
              className="btn-secondary w-full"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Add Custom Clause
            </button>
          </div>
          {localSettings.customClauses.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Your Custom Clauses</h4>
              {localSettings.customClauses.map(clause => (
                <div key={clause.id} className="bg-white rounded p-3 border border-gray-200 flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{clause.name}</p>
                    <p className="text-sm text-gray-600">{clause.description}</p>
                  </div>
                  <button
                    onClick={() => removeCustomClause(clause.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cross-Check Policies */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
            <Building2 className="w-4 h-4" />
            <span>Cross-Check Other Company Policies</span>
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newPolicy.companyName}
              onChange={(e) => setNewPolicy({ ...newPolicy, companyName: e.target.value })}
              className="input-field"
              placeholder="Company name (e.g., ABC Corp)"
            />
            <select
              value={newPolicy.country}
              onChange={(e) => setNewPolicy({ ...newPolicy, country: e.target.value })}
              className="input-field"
            >
              <option value="">Select Country</option>
              {COUNTRIES.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            <textarea
              value={newPolicy.requirements}
              onChange={(e) => setNewPolicy({ ...newPolicy, requirements: e.target.value })}
              className="input-field h-24"
              placeholder="Policy requirements (one per line)&#10;e.g., Payment within 30 days&#10;Governing law must be local&#10;Maximum liability 6 months fees"
            />
            <button
              onClick={addPolicy}
              className="btn-secondary w-full"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Add Company Policy
            </button>
          </div>
          {localSettings.crossCheckPolicies.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Saved Company Policies</h4>
              {localSettings.crossCheckPolicies.map(policy => {
                const countryName = COUNTRIES.find(c => c.code === policy.country)?.name || policy.country
                return (
                  <div key={policy.id} className="bg-white rounded p-3 border border-gray-200 flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{policy.companyName}</p>
                      <p className="text-sm text-gray-500">{countryName}</p>
                      <ul className="text-sm text-gray-600 mt-1 list-disc list-inside">
                        {policy.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => removePolicy(policy.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary flex items-center space-x-2"
          >
            {saved ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel
