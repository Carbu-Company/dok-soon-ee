'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { 
  getCompanyInfo, 
  getCompanyDealer, 
  getCompanySangsaDealer,
  getPurchaseCost,
  getSellCostSummary,
  getCompanyExpense,
  getCompanyIncome
} from '@/app/(main)/api/carApi'

export default function SettingsPage() {
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState('company-info')
  
  // 로딩 상태
  const [loading, setLoading] = useState(false)
  
  // 상사 정보 상태
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    businessNumber: '',
    loginId: '',
    password: '',
    phone: '',
    email: '',
    emailDomain: 'gmail.com',
    mobile: '',
    address: '',
    detailAddress: ''
  })
  
  // 딜러 목록 상태
  const [dealerList, setDealerList] = useState([])
  
  // 매입/매도비 설정 상태
  const [purchaseCost, setPurchaseCost] = useState([])
  const [sellCostSummary, setSellCostSummary] = useState([])
  
  // 지출/수입 항목 상태
  const [expenseList, setExpenseList] = useState([])
  const [incomeList, setIncomeList] = useState([])
  
  // 이메일 도메인 옵션
  const emailDomains = [
    { value: 'gmail.com', label: 'gmail.com' },
    { value: 'naver.com', label: 'naver.com' },
    { value: 'daum.net', label: 'daum.net' },
    { value: 'nate.com', label: 'nate.com' }
  ]
  
  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadCompanyInfo()
    loadDealerList()
    loadPurchaseCost()
    loadSellCostSummary()
    loadExpenseList()
    loadIncomeList()
  }, [])
  
  // 상사 정보 로드
  const loadCompanyInfo = async () => {
    try {
      setLoading(true)
      const result = await getCompanyInfo() // agentId는 자동으로 세션에서 가져옴
      console.log('상사 정보 API 응답:', result)
      if (result.success && result.data) {
        console.log('상사 정보 데이터:', result.data)
        setCompanyInfo({
          companyName: result.data.companyName || '',
          businessNumber: result.data.businessNumber || '',
          loginId: result.data.loginId || '',
          password: result.data.password || '',
          phone: result.data.phone || '',
          email: result.data.email || '',
          emailDomain: result.data.emailDomain || 'gmail.com',
          mobile: result.data.mobile || '',
          address: result.data.address || '',
          detailAddress: result.data.detailAddress || ''
        })
      } else {
        console.log('상사 정보 로드 실패:', result.error)
      }
    } catch (error) {
      console.error('상사 정보 로드 오류:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // 딜러 목록 로드
  const loadDealerList = async () => {
    try {
      const result = await getCompanyDealer() // agentId는 자동으로 세션에서 가져옴
      console.log('딜러 목록 API 응답:', result)
      if (result.success && result.data) {
        console.log('딜러 목록 데이터:', result.data)
        setDealerList(result.data)
      } else {
        console.log('딜러 목록 로드 실패:', result.error)
      }
    } catch (error) {
      console.error('딜러 목록 로드 오류:', error)
    }
  }
  
  // 매입비 설정 로드
  const loadPurchaseCost = async () => {
    try {
      const result = await getPurchaseCost() // agentId는 자동으로 세션에서 가져옴
      console.log('매입비 설정 API 응답:', result)
      if (result.success && result.data) {
        console.log('매입비 설정 데이터:', result.data)
        setPurchaseCost(result.data)
      } else {
        console.log('매입비 설정 로드 실패:', result.error)
      }
    } catch (error) {
      console.error('매입비 설정 로드 오류:', error)
    }
  }
  
  // 매도비 설정 로드
  const loadSellCostSummary = async () => {
    try {
      const result = await getSellCostSummary() // agentId는 자동으로 세션에서 가져옴
      console.log('매도비 설정 API 응답:', result)
      if (result.success && result.data) {
        console.log('매도비 설정 데이터:', result.data)
        setSellCostSummary(result.data)
      } else {
        console.log('매도비 설정 로드 실패:', result.error)
      }
    } catch (error) {
      console.error('매도비 설정 로드 오류:', error)
    }
  }
  
  // 지출 항목 로드
  const loadExpenseList = async () => {
    try {
      const result = await getCompanyExpense() // agentId는 자동으로 세션에서 가져옴
      console.log('지출 항목 API 응답:', result)
      if (result.success && result.data) {
        console.log('지출 항목 데이터:', result.data)
        setExpenseList(result.data)
      } else {
        console.log('지출 항목 로드 실패:', result.error)
      }
    } catch (error) {
      console.error('지출 항목 로드 오류:', error)
    }
  }
  
  // 수입 항목 로드
  const loadIncomeList = async () => {
    try {
      const result = await getCompanyIncome() // agentId는 자동으로 세션에서 가져옴
      console.log('수입 항목 API 응답:', result)
      if (result.success && result.data) {
        console.log('수입 항목 데이터:', result.data)
        setIncomeList(result.data)
      } else {
        console.log('수입 항목 로드 실패:', result.error)
      }
    } catch (error) {
      console.error('수입 항목 로드 오류:', error)
    }
  }
  
  // 상사 정보 업데이트
  const handleCompanyInfoChange = (field, value) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // 저장 처리
  const handleSave = async () => {
    try {
      setLoading(true)
      // 여기에 저장 API 호출 로직 추가
      alert('저장되었습니다.')
    } catch (error) {
      console.error('저장 오류:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }
  
  // 탭 변경 처리
  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }
    return (
        <main className="container container--page">
          <div className="container__head">
            <h2 className="container__title">환경 설정</h2>
  
            <div className="guidebox">
              <p className="guidebox__title">도움말</p>
              <p className="guidebox__desc">도움말 안내 텍스트 문구가 들어갑니다. 도움말 안내 텍스트 문구가 들어갑니다. 도움말 안내 텍스트 문구가 들어갑니다. 도움말 안내 텍스트 문구가 들어갑니다. 도움말 안내 텍스트 문구가 들어갑니다.</p>
            </div>
          </div>
  
          <div className="tab-menu">
            <ul className="tab-menu__list">
              <li>
                <a 
                  href="#" 
                  className={`tab-menu__menu ${activeTab === 'company-info' ? 'on' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleTabChange('company-info')
                  }}
                >
                  상사 정보 관리
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`tab-menu__menu ${activeTab === 'dealer-management' ? 'on' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleTabChange('dealer-management')
                  }}
                >
                  상사 딜러 관리
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`tab-menu__menu ${activeTab === 'cost-settings' ? 'on' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleTabChange('cost-settings')
                  }}
                >
                  매입/매도비 설정
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`tab-menu__menu ${activeTab === 'certificate' ? 'on' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleTabChange('certificate')
                  }}
                >
                  공인인증서 등록
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`tab-menu__menu ${activeTab === 'account' ? 'on' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleTabChange('account')
                  }}
                >
                  계좌 등록
                </a>
              </li>
            </ul>
          </div>
  
          {/* 상사 정보 관리 탭 */}
          {activeTab === 'company-info' && (
            <div className="table-wrap">
              <h2 className="table-wrap__title">상사 정보 관리</h2>
              <table className="table table--lg">
                <colgroup>
                  <col style={{ width: "140px" }} />
                  <col style={{ width: "auto" }} />
                  <col style={{ width: "140px" }} />
                  <col style={{ width: "auto" }} />
                </colgroup>
                <tbody>
                  <tr>
                    <th>상사명</th>
                    <td>
                      <div className="input w240">
                        <input 
                          type="text" 
                          className="input__field" 
                          placeholder="상사명" 
                          value={companyInfo.companyName}
                          onChange={(e) => handleCompanyInfoChange('companyName', e.target.value)}
                        />
                        <div className="input__utils">
                          <button 
                            type="button" 
                            className="jsInputClear input__clear ico ico--input-delete"
                            onClick={() => handleCompanyInfoChange('companyName', '')}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </td>
                    <th>사업자 등록번호</th>
                    <td className="text-left">
                      <div className="input w240">
                        <input 
                          type="text" 
                          className="input__field" 
                          placeholder="123-45-67890" 
                          value={companyInfo.businessNumber}
                          onChange={(e) => handleCompanyInfoChange('businessNumber', e.target.value)}
                        />
                        <div className="input__utils">
                          <button 
                            type="button" 
                            className="jsInputClear input__clear ico ico--input-delete"
                            onClick={() => handleCompanyInfoChange('businessNumber', '')}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>로그인 ID</th>
                    <td>
                      <div className="input w240">
                        <input 
                          type="text" 
                          className="input__field" 
                          placeholder="아이디" 
                          value={companyInfo.loginId}
                          onChange={(e) => handleCompanyInfoChange('loginId', e.target.value)}
                        />
                        <div className="input__utils">
                          <button 
                            type="button" 
                            className="jsInputClear input__clear ico ico--input-delete"
                            onClick={() => handleCompanyInfoChange('loginId', '')}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </td>
                    <th>비밀번호</th>
                    <td>
                      <div className="input w240">
                        <input 
                          type="password" 
                          className="input__field" 
                          placeholder="비밀번호" 
                          value={companyInfo.password}
                          onChange={(e) => handleCompanyInfoChange('password', e.target.value)}
                        />
                        <div className="input__utils">
                          <button 
                            type="button" 
                            className="jsInputClear input__clear ico ico--input-delete"
                            onClick={() => handleCompanyInfoChange('password', '')}
                          >
                            삭제
                          </button>
                          <button type="button" className="jsInputTypeToggle input__toggle ico ico--view">비밀번호 보기</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>전화</th>
                    <td>
                      <div className="input w240">
                        <input 
                          type="text" 
                          className="input__field" 
                          placeholder="- 없이 입력" 
                          value={companyInfo.phone}
                          onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
                        />
                        <div className="input__utils">
                          <button 
                            type="button" 
                            className="jsInputClear input__clear ico ico--input-delete"
                            onClick={() => handleCompanyInfoChange('phone', '')}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </td>
                    <th>이메일 주소</th>
                    <td>
                      <div className="input-group input-group--sm">
                        <div className="input w240">
                          <input 
                            type="text" 
                            className="input__field" 
                            placeholder="이메일 주소" 
                            value={companyInfo.email}
                            onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
                          />
                          <div className="input__utils">
                            <button 
                              type="button" 
                              className="jsInputClear input__clear ico ico--input-delete"
                              onClick={() => handleCompanyInfoChange('email', '')}
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                        <span className="input-group__dash">@</span>
                        <div className="select w120">
                          <input className="select__input" type="hidden" name="emailDomain" value={companyInfo.emailDomain} />
                          <button className="select__toggle" type="button">
                            <span className="select__text">{companyInfo.emailDomain}</span>
                            <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                          </button>
                          <ul className="select__menu">
                            {emailDomains.map((domain) => (
                              <li 
                                key={domain.value}
                                className={`select__option ${companyInfo.emailDomain === domain.value ? 'select__option--selected' : ''}`}
                                onClick={() => handleCompanyInfoChange('emailDomain', domain.value)}
                              >
                                {domain.label}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>휴대폰 번호</th>
                    <td colSpan={3}>
                      <div className="input w240">
                        <input 
                          type="text" 
                          className="input__field" 
                          placeholder="- 없이 입력" 
                          value={companyInfo.mobile}
                          onChange={(e) => handleCompanyInfoChange('mobile', e.target.value)}
                        />
                        <div className="input__utils">
                          <button 
                            type="button" 
                            className="jsInputClear input__clear ico ico--input-delete"
                            onClick={() => handleCompanyInfoChange('mobile', '')}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>주소</th>
                    <td colSpan={3}>
                      <div className="input-group">
                        <button className="btn btn--dark" type="button">주소 검색</button>
                        <div className="input w400">
                          <input 
                            type="text" 
                            className="input__field" 
                            placeholder="검색 버튼을 눌러주세요" 
                            value={companyInfo.address}
                            onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                          />
                          <div className="input__utils">
                            <button 
                              type="button" 
                              className="jsInputClear input__clear ico ico--input-delete"
                              onClick={() => handleCompanyInfoChange('address', '')}
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                        <div className="input w400">
                          <input 
                            type="text" 
                            className="input__field" 
                            placeholder="상세 주소" 
                            value={companyInfo.detailAddress}
                            onChange={(e) => handleCompanyInfoChange('detailAddress', e.target.value)}
                          />
                          <div className="input__utils">
                            <button 
                              type="button" 
                              className="jsInputClear input__clear ico ico--input-delete"
                              onClick={() => handleCompanyInfoChange('detailAddress', '')}
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 상사 딜러 관리 탭 */}
          {activeTab === 'dealer-management' && (
            <div className="table-wrap">
              <h2 className="table-wrap__title">상사 딜러 관리</h2>
              <div className="table-wrap__head">
                <button className="btn btn--primary" type="button">딜러 추가</button>
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
                          <button className="btn btn--light btn--sm" type="button">수정</button>
                          <button className="btn btn--red btn--sm" type="button">삭제</button>
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
          )}

          {/* 매입/매도비 설정 탭 */}
          {activeTab === 'cost-settings' && (
            <div className="table-wrap">
              <h2 className="table-wrap__title">매입/매도비 설정</h2>
              <div className="table-wrap__head">
                <button className="btn btn--primary" type="button">비용 항목 추가</button>
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
                  {purchaseCost.length > 0 ? (
                    purchaseCost.map((cost, index) => (
                      <tr key={index}>
                        <td>{cost.itemName || '-'}</td>
                        <td>{cost.type || '-'}</td>
                        <td>{cost.amount ? cost.amount.toLocaleString() + '원' : '-'}</td>
                        <td>{cost.description || '-'}</td>
                        <td>
                          <button className="btn btn--light btn--sm" type="button">수정</button>
                          <button className="btn btn--red btn--sm" type="button">삭제</button>
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
          )}

          {/* 공인인증서 등록 탭 */}
          {activeTab === 'certificate' && (
            <div className="table-wrap">
              <h2 className="table-wrap__title">공인인증서 등록</h2>
              <div className="guidebox">
                <p className="guidebox__title">공인인증서 등록 안내</p>
                <p className="guidebox__desc">
                  전자세금계산서 발행을 위해 공인인증서를 등록해주세요.<br/>
                  등록된 공인인증서는 팝빌 시스템에서 자동으로 관리됩니다.
                </p>
              </div>
              <div className="upload-area">
                <div className="upload-area__content">
                  <div className="upload-area__icon">📄</div>
                  <p className="upload-area__text">공인인증서 파일을 선택하거나 드래그하여 업로드하세요</p>
                  <button className="btn btn--primary" type="button">파일 선택</button>
                </div>
              </div>
            </div>
          )}

          {/* 계좌 등록 탭 */}
          {activeTab === 'account' && (
            <div className="table-wrap">
              <h2 className="table-wrap__title">계좌 등록</h2>
              <div className="table-wrap__head">
                <button className="btn btn--primary" type="button">계좌 추가</button>
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
                  <tr>
                    <td colSpan={5} className="text-center">등록된 계좌가 없습니다.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
  
          <div className="container__btns">
            <button 
              className="btn btn--primary" 
              type="button" 
              disabled={loading}
              onClick={handleSave}
            >
              {loading ? '저장 중...' : '저장'}
            </button>
            <button 
              className="btn btn--light" 
              type="button"
              onClick={() => {
                if (confirm('변경사항을 취소하시겠습니까?')) {
                  loadCompanyInfo()
                }
              }}
            >
              취소
            </button>
          </div>
        </main>
    );
  }
  