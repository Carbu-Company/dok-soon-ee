"use client";
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { checkBizID } from '@/lib/util.js'
import { openPostcodeSearch } from '@/components/modal/AddressModal'
import { getAcqTax, autoHypenTelNo, autoHypenBizNO, autoHypenSNO } from '@/app/(main)/common/script.js'

// ===== 메인 컴포넌트 =====
export default function EditPage({ 
  session = null, 
  agentInfo = {} ,  
}) {

  const router = useRouter();


  console.log('agentInfo11111111111111111111111', agentInfo);

  // ===== 기본 정보 상태 =====
  const [agentId, setAgentId] = useState(agentInfo?.AGENT_ID || '');
  const [agentNm, setAgentNm] = useState(agentInfo?.AGENT_NM || '');
  const [companyNm, setCompanyNm] = useState(agentInfo?.COMPANY_NM || '');
  const [brno, setBrno] = useState(agentInfo?.BRNO || '');
  const [presNm, setPresNm] = useState(agentInfo?.PRES_NM || '');
  const [phon, setPhon] = useState(agentInfo?.PHON || '');
  const [email, setEmail] = useState(agentInfo?.EMAIL || '');
  const [zip, setZip] = useState(agentInfo?.ZIP || '');
  const [addr1, setAddr1] = useState(agentInfo?.ADDR1 || '');
  const [addr2, setAddr2] = useState(agentInfo?.ADDR2 || '');
  const [useEndDt, setUseEndDt] = useState(agentInfo?.USE_END_DT || '');
  const [presPhon, setPresPhon] = useState(agentInfo?.PRES_PHON || '');
  const [memo, setMemo] = useState(agentInfo?.MEMO || '');
  const [feeSctCd, setFeeSctCd] = useState(agentInfo?.FEE_SCT_CD || 'B');
  const [feeAmt, setFeeAmt] = useState(agentInfo?.FEE_AMT || '0');
  const [useYn, setUseYn] = useState(agentInfo?.USE_YN || 'N');
  // ===== UI 상태 =====
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 주소 검색 핸들러
  const handleAddressSearch = useCallback(() => {
    openPostcodeSearch((addressData) => {
      setZip(addressData.zonecode);
      setAddr1(addressData.address);
      setAddr2(''); // 상세주소는 초기화
    });
  }, []);


  const handleSubmit = async () => {

    setLoading(true);
    setError(null);

    // 상사명 체크
    if(!agentNm) {
      alert('상사명을 입력해주세요.');
      return;
    }

    // 사업자번호
    if(brno) {
      if(!checkBizID(brno.replace(/-/g, ''))) {
        alert(brno.replace(/-/g, '') + '는 사업자등록번호가 아닙니다.');
        return;
      }
    }

    // 대표자명 체크
    if(!presNm) {
      alert('대표자명을 입력해주세요.');
      return;
    }

    // 연락처
    if(!phon) {
      alert('연락처를 입력해주세요.');
      return;
    }

    // e메일 주소
    if(!zip) {
      alert('주소를 입력해주세요.');
      return;
    }

    // 사용여부 체크하여 월이용료 금액 체크
    if(useYn === 'Y') {
      if(!feeAmt) {
        alert('월이용료를 입력해주세요.');
        return;
      }
    }

    const formValues = {
      agentId,
      agentNm,
      brno,
      presNm,
      phon,
      email,
      zip,
      addr1,
      addr2,
      useEndDt,
      presPhon,
      memo,
      feeSctCd,
      feeAmt,
      useYn,
      usrId: session?.usrId,
    };

    console.log('formValues', formValues);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/updateAdminAgent`, {
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

        /**
         * 상사 POPBILL 등록
         */
        const popbillResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/bizinfo/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formValues)
        });
        const popbillRes = await popbillResponse.json();

        if(popbillRes.success) {
          alert('상사 POPBILL 등록 되었습니다.'); // 테스트용 알림
        } else {
          alert('상사 POPBILL 등록에 실패했습니다.'); // 테스트용 알림
        }


        /** 
         * 팝빌 등록이 성공하면 사용 승인 처리 (db UPDATE)
         */
        const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/updateAgentInfo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formValues)
        });
        const updateRes = await updateResponse.json();

        if(updateRes.success) {
          alert('사용 승인 처리 되었습니다.'); // 테스트용 알림
        } else {
          alert('사용 승인 처리에 실패했습니다.'); // 테스트용 알림
        }

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
        <h2 className="table-wrap__title">상사 정보</h2>
        <table className="table table--lg">
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "auto" }} />
          </colgroup>
          <tbody>
            <tr>
              <th>상사명(상호명)<span className="text-red">*</span></th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="상사명(상호명)"
                    name="agentNm"
                    value={agentNm}
                    onChange={(e) => setAgentNm(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                  <div className="input__utils">
                    <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                  </div>
                </div>

              </td>
              <th>회사명</th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="회사명"
                    name="agentNm"
                    value={companyNm}
                    onChange={(e) => setCompanyNm(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                  <div className="input__utils">
                    <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>사업자등록번호 <span className="text-red">*</span></th>
              <td>
                  <div className="input-group">
                    <div className="input w200">
                      <input 
                        type="text" 
                        className="input__field" 
                        placeholder="-없이 입력" 
                        autoComplete="off"
                        name='brno'
                        value={brno}
                        onChange={(e) => {
                          autoHypenBizNO(e.target);
                          setBrno(e.target.value);
                        }}
                        onFocus={(e) => e.target.select()}
                      />
                    </div>
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>
                </td>
              <th>대표자명 <span className="text-red">*</span></th>
              <td>
                <div className="input-group input-group--sm">
                  <div className="input w200">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="대표자명" 
                      name="presNm"
                      value={presNm}
                      onChange={(e) => setPresNm(e.target.value)}
                      onFocus={(e) => e.target.select()}
                    />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>연락처 <span className="text-red">*</span></th>
              <td>
                  <div className="input-group">
                    <div className="input w200">
                      <input 
                        type="text" 
                        className="input__field" 
                        placeholder="-없이 입력" 
                        autoComplete="off"
                        name='phon'
                        value={phon}
                        onChange={(e) => {
                          let value = autoHypenTelNo(e.target.value);
                          setPhon(value);
                        }}
                        onFocus={(e) => e.target.select()}
                      />
                    </div>
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>
                </td>
              <th>e메일주소</th>
              <td>
                <div className="input-group input-group--sm">
                  <div className="input w200">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="e메일주소" 
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value.trim())}
                      onFocus={(e) => e.target.select()}
                    />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>주소 <span className="text-red">*</span></th>
              <td colSpan={3}>
                <div className="input-group">
                    <div className="input w200">
                      <input 
                        type="text" 
                        className="input__field" 
                        placeholder="우편번호"
                        value={zip}
                        readOnly
                        onChange={(e) => setZip(e.target.value)}
                      />
                    </div>
                      <div className="input w500">
                        <input 
                          type="text" 
                          className="input__field" 
                          placeholder="주소"
                          value={addr1}
                          onChange={(e) => setAddr1(e.target.value)}
                        />
                        <div className="input__utils">
                          <button
                            type="button"
                            className="jsInputClear input__clear ico ico--input-delete"
                            onClick={() => setAddr1('')}
                          >
                            주소
                          </button>
                        </div>
                      </div>
                      <button className="btn btn--dark" type="button" onClick={handleAddressSearch} style={{ width: "50px" }}>검색</button>
                      <div className="input w500">
                        <input 
                          type="text" 
                          className="input__field" 
                          placeholder="상세주소"
                          value={addr2}
                          onChange={(e) => setAddr2(e.target.value)}
                        />
                        <div className="input__utils">
                          <button
                            type="button"
                            className="jsInputClear input__clear ico ico--input-delete"
                            onClick={() => setAddr2('')}
                          >
                            상세주소
                          </button>
                        </div>
                      </div>
                  </div>
              </td>
            </tr>
            <tr>
              <th>시스템 사용 만료일</th>
              <td>
                <div className="input-group">
                  <div className="input w200">
                    <input 
                      type="date" 
                      className="input__field" 
                      placeholder="만료일" 
                      autoComplete="off"
                      name='useEndDt'
                      onChange={(e) => setUseEndDt(e.target.value)}
                      value={useEndDt || ''} 
                    />
                  </div>
                  <span className="input-help">시스템 사용 만료일</span>
                </div>
              </td>
              <th>대표 핸드폰</th>
              <td>
                <div className="input w200">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="- 없이 입력"
                    name="presPhon"
                    value={presPhon || ''}
                    onChange={(e) => {
                      let value = autoHypenTelNo(e.target.value);
                      setPresPhon(value);
                    }}
                    onFocus={(e) => e.target.select()}
                  />
                  <div className="input__utils">
                    <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>특이사항</th>
              <td colSpan="3">
                <div className="input">
                  <textarea 
                    className="input__field textarea" 
                    placeholder="특이사항" 
                    name="memo"
                    value={memo || ''}
                    onChange={(e) => setMemo(e.target.value.trim())}
                    onFocus={(e) => e.target.select()}
                    style={{ height: '100px' }}
                  ></textarea>
                  <div className="input__utils">
                    <button
                      type="button"
                      className="jsInputClear input__clear ico ico--input-delete"
                      onClick={() => setMemo('')}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="table-wrap">
        <h2 className="table-wrap__title">버전 관리</h2>
        <table className="table table--lg">
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "auto" }} />
          </colgroup>
          <tbody>
            <tr>
              <th>사용여부<span className="text-red">*</span></th>
              <td colSpan="3">
                <div className="form-option-wrap">
                  <div className="form-option">
                    <label className="form-option__label">
                      <input 
                        type="radio" 
                        name="useYn" 
                        value="Y" 
                        defaultChecked={useYn === 'Y'}
                        onChange={(e) => setUseYn(e.target.value)}
                      />
                      <span className="form-option__title">사용</span>
                    </label>
                  </div>
                  <div className="form-option">
                    <label className="form-option__label">
                      <input 
                        type="radio" 
                        name="useYn" 
                        value="N"
                        defaultChecked={useYn === 'N'}
                        onChange={(e) => setUseYn(e.target.value)}
                      />
                      <span className="form-option__title">미사용</span>
                    </label>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>사용버전<span className="text-red">*</span></th>
              <td>
                <div className="select">
                  <input 
                    className="select__input" 
                    type="hidden" 
                    name="verCd" 
                    value={feeSctCd || ''} 
                  />
                  <button className="select__toggle" type="button">
                    <span className="select__text">
                      {feeSctCd === 'B' ? '베이직' : feeSctCd === 'P' ? '프리미엄' : '선택'}
                    </span>
                    <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                  </button>
                  <ul className="select__menu">
                    <li
                      className={`select__option${feeSctCd === 'B' ? ' select__option--selected' : ''}`}
                      data-value="B"
                      onClick={() => setFeeSctCd('B')}
                      aria-selected={feeSctCd === 'B'}
                    >
                      베이직
                    </li>
                    <li
                      className={`select__option${feeSctCd === 'P' ? ' select__option--selected' : ''}`}
                      data-value="P"
                      onClick={() => setFeeSctCd('P')}
                      aria-selected={feeSctCd === 'P'}
                    >
                      프리미엄
                    </li>
                  </ul>
                </div>
              </td>
              <th>월이용료</th>
              <td>
                <div className="input">
                  <input 
                      type="text" 
                      className="input__field" 
                      placeholder="월이용료" 
                      name="feeAmt"
                      value={feeAmt ? Number(feeAmt).toLocaleString() : '0'}
                      onChange={(e) => setFeeAmt(e.target.value.replace(/[^\d]/g, ''))}
                      onFocus={(e) => e.target.select()}
                    />
                  <div className="input__utils">
                    <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
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