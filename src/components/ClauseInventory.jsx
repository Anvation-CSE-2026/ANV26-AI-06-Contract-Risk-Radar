import React, { useState } from 'react'
import { FileText, Search, Filter, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'

const ClauseInventory = ({ contract }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [expandedClauses, setExpandedClauses] = useState({})
  const [sortBy, setSortBy] = useState('id')

  const toggleClause = (id) => {
    setExpandedClauses(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const filteredClauses = contract.clauses
    .filter(clause => {
      const matchesSearch = clause.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           clause.content.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterType === 'all' || clause.type === filterType
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (sortBy === 'id') return a.id - b.id
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'risk') {
        const riskOrder = { high: 0, medium: 1, low: 2 }
        return riskOrder[a.riskLevel] - riskOrder[b.riskLevel]
      }
      return 0
    })

  const getRiskIcon = (level) => {
    switch (level) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'medium':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'high':
        return 'border-l-red-500 bg-red-50'
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'low':
        return 'border-l-green-500 bg-green-50'
      default:
        return 'border-l-gray-300 bg-gray-50'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'standard':
        return 'bg-blue-100 text-blue-700'
      case 'risky':
        return 'bg-red-100 text-red-700'
      case 'missing':
        return 'bg-orange-100 text-orange-700'
      case 'ambiguous':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Clause Inventory</h2>
              <p className="text-sm text-gray-500">
                {contract.name} • {contract.clauses.length} clauses identified
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clauses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field w-40"
            >
              <option value="all">All Types</option>
              <option value="standard">Standard</option>
              <option value="risky">Risky</option>
              <option value="missing">Missing</option>
              <option value="ambiguous">Ambiguous</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-40"
            >
              <option value="id">Sort by ID</option>
              <option value="title">Sort by Title</option>
              <option value="risk">Sort by Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Clauses</p>
              <p className="text-2xl font-bold text-gray-900">{contract.clauses.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Standard</p>
              <p className="text-2xl font-bold text-green-600">
                {contract.clauses.filter(c => c.type === 'standard').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Risky</p>
              <p className="text-2xl font-bold text-red-600">
                {contract.clauses.filter(c => c.type === 'risky').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ambiguous</p>
              <p className="text-2xl font-bold text-purple-600">
                {contract.clauses.filter(c => c.type === 'ambiguous').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Clauses List */}
      <div className="space-y-3">
        {filteredClauses.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No clauses found matching your criteria</p>
          </div>
        ) : (
          filteredClauses.map((clause) => (
            <div
              key={clause.id}
              className={`card border-l-4 ${getRiskColor(clause.riskLevel)} cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => toggleClause(clause.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-medium text-gray-500">
                      {clause.number}
                    </span>
                    <h3 className="font-semibold text-gray-900">{clause.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(clause.type)}`}>
                      {clause.type}
                    </span>
                    {getRiskIcon(clause.riskLevel)}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Lines {clause.lineStart} - {clause.lineEnd}</span>
                  </div>
                </div>
                <div className="ml-4">
                  {expandedClauses[clause.id] ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              {expandedClauses[clause.id] && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Clause Content</h4>
                    <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono">
                      {clause.content}
                    </pre>
                  </div>
                  <div className="mt-3 flex items-center space-x-2 text-sm text-gray-500">
                    <span className="font-medium">Source Traceability:</span>
                    <span className="text-primary-600">Lines {clause.lineStart}-{clause.lineEnd}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ClauseInventory
