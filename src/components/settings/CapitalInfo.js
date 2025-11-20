'use client'
import { useState } from 'react'
import { openPostcodeSearch } from '@/components/modal/AddressModal'

export default function CapitalInfo({ 
  capitalInfo, 
  onCapitalInfoChange,  
  loading
}) {
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
        [index]: { ...capitalInfo[index] }
      }))
    }
    setEditingRows(prev => new Set([...prev, index]))
  }

  // 특정 행 수정 모드 취소
  const handleRowEditCancel = (index) => {
    if (newlyAddedItems.has(index)) {
      // 새로 추가된 행인 경우 - 해당 행을 삭제
      const updatedList = capitalInfo.filter((_, i) => i !== index)
      onCapitalInfoChange(updatedList)
      
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
      const updatedList = [...capitalInfo]
      updatedList[index] = { ...originalData[index] }
      onCapitalInfoChange(updatedList)
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

  // 캐피탈 정보 추가
  const handleAddCapitalInfo = () => {
    // 현재 수정 중인 행이 있으면 추가 불가
    if (editingRows.size > 0) {
      alert('현재 수정 중인 캐피탈 정보가 있습니다. 저장 또는 취소 후 다시 시도해주세요.')
      return
    }
    
    const newCapitalInfo = {
      LOAN_CORP_CD: '',
      LOAN_CORP_NM: '',
      TOT_LMT_AMT: '',
      INTR_PAY_DD: '01'
    }
    
    // 기존 newlyAddedItems의 인덱스를 모두 1씩 증가 (새 항목이 맨 앞에 추가되므로)
    setNewlyAddedItems(prev => {
      const newSet = new Set()
      prev.forEach(index => newSet.add(index + 1))
      newSet.add(0) // 새로 추가된 항목은 인덱스 0
      return newSet
    })
    
    // 상단에 추가 (배열의 맨 앞에 추가)
    const updatedList = [newCapitalInfo, ...capitalInfo]
    onCapitalInfoChange(updatedList)
    
    // 새로 추가된 행을 수정 모드로 설정 (인덱스 0)
    setTimeout(() => {
      handleRowEditStart(0)
    }, 0)
  }

  // 캐피탈 정보 삭제
  const handleDeleteCapitalInfo = (index) => {
    if (confirm('정말로 이 캐피탈 정보를 삭제하시겠습니까?')) {
      const updatedList = capitalInfo.filter((_, i) => i !== index)
      onCapitalInfoChange(updatedList)
      
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
    const updatedList = [...capitalInfo]
    updatedList[index] = {
      ...updatedList[index],
      [field]: value
    }
    onCapitalInfoChange(updatedList)
  }


  // 특정 행이 수정 모드인지 확인
  const isRowEditing = (index) => {
    return editingRows.has(index)
  };

  // 필드 클래스명 생성
  const getFieldClassName = (index) => {
    if (!isRowEditing(index)) {
      return 'settings-readonly'
    }
    return ''
  };

  return (
    <div className="table-wrap">
      <div className="table-wrap__head">
        <h2 className="table-wrap__title">캐피탈 총 대출 한도 관리</h2>
        <button 
          className="btn btn--primary" 
          type="button"
          onClick={handleAddCapitalInfo}
          disabled={loading || editingRows.size > 0}
        >
          캐피탈 추가
        </button>
      </div>
      
      <table className="table dealer-table">
        <colgroup>
          <col style={{ width: "40px" }} />
          <col style={{ width: "200px" }} />
          <col style={{ width: "100px" }} />
          <col style={{ width: "90px" }} />
          <col style={{ width: "60px" }} />
        </colgroup>
        <thead>
          <tr>
            <th>번호</th>
            <th>캐피탈명</th>
            <th>총 대출 한도</th>
            <th>이자 지급 일 (01~31)</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {capitalInfo.length > 0 ? (
            capitalInfo.map((item, index) => (
              <tr key={index}>
                <td>
                  {index + 1}
                </td>
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
                        onClick={() => handleFieldChange(index, 'LOAN_CORP_NM', '')}
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
                      placeholder="0" 
                      value={item.TOT_LMT_AMT ? Number(item.TOT_LMT_AMT).toLocaleString() : '0'}
                      onChange={(e) => handleFieldChange(index, 'TOT_LMT_AMT', e.target.value.replace(/[^\d]/g, ''))}
                      onFocus={(e) => e.target.select()}
                    />
                    <div className="input__utils">
                      <button 
                        type="button" 
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => handleFieldChange(index, 'TOT_LMT_AMT', '')}
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
                      placeholder="이자납부일" 
                      value={item.INTR_PAY_DD || ''}
                      onChange={(e) => handleFieldChange(index, 'INTR_PAY_DD', e.target.value)}
                      readOnly={!isRowEditing(index)}
                    />
                    <div className="input__utils">
                      <button 
                        type="button" 
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => handleFieldChange(index, 'INTR_PAY_DD', '')}
                      >
                        삭제
                      </button>
                    </div>
                    
                  </div>
                </td>
                <td>
                  <div className="capital-info-actions">
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
                          onClick={() => handleDeleteCapitalInfo(index)}
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
              <td colSpan={5} className="text-center">등록된 캐피탈 정보가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
