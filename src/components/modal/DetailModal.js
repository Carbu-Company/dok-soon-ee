'use client';
import Image from 'next/image';
import React from 'react';

export default function DetailModal(props) {
  const {car : carData, open = true, onClose = () => {}, onPrint = () => {}} = props;

  return (
    <div className={`modal ${open ? "modal--open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="detail-modal-title">
      <div className="modal__container">
        <div className="modal__header">
          <h2 id="detail-modal-title" className="modal__title">제시(매입)차량 상세보기</h2>
          <div className="modal__utils">
            <button className="modal__btn print" type="button" onClick={onPrint} aria-label="프린트">
              <Image src="/images/ico-print.svg" alt="프린트" width={32} height={32} />
            </button>
            <button className="modal__btn close" type="button" onClick={onClose} aria-label="닫기">
              <Image src="/images/ico-modal-close.svg" alt="닫기" width={32} height={32} />
            </button>
          </div>
        </div>

        {/* modal content :: s */}
        <div className="modal__content">
          {/*
          <div className="guidebox">
            <p className="guidebox__title">도움말</p>
            <p className="guidebox__desc">
              도움말 안내 텍스트 문구가 들어갑니다. 도움말 안내 텍스트 문구가 들어갑니다.
              도움말 안내 텍스트 문구가 들어갑니다. 도움말 안내 텍스트 문구가 들어갑니다.
              도움말 안내 텍스트 문구가 들어갑니다.
            </p>
          </div>
          */}

          <div className="modal__table">
            <p className="modal__section-title">기본정보</p>
            <table className="md-table">
              <colgroup>
                <col style={{ width: '120px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <th>제시구분</th>
                  <td>{carData?.PRSN_SCT_CD === '0' ? '상사매입' : '고객위탁'}</td>
                  <th>차량명</th>
                  <td>{carData?.CAR_NM || '-'}</td>
                  <th>차량번호(매입후)</th>
                  <td>{carData?.CAR_NO || '-'}</td>
                </tr>
                <tr>
                  <th>매입딜러</th>
                  <td>{carData?.DLR_NM || '-'}</td>
                  <th>매입일</th>
                  <td>{carData?.CAR_PUR_DT || '-'}</td>
                  <th>차량번호(매입전)</th>
                  <td>{carData?.PUR_BEF_CAR_NO || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="modal__table">
            <p className="modal__section-title">매입정보</p>
            <table className="md-table">
              <colgroup>
                <col style={{ width: '120px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <th>매입금액</th>
                  <td>{carData?.PUR_AMT.toLocaleString() || '-'}원</td>
                  <th>상사매입비</th>
                  <td>{carData?.AGENT_PUR_CST.toLocaleString() || '-'}원 / {carData?.AGENT_PUR_CST_PAY_DT || '-'}</td>
                  <th>취득세</th>
                  <td>{carData?.GAIN_TAX.toLocaleString() || '-'}원</td>
                </tr>
                <tr>
                  <th>계약서번호</th>
                  <td>{carData?.CTSH_NO || '-'}</td>
                  <th>이전일</th>
                  <td>{carData?.CAR_REG_DT || '-'}</td>
                  <th>매도자(전소유자)</th>
                  <td>[{carData?.OWNR_TP_CD === '0' ? '개인' : '법인'}] {carData?.OWNR_NM}</td>
                </tr>
                <tr>
                  <th>주민(법인)등록번호</th>
                  <td>{carData?.OWNR_SSN?.slice(0, -6) + '******'}</td>
                  <th>사업자등록번호</th>
                  <td>{carData?.OWNR_BRNO || '-'}</td>
                  <th>연락처</th>
                  <td>{carData?.OWNR_PHON || '-'}</td>
                </tr>
                <tr>
                  <th>주소</th>
                  <td colSpan={5} style={{ textAlign: 'left', paddingLeft: '42px' }}>({carData?.OWNR_ZIP}) {carData?.OWNR_ADDR1} {carData?.OWNR_ADDR2}</td>
                </tr>
                <tr>
                  <th>매입(세금)계산서</th>
                  <td>{carData?.TXBL_RCV_YN === 'E' ? '해당없음' : 
                   carData?.TXBL_RCV_YN === 'Y' ? '수취' :
                   carData?.TXBL_RCV_YN === 'N' ? '미수취' : ''}</td>
                  <th>매입계산서발행일</th>
                  <td>{carData?.TXBL_ISSU_DT || '-'}</td>
                  <th>사실확인서</th>
                  <td>{carData?.FCT_CNDC_YN === 'E' ? '해당없음' : 
                   carData?.FCT_CNDC_YN === 'Y' ? '수취' :
                   carData?.FCT_CNDC_YN === 'N' ? '미수취' : ''}</td>
                </tr>
                <tr>
                  <th>조합제시메모</th>
                  <td colSpan={5}>{carData?.COMB_PRSN_MEMO || '-'}</td>
                </tr>
                <tr>
                  <th>특이사항</th>
                  <td colSpan={5}>{carData?.PUR_DESC || '-'}</td>
                </tr>
                <tr>
                  <th>주차위치</th>
                  <td>{carData?.PARK_ZON_NM || '-'} - {carData?.PARK_ZON_DESC || '-'}</td>
                  <th>Key번호</th>
                  <td>{carData?.PARK_KEY_NO || '-'}</td>
                  <th></th>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/*
          <div className="modal__table">
            <p className="modal__section-title">입고이력</p>
            <table className="table">
              <thead>
                <tr>
                  <th>입고일</th>
                  <th>담당 딜러</th>
                  <th>매입 금액</th>
                  <th>취득세</th>
                  <th>매입비</th>
                  <th>등록일</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2025-07-01</td>
                  <td>홍길동</td>
                  <td>1,000,000원</td>
                  <td>2,000,000원</td>
                  <td>1,165,000원</td>
                  <td>2025-07-10</td>
                </tr>
              </tbody>
            </table>
          </div>
          */}

          {/*
          <div className="terms terms--view">
            <p className="terms__title">참고 내용</p>
            <div className="terms__content">
              <ul className="terms__list">
                <li>참고 내용 텍스트 문구가 들어갑니다.</li>
                <li>참고 내용 텍스트 문구가 들어갑니다.</li>
              </ul>
            </div>
          </div>
          */}

          <div className="modal__btns">
            <button className="btn btn--light close" type="button" onClick={onClose}>취소</button>
            <button className="btn btn--primary" type="button" onClick={onPrint}>인쇄</button>
          </div>
        </div>
        {/* modal content :: e */}
      </div>
    </div>
  );
}
