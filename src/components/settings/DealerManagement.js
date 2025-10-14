'use client'

export default function DealerManagement({ dealerList, loading }) {
  const handleAddDealer = () => {
    // 딜러 추가 로직
    console.log('딜러 추가')
  }

  const handleEditDealer = (dealer) => {
    // 딜러 수정 로직
    console.log('딜러 수정:', dealer)
  }

  const handleDeleteDealer = (dealer) => {
    // 딜러 삭제 로직
    if (confirm('정말로 이 딜러를 삭제하시겠습니까?')) {
      console.log('딜러 삭제:', dealer)
    }
  }

  return (
    <div className="table-wrap">
      <h2 className="table-wrap__title">상사 딜러 관리</h2>
      <div className="table-wrap__head">
        <button 
          className="btn btn--primary" 
          type="button"
          onClick={handleAddDealer}
        >
          딜러 추가
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>딜러명</th>
            <th>연락처</th>
            <th>이메일</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {dealerList.length > 0 ? (
            dealerList.map((dealer, index) => (
              <tr key={index}>
                <td>{dealer.dealerName || '-'}</td>
                <td>{dealer.phone || '-'}</td>
                <td>{dealer.email || '-'}</td>
                <td>
                  <span className={`status ${dealer.status === 'active' ? 'status--active' : 'status--inactive'}`}>
                    {dealer.status === 'active' ? '활성' : '비활성'}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn--light btn--sm" 
                    type="button"
                    onClick={() => handleEditDealer(dealer)}
                  >
                    수정
                  </button>
                  <button 
                    className="btn btn--red btn--sm" 
                    type="button"
                    onClick={() => handleDeleteDealer(dealer)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">등록된 딜러가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
