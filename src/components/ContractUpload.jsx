import React, { useState } from 'react'
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react'
import { api } from '../api'

const ContractUpload = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false)
  const [contractText, setContractText] = useState('')
  const [sampleContract, setSampleContract] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sampleContracts = [
    {
      id: 1,
      name: 'Software License Agreement',
      content: `SOFTWARE LICENSE AGREEMENT

This Software License Agreement ("Agreement") is entered into as of the date of acceptance between Licensor and Licensee.

1. GRANT OF LICENSE
Subject to the terms and conditions of this Agreement, Licensor hereby grants to Licensee a non-exclusive, non-transferable license to use the Software solely for internal business purposes.

2. TERM AND TERMINATION
This Agreement shall commence on the Effective Date and continue for a period of twelve (12) months, unless terminated earlier as provided herein. Either party may terminate this Agreement upon thirty (30) days written notice.

3. CONFIDENTIALITY
Each party agrees to maintain the confidentiality of all proprietary information disclosed during the term of this Agreement.

4. LIMITATION OF LIABILITY
IN NO EVENT SHALL LICENSOR BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, REGARDLESS OF THE CAUSE.

5. INTELLECTUAL PROPERTY
All intellectual property rights in the Software shall remain with Licensor.

6. GOVERNING LAW
This Agreement shall be governed by the laws of the State of Delaware.`
    },
    {
      id: 2,
      name: 'Service Level Agreement',
      content: `SERVICE LEVEL AGREEMENT

This Service Level Agreement ("SLA") is between Provider and Customer.

1. SERVICE AVAILABILITY
Provider shall maintain 99.9% uptime for the Services during normal business hours.

2. RESPONSE TIMES
Provider shall respond to critical issues within 4 hours and non-critical issues within 24 hours.

3. CREDITS
If Service Availability falls below 99.9%, Customer shall be entitled to service credits equal to 10% of the monthly fee for each 1% shortfall.

4. MAINTENANCE
Provider may perform scheduled maintenance with 48 hours notice to Customer.

5. SUPPORT
Provider shall provide email support during business hours, Monday through Friday.`
    }
  ]

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        setContractText(event.target.result)
      }
      reader.readAsText(file)
    }
  }

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        setContractText(event.target.result)
      }
      reader.readAsText(file)
    }
  }

  const loadSampleContract = (contract) => {
    setSampleContract(contract)
    setContractText(contract.content)
  }

  const handleSubmit = async () => {
    if (contractText.trim()) {
      setIsSubmitting(true)
      try {
        const result = await api.createContract({
          text: contractText,
          name: sampleContract ? sampleContract.name : 'Uploaded Contract'
        })
        onUpload({
          id: result.id,
          text: result.text,
          clauses: result.clauses,
          name: result.name
        })
      } catch (error) {
        console.error('Failed to create contract:', error)
        alert('Failed to upload contract. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const parseContract = (text) => {
    const lines = text.split('\n')
    const clauses = []
    let currentClause = null
    let clauseNumber = 1

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      // Detect clause headers (e.g., "1. GRANT OF LICENSE" or "GRANT OF LICENSE")
      const clauseMatch = trimmedLine.match(/^(\d+\.?\s*)?([A-Z][A-Z\s]+)$/)
      
      if (clauseMatch && trimmedLine.length > 5) {
        if (currentClause) {
          clauses.push(currentClause)
        }
        currentClause = {
          id: clauseNumber++,
          number: clauseMatch[1] || `${clauseNumber}.`,
          title: clauseMatch[2].trim(),
          content: trimmedLine,
          lineStart: index + 1,
          lineEnd: index + 1,
          type: 'standard',
          riskLevel: 'low'
        }
      } else if (currentClause && trimmedLine) {
        currentClause.content += '\n' + trimmedLine
        currentClause.lineEnd = index + 1
      }
    })

    if (currentClause) {
      clauses.push(currentClause)
    }

    return clauses
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Upload Contract</h2>
          <p className="text-sm text-gray-500">
            Upload a contract document or use a sample to begin analysis
          </p>
        </div>
      </div>

      {/* Sample Contracts */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Sample Contracts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sampleContracts.map((contract) => (
            <button
              key={contract.id}
              onClick={() => loadSampleContract(contract)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                sampleContract?.id === contract.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">{contract.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">
          Drag and drop your contract file here, or
        </p>
        <label className="cursor-pointer">
          <span className="text-primary-600 font-medium hover:text-primary-700">
            browse to upload
          </span>
          <input
            type="file"
            accept=".txt,.md"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
        <p className="text-sm text-gray-500 mt-2">
          Supports .txt and .md files
        </p>
      </div>

      {/* Text Area */}
      {contractText && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contract Text
          </label>
          <textarea
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
            className="input-field h-64 font-mono text-sm"
            placeholder="Paste your contract text here..."
          />
        </div>
      )}

      {/* Submit Button */}
      {contractText && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Analyze Contract'
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default ContractUpload
