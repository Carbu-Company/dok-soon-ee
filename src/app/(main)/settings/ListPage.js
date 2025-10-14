'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { 
  getAgentInfo, 
  getCompanyDealer, 
  getCompanySangsaDealer,
  getPurchaseCost,
  getSellCostSummary,
  getCompanyExpense,
  getCompanyIncome,
  getAgentAcctList
} from '@/app/(main)/api/carApi'
import CompanyInfo from '@/components/settings/CompanyInfo'
import DealerManagement from '@/components/settings/DealerManagement'
import CostSettings from '@/components/settings/CostSettings'
import Certificate from '@/components/settings/Certificate'
import Account from '@/components/settings/Account'

export default function SettingsPage(props) {
    const carAgent = props.session.agentId;
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
  
  // 계좌 목록 상태
  const [accountList, setAccountList] = useState([])
  
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
    loadAccountList()
  }, [])
  
  // 상사 정보 로드
  const loadCompanyInfo = async () => {
    try {
      setLoading(true)
      const result = await getAgentInfo(carAgent)
      if (result.success && result.data) {
        setCompanyInfo({
          companyName: result.data.COMNAME || '',
          businessNumber: result.data.BRNO || '',
          loginId: result.data.loginId || '',
          password: result.data.password || '',
          phone: result.data.PHON || '',
          email: result.data.EMAIL_ID || '',
          emailDomain: result.data.EMAIL_DOMAIN || 'gmail.com',
          mobile: result.data.mobile || '',
          address: result.data.ADDR1 || '',
          detailAddress: result.data.ADDR2 || ''
        })
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }
  
  // 딜러 목록 로드
  const loadDealerList = async () => {
    try {
      const result = await getCompanyDealer(carAgent) // carAgent는 자동으로 세션에서 가져옴
      if (result.success && result.data) {
        setDealerList(result.data)
      }
    } catch (error) {
    }
  }
  
  // 매입비 설정 로드
  const loadPurchaseCost = async () => {
    try {
      const result = await getPurchaseCost(carAgent) // carAgent는 자동으로 세션에서 가져옴
      if (result.success && result.data) {
        setPurchaseCost(result.data)
      }
    } catch (error) {
    }
  }
  
  // 매도비 설정 로드
  const loadSellCostSummary = async () => {
    try {
      const result = await getSellCostSummary(carAgent) // carAgent는 자동으로 세션에서 가져옴
      if (result.success && result.data) {
        setSellCostSummary(result.data)
      }
    } catch (error) {
    }
  }
  
  // 지출 항목 로드
  const loadExpenseList = async () => {
    try {
      const result = await getCompanyExpense(carAgent) // carAgent는 자동으로 세션에서 가져옴
      if (result.success && result.data) {
        setExpenseList(result.data)
      }
    } catch (error) {
    }
  }
  
  // 수입 항목 로드
  const loadIncomeList = async () => {
    try {
      const result = await getCompanyIncome(carAgent) // carAgent는 자동으로 세션에서 가져옴
      if (result.success && result.data) {
        setIncomeList(result.data)
      }
    } catch (error) {
    }
  }
  
  // 계좌 목록 로드
  const loadAccountList = async () => {
    try {
      const result = await getAgentAcctList(carAgent)
      if (result.success && result.data) {
        setAccountList(result.data)
      }
    } catch (error) {
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
            <CompanyInfo 
              companyInfo={companyInfo}
              emailDomains={emailDomains}
              onCompanyInfoChange={handleCompanyInfoChange}
              loading={loading}
            />
          )}

          {/* 상사 딜러 관리 탭 */}
          {activeTab === 'dealer-management' && (
            <DealerManagement 
              dealerList={dealerList}
              loading={loading}
            />
          )}

          {/* 매입/매도비 설정 탭 */}
          {activeTab === 'cost-settings' && (
            <CostSettings 
              purchaseCost={purchaseCost}
              sellCostSummary={sellCostSummary}
              expenseList={expenseList}
              incomeList={incomeList}
              loading={loading}
            />
          )}

          {/* 공인인증서 등록 탭 */}
          {activeTab === 'certificate' && (
            <Certificate 
              loading={loading}
            />
          )}

          {/* 계좌 등록 탭 */}
          {activeTab === 'account' && (
            <Account 
              accountList={accountList}
              loading={loading}
            />
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
  