'use client'
import { useState } from 'react'

export default function DealerManagement({ dealerList, loading, onDealerListChange }) {
  // 행별 수정 모드 상태 관리
  const [editingRows, setEditingRows] = useState(new Set())
  const [originalData, setOriginalData] = useState({})

  // 특정 행 수정 모드 시작
  const handleRowEditStart = (index) => {
    setOriginalData(prev => ({
      ...prev,
      [index]: { ...dealerList[index] }
    }))
    setEditingRows(prev => new Set([...prev, index]))
  }

  // 특정 행 수정 모드 취소
  const handleRowEditCancel = (index) => {
    // 원본 데이터로 복원
    if (originalData[index]) {
      const updatedList = [...dealerList]
      updatedList[index] = { ...originalData[index] }
      onDealerListChange(updatedList)
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

  // 딜러 추가
  const handleAddDealer = () => {
    // 현재 수정 중인 행이 있으면 추가 불가
    if (editingRows.size > 0) {
      alert('현재 수정 중인 딜러가 있습니다. 저장 또는 취소 후 다시 시도해주세요.')
      return
    }
    
    const newDealer = {
      EMPKNAME: '',
      EMPTELNO1: '',
      EMPEMAIL: '',
      EMPSDATE: '',
      ADDR1: ''
    }
    // 상단에 추가 (배열의 맨 앞에 추가)
    const updatedList = [newDealer, ...dealerList]
    onDealerListChange(updatedList)
    
    // 새로 추가된 행을 수정 모드로 설정 (인덱스 0)
    setTimeout(() => {
      handleRowEditStart(0)
    }, 0)
  }

  // 딜러 삭제
  const handleDeleteDealer = (index) => {
    if (confirm('정말로 이 딜러를 삭제하시겠습니까?')) {
      const updatedList = dealerList.filter((_, i) => i !== index)
      onDealerListChange(updatedList)
      
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
    const updatedList = [...dealerList]
    updatedList[index] = {
      ...updatedList[index],
      [field]: value
    }
    onDealerListChange(updatedList)
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
        <h2 className="table-wrap__title">상사 딜러 관리</h2>
        <button 
          className="btn btn--primary" 
          type="button"
          onClick={handleAddDealer}
          disabled={loading || editingRows.size > 0}
        >
          딜러 추가
        </button>
      </div>
      
      <table className="table dealer-table">
        <colgroup>
          <col style={{ width: "80px" }} />
          <col style={{ width: "90px" }} />
          <col style={{ width: "110px" }} />
          <col style={{ width: "90px" }} />
          <col style={{ width: "200px" }} />
          <col style={{ width: "60px" }} />
        </colgroup>
        <thead>
          <tr>
            <th>딜러명</th>
            <th>연락처</th>
            <th>이메일</th>
            <th>입사일</th>
            <th>주소</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {dealerList.length > 0 ? (
            dealerList.map((dealer, index) => (
              <tr key={index}>
                <td>
                  <div className="input">
                    <input 
                      type="text" 
                      className={`input__field ${getFieldClassName(index)}`}
                      placeholder="딜러명" 
                      value={dealer.EMPKNAME || ''}
                      onChange={(e) => handleFieldChange(index, 'EMPKNAME', e.target.value)}
                      readOnly={!isRowEditing(index)}
                    />
                    <div className="input__utils">
                      <button 
                        type="button" 
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => handleFieldChange(index, 'EMPKNAME', '')}
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
                      placeholder="- 없이 입력" 
                      value={dealer.EMPTELNO1 || ''}
                      onChange={(e) => handleFieldChange(index, 'EMPTELNO1', e.target.value)}
                      readOnly={!isRowEditing(index)}
                    />
                    <div className="input__utils">
                      <button 
                        type="button" 
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => handleFieldChange(index, 'EMPTELNO1', '')}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input 
                      type="email" 
                      className={`input__field ${getFieldClassName(index)}`}
                      placeholder="이메일 주소" 
                      value={dealer.EMPEMAIL || ''}
                      onChange={(e) => handleFieldChange(index, 'EMPEMAIL', e.target.value)}
                      readOnly={!isRowEditing(index)}
                    />
                    <div className="input__utils">
                      <button 
                        type="button" 
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => handleFieldChange(index, 'EMPEMAIL', '')}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input 
                      type="date" 
                      className={`input__field ${getFieldClassName(index)}`}
                      value={dealer.EMPSDATE || ''}
                      onChange={(e) => handleFieldChange(index, 'EMPSDATE', e.target.value)}
                      readOnly={!isRowEditing(index)}
                    />
                    <div className="input__utils">
                      <button 
                        type="button" 
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => handleFieldChange(index, 'EMPSDATE', '')}
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
                      placeholder="주소를 입력하세요" 
                      value={dealer.ADDR1 || ''}
                      onChange={(e) => handleFieldChange(index, 'ADDR1', e.target.value)}
                      readOnly={!isRowEditing(index)}
                    />
                    <div className="input__utils">
                      <button 
                        type="button" 
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => handleFieldChange(index, 'ADDR1', '')}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="dealer-actions">
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
                          onClick={() => handleDeleteDealer(index)}
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
              <td colSpan={6} className="text-center">등록된 딜러가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
