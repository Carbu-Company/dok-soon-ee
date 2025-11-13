"use client";
import Image from 'next/image'
import { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { isValidResidentNumber, checkBizID, isValidCorporateNumber, handleImageUpload } from '@/lib/util.js'
import { getAcqTax } from '@/app/(main)/common/script.js'
import { openPostcodeSearch } from '@/components/modal/AddressModal'
import CarSearchModal from "@/components/modal/CarSearchModal"
import { putReceiptRegisterIssue } from '@/app/(main)/api/popbill';

export default function IssuePage({ 
  session = null, 
  cashIssueInfo = null
  }) {
  const router = useRouter();
  // props 값 가져오기
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  
    // 거래유형 코드
  const [tradeSctCd, setTradeSctCd] = useState('0');

  // 식별번호
  const [rcgnNo, setRcgnNo] = useState(cashIssueInfo?.RCGN_NO ?? '');

  const [tradeAmt, setTradeAmt] = useState(cashIssueInfo?.TRADE_ITEM_AMT ?? '');
  const [tradeSupPrc, setTradeSupPrc] = useState(cashIssueInfo?.TRADE_ITEM_SUP_PRC ?? '');
  const [tradeVat, setTradeVat] = useState(cashIssueInfo?.TRADE_ITEM_VAT ?? '');
  const [tradeDt, setTradeDt] = useState(cashIssueInfo?.TRADE_DT ?? '');
  const [tradeMemo, setTradeMemo] = useState(cashIssueInfo?.TRADE_MEMO ?? '');

  // 주문자명
  const [ownrNm, setOwnrNm] = useState(cashIssueInfo?.TRADE_TGT_NM ?? '');

  // 연락처
  const [ownrPhon, setOwnrPhon] = useState(cashIssueInfo?.TRADE_TGT_PHON ?? '');

  // 자진발급 여부
  const [vltIssuYn, setVltIssuYn] = useState('N');

  // 저장 처리 
  const handleSubmit = async () => {

    setLoading(true);
    setError(null);

    // 식별번호 체크
    if(!rcgnNo) {
      alert('식별번호를 입력해주세요.');
      return;
    }

    // 거래금액
    if(!tradeAmt || tradeAmt === '0') {
      alert('거래금액을 입력해주세요.');
      return;
    }

    // 거래일
    if(!tradeDt) {
      alert('거래일을 선택해주세요.');
      return;
    }

    const formValues = {
      agentId: session?.agentId,                                 // 상사ID
      tradeSctCd,                                                // 거래유형
      rcgnNo,                                                    // 식별번호      
      vltIssuYn,                                                 // 자진발급 여부
      tradeAmt,                                                  // 거래금액
      tradeSupPrc,                                               // 공급가액
      tradeVat,                                                  // 부가세
      ownrNm,                                                    // 주문자명
      ownrPhon,                                                  // 연락처
      tradeDt,                                                   // 거래일
      tradeMemo,                                                 // 특이사항
    };


    // 먼저 popbill 발행 처리
    const result = await putReceiptRegisterIssue(session, formValues);
    console.log("발행 결과:", result);
    if (result.success) {

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insertCarCash`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formValues)
        });
        const res = await response.json();
        
        alert('현금영수증 발행 등록 되었습니다.'); // 테스트용 알림
        setLoading(false);
        if (res.success) {
          router.push('/cash-receipts/register');
          return { success: true, res, error: null };
        } else {
          throw new Error(res.message || '현금영수증 발행 등록에 실패했습니다');
        }
      } catch (error) {
        setError(error.message);
        alert('현금영수증 발행 등록 중 오류가 발생했습니다.'); // 테스트용 알림
        setLoading(false);
        return { success: false, res: [], error: error.message };
      }

    } else {
      throw new Error(result.message || '현금영수증 발행 등록에 실패했습니다');
    }
  };

  const handleReceiptRegisterIssue = async () => {
    try {
      const result = await putReceiptRegisterIssue(user, formData);
      console.log("발행 결과:", result);
    } catch (error) {
      console.error("발행 처리 오류:", error);
      alert(`발행 처리에 실패했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">현금영수증 건별발행</h2>

        <div className="guidebox">
          <p className="guidebox__title">도움말</p>
          <p className="guidebox__desc">현금영수증 건별 발행이 가능합니다.</p>
          <p className="guidebox__desc">자진발급시 식별번호는 010-000-1234로 고정. readonly 처리</p>
          <p className="guidebox__desc">발행일 자진발급 날짜 선택은 5일 이내만 가능하게(기본은 오늘날짜)</p>
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
            <col style={{ width: "10%" }} />
            <col style={{ width: "auto" }} />
          </colgroup>
          <tbody>
            <tr>
              <th>거래유형<span className="text-red">*</span></th>
              <td>
                <div className="form-option-wrap">
                  <div className="form-option">
                    <label className="form-option__label">
                      <input 
                        type="radio" 
                        name="tradeSctCd" 
                        value="0" 
                        onChange={(e) => setTradeSctCd(e.target.value)}
                        checked={tradeSctCd === '0'}
                      />
                      <span className="form-option__title">소득공제용</span>
                    </label>
                  </div>
                  <div className="form-option">
                    <label className="form-option__label">
                      <input 
                        type="radio" 
                        name="tradeSctCd" 
                        value="1"
                        onChange={(e) => setTradeSctCd(e.target.value)}
                        checked={tradeSctCd === '1'}
                      />
                      <span className="form-option__title">지출증빙용</span>
                    </label>
                  </div>
                </div>
              </td>
              <th>식별번호<span className="text-red">*</span></th>
              <td>
                <div className="input-group input-group--sm">
                  <div className="input w160">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="식별번호" 
                      name="rcgnNo"
                      value={rcgnNo && rcgnNo.length === 13 ? rcgnNo.slice(0, 7) + "******" : rcgnNo}
                      onChange={(e) => setRcgnNo(e.target.value)}
                      onFocus={(e) => e.target.select()}
                      readOnly={true}
                    />

                  </div>
                  <span className="input-help">휴대폰/주민등록/카드번호</span>
                </div>
              </td>
              <th>자진발급</th>
              <td>
                <div className="form-option-wrap">
                  <div className="form-option">
                    <label className="form-option__label">
                      <input 
                        type="radio" 
                        name="vltIssuYn" 
                        value="N" 
                        onChange={(e) => {
                          setVltIssuYn(e.target.value);
                          setOwnrPhon('');
                        }}
                        checked={vltIssuYn === 'N'}
                      />
                      <span className="form-option__title">아니요</span>
                    </label>
                  </div>
                  <div className="form-option">
                    <label className="form-option__label">
                      <input 
                        type="radio" 
                        name="vltIssuYn" 
                        value="Y"
                        onChange={(e) => {
                          setVltIssuYn(e.target.value);
                          setOwnrPhon('010-000-1234');
                        }}
                        checked={vltIssuYn === 'Y'}
                      />
                      <span className="form-option__title">예</span>
                    </label>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>거래금액<span className="text-red">*</span></th>
              <td>
                <div className="input-group input-group--sm">
                  <div className="input w160">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="거래금액" 
                      name="tradeAmt"
                      value={tradeAmt ? Number(tradeAmt).toLocaleString() : '0'}
                      onChange={(e) => setTradeAmt(e.target.value.replace(/[^\d]/g, ''))}
                      onFocus={(e) => e.target.select()}
                    />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>
                  <span className="input-help">{tradeSupPrc?.toLocaleString() || '0'} / {tradeVat?.toLocaleString() || '0'}</span>
                </div>
              </td>
              <th>주문자명</th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="주문자명"
                    name="ownrNm"
                    value={ownrNm}
                    onChange={(e) => setOwnrNm(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                  <div className="input__utils">
                    <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                  </div>
                </div>
              </td>
              <th>연락처</th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="연락처"
                    name="ownrPhon"
                    value={ownrPhon}
                    onChange={(e) => setOwnrPhon(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                  <div className="input__utils">
                    <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>거래일<span className="text-red">*</span></th>
              <td>
                <div className="input-group">
                  <div className="input w200">
                    <input 
                      type="date" 
                      className="input__field" 
                      placeholder="거래일" 
                      autoComplete="off"
                      name='tradeDt'
                      onChange={(e) => setTradeDt(e.target.value)}
                      value={tradeDt || ''} 
                    />
                  </div>
                  <span className="input-help">거래일</span>
                </div>
              </td>
              <th>특이사항</th>
              <td colSpan={3}>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="특이사항"
                    name="tradeMemo"
                    value={tradeMemo}
                    onChange={(e) => setTradeMemo(e.target.value)}
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