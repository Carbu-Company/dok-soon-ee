'use client'
import { useState } from 'react'

export default function CapitalInfo({ 
  capitalInfo, 
  onCapitalInfoChange,
  loading
}) {
  // 각 섹션별 수정 모드 상태 관리
  const [editingRows, setEditingRows] = useState({
    capital: new Set()
  })
  const [originalData, setOriginalData] = useState({})
  // 새로 추가된 항목들의 인덱스를 추적
  const [newlyAddedItems, setNewlyAddedItems] = useState({
    capital: new Set()
  })

  // 특정 행 수정 모드 시작
  const handleRowEditStart = (section, index) => {
    const dataKey = `${section}-${index}`
    const currentData = capitalInfo
    
    // 새로 추가된 항목이 아닌 경우에만 originalData에 저장
    if (!newlyAddedItems.capital.has(index)) {
      setOriginalData(prev => ({
        ...prev,
        [dataKey]: { ...currentData }
      }))
    }
    
    setEditingRows(prev => ({
      ...prev,
      capital: new Set([...prev.capital, index])
    }))
  }

  // 새로 추가된 항목인지 확인
  const isNewlyAddedItem = (section, index) => {
    const currentData = capitalInfo
    return false
  }

  // 특정 행 수정 모드 취소
  const handleRowEditCancel = (section, index) => {
    const dataKey = `${section}-${index}`
    
    if (newlyAddedItems.capital.has(index)) {
      // 새로 추가된 행인 경우 - 해당 행을 삭제
      const updatedData = capitalInfo.filter((_, i) => i !== index)
      
      onCapitalInfoChange(updatedData)
      
      // newlyAddedItems에서 제거하고 인덱스 조정
      setNewlyAddedItems(prev => ({
        ...prev,
        capital: new Set([...prev.capital].filter(itemIndex => {
          if (itemIndex < index) return true
          if (itemIndex > index) {
            // 인덱스를 1 감소시켜야 하지만 Set에서는 직접 수정 불가
            // 새로운 Set을 만들어야 함
            return false
          }
          return false // itemIndex === index인 경우 제거
        }).map(itemIndex => itemIndex > index ? itemIndex - 1 : itemIndex))
      }))
    } else {
      // 기존 데이터 수정인 경우 - 원본 데이터로 복원
      const currentData = capitalInfo
      const updatedData = [...currentData]
      updatedData[index] = { ...originalData[dataKey] }
      
      onCapitalInfoChange(updatedData)
    }
    
    setEditingRows(prev => ({
      ...prev,
      capital: new Set([...prev.capital].filter(i => i !== index))
    }))
    
    setOriginalData(prev => {
      const newData = { ...prev }
      delete newData[dataKey]
      return newData
    })
  }

  // 특정 행 수정 모드 저장
  const handleRowEditSave = (section, index) => {
    // 여기에 저장 API 호출 로직 추가 예정
    alert('저장되었습니다.')
    
    // 새로 추가된 항목이었다면 추적에서 제거 (이제 기존 데이터가 됨)
    if (newlyAddedItems.capital.has(index)) {
      setNewlyAddedItems(prev => ({
        ...prev,
        capital: new Set([...prev.capital].filter(i => i !== index))
      }))
    }
    
    setEditingRows(prev => ({
      ...prev,
      capital: new Set([...prev.capital].filter(i => i !== index))
    }))
    
    const dataKey = `capital-${index}`
    setOriginalData(prev => {
      const newData = { ...prev }
      delete newData[dataKey]
      return newData
    })
  }

  // 항목 추가
  const handleAddItem = () => { 
    // 현재 수정 중인 행이 있으면 추가 불가
    if (editingRows.capital.size > 0) {
      alert('현재 수정 중인 항목이 있습니다. 저장 또는 취소 후 다시 시도해주세요.')
      return
    }
    
    // 기존 newlyAddedItems의 인덱스를 모두 1씩 증가 (새 항목이 맨 앞에 추가되므로)
    setNewlyAddedItems(prev => ({
      ...prev,
      capital: new Set([...prev.capital].map(index => index + 1).concat([0]))
    }))
    
    onCapitalInfoChange(capitalInfo)
    
    // 새로 추가된 행을 수정 모드로 설정 (인덱스 0)
    setTimeout(() => {
      handleRowEditStart('capital', 0)
    }, 0)
  }

  // 항목 삭제
  const handleDeleteItem = (index) => {
    if (confirm('정말로 이 항목을 삭제하시겠습니까?')) {
      const updatedData = capitalInfo.filter((_, i) => i !== index)
      
      onCapitalInfoChange(updatedData)
      
      // 수정 상태 정리
      if (editingRows.capital.has(index)) {
        setEditingRows(prev => ({
          ...prev,
          capital: new Set([...prev.capital].filter(i => i !== index))
        }))
      }
    }
  }

  // 필드 변경 감지
  const handleFieldChange = (index, field, value) => {
    const updatedData = [...capitalInfo]
    updatedData[index] = {
      ...capitalInfo[index],
      [field]: value  
    }
    
    onCapitalInfoChange(updatedData)
  }

  // 데이터 업데이트
  const updateData = (data) => {
    onCapitalInfoChange(data)
  }

  // 새 항목 템플릿
  const getNewItemTemplate = () => {
    return {
      LOAN_CORP_CD: '',
      LOAN_CORP_NM: '',
      TOT_LMT_AMT: 0,
      INTR_PAY_DD: '01'
    }
  }

  // 특정 행이 수정 모드인지 확인
  const isRowEditing = (index) => {
    return editingRows[section].has(index)
  }

  // 필드 클래스명 생성
  const getFieldClassName = (section, index) => {
    if (!isRowEditing(section, index)) {
      return 'settings-readonly'
    }
    return ''
  }

  return (
    <div className="cost-settings">
      {/* 캐피탈 설정 */}
      <div className="table-wrap">
        <div className="table-wrap__head">
          <h3 className="table-wrap__subtitle">캐피탈 총 대출 한도 설정</h3>
          <button 
            className="btn btn--primary" 
            type="button"
            onClick={() => handleAddItem()}
            disabled={loading || editingRows.capital.size > 0}
          >
            항목 추가
          </button>
        </div>
        
        <table className="table cost-table">
          <colgroup>
            <col style={{ width: "200px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "60px" }} />
          </colgroup>
          <thead>
            <tr>
              <th>캐피탈명</th>
              <th>총한도</th>
              <th>이자납입일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {capitalInfo.length > 0 ? (
              capitalInfo.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="input">
                      <input 
                        type="text" 
                        className={`input__field ${getFieldClassName(index)}`}
                        placeholder="캐피탈명" 
                        value={item.LOAN_CORP_NM || ''}
                        onChange={(e) => handleFieldChange(index, 'LOAN_CORP_NM', e.target.value)}
                        readOnly={!isRowEditing(index)}
                      />
                      <div className="input__utils">
                        <button 
                          type="button" 
                          className="jsInputClear input__clear ico ico--input-delete"
                          onClick={() => handleFieldChange('capital', index, 'LOAN_CORP_NM', '')}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="input">
                      <input 
                        type="number" 
                        className={`input__field ${getFieldClassName(index)}`}
                        placeholder="0" 
                        value={item.TOT_LMT_AMT || ''}
                        onChange={(e) => handleFieldChange(index, 'TOT_LMT_AMT', parseFloat(e.target.value) || 0)}
                        readOnly={!isRowEditing('purchase', index)}
                      />
                      <div className="input__utils">
                        <button 
                          type="button" 
                          className="jsInputClear input__clear ico ico--input-delete"
                          onClick={() => handleFieldChange(index, 'TOT_LMT_AMT', 0)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="input">
                      <input 
                        type="number" 
                        className={`input__field ${getFieldClassName(index)}`}
                        placeholder="0" 
                        value={item.INTR_PAY_DD || ''}
                        onChange={(e) => handleFieldChange(index, 'INTR_PAY_DD', parseInt(e.target.value) || 0)}
                        readOnly={!isRowEditing(index)}
                      />
                      <div className="input__utils">
                        <button 
                          type="button" 
                          className="jsInputClear input__clear ico ico--input-delete"
                          onClick={() => handleFieldChange(index, 'INTR_PAY_DD', 0)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="cost-actions">
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
                            onClick={() => handleDeleteItem(index)}
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
                <td colSpan={4} className="text-center">등록된 캐피탈 항목이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
