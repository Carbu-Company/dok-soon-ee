"use client";
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isValidResidentNumber, checkBizID, isValidCorporateNumber } from '../../../../../lib/util.js'
import { openPostcodeSearch } from '@/components/modal/AddressModal'
import { getAcqTax, autoHypenTelNo, autoHypenBizNO, autoHypenSNO } from '@/app/(main)/common/script.js'

// ===== 메인 컴포넌트 =====
export default function EditPage({ 
  session = null, 
  agentInfo = [] ,  
}) {
  console.log('agentInfo**********', agentInfo);

  // ===== 기본 정보 상태 =====
  const [agentId, setAgentId] = useState(agentInfo.AGENT_ID || '');
  const [agentNm, setAgentNm] = useState(agentInfo.AGENT_NM || '');
  const [agentTel, setAgentTel] = useState(agentInfo.AGENT_TEL || '');
  const [agentEmail, setAgentEmail] = useState(agentInfo.AGENT_EMAIL || '');
  const [agentAddr, setAgentAddr] = useState(agentInfo.AGENT_ADDR || '');
  const [agentZip, setAgentZip] = useState(agentInfo.AGENT_ZIP || '');

  // ===== UI 상태 =====
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ===== 이벤트 핸들러 =====
  // 주소 검색 핸들러
  const handleAddressSearch = useCallback(() => {
    openPostcodeSearch((addressData) => {
      setOwnrZip(addressData.zonecode);
      setOwnrAddr1(addressData.address);
      setOwnrAddr2(''); // 상세주소는 초기화
    });
  }, []);


  const handleSubmit = async () => {

    setLoading(true);
    setError(null);

    console.log('agentId', agentId);    // 상사 ID
    console.log('agentNm', agentNm);    // 상사명
    console.log('agentTel', agentTel);    // 연락처
    console.log('agentEmail', agentEmail);    // e메일 주소
    console.log('agentAddr', agentAddr);    // 주소
    console.log('agentZip', agentZip);    // 우편번호

    // 주민(법인)등록번호
    if(!agentTel) {
      alert('연락처를 입력해주세요.');
      return;
    }

    if(!agentEmail) {
      alert('e메일 주소를 입력해주세요.');
      return;
    }

    // 사업자번호
    if(ownrBrno) {
      if(!checkBizID(ownrBrno.replace(/-/g, ''))) {
        alert('사업자등록번호를 확인해주세요.');
        return;
      }
    }

    const formValues = {
      agentId: agentId,
      agentNm: agentNm,
      agentTel: agentTel,
      agentEmail: agentEmail,
      agentAddr: agentAddr,
      agentZip: agentZip,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/updateAgentInfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues)
      });
      const res = await response.json();

      alert('상사 정보 수정 되었습니다.'); // 테스트용 알림
      setLoading(false);
      if (res.success) {
        router.back();
        return { success: true, res, error: null };
      } else {
        throw new Error(res.message || '상사 정보 수정에 실패했습니다');
      }
    } catch (error) {
      setError(error.message);
      alert('상사 정보 수정 중 오류가 발생했습니다.'); // 테스트용 알림
      setLoading(false);
      return { success: false, res: [], error: error.message };
    }
  };

  return (
      <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">상사 정보 수정</h2>

        <div className="guidebox">
          <p className="guidebox__title">도움말</p>
          <p className="guidebox__desc">도움말 안내 텍스트 문구가 들어갑니다. 도움말 안내 텍스트 문구가 들어갑니다. 도움말 안내 텍스트 문구가 들어갑니다. 도움말 안내 텍스트 문구가 들어갑니다. 도움말 안내 텍스트 문구가 들어갑니다.</p>
        </div>
      </div>

      <div className="table-wrap">
        <h2 className="table-wrap__title">필수 입력 정보</h2>
        <table className="table table--lg">
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "auto" }} />
          </colgroup>
          <tbody>
            <tr>
              <th>제시구분<span className="text-red">*</span></th>
              <td>
                <div className="form-option-wrap">
                  <div className="form-option">
                    <label className="form-option__label">
                      <input 
                        type="radio" 
                        name="prsnSctCd" 
                        value={PRESENTATION_TYPE.COMPANY_PURCHASE}
                        checked={prsnSctCd === PRESENTATION_TYPE.COMPANY_PURCHASE}
                        onChange={(e) => setPrsnSctCd(e.target.value)}
                      />
                      <span className="form-option__title">상사매입</span>
                    </label>
                  </div>
                  <div className="form-option">
                    <label className="form-option__label">
                      <input 
                        type="radio" 
                        name="prsnSctCd" 
                        value={PRESENTATION_TYPE.CUSTOMER_CONSIGNMENT}
                        checked={prsnSctCd === PRESENTATION_TYPE.CUSTOMER_CONSIGNMENT}
                        onChange={(e) => setPrsnSctCd(e.target.value)}
                      />
                      <span className="form-option__title">고객위탁</span>
                    </label>
                  </div>
                </div>
              </td>
              <th>매입딜러</th>
              <td>
                <div className="select">
                  <input 
                    className="select__input" 
                    type="hidden" 
                    name="dealerId" 
                    value={dealerId || ''} 
                  />
                  <button 
                    className="select__toggle" 
                    type="button"
                    onClick={() => setIsDealerSelectOpen(!isDealerSelectOpen)}
                  >
                    <span className="select__text">
                      {dealerId ? dealerList.find(d => d.USR_ID === dealerId)?.USR_NM || '선택' : '선택'}
                    </span>
                    <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                  </button>

                  <ul className={`select__menu ${isDealerSelectOpen ? 'active' : ''}`}>
                    <li 
                      key="default-dealer"
                      className={`select__option ${!dealerId ? 'select__option--selected' : ''}`}
                      data-value=""
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDealerSelect('');
                      }}
                    >선택</li>
                    {dealerList && dealerList.map((dealer) => (
                      <li 
                        key={`dealer-${dealer.USR_ID}`}
                        className={`select__option ${dealerId === dealer.USR_ID ? 'select__option--selected' : ''}`}
                        data-value={dealer.USR_ID}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDealerSelect(dealer.USR_ID);
                        }}
                      >{dealer.USR_NM}</li>
                    ))}
                  </ul>
                </div>
              </td>
            </tr>
            <tr>
              <th>매입일</th>
              <td>
                  <div className="input-group">
                    <div className="input w200">
                      <input 
                        type="date" 
                        className="input__field" 
                        placeholder="매입일" 
                        autoComplete="off"
                        name='carPurDt'
                        onChange={(e) => setCarPurDt(e.target.value)}
                        value={carPurDt || ''} 
                      />
                    </div>
                    <span className="input-help">조합전산 제시일</span>
                  </div>
                </td>
              <th>상사매입비</th>
              <td>
                <div className="input-group input-group--sm">
                  <div className="input w200">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="상사매입비" 
                      name="agentPurCst"
                      value={agentPurCst ? Number(agentPurCst).toLocaleString() : '0'}
                      onChange={(e) => setAgentPurCst(e.target.value.replace(/[^\d]/g, ''))}
                      onFocus={(e) => e.target.select()}
                    />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>

                  <div className="input w200">
                    <input 
                      type="date" 
                      className="input__field" 
                      placeholder="상사매입비 입금일" 
                      autoComplete="off"
                      name='brokerageDate'
                      onChange={(e) => setBrokerageDate(e.target.value)}
                      value={brokerageDate || ''} 
                    />
                  </div>

                  <div className="select w120">
                    <input 
                      className="select__input" 
                      type="hidden" 
                      name="carKndCd" 
                      value={cstTypeCd || ''} 
                    />
                    <button 
                      className="select__toggle" 
                      type="button"
                      onClick={() => setIsCstTypeCdSelectOpen(!isCstTypeCdSelectOpen)}
                    >
                      <span className="select__text">
                        {cstTypeCd ? cstTypeCdList.find(c => c.CD === cstTypeCd)?.CD_NM || '해당없음' : '해당없음'}
                      </span>
                      <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                    </button>
                    <ul className="select__menu" style={{ display: isCstTypeCdSelectOpen ? 'block' : 'none' }}>
                      <li 
                        key="default-cstType"
                        className={`select__option ${!cstTypeCd ? 'select__option--selected' : ''}`}
                        data-value="000"
                        onClick={() => {
                          setCstTypeCd('000');
                          setIsCstTypeCdSelectOpen(false);
                        }}
                      >해당없음</li>
                      {cstTypeCdList && cstTypeCdList.map((cstType) => (
                        <li 
                          key={`cstType-${cstType.CD}`}
                          className={`select__option ${cstTypeCd === cstType.CD ? 'select__option--selected' : ''}`}
                          data-value={`${cstType.CD}`}
                          onClick={() => {
                            setCstTypeCd(`${cstType.CD}`);
                            setIsCstTypeCdSelectOpen(false);
                          }}
                        >{cstType.CD_NM}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      <div className="container__btns">
        <button className="btn btn--light" type="button" onClick={() => { window.location.href = '/purchases/list'; }}>취소</button>
        <button className="btn btn--primary" type="button" onClick={handleSubmit}>확인</button>
      </div>
    </main>
  );
}