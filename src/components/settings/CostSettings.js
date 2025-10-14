'use client'

export default function CostSettings({ 
  purchaseCost, 
  sellCostSummary, 
  expenseList, 
  incomeList, 
  loading 
}) {
  const handleAddCostItem = () => {
    // 비용 항목 추가 로직
    console.log('비용 항목 추가')
  }

  const handleEditCostItem = (costItem) => {
    // 비용 항목 수정 로직
    console.log('비용 항목 수정:', costItem)
  }

  const handleDeleteCostItem = (costItem) => {
    // 비용 항목 삭제 로직
    if (confirm('정말로 이 비용 항목을 삭제하시겠습니까?')) {
      console.log('비용 항목 삭제:', costItem)
    }
  }

  // 매입비와 매도비를 합쳐서 표시
  const allCostItems = [
    ...purchaseCost.map(item => ({ ...item, type: '매입비' })),
    ...sellCostSummary.map(item => ({ ...item, type: '매도비' }))
  ]

  return (
    <div className="table-wrap">
      <h2 className="table-wrap__title">매입/매도비 설정</h2>
      <div className="table-wrap__head">
        <button 
          className="btn btn--primary" 
          type="button"
          onClick={handleAddCostItem}
        >
          비용 항목 추가
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>항목명</th>
            <th>유형</th>
            <th>금액</th>
            <th>설명</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {allCostItems.length > 0 ? (
            allCostItems.map((cost, index) => (
              <tr key={index}>
                <td>{cost.itemName || '-'}</td>
                <td>{cost.type || '-'}</td>
                <td>{cost.amount ? cost.amount.toLocaleString() + '원' : '-'}</td>
                <td>{cost.description || '-'}</td>
                <td>
                  <button 
                    className="btn btn--light btn--sm" 
                    type="button"
                    onClick={() => handleEditCostItem(cost)}
                  >
                    수정
                  </button>
                  <button 
                    className="btn btn--red btn--sm" 
                    type="button"
                    onClick={() => handleDeleteCostItem(cost)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">등록된 비용 항목이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
