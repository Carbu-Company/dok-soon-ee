'use client'
import { useState } from 'react'

export default function CostSettings({ 
  purchaseCost, 
  sellCost, 
  expenseList, 
  incomeList, 
  loading,
  onPurchaseCostChange,
  onSellCostChange,
  onExpenseListChange,
  onIncomeListChange
}) {
  // 각 섹션별 수정 모드 상태 관리
  const [editingRows, setEditingRows] = useState({
    purchase: new Set(),
    sell: new Set(),
    expense: new Set(),
    income: new Set()
  })
  const [originalData, setOriginalData] = useState({})
  // 새로 추가된 항목들의 인덱스를 추적
  const [newlyAddedItems, setNewlyAddedItems] = useState({
    purchase: new Set(),
    sell: new Set(),
    expense: new Set(),
    income: new Set()
  })

  // 특정 행 수정 모드 시작
  const handleRowEditStart = (section, index) => {
    const dataKey = `${section}-${index}`
    const currentData = getCurrentData(section)
    
    // 새로 추가된 항목이 아닌 경우에만 originalData에 저장
    if (!newlyAddedItems[section].has(index)) {
      setOriginalData(prev => ({
        ...prev,
        [dataKey]: { ...currentData[index] }
      }))
    }
    
    setEditingRows(prev => ({
      ...prev,
      [section]: new Set([...prev[section], index])
    }))
  }

  // 새로 추가된 항목인지 확인
  const isNewlyAddedItem = (section, index) => {
    const currentData = getCurrentData(section)
    const item = currentData[index]
    
    // 새로 추가된 항목의 특징: 모든 필드가 기본값이거나 빈 값
    if (section === 'purchase' || section === 'sell') {
      return item.TRADE_ITEM_SEQ === 0 && 
             item.TRADE_ITEM_CD === '' && 
             item.TRADE_ITEM_NM === '' && 
             item.TRADE_ITEM_RT === 0 && 
             item.TRADE_ITEM_AMT === 0
    } else if (section === 'expense') {
      return item.EXPD_ITEM_CD === '' && 
             item.EXPD_ITEM_NM === '' && 
             item.BASE_AMT === 0 && 
             item.SORT_SEQ === 0 && 
             item.USE_YN === 'Y'
    } else if (section === 'income') {
      return item.IMP_ITEM_CD === '' && 
             item.IMP_ITEM_NM === '' && 
             item.BASE_AMT === 0 && 
             item.SORT_SEQ === 0 && 
             item.USE_YN === 'Y'
    }
    return false
  }

  // 특정 행 수정 모드 취소
  const handleRowEditCancel = (section, index) => {
    const dataKey = `${section}-${index}`
    
    if (newlyAddedItems[section].has(index)) {
      // 새로 추가된 행인 경우 - 해당 행을 삭제
      const currentData = getCurrentData(section)
      const updatedData = currentData.filter((_, i) => i !== index)
      
      updateData(section, updatedData)
      
      // newlyAddedItems에서 제거하고 인덱스 조정
      setNewlyAddedItems(prev => ({
        ...prev,
        [section]: new Set([...prev[section]].filter(itemIndex => {
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
      const currentData = getCurrentData(section)
      const updatedData = [...currentData]
      updatedData[index] = { ...originalData[dataKey] }
      
      updateData(section, updatedData)
    }
    
    setEditingRows(prev => ({
      ...prev,
      [section]: new Set([...prev[section]].filter(i => i !== index))
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
    if (newlyAddedItems[section].has(index)) {
      setNewlyAddedItems(prev => ({
        ...prev,
        [section]: new Set([...prev[section]].filter(i => i !== index))
      }))
    }
    
    setEditingRows(prev => ({
      ...prev,
      [section]: new Set([...prev[section]].filter(i => i !== index))
    }))
    
    const dataKey = `${section}-${index}`
    setOriginalData(prev => {
      const newData = { ...prev }
      delete newData[dataKey]
      return newData
    })
  }

  // 항목 추가
  const handleAddItem = (section) => {
    // 현재 수정 중인 행이 있으면 추가 불가
    if (editingRows[section].size > 0) {
      const sectionName = getSectionName(section)
      alert(`현재 수정 중인 ${sectionName} 항목이 있습니다. 저장 또는 취소 후 다시 시도해주세요.`)
      return
    }
    
    const newItem = getNewItemTemplate(section)
    const currentData = getCurrentData(section)
    const updatedData = [newItem, ...currentData]
    
    // 기존 newlyAddedItems의 인덱스를 모두 1씩 증가 (새 항목이 맨 앞에 추가되므로)
    setNewlyAddedItems(prev => ({
      ...prev,
      [section]: new Set([...prev[section]].map(index => index + 1).concat([0]))
    }))
    
    updateData(section, updatedData)
    
    // 새로 추가된 행을 수정 모드로 설정 (인덱스 0)
    setTimeout(() => {
      handleRowEditStart(section, 0)
    }, 0)
  }

  // 섹션 이름 가져오기
  const getSectionName = (section) => {
    switch (section) {
      case 'purchase': return '매입비'
      case 'sell': return '매도비'
      case 'expense': return '지출'
      case 'income': return '수입'
      default: return '항목'
    }
  }

  // 항목 삭제
  const handleDeleteItem = (section, index) => {
    if (confirm('정말로 이 항목을 삭제하시겠습니까?')) {
      const currentData = getCurrentData(section)
      const updatedData = currentData.filter((_, i) => i !== index)
      
      updateData(section, updatedData)
      
      // 수정 상태 정리
      if (editingRows[section].has(index)) {
        setEditingRows(prev => ({
          ...prev,
          [section]: new Set([...prev[section]].filter(i => i !== index))
        }))
      }
    }
  }

  // 필드 변경 감지
  const handleFieldChange = (section, index, field, value) => {
    const currentData = getCurrentData(section)
    const updatedData = [...currentData]
    updatedData[index] = {
      ...updatedData[index],
      [field]: value
    }
    
    updateData(section, updatedData)
  }

  // 현재 데이터 가져오기
  const getCurrentData = (section) => {
    switch (section) {
      case 'purchase': return purchaseCost
      case 'sell': return sellCost
      case 'expense': return expenseList
      case 'income': return incomeList
      default: return []
    }
  }

  // 데이터 업데이트
  const updateData = (section, data) => {
    switch (section) {
      case 'purchase': 
        onPurchaseCostChange(data)
        break
      case 'sell': 
        onSellCostChange(data)
        break
      case 'expense': 
        onExpenseListChange(data)
        break
      case 'income': 
        onIncomeListChange(data)
        break
    }
  }

  // 새 항목 템플릿
  const getNewItemTemplate = (section) => {
    switch (section) {
      case 'purchase':
      case 'sell':
        return {
          TRADE_ITEM_SEQ: 0,
          TRADE_ITEM_CD: '',
          TRADE_ITEM_NM: '',
          TRADE_ITEM_RT: 0,
          TRADE_ITEM_AMT: 0,
          DEL_YN: 'N'
        }
      case 'expense':
        return {
          EXPD_ITEM_CD: '',
          EXPD_ITEM_NM: '',
          BASE_AMT: 0,
          SORT_SEQ: 0,
          USE_YN: 'Y'
        }
      case 'income':
        return {
          IMP_ITEM_CD: '',
          IMP_ITEM_NM: '',
          BASE_AMT: 0,
          SORT_SEQ: 0,
          USE_YN: 'Y'
        }
      default:
        return {}
    }
  }

  // 특정 행이 수정 모드인지 확인
  const isRowEditing = (section, index) => {
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
      {/* 매입비 설정 */}
      <div className="table-wrap">
        <div className="table-wrap__head">
          <h3 className="table-wrap__subtitle">매입비 설정</h3>
          <button 
            className="btn btn--primary" 
            type="button"
            onClick={() => handleAddItem('purchase')}
            disabled={loading || editingRows.purchase.size > 0}
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
              <th>항목명</th>
              <th>비율(%)</th>
              <th>금액</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {purchaseCost.length > 0 ? (
              purchaseCost.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="input">
                      <input 
                        type="hidden"
                        value={item.TRADE_ITEM_SEQ || ''}
                        name="TRADE_ITEM_SEQ"
                      />
                      <input 
                        type="text" 
                        className={`input__field ${getFieldClassName('purchase', index)}`}
                        placeholder="항목명" 
                        value={item.TRADE_ITEM_NM || ''}
                        onChange={(e) => handleFieldChange('purchase', index, 'TRADE_ITEM_NM', e.target.value)}
                        readOnly={!isRowEditing('purchase', index)}
                      />
                      <div className="input__utils">
                        <button 
                          type="button" 
                          className="jsInputClear input__clear ico ico--input-delete"
                          onClick={() => handleFieldChange('purchase', index, 'TRADE_ITEM_NM', '')}
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
                        className={`input__field ${getFieldClassName('purchase', index)}`}
                        placeholder="0" 
                        value={item.TRADE_ITEM_RT || ''}
                        onChange={(e) => handleFieldChange('purchase', index, 'TRADE_ITEM_RT', parseFloat(e.target.value) || 0)}
                        readOnly={!isRowEditing('purchase', index)}
                      />
                      <div className="input__utils">
                        <button 
                          type="button" 
                          className="jsInputClear input__clear ico ico--input-delete"
                          onClick={() => handleFieldChange('purchase', index, 'TRADE_ITEM_RT', 0)}
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
                        className={`input__field ${getFieldClassName('purchase', index)}`}
                        placeholder="0" 
                        value={item.TRADE_ITEM_AMT || ''}
                        onChange={(e) => handleFieldChange('purchase', index, 'TRADE_ITEM_AMT', parseInt(e.target.value) || 0)}
                        readOnly={!isRowEditing('purchase', index)}
                      />
                      <div className="input__utils">
                        <button 
                          type="button" 
                          className="jsInputClear input__clear ico ico--input-delete"
                          onClick={() => handleFieldChange('purchase', index, 'TRADE_ITEM_AMT', 0)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="cost-actions">
                      {isRowEditing('purchase', index) ? (
                        <>
                          <button 
                            className="btn btn--primary btn--sm" 
                            type="button"
                            onClick={() => handleRowEditSave('purchase', index)}
                          >
                            저장
                          </button>
                          <button 
                            className="btn btn--light btn--sm" 
                            type="button"
                            onClick={() => handleRowEditCancel('purchase', index)}
                          >
                            취소
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className="btn btn--light btn--sm" 
                            type="button"
                            onClick={() => handleRowEditStart('purchase', index)}
                          >
                            수정
                          </button>
                          <button 
                            className="btn btn--red btn--sm" 
                            type="button"
                            onClick={() => handleDeleteItem('purchase', index)}
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
                <td colSpan={4} className="text-center">등록된 매입비 항목이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 매도비 설정 */}
      <div className="table-wrap">
        <div className="table-wrap__head">
          <h3 className="table-wrap__subtitle">매도비 설정</h3>
          <button 
            className="btn btn--primary" 
            type="button"
            onClick={() => handleAddItem('sell')}
            disabled={loading || editingRows.sell.size > 0}
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
              <th>항목명</th>
              <th>비율(%)</th>
              <th>금액</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {sellCost.length > 0 ? (
              sellCost.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="input">
                      <input 
                        type="hidden"
                        value={item.TRADE_ITEM_SEQ || ''}
                        name="TRADE_ITEM_SEQ"
                      />
                      <input 
                        type="text" 
                        className={`input__field ${getFieldClassName('sell', index)}`}
                        placeholder="항목명" 
                        value={item.TRADE_ITEM_NM || ''}
                        onChange={(e) => handleFieldChange('sell', index, 'TRADE_ITEM_NM', e.target.value)}
                        readOnly={!isRowEditing('sell', index)}
                      />
                      <div className="input__utils">
                        <button 
                          type="button" 
                          className="jsInputClear input__clear ico ico--input-delete"
                          onClick={() => handleFieldChange('sell', index, 'TRADE_ITEM_NM', '')}
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
                        className={`input__field ${getFieldClassName('sell', index)}`}
                        placeholder="0" 
                        value={item.TRADE_ITEM_RT || ''}
                        onChange={(e) => handleFieldChange('sell', index, 'TRADE_ITEM_RT', parseFloat(e.target.value) || 0)}
                        readOnly={!isRowEditing('sell', index)}
                      />
                      <div className="input__utils">
                        <button 
                          type="button" 
                          className="jsInputClear input__clear ico ico--input-delete"
                          onClick={() => handleFieldChange('sell', index, 'TRADE_ITEM_RT', 0)}
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
                        className={`input__field ${getFieldClassName('sell', index)}`}
                        placeholder="0" 
                        value={item.TRADE_ITEM_AMT || ''}
                        onChange={(e) => handleFieldChange('sell', index, 'TRADE_ITEM_AMT', parseInt(e.target.value) || 0)}
                        readOnly={!isRowEditing('sell', index)}
                      />
                      <div className="input__utils">
                        <button 
                          type="button" 
                          className="jsInputClear input__clear ico ico--input-delete"
                          onClick={() => handleFieldChange('sell', index, 'TRADE_ITEM_AMT', 0)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="cost-actions">
                      {isRowEditing('sell', index) ? (
                        <>
                          <button 
                            className="btn btn--primary btn--sm" 
                            type="button"
                            onClick={() => handleRowEditSave('sell', index)}
                          >
                            저장
                          </button>
                          <button 
                            className="btn btn--light btn--sm" 
                            type="button"
                            onClick={() => handleRowEditCancel('sell', index)}
                          >
                            취소
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className="btn btn--light btn--sm" 
                            type="button"
                            onClick={() => handleRowEditStart('sell', index)}
                          >
                            수정
                          </button>
                          <button 
                            className="btn btn--red btn--sm" 
                            type="button"
                            onClick={() => handleDeleteItem('sell', index)}
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
                <td colSpan={4} className="text-center">등록된 매도비 항목이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 지출 항목 설정 */}
      <div className="table-wrap">
        <div className="table-wrap__head">
          <h3 className="table-wrap__subtitle">지출 항목 설정</h3>
          <button 
            className="btn btn--primary" 
            type="button"
            onClick={() => handleAddItem('expense')}
            disabled={loading || editingRows.expense.size > 0}
          >
            항목 추가
          </button>
        </div>
        
        <table className="table cost-table">
          <colgroup>
            <col style={{ width: "200px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "60px" }} />
            <col style={{ width: "90px" }} />
            <col style={{ width: "60px" }} />
          </colgroup>
          <thead>
            <tr>
              <th>지출 항목명</th>
              <th>금액</th>
              <th>정렬순서</th>
              <th>사용여부</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {expenseList.length > 0 ? (
              expenseList.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="input">
                      <input 
                        type="hidden"
                        value={item.EXPD_ITEM_CD || ''}
                        name="EXPD_ITEM_CD"
                      />
                      <input 
                        type="text" 
                        className={`input__field ${getFieldClassName('expense', index)}`}
                        placeholder="항목명" 
                        value={item.EXPD_ITEM_NM || ''}
                        onChange={(e) => handleFieldChange('expense', index, 'EXPD_ITEM_NM', e.target.value)}
                        readOnly={!isRowEditing('expense', index)}
                      />
                      <div className="input__utils">
                        <button 
                          type="button" 
                          className="jsInputClear input__clear ico ico--input-delete"
                          onClick={() => handleFieldChange('expense', index, 'EXPD_ITEM_NM', '')}
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
                        className={`input__field ${getFieldClassName('expense', index)}`}
                        placeholder="0" 
                        value={item.BASE_AMT || ''}
                        onChange={(e) => handleFieldChange('expense', index, 'BASE_AMT', e.target.value)}
                        readOnly={!isRowEditing('expense', index)}
                      />
                      <div className="input__utils">
                        <button 
                          type="button" 
                          className="jsInputClear input__clear ico ico--input-delete"
                          onClick={() => handleFieldChange('expense', index, 'BASE_AMT', '0')}
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
                        className={`input__field ${getFieldClassName('expense', index)}`}
                        placeholder="0" 
                        value={item.SORT_SEQ || ''}
                        onChange={(e) => handleFieldChange('expense', index, 'SORT_SEQ', e.target.value)}
                        readOnly={!isRowEditing('expense', index)}
                      />
                      <div className="input__utils">
                        <button 
                          type="button" 
                          className="jsInputClear input__clear ico ico--input-delete"
                          onClick={() => handleFieldChange('expense', index, 'SORT_SEQ', '0')}
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
                            name={`EXPENSE_USE_YN_${index}`}
                            value="Y" 
                            checked={item.USE_YN === 'Y'}
                            onChange={(e) => handleFieldChange('expense', index, 'USE_YN', e.target.value)}
                          />
                          <span className="form-option__title">예</span>
                        </label>
                      </div>
                      <div className="form-option">
                        <label className="form-option__label">
                          <input 
                            type="radio" 
                            name={`EXPENSE_USE_YN_${index}`} 
                            value="N"
                            checked={item.USE_YN === 'N'}
                            onChange={(e) => handleFieldChange('expense', index, 'USE_YN', e.target.value)}
                          />
                          <span className="form-option__title">아니오</span>
                        </label>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="cost-actions">
                      {isRowEditing('expense', index) ? (
                        <>
                          <button 
                            className="btn btn--primary btn--sm" 
                            type="button"
                            onClick={() => handleRowEditSave('expense', index)}
                          >
                            저장
                          </button>
                          <button 
                            className="btn btn--light btn--sm" 
                            type="button"
                            onClick={() => handleRowEditCancel('expense', index)}
                          >
                            취소
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className="btn btn--light btn--sm" 
                            type="button"
                            onClick={() => handleRowEditStart('expense', index)}
                          >
                            수정
                          </button>
                          <button 
                            className="btn btn--red btn--sm" 
                            type="button"
                            onClick={() => handleDeleteItem('expense', index)}
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
                <td colSpan={4} className="text-center">등록된 지출 항목이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 수입 항목 설정 */}
      <div className="table-wrap">
        <div className="table-wrap__head">
          <h3 className="table-wrap__subtitle">수입 항목 설정</h3>
          <button 
            className="btn btn--primary" 
            type="button"
            onClick={() => handleAddItem('income')}
            disabled={loading || editingRows.income.size > 0}
          >
            항목 추가
          </button>
        </div>
        
        <table className="table cost-table">
          <colgroup>
          <col style={{ width: "200px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "60px" }} />
            <col style={{ width: "90px" }} />
            <col style={{ width: "60px" }} />
          </colgroup>
          <thead>
            <tr>
            <th>수입 항목명</th>
            <th>금액</th>
            <th>정렬순서</th>
            <th>사용여부</th>
            <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {incomeList.length > 0 ? (
              incomeList.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="input">
                      <input 
                        type="hidden"
                        value={item.IMP_ITEM_CD || ''}
                        name="IMP_ITEM_CD"
                      />
                      <input 
                        type="text" 
                        className={`input__field ${getFieldClassName('income', index)}`}
                        placeholder="항목명" 
                        value={item.IMP_ITEM_NM || ''}
                        onChange={(e) => handleFieldChange('income', index, 'IMP_ITEM_NM', e.target.value)}
                        readOnly={!isRowEditing('income', index)}
                      />
                      <div className="input__utils">
                        <button 
                          type="button" 
                          className="jsInputClear input__clear ico ico--input-delete"
                          onClick={() => handleFieldChange('income', index, 'IMP_ITEM_NM', '')}
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
                        className={`input__field ${getFieldClassName('income', index)}`}
                        placeholder="0" 
                        value={item.BASE_AMT || ''}
                        onChange={(e) => handleFieldChange('income', index, 'BASE_AMT', e.target.value)}
                        readOnly={!isRowEditing('income', index)}
                      />
                      <div className="input__utils">
                        <button 
                          type="button" 
                          className="jsInputClear input__clear ico ico--input-delete"
                          onClick={() => handleFieldChange('income', index, 'BASE_AMT', '0')}
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
                        className={`input__field ${getFieldClassName('income', index)}`}
                        placeholder="0" 
                        value={item.SORT_SEQ || ''}
                        onChange={(e) => handleFieldChange('income', index, 'SORT_SEQ', e.target.value)}
                        readOnly={!isRowEditing('income', index)}
                      />
                      <div className="input__utils">
                        <button 
                          type="button" 
                          className="jsInputClear input__clear ico ico--input-delete"
                          onClick={() => handleFieldChange('income', index, 'SORT_SEQ', '0')}
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
                            name={`INCOME_USE_YN_${index}`}
                            value="Y" 
                            checked={item.USE_YN === 'Y'}
                            onChange={(e) => handleFieldChange('income', index, 'USE_YN', e.target.value)}
                          />
                          <span className="form-option__title">예</span>
                        </label>
                      </div>
                      <div className="form-option">
                        <label className="form-option__label">
                          <input 
                            type="radio" 
                            name={`INCOME_USE_YN_${index}`} 
                            value="N"
                            checked={item.USE_YN === 'N'}
                            onChange={(e) => handleFieldChange('income', index, 'USE_YN', e.target.value)}
                          />
                          <span className="form-option__title">아니오</span>
                        </label>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="cost-actions">
                      {isRowEditing('income', index) ? (
                        <>
                          <button 
                            className="btn btn--primary btn--sm" 
                            type="button"
                            onClick={() => handleRowEditSave('income', index)}
                          >
                            저장
                          </button>
                          <button 
                            className="btn btn--light btn--sm" 
                            type="button"
                            onClick={() => handleRowEditCancel('income', index)}
                          >
                            취소
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className="btn btn--light btn--sm" 
                            type="button"
                            onClick={() => handleRowEditStart('income', index)}
                          >
                            수정
                          </button>
                          <button 
                            className="btn btn--red btn--sm" 
                            type="button"
                            onClick={() => handleDeleteItem('income', index)}
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
                <td colSpan={4} className="text-center">등록된 수입 항목이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
