"use client";
import Image from 'next/image'
import { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { isValidResidentNumber, checkBizID, isValidCorporateNumber, handleImageUpload } from '@/lib/util.js'
import { getAcqTax } from '@/app/(main)/common/script.js'
import { openPostcodeSearch } from '@/components/modal/AddressModal'
import CarSearchModal from "@/components/modal/CarSearchModal"

export default function IssuePage({ 
  session = null, 
  cashIssueInfo = null
  }) {
    // 거래유형 코드
  const [tradeSctCd, setTradeSctCd] = useState('0');

  // 식별번호
  const [rcgnNo, setRcgnNo] = useState(cashIssueInfo.RCGN_NO);

  const [tradeAmt, setTradeAmt] = useState(cashIssueInfo.TRADE_ITEM_AMT);
  const [tradeSupPrc, setTradeSupPrc] = useState(cashIssueInfo.TRADE_ITEM_SUP_PRC);
  const [tradeVat, setTradeVat] = useState(cashIssueInfo.TRADE_ITEM_VAT);
  const [tradeDt, setTradeDt] = useState(cashIssueInfo.TRADE_DT);
  const [tradeMemo, setTradeMemo] = useState(cashIssueInfo.TRADE_MEMO);

  // 주문자명
  const [ownrNm, setOwnrNm] = useState(cashIssueInfo.TRADE_TGT_NM);

  // 연락처
  const [ownrPhon, setOwnrPhon] = useState(cashIssueInfo.TRADE_TGT_PHON);

  // 자진발급 여부
  const [vltIssuYn, setVltIssuYn] = useState('N');

  const handleSubmit = async () => {

    setLoading(true);
    setError(null);

    // 첨부파일 올리기
    for(let i = 0; i < attachedFiles.length; i++) {

      console.log('attachedFiles[i]', attachedFiles[i]);

      // 이미 업로드된 파일은 건너뛰기
      if (attachedFiles[i].uploaded) continue;
      
      // apiCall.js의 handleImageUpload 함수 호출
      try {
        const imageUrl = await handleImageUpload(
            attachedFiles[i].file, 
            i, 
            [], // 빈 배열 전달 (URL 배열은 사용하지 않음)
            () => {} // 콜백은 사용하지 않음
        );
        
        // 업로드 성공 시 파일 정보 업데이트
        const updatedFiles = [...attachedFiles];
        updatedFiles[i].url = imageUrl;
        updatedFiles[i].uploaded = true;
        setAttachedFiles(updatedFiles);
      } catch (error) {
        console.error('파일 업로드 실패:', error);
        // 업로드 실패 시 해당 파일 제거
        const filteredFiles = attachedFiles.filter((_, index) => index !== i);
        setAttachedFiles(filteredFiles);
      }

    }

    attachedFiles.forEach(file => {
      console.log('file', file);

      //두개의 파일 정보

      // file {file: File, name: 'ku.sql', url: 'https://aibizimpage.s3.ap-northeast-2.amazonaws.com/ku.sql', uploaded: true}
      // file {file: File, name: 'ku.zip', url: 'https://aibizimpage.s3.ap-northeast-2.amazonaws.com/ku.zip', uploaded: true}
    });

    console.log('dealerId', dealerId);    // 매입딜러 ID
    console.log('carKndCd', carKndCd);    // 차량 종류 코드
    console.log('evdcCd', evdcCd);    // 증빙종류 코드
    console.log('carNm', carNm);    // 차량명

    console.log('prsnSctCd', prsnSctCd);    // 제시구분 코드
    console.log('purAmt', purAmt);    // 매입금액
    console.log('purSupPrc', purSupPrc);    // 공급가액
    console.log('purVat', purVat);    // 부가세    
    console.log('carPurDt', carPurDt);    // 매입일
    console.log('agentPurCst', agentPurCst);    // 상사매입비
    console.log('brokerageDate', brokerageDate);    // 상사매입비 입금일
    console.log('cstTypeCd', cstTypeCd);    // 비용 발급 코드
    console.log('carRegDt', carRegDt);    // 이전일
    console.log('txblIssuDt', txblIssuDt);    // 발행일
    console.log('carNo', carNo);    // 차량번호(매입후)
    console.log('purBefCarNo', purBefCarNo);    // 차량번호(매입전)
    console.log('ownrNm', ownrNm);    // 고객명
    console.log('ownrTpCd', ownrTpCd);    // 고객구분
    console.log('ctshNo', ctshNo);    // 계약서번호
    console.log('ownrSsn', ownrSsn);    // 주민(법인)등록번호
    console.log('ownrPhon', ownrPhon);    // 연락처
    console.log('ownrEmail', ownrEmail);    // e메일 주소
    console.log('emailDomain', emailDomain);    // e메일 도메인
    console.log('ownrAddr1', ownrAddr1);    // 주소1
    console.log('ownrAddr2', ownrAddr2);    // 주소2
    console.log('ownrBrno', ownrBrno);    // 사업자등록번호
    console.log('txblRcvYn', txblRcvYn);    // 세금 납부일
    console.log('purDesc', purDesc);    // 특이사항
    console.log('parkingCd', parkingCd);    // 주차위치 코드
    console.log('parkingLocationDesc', parkingLocationDesc);    // 주차위치 설명
    console.log('fctCndcYn', fctCndcYn);    // 사실확인서
    console.log('attachedFiles', attachedFiles);    // 관련 서류 첨부
    console.log('parkKeyNo', parkKeyNo);    // Key번호

    // 매입딜러
    if(!dealerId) {
      alert('매입딜러를 선택해주세요.');
      return;
    }

    // 매입금액
    if(!purAmt || purAmt === '0') {
      alert('매입금액을 입력해주세요.');
      return;
    }

    // 매입일
    if(!carPurDt) {
      alert('매입일을 선택해주세요.');
      return;
    }

    // 상사매입비
    if(!agentPurCst) {
      alert('상사매입비를 입력해주세요.');
      return;
    }

    // (예상) 취득세   --- 나중에 고민 해야함
    // if(!gainTax) {
    //   alert('(예상)취득세를 입력해주세요.');
    //   return;
    // }

    // 차량 유형
    if(!carKndCd) {
      alert('차량 유형을 선택해주세요.');
      return;
    }

    // 차량명
    if(!carNm) {
      alert('차량명을 입력해주세요.');
      return;
    }

    // 차량번호(매입후)
    if(!carNo) {
      alert('차량번호(매입후)를 입력해주세요.');
      return;
    }

    // 고객명
    if(!ownrNm) {
      alert('매도자/전소유자명을 입력해주세요.');
      return;
    }

    // 고객구분
    if(!ownrTpCd) {
      alert('고객구분을 선택해주세요.');
      return;
    }

    // 증빙종류
    if(!evdcCd) {
      alert('증빙종류를 선택해주세요.');
      return;
    }

    // 주민(법인)등록번호
    if(ownrSsn) {

      // 주민번호 체크 
      if(!isValidResidentNumber(ownrSsn) && ownrTpCd === '001') {
        alert('주민등록번호를 확인해주세요.');
        return;
      } else if(!isValidCorporateNumber(ownrSsn) && ownrTpCd === '002') {
        alert('법인등록번호를 확인해주세요.');
        return;
      }

    }

    // 사업자번호
    if(ownrBrno) {
      if(!checkBizID(ownrBrno)) {
        alert('사업자등록번호를 확인해주세요.');
        return;
      }
    }

    const formValues = {
      agentId: session?.agentId,                                // 상사사 ID
      purAmt,                                                    // 매입금액
      purSupPrc,                                                 // 공급가액
      purVat,                                                    // 부가세
      carPurDt,                                                  // 매입일   
      agentPurCst,                                               // 상사매입비
      brokerageDate,                                             // 상사매입비 입금일'
      cstTypeCd,                                                 // 비용 발급 코드
      gainTax,                                                   // 취득세
      carNm,                                                     // 차량명
      carNo,                                                     // 차량번호(매입후)
      purBefCarNo,                                               // 차량번호(매입전)
      ownrTpCd,                                                  // 소유자 유형
      ownrSsn,                                                   // 주민등록번호
      ownrBrno,                                                  // 사업자등록번호
      ownrNm,                                                    // 고객명
      ownrZip,                                                   // 주소 우편번호
      evdcCd,                                                    // 증빙종류
      carKndCd,                                                  // 차량 유형 
      prsnSctCd,                                                 // 제시 구분
      ownrPhon,                                                  // 연락처
      ownrEmail,                                                 // 이메일 아이디
      emailDomain,                                               // 이메일 도메인
      txblIssuDt,                                                // 세금 납부일
      purDesc,                                                   // 매입설명
      ownrAddr1,                                                 // 주소
      ownrAddr2,                                                 // 상세주소
      attachedFiles: attachedFiles.map(file => ({
        name: file.name,
        url: file.url
      })), // 관련 서류 첨부 (파일명과 URL)
      usrId: session?.usrId,                                     // 사용자 ID
      dealerId,                                                  // 딜러 코드
      parkingCd,                                                 // 주차위치 코드
      parkingLocationDesc,                                       // 주차위치 설명
      parkKeyNo,                                                 // Key번호
      fctCndcYn,                                                 // 사실 확인서 여부
      txblRcvYn,                                                 // 매입수취여부
      ctshNo                                                     // 계약서번호
    };
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insertCarPur`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues)
      });
      const res = await response.json();
      
      alert('매입차량 등록 되었습니다.'); // 테스트용 알림
      setLoading(false);
      if (res.success) {
        router.push('/purchases/list');
        return { success: true, res, error: null };
      } else {
        throw new Error(res.message || '매입차량 등록에 실패했습니다');
      }
    } catch (error) {
      setError(error.message);
      alert('매입차량 등록 중 오류가 발생했습니다.'); // 테스트용 알림
      setLoading(false);
      return { success: false, res: [], error: error.message };
    }

  };

  console.log('cashIssueInfo', cashIssueInfo);


  return (
      <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">현금영수증 발행 등록</h2>

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
              <th>식별번호</th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="식별번호"
                    name="rcgnNo"
                    value={cashIssueInfo.ISSUE_ID}
                    onChange={(e) => setRcgnNo(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    readOnly
                  />
                  <div className="input__utils">
                    <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                  </div>
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
                        onChange={(e) => setVltIssuYn(e.target.value)}
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
                        onChange={(e) => setVltIssuYn(e.target.value)}
                        checked={vltIssuYn === 'Y'}
                      />
                      <span className="form-option__title">예</span>
                    </label>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>거래금액</th>
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
              <th>거래일</th>
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