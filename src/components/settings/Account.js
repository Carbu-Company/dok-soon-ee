'use client'
import { useState } from 'react'

export default function Account({ accountList, loading, onAccountListChange }) {
  // 행별 수정 모드 상태 관리
  const [editingRows, setEditingRows] = useState(new Set())
  const [originalData, setOriginalData] = useState({})

  // 특정 행 수정 모드 시작
  const handleRowEditStart = (index) => {
    setOriginalData(prev => ({
      ...prev,
      [index]: { ...accountList[index] }
    }))
    setEditingRows(prev => new Set([...prev, index]))
  }

  // 특정 행 수정 모드 취소
  const handleRowEditCancel = (index) => {
    // 원본 데이터로 복원
    if (originalData[index]) {
      const updatedList = [...accountList]
      updatedList[index] = { ...originalData[index] }
      onAccountListChange(updatedList)
    }
    setEditingRows(prev => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
    setOriginalData(prev => {
      const newData = { ...prev }
      delete newData[index]
      return newData
    })
  }

  // 특정 행 수정 모드 저장
  const handleRowEditSave = (index) => {
    // 여기에 저장 API 호출 로직 추가 예정
    alert('저장되었습니다.')
    setEditingRows(prev => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
    setOriginalData(prev => {
      const newData = { ...prev }
      delete newData[index]
      return newData
    })
  }

  // 계좌 추가
  const handleAddAccount = () => {
    // 현재 수정 중인 행이 있으면 추가 불가
    if (editingRows.size > 0) {
      alert('현재 수정 중인 계좌가 있습니다. 저장 또는 취소 후 다시 시도해주세요.')
      return
    }
    
    const newAccount = {
      BNK_CD: '',
      BNK_NM: '',
      ACCT_NO: '',
      ACCT_NM: '',
      MAST_YN: 'N'
    }
    // 상단에 추가 (배열의 맨 앞에 추가)
    const updatedList = [newAccount, ...accountList]
    onAccountListChange(updatedList)
    
    // 새로 추가된 행을 수정 모드로 설정 (인덱스 0)
    setTimeout(() => {
      handleRowEditStart(0)
    }, 0)
  }

  // 계좌 삭제
  const handleDeleteAccount = (index) => {
    if (confirm('정말로 이 계좌를 삭제하시겠습니까?')) {
      const updatedList = accountList.filter((_, i) => i !== index)
      onAccountListChange(updatedList)
      
      // 수정 중인 행이 삭제되면 수정 상태 정리
      if (editingRows.has(index)) {
        setEditingRows(prev => {
          const newSet = new Set()
          prev.forEach(rowIndex => {
            if (rowIndex < index) {
              newSet.add(rowIndex)
            } else if (rowIndex > index) {
              newSet.add(rowIndex - 1)
            }
          })
          return newSet
        })
        
        setOriginalData(prev => {
          const newData = {}
          Object.keys(prev).forEach(key => {
            const keyIndex = parseInt(key)
            if (keyIndex < index) {
              newData[keyIndex] = prev[keyIndex]
            } else if (keyIndex > index) {
              newData[keyIndex - 1] = prev[keyIndex]
            }
          })
          return newData
        })
      }
    }
  }

  // 필드 변경 감지
  const handleFieldChange = (index, field, value) => {
    const updatedList = [...accountList]
    updatedList[index] = {
      ...updatedList[index],
      [field]: value
    }
    onAccountListChange(updatedList)
  }

  // 특정 행이 수정 모드인지 확인
  const isRowEditing = (index) => {
    return editingRows.has(index)
  }

  // 필드 클래스명 생성
  const getFieldClassName = (index) => {
    if (!isRowEditing(index)) {
      return 'settings-readonly'
    }
    return ''
  }

  return (
    <div className="table-wrap">
      <div className="table-wrap__head">
        <h2 className="table-wrap__title">계좌 등록</h2>
        <button 
          className="btn btn--primary" 
          type="button"
          onClick={handleAddAccount}
          disabled={loading || editingRows.size > 0}
        >
          계좌 추가
        </button>
      </div>
      
      <table className="table account-table">
        <colgroup>
          <col style={{ width: "60px" }} />
          <col style={{ width: "60px" }} />
          <col style={{ width: "140px" }} />
          <col style={{ width: "130px" }} />
          <col style={{ width: "100px" }} />
          <col style={{ width: "60px" }} />
        </colgroup>
        <thead>
          <tr>
            <th>은행코드</th>
            <th>은행명</th>
            <th>계좌번호</th>
            <th>계좌명</th>
            <th>주거래</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {accountList.length > 0 ? (
            accountList.map((account, index) => (
              <tr key={index}>
                <td>
                  <div className="input">
                    <input 
                      type="text" 
                      className={`input__field ${getFieldClassName(index)}`}
                      placeholder="은행코드" 
                      value={account.BNK_CD || ''}
                      onChange={(e) => handleFieldChange(index, 'BNK_CD', e.target.value)}
                      readOnly={!isRowEditing(index)}
                    />
                    <div className="input__utils">
                      <button 
                        type="button" 
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => handleFieldChange(index, 'BNK_CD', '')}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input 
                      type="text" 
                      className={`input__field ${getFieldClassName(index)}`}
                      placeholder="은행명" 
                      value={account.BNK_NM || ''}
                      onChange={(e) => handleFieldChange(index, 'BNK_NM', e.target.value)}
                      readOnly={!isRowEditing(index)}
                    />
                    <div className="input__utils">
                      <button 
                        type="button" 
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => handleFieldChange(index, 'BNK_NM', '')}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input 
                      type="text" 
                      className={`input__field ${getFieldClassName(index)}`}
                      placeholder="계좌번호" 
                      value={account.ACCT_NO || ''}
                      onChange={(e) => handleFieldChange(index, 'ACCT_NO', e.target.value)}
                      readOnly={!isRowEditing(index)}
                    />
                    <div className="input__utils">
                      <button 
                        type="button" 
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => handleFieldChange(index, 'ACCT_NO', '')}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input 
                      type="text" 
                      className={`input__field ${getFieldClassName(index)}`}
                      placeholder="계좌명" 
                      value={account.ACCT_NM || ''}
                      onChange={(e) => handleFieldChange(index, 'ACCT_NM', e.target.value)}
                      readOnly={!isRowEditing(index)}
                    />
                    <div className="input__utils">
                      <button 
                        type="button" 
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => handleFieldChange(index, 'ACCT_NM', '')}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="input">
                    <select 
                      className={`input__field ${getFieldClassName(index)}`}
                      value={account.MAST_YN || 'N'}
                      onChange={(e) => handleFieldChange(index, 'MAST_YN', e.target.value)}
                      disabled={!isRowEditing(index)}
                    >
                      <option value="Y">주거래</option>
                      <option value="N">일반</option>
                    </select>
                  </div>
                </td>
                <td>
                  <div className="account-actions">
                    {isRowEditing(index) ? (
                      <>
                        <button 
                          className="btn btn--primary btn--sm" 
                          type="button"
                          onClick={() => handleRowEditSave(index)}
                        >
                          저장
                        </button>
                        <button 
                          className="btn btn--light btn--sm" 
                          type="button"
                          onClick={() => handleRowEditCancel(index)}
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="btn btn--light btn--sm" 
                          type="button"
                          onClick={() => handleRowEditStart(index)}
                        >
                          수정
                        </button>
                        <button 
                          className="btn btn--red btn--sm" 
                          type="button"
                          onClick={() => handleDeleteAccount(index)}
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">등록된 계좌가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
