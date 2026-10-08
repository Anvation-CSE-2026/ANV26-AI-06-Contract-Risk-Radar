import React, { useState, useEffect } from 'react'
import { FileText, BookOpen, AlertTriangle, CheckCircle, Shield, Settings as SettingsIcon } from 'lucide-react'
import ContractUpload from './components/ContractUpload'
import PlaybookUpload from './components/PlaybookUpload'
import ClauseInventory from './components/ClauseInventory'
import RiskAnalysis from './components/RiskAnalysis'
import SettingsPanel from './components/Settings'

function App() {
  const [contract, setContract] = useState(null)
  const [playbook, setPlaybook] = useState(null)
  const [activeTab, setActiveTab] = useState('upload')
  const [settings, setSettings] = useState(null)
  const [showSettings, setShowSettings] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('contractRiskRadarSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    } else {
      // Default settings
      setSettings({
        country: 'US',
        governingLaw: 'State Law (e.g., Delaware, New York)',
        companyName: '',
        defaultSeverity: 'medium',
        requireAllRules: true,
        customClauses: [],
        crossCheckPolicies: []
      })
    }
  }, [])

  const handleContractUpload = (contractData) => {
    setContract(contractData)
    setActiveTab('inventory')
  }

  const handlePlaybookUpload = (playbookData) => {
    setPlaybook(playbookData)
  }

  const handleSettingsSave = (newSettings) => {
    setSettings(newSettings)
    localStorage.setItem('contractRiskRadarSettings', JSON.stringify(newSettings))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Contract Risk Radar
                </h1>
                <p className="text-sm text-gray-500">
                  Evidence-Grounded Contract Risk & Obligation Intelligence
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                contract ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                <FileText className="w-4 h-4" />
                <span>Contract: {contract ? 'Loaded' : 'Not Loaded'}</span>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                playbook ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                <BookOpen className="w-4 h-4" />
                <span>Playbook: {playbook ? 'Loaded' : 'Not Loaded'}</span>
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Settings"
              >
                <SettingsIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'upload'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upload Documents
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              disabled={!contract}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'inventory'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${!contract ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Clause Inventory
            </button>
            <button
              onClick={() => setActiveTab('risks')}
              disabled={!contract || !playbook}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'risks'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${!contract || !playbook ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Risk Analysis
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'upload' && (
          <div className="space-y-8">
            <ContractUpload onUpload={handleContractUpload} />
            <PlaybookUpload onUpload={handlePlaybookUpload} />
          </div>
        )}
        {activeTab === 'inventory' && contract && (
          <ClauseInventory contract={contract} />
        )}
        {activeTab === 'risks' && contract && playbook && (
          <RiskAnalysis contract={contract} playbook={playbook} settings={settings} />
        )}
      </main>

      {/* Settings Modal */}
      {showSettings && settings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <SettingsPanel
              settings={settings}
              onSave={handleSettingsSave}
              onClose={() => setShowSettings(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
