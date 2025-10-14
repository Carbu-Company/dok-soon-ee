'use client'

export default function Account({ accountList, loading }) {
  const handleAddAccount = () => {
    // 계좌 추가 로직
    console.log('계좌 추가')
  }

  const handleEditAccount = (account) => {
    // 계좌 수정 로직
    console.log('계좌 수정:', account)
  }

  const handleDeleteAccount = (account) => {
    // 계좌 삭제 로직
    if (confirm('정말로 이 계좌를 삭제하시겠습니까?')) {
      console.log('계좌 삭제:', account)
    }
  }

  return (
    <div className="table-wrap">
      <h2 className="table-wrap__title">계좌 등록</h2>
      <div className="table-wrap__head">
        <button 
          className="btn btn--primary" 
          type="button"
          onClick={handleAddAccount}
        >
          계좌 추가
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>은행명</th>
            <th>계좌번호</th>
            <th>예금주</th>
            <th>계좌유형</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {accountList.length > 0 ? (
            accountList.map((account, index) => (
              <tr key={index}>
                <td>{account.bankName || '-'}</td>
                <td>{account.ACCT_NO || '-'}</td>
                <td>{account.accountHolder || '-'}</td>
                <td>{account.ACCT_NM || '-'}</td>
                <td>
                  <button 
                    className="btn btn--light btn--sm" 
                    type="button"
                    onClick={() => handleEditAccount(account)}
                  >
                    수정
                  </button>
                  <button 
                    className="btn btn--red btn--sm" 
                    type="button"
                    onClick={() => handleDeleteAccount(account)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">등록된 계좌가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
