'use client'
import { useState } from 'react'

export default function Certificate({ loading, onCertificateChange }) {
  const [certificateData, setCertificateData] = useState({
    fileName: '',
    status: '미등록'
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)
  const [originalData, setOriginalData] = useState({})

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      // 파일 확장자 검증
      const validExtensions = ['.p12', '.pfx']
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
      
      if (!validExtensions.includes(fileExtension)) {
        alert('공인인증서 파일(.p12, .pfx)만 업로드 가능합니다.')
        return
      }

      setSelectedFile(file)
      setUploadStatus('')
      
      // 파일 정보 업데이트
      setCertificateData(prev => ({
        ...prev,
        fileName: file.name,
        status: '업로드 대기'
      }))
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
        setCertificateData(prev => ({
          ...prev,
          status: '등록됨'
        }))
        setSelectedFile(null)
        alert('공인인증서가 성공적으로 등록되었습니다.')
      }, 2000)
    } catch (error) {
      console.error('파일 업로드 오류:', error)
      setUploadStatus('업로드 실패')
      setCertificateData(prev => ({
        ...prev,
        status: '업로드 실패'
      }))
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
      const file = files[0]
      const validExtensions = ['.p12', '.pfx']
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
      
      if (!validExtensions.includes(fileExtension)) {
        alert('공인인증서 파일(.p12, .pfx)만 업로드 가능합니다.')
        return
      }

      setSelectedFile(file)
      setUploadStatus('')
      setCertificateData(prev => ({
        ...prev,
        fileName: file.name,
        status: '업로드 대기'
      }))
    }
  }

  const handleEditStart = () => {
    setOriginalData({ ...certificateData })
    setIsEditMode(true)
  }

  const handleEditCancel = () => {
    // 원본 데이터로 복원
    setCertificateData(originalData)
    setSelectedFile(null)
    setUploadStatus('')
    setIsEditMode(false)
  }

  const handleEditSave = () => {
    // 저장 로직
    alert('저장되었습니다.')
    setOriginalData({ ...certificateData })
    setIsEditMode(false)
  }

  const handleFieldChange = (field, value) => {
    setCertificateData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRemoveCertificate = () => {
    if (confirm('등록된 공인인증서를 삭제하시겠습니까?')) {
      setCertificateData({
        fileName: '',
        status: '미등록'
      })
      setSelectedFile(null)
      setUploadStatus('')
      alert('공인인증서가 삭제되었습니다.')
    }
  }

  return (
    <div className="certificate-settings">
      <h2 className="table-wrap__title">공인인증서 등록</h2>
      
      {/* 안내 메시지 */}
      <div className="guidebox">
        <p className="guidebox__title">공인인증서 등록 안내</p>
        <p className="guidebox__desc">
          전자세금계산서 발행을 위해 공인인증서를 등록해주세요.<br/>
          등록된 공인인증서는 팝빌 시스템에서 자동으로 관리됩니다.
        </p>
      </div>

      {/* 인증서 정보 테이블 */}
      <div className="table-wrap">
        <table className="table certificate-table">
          <colgroup>
            <col style={{ width: "300px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "100px" }} />
          </colgroup>
          <thead>
            <tr>
              <th>파일명</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className={`input__field ${!isEditMode ? 'settings-readonly' : ''}`}
                    placeholder="파일을 선택하세요" 
                    value={certificateData.fileName}
                    readOnly
                  />
                </div>
              </td>
              <td>
                <div className="certificate-status">
                  <span className={`status-badge status-badge--${getStatusClass(certificateData.status)}`}>
                    {certificateData.status}
                  </span>
                </div>
              </td>
              <td>
                <div className="certificate-actions">
                  {!isEditMode ? (
                    <>
                      <button 
                        className="btn btn--light btn--sm" 
                        type="button"
                        onClick={handleEditStart}
                        disabled={loading}
                      >
                        수정
                      </button>
                      {certificateData.status === '등록됨' && (
                        <button 
                          className="btn btn--red btn--sm" 
                          type="button"
                          onClick={handleRemoveCertificate}
                          disabled={loading}
                        >
                          삭제
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button 
                        className="btn btn--primary btn--sm" 
                        type="button"
                        onClick={handleEditSave}
                        disabled={loading}
                      >
                        저장
                      </button>
                      <button 
                        className="btn btn--light btn--sm" 
                        type="button"
                        onClick={handleEditCancel}
                        disabled={loading}
                      >
                        취소
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 파일 업로드 영역 */}
      {isEditMode && (
        <div className="table-wrap">
          <h3 className="table-wrap__subtitle">파일 업로드</h3>
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
                  : '공인인증서 파일(.p12, .pfx)을 선택하거나 드래그하여 업로드하세요'
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
                <label 
                  htmlFor="certificate-file" 
                  className="btn btn--primary"
                >
                  파일 선택
                </label>
                {selectedFile && (
                  <button 
                    className="btn btn--secondary" 
                    type="button"
                    onClick={handleFileUpload}
                    disabled={loading || uploadStatus === '업로드 중...'}
                  >
                    {uploadStatus || '업로드'}
                  </button>
                )}
              </div>
              {uploadStatus && (
                <p className={`upload-area__status upload-area__status--${getUploadStatusClass(uploadStatus)}`}>
                  {uploadStatus}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 상태별 안내 메시지 */}
      {certificateData.status === '등록됨' && (
        <div className="alert alert--success">
          <p>공인인증서가 정상적으로 등록되었습니다. 전자세금계산서 발행이 가능합니다.</p>
        </div>
      )}
      
      {certificateData.status === '업로드 실패' && (
        <div className="alert alert--error">
          <p>공인인증서 업로드에 실패했습니다. 파일과 비밀번호를 확인 후 다시 시도해주세요.</p>
        </div>
      )}
    </div>
  )

  // 상태별 CSS 클래스 반환
  function getStatusClass(status) {
    switch (status) {
      case '등록됨': return 'success'
      case '업로드 대기': return 'warning'
      case '업로드 실패': return 'error'
      case '미등록': return 'default'
      default: return 'default'
    }
  }

  // 업로드 상태별 CSS 클래스 반환
  function getUploadStatusClass(status) {
    if (status.includes('완료')) return 'success'
    if (status.includes('실패')) return 'error'
    if (status.includes('중')) return 'loading'
    return 'default'
  }
}
