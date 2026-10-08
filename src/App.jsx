import React, { useState } from 'react'
import { FileText, BookOpen, AlertTriangle, CheckCircle, Shield } from 'lucide-react'
import ContractUpload from './components/ContractUpload'
import PlaybookUpload from './components/PlaybookUpload'
import ClauseInventory from './components/ClauseInventory'
import RiskAnalysis from './components/RiskAnalysis'

function App() {
  const [contract, setContract] = useState(null)
  const [playbook, setPlaybook] = useState(null)
  const [activeTab, setActiveTab] = useState('upload')

  const handleContractUpload = (contractData) => {
    setContract(contractData)
    setActiveTab('inventory')
  }

  const handlePlaybookUpload = (playbookData) => {
    setPlaybook(playbookData)
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
          <RiskAnalysis contract={contract} playbook={playbook} />
        )}
      </main>
    </div>
  )
}

export default App
