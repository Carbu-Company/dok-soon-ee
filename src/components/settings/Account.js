'use client'
import { useState } from 'react'

export default function Account({ accountList, bankList, loading, onAccountListChange }) {
  // 행별 수정 모드 상태 관리
  const [editingRows, setEditingRows] = useState(new Set())
  const [originalData, setOriginalData] = useState({})
  // 새로 추가된 항목들의 인덱스를 추적
  const [newlyAddedItems, setNewlyAddedItems] = useState(new Set())

  // 특정 행 수정 모드 시작
  const handleRowEditStart = (index) => {
    // 새로 추가된 항목이 아닌 경우에만 originalData에 저장
    if (!newlyAddedItems.has(index)) {
      setOriginalData(prev => ({
        ...prev,
        [index]: { ...accountList[index] }
      }))
    }
    setEditingRows(prev => new Set([...prev, index]))
  }

  // 특정 행 수정 모드 취소
  const handleRowEditCancel = (index) => {
    if (newlyAddedItems.has(index)) {
      // 새로 추가된 행인 경우 - 해당 행을 삭제
      const updatedList = accountList.filter((_, i) => i !== index)
      onAccountListChange(updatedList)
      
      // newlyAddedItems에서 제거하고 인덱스 조정
      setNewlyAddedItems(prev => {
        const newSet = new Set()
        prev.forEach(itemIndex => {
          if (itemIndex < index) {
            newSet.add(itemIndex)
          } else if (itemIndex > index) {
            newSet.add(itemIndex - 1)
          }
          // itemIndex === index인 경우는 제거됨
        })
        return newSet
      })
    } else {
      // 기존 데이터 수정인 경우 - 원본 데이터로 복원
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
    
    // 새로 추가된 항목이었다면 추적에서 제거 (이제 기존 데이터가 됨)
    if (newlyAddedItems.has(index)) {
      setNewlyAddedItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(index)
        return newSet
      })
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
      MAST_YN: 'N',
      USE_YN: 'Y'
    }
    
    // 기존 newlyAddedItems의 인덱스를 모두 1씩 증가 (새 항목이 맨 앞에 추가되므로)
    setNewlyAddedItems(prev => {
      const newSet = new Set()
      prev.forEach(index => newSet.add(index + 1))
      newSet.add(0) // 새로 추가된 항목은 인덱스 0
      return newSet
    })
    
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
            <th>은행명 / 코드</th>
            <th>계좌번호</th>
            <th>계좌명</th>
            <th>주거래 통장</th>
            <th>사용여부</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {accountList.length > 0 ? (
            accountList.map((account, index) => (
              <tr key={index}>
                <td>
                  <div className="input">
                    <select
                      className={`input__field ${getFieldClassName(index)}`}
                      value={account.BAK_CD !== undefined ? account.BAK_CD : (account.BNK_CD || '')}
                      onChange={(e) => handleFieldChange(index, 'BAK_CD', e.target.value)}
                      disabled={!isRowEditing(index)}
                    >
                      <option value="">은행 선택</option>
                      {bankList && bankList.map((bank, i) => (
                        <option key={i} value={bank.CD}>
                          {bank.CD_NM} ({bank.CD})
                        </option>
                      ))}
                    </select>
                    <div className="input__utils">
                      <button 
                        type="button" 
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => handleFieldChange(index, 'BAK_CD', '')}
                        disabled={!isRowEditing(index)}
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
                  <div className="form-option-wrap">
                    <div className="form-option">
                      <label className="form-option__label">
                        <input 
                          type="radio" 
                          name={`MAST_YN_${index}`}
                          value="Y" 
                          checked={account.MAST_YN === 'Y'}
                          onChange={(e) => handleFieldChange(index, 'MAST_YN', e.target.value)}
                        />
                        <span className="form-option__title">예</span>
                      </label>
                    </div>
                    <div className="form-option">
                      <label className="form-option__label">
                        <input 
                          type="radio" 
                          name={`MAST_YN_${index}`} 
                          value="N"
                          checked={account.MAST_YN === 'N'}
                          onChange={(e) => handleFieldChange(index, 'MAST_YN', e.target.value)}
                        />
                        <span className="form-option__title">아니오</span>
                      </label>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="form-option-wrap">
                    <div className="form-option">
                      <label className="form-option__label">
                        <input 
                          type="radio" 
                          name={`USE_YN_${index}`}
                          value="Y" 
                          checked={account.USE_YN === 'Y'}
                          onChange={(e) => handleFieldChange(index, 'USE_YN', e.target.value)}
                        />
                        <span className="form-option__title">예</span>
                      </label>
                    </div>
                    <div className="form-option">
                      <label className="form-option__label">
                        <input 
                          type="radio" 
                          name={`USE_YN_${index}`} 
                          value="N"
                          checked={account.USE_YN === 'N'}
                          onChange={(e) => handleFieldChange(index, 'USE_YN', e.target.value)}
                        />
                        <span className="form-option__title">아니오</span>
                      </label>
                    </div>
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
