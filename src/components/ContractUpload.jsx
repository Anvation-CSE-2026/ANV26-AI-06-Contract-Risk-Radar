import React, { useState } from 'react'
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react'
import { api } from '../api'

const ContractUpload = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false)
  const [contractText, setContractText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = React.useRef(null)

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

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async () => {
    if (contractText.trim()) {
      setIsSubmitting(true)
      try {
        const result = await api.createContract({
          text: contractText,
          name: 'Uploaded Contract'
        })
        onUpload({
          id: result.id,
          text: result.text,
          clauses: result.clauses,
          name: result.name
        })
      } catch (error) {
        console.error('Backend not available, using client-side parsing:', error)
        // Fallback to client-side parsing
        const clauses = parseContract(contractText)
        onUpload({
          id: Date.now(),
          text: contractText,
          clauses: clauses,
          name: 'Uploaded Contract'
        })
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
            Upload a contract document to begin analysis
          </p>
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
        <button
          onClick={handleButtonClick}
          className="text-primary-600 font-medium hover:text-primary-700 cursor-pointer bg-transparent border-none"
        >
          browse to upload
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept=".txt,.md"
          onChange={handleFileUpload}
          className="hidden"
        />
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
