import React, { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, AlertCircle, Search, Filter, ChevronDown, ChevronUp, Link2, FileText, BookOpen, Loader2 } from 'lucide-react'
import { api } from '../api'

const RiskAnalysis = ({ contract, playbook }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [expandedRisks, setExpandedRisks] = useState({})
  const [analysisResults, setAnalysisResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (contract && contract.id && playbook) {
      loadAnalysis()
    } else if (contract && playbook) {
      // Fallback to client-side analysis if no backend
      setAnalysisResults(analyzeRisks())
    }
  }, [contract, playbook])

  const loadAnalysis = async () => {
    setIsLoading(true)
    try {
      const data = await api.getContractAnalysis(contract.id)
      setAnalysisResults(data.results)
    } catch (error) {
      console.error('Failed to load analysis:', error)
      // Fallback to client-side analysis
      setAnalysisResults(analyzeRisks())
    } finally {
      setIsLoading(false)
    }
  }

  const analyzeRisks = () => {
    const analysis = []

    playbook.forEach(rule => {
      const matchingClauses = contract.clauses.filter(clause => {
        const clauseLower = clause.content.toLowerCase()
        return rule.keywords.some(keyword => 
          clauseLower.includes(keyword.toLowerCase())
        )
      })

      if (matchingClauses.length > 0) {
        matchingClauses.forEach(clause => {
          analysis.push({
            id: `${rule.id}-${clause.id}`,
            rule: rule,
            clause: clause,
            status: 'found',
            severity: rule.severity,
            matchedKeywords: rule.keywords.filter(keyword => 
              clause.content.toLowerCase().includes(keyword.toLowerCase())
            )
          })
        })
      } else if (rule.required) {
        analysis.push({
          id: `missing-${rule.id}`,
          rule: rule,
          clause: null,
          status: 'missing',
          severity: rule.severity,
          matchedKeywords: []
        })
      }
    })

    // Check for potentially risky clauses that don't match any rule
    contract.clauses.forEach(clause => {
      const hasMatch = playbook.some(rule => 
        rule.keywords.some(keyword => 
          clause.content.toLowerCase().includes(keyword.toLowerCase())
        )
      )
      
      if (!hasMatch && clause.content.length > 100) {
        analysis.push({
          id: `unreviewed-${clause.id}`,
          rule: {
            name: 'Unreviewed Clause',
            category: 'Unknown',
            description: 'This clause was not matched against any playbook rule',
            severity: 'medium',
            required: false
          },
          clause: clause,
          status: 'unreviewed',
          severity: 'medium',
          matchedKeywords: []
        })
      }
    })

    return analysis
  }

  const risks = analysisResults || analyzeRisks()

  const toggleRisk = (id) => {
    setExpandedRisks(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const filteredRisks = risks.filter(risk => {
    const matchesSearch = risk.rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (risk.clause && risk.clause.title.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSeverity = filterSeverity === 'all' || risk.severity === filterSeverity
    const matchesStatus = filterStatus === 'all' || risk.status === filterStatus
    return matchesSearch && matchesSeverity && matchesStatus
  })

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'found':
        return 'bg-green-50 border-green-200'
      case 'missing':
        return 'bg-red-50 border-red-200'
      case 'unreviewed':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'found':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'missing':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'unreviewed':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getSuggestedAction = (risk) => {
    if (risk.status === 'missing') {
      return `Add ${risk.rule.name} clause to the contract`
    } else if (risk.status === 'unreviewed') {
      return 'Review this clause against playbook requirements'
    } else if (risk.severity === 'high') {
      return 'Immediate review and potential redline required'
    } else if (risk.severity === 'medium') {
      return 'Review recommended'
    } else {
      return 'Clause appears compliant'
    }
  }

  const statistics = {
    total: risks.length,
    high: risks.filter(r => r.severity === 'high').length,
    medium: risks.filter(r => r.severity === 'medium').length,
    low: risks.filter(r => r.severity === 'low').length,
    missing: risks.filter(r => r.status === 'missing').length,
    found: risks.filter(r => r.status === 'found').length,
    unreviewed: risks.filter(r => r.status === 'unreviewed').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Risk Analysis</h2>
              <p className="text-sm text-gray-500">
                Contract review against {playbook.length} playbook rules
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
              placeholder="Search risks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="input-field w-40"
            >
              <option value="all">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field w-40"
            >
              <option value="all">All Status</option>
              <option value="found">Found</option>
              <option value="missing">Missing</option>
              <option value="unreviewed">Unreviewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Risks</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-gray-500" />
          </div>
        </div>
        <div className="card border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">High Severity</p>
              <p className="text-2xl font-bold text-red-600">{statistics.high}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="card border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Missing Clauses</p>
              <p className="text-2xl font-bold text-orange-600">{statistics.missing}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="card border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Compliant</p>
              <p className="text-2xl font-bold text-green-600">{statistics.found}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Missing Clauses Section */}
      {statistics.missing > 0 && (
        <div className="card border-2 border-red-300 bg-red-50">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-lg font-bold text-red-900">Missing Required Clauses</h3>
              <p className="text-sm text-red-700">
                {statistics.missing} required clause(s) not found in the contract
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {risks
              .filter(risk => risk.status === 'missing')
              .map(risk => (
                <div
                  key={risk.id}
                  className="bg-white rounded-lg p-4 border border-red-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => toggleRisk(risk.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <h4 className="font-semibold text-gray-900">{risk.rule.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(risk.severity)}`}>
                          {risk.severity}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Required
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{risk.rule.description}</p>
                    </div>
                    <div className="ml-4">
                      {expandedRisks[risk.id] ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  {expandedRisks[risk.id] && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                          <BookOpen className="w-4 h-4 text-purple-500" />
                          <span>Playbook Rule Details</span>
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Rule Name</p>
                            <p className="text-sm text-gray-600">{risk.rule.name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Category</p>
                            <p className="text-sm text-gray-600">{risk.rule.category}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Description</p>
                            <p className="text-sm text-gray-600">{risk.rule.description}</p>
                          </div>
                          {risk.rule.keywords.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-900">Keywords to look for</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {risk.rule.keywords.map((keyword, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Suggested Action</h4>
                        <p className="text-sm text-blue-700">{getSuggestedAction(risk)}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Risks List */}
      {isLoading ? (
        <div className="card flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin mr-3" />
          <span className="text-gray-500">Analyzing contract...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRisks.length === 0 ? (
            <div className="card text-center py-12">
              <CheckCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No risks found matching your criteria</p>
            </div>
          ) : (
            filteredRisks.map((risk) => (
              <div
                key={risk.id}
                className={`card border-2 ${getStatusColor(risk.status)} cursor-pointer hover:shadow-md transition-shadow`}
                onClick={() => toggleRisk(risk.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(risk.status)}
                      <h3 className="font-semibold text-gray-900">{risk.rule.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(risk.severity)}`}>
                        {risk.severity}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        risk.status === 'found' ? 'bg-green-100 text-green-700' :
                        risk.status === 'missing' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {risk.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{risk.rule.description}</p>
                    
                    {risk.clause && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <FileText className="w-4 h-4" />
                        <span>Matched with: {risk.clause.title}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-primary-600">Lines {risk.clause.lineStart}-{risk.clause.lineEnd}</span>
                      </div>
                    )}
                    
                    {risk.matchedKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {risk.matchedKeywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    {expandedRisks[risk.id] ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedRisks[risk.id] && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    {/* Traceability */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                        <Link2 className="w-4 h-4" />
                        <span>Traceability</span>
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <BookOpen className="w-4 h-4 text-purple-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Playbook Rule</p>
                            <p className="text-sm text-gray-600">{risk.rule.name}</p>
                            <p className="text-xs text-gray-500">Category: {risk.rule.category}</p>
                          </div>
                        </div>
                        {risk.clause && (
                          <div className="flex items-start space-x-2">
                            <FileText className="w-4 h-4 text-blue-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Contract Clause</p>
                              <p className="text-sm text-gray-600">{risk.clause.title}</p>
                              <p className="text-xs text-gray-500">Lines {risk.clause.lineStart}-{risk.clause.lineEnd}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Suggested Action */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Suggested Action</h4>
                      <p className="text-sm text-blue-700">{getSuggestedAction(risk)}</p>
                    </div>

                    {/* Clause Content */}
                    {risk.clause && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Clause Content</h4>
                        <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono">
                          {risk.clause.content}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default RiskAnalysis
