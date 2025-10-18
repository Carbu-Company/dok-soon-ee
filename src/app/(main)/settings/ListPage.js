'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { 
  getAgentInfo, 
  getDealerList,    // getUsrList 
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
    const agentId = props.session.agentId;
    console.log('SettingsPage - agentId:', agentId);
    console.log('SettingsPage - props.session:', props.session);
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState('company-info')
  
  // 로딩 상태
  const [loading, setLoading] = useState(false)
  
  // 상사 정보 상태
  const [agentInfo, setAgentInfo] = useState({
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
    loadAgentInfo()
    loadDealerList()
    loadPurchaseCost()
    loadSellCostSummary()
    loadExpenseList()
    loadIncomeList()
    loadAccountList()
  }, [])
  
  // 상사 정보 로드
  const loadAgentInfo = async () => {
    console.log('loadAgentInfo*******************:', agentId);
    try {
      setLoading(true)
      const result = await getAgentInfo(agentId)
      console.log('getAgentInfo result*******************:', result);
      if (result.success && result.data && result.data.length > 0) {
        const agentData = result.data[0];

        console.log('agentData*******************:', agentData);
        setAgentInfo({
          companyName: agentData.AGENT_NM || '',
          businessNumber: agentData.BRNO || '',
          loginId: agentData.LOGIN_ID || '',
          password: agentData.LOGIN_PASSWORD || '',
          phone: agentData.PHON || '',
          email: agentData.EMAIL || '',
          emailDomain: agentData.EMAIL_DOMAIN || ''
        })
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }
  
  // 딜러 목록 로드
  const loadDealerList = async () => {
    if (!agentId) {
      console.warn('agentId is not available, skipping dealer list load');
      return;
    }
    try {
      console.log('Loading dealer list for agentId:', agentId);
      const result = await getDealerList(agentId) // carAgent는 자동으로 세션에서 가져옴
      console.log('Dealer list result:', result);
      if (result.success && result.data) {
        setDealerList(result.data)
      }
    } catch (error) {
      console.error('Error loading dealer list:', error);
    }
  }
  
  // 매입비 설정 로드
  const loadPurchaseCost = async () => {
    try {
      console.log('Loading purchase cost for agentId:', agentId);
      const result = await getPurchaseCost(agentId) // carAgent는 자동으로 세션에서 가져옴
      console.log('Purchase cost result:', result);
      if (result.success && result.data) {
        setPurchaseCost(result.data)
      }
    } catch (error) {
      console.error('Error loading purchase cost:', error);
    }
  }
  
  // 매도비 설정 로드
  const loadSellCostSummary = async () => {
    try {
      const result = await getSellCostSummary(agentId) // carAgent는 자동으로 세션에서 가져옴
      if (result.success && result.data) {
        setSellCostSummary(result.data)
      }
    } catch (error) {
    }
  }
  
  // 지출 항목 로드
  const loadExpenseList = async () => {
    try {
      const result = await getCompanyExpense(agentId) // carAgent는 자동으로 세션에서 가져옴
      if (result.success && result.data) {
        setExpenseList(result.data)
      }
    } catch (error) {
    }
  }
  
  // 수입 항목 로드
  const loadIncomeList = async () => {
    try {
      const result = await getCompanyIncome(agentId) // carAgent는 자동으로 세션에서 가져옴
      if (result.success && result.data) {
        setIncomeList(result.data)
      }
    } catch (error) {
    }
  }
  
  // 계좌 목록 로드
  const loadAccountList = async () => {
    try {
      const result = await getAgentAcctList(agentId)
      console.log('계좌 목록 로드:', result)
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
  
  // 딜러 목록 업데이트
  const handleDealerListChange = (newDealerList) => {
    setDealerList(newDealerList)
  }
  
  // 매입비 설정 업데이트
  const handlePurchaseCostChange = (newPurchaseCost) => {
    setPurchaseCost(newPurchaseCost)
  }
  
  // 매도비 설정 업데이트
  const handleSellCostSummaryChange = (newSellCostSummary) => {
    setSellCostSummary(newSellCostSummary)
  }
  
  // 지출 항목 업데이트
  const handleExpenseListChange = (newExpenseList) => {
    setExpenseList(newExpenseList)
  }
  
  // 수입 항목 업데이트
  const handleIncomeListChange = (newIncomeList) => {
    setIncomeList(newIncomeList)
  }
  
  // 계좌 목록 업데이트
  const handleAccountListChange = (newAccountList) => {
    setAccountList(newAccountList)
  }
  
  // 공인인증서 정보 업데이트
  const handleCertificateChange = (newCertificateData) => {
    // 공인인증서 데이터 업데이트 로직
    console.log('공인인증서 데이터 변경:', newCertificateData)
  }
  
  
  // 탭 변경 처리
  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  // 딜러 수정
  const usrUpdate = (usrId) => {
    if (confirm('수정하시겠습니까?')) {
      // 수정페이지로 이동
      window.location.href = `/settings/edit/${usrId}`;
    }
  }

  // 딜러 삭제
  const usrDelete = async (usrId) => {
      if (confirm('삭제하시겠습니까?')) {
        try {
          // API 호출 로직
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deleteDealer?usrId=${usrId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            alert('삭제되었습니다.');
            // 딜러 목록 새로고침
            loadDealerList();
          } else {
            alert('삭제에 실패했습니다.');
          }
        } catch (error) {
          console.error('딜러 삭제 오류:', error);
          alert('삭제 중 오류가 발생했습니다.');
        }
      }
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
              agentInfo={agentInfo}
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
              onDealerListChange={handleDealerListChange}
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
              onPurchaseCostChange={handlePurchaseCostChange}
              onSellCostSummaryChange={handleSellCostSummaryChange}
              onExpenseListChange={handleExpenseListChange}
              onIncomeListChange={handleIncomeListChange}
            />
          )}

          {/* 공인인증서 등록 탭 */}
          {activeTab === 'certificate' && (
            <Certificate 
              loading={loading}
              onCertificateChange={handleCertificateChange}
            />
          )}

          {/* 계좌 등록 탭 */}
          {activeTab === 'account' && (
            <Account 
              accountList={accountList}
              loading={loading}
              onAccountListChange={handleAccountListChange}
            />
          )}
        </main>
  );
}