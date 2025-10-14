'use client'
import { useState } from 'react'

export default function Certificate({ loading }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('')

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      setUploadStatus('')
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('파일을 선택해주세요.')
      return
    }

    try {
      setUploadStatus('업로드 중...')
      // 여기에 파일 업로드 API 호출 로직 추가
      console.log('파일 업로드:', selectedFile)
      
      // 임시로 성공 처리
      setTimeout(() => {
        setUploadStatus('업로드 완료')
        setSelectedFile(null)
        alert('공인인증서가 성공적으로 등록되었습니다.')
      }, 2000)
    } catch (error) {
      console.error('파일 업로드 오류:', error)
      setUploadStatus('업로드 실패')
      alert('파일 업로드 중 오류가 발생했습니다.')
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      setSelectedFile(files[0])
      setUploadStatus('')
    }
  }

  return (
    <div className="table-wrap">
      <h2 className="table-wrap__title">공인인증서 등록</h2>
      <div className="guidebox">
        <p className="guidebox__title">공인인증서 등록 안내</p>
        <p className="guidebox__desc">
          전자세금계산서 발행을 위해 공인인증서를 등록해주세요.<br/>
          등록된 공인인증서는 팝빌 시스템에서 자동으로 관리됩니다.
        </p>
      </div>
      
      <div 
        className="upload-area"
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-area__content">
          <div className="upload-area__icon">📄</div>
          <p className="upload-area__text">
            {selectedFile 
              ? `선택된 파일: ${selectedFile.name}` 
              : '공인인증서 파일을 선택하거나 드래그하여 업로드하세요'
            }
          </p>
          <div className="upload-area__actions">
            <input
              type="file"
              id="certificate-file"
              accept=".p12,.pfx"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <label htmlFor="certificate-file" className="btn btn--primary">
              파일 선택
            </label>
            {selectedFile && (
              <button 
                className="btn btn--secondary" 
                type="button"
                onClick={handleFileUpload}
                disabled={loading}
              >
                {uploadStatus || '업로드'}
              </button>
            )}
          </div>
          {uploadStatus && (
            <p className="upload-area__status">{uploadStatus}</p>
          )}
        </div>
      </div>
    </div>
  )
}
