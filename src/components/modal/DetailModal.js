'use client';
import Image from 'next/image';
import React from 'react';

export default function DetailModal({ open = true, onClose = () => {}, onPrint = () => {} }) {
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
                  <td>상사매입</td>
                  <th>차량명</th>
                  <td>그랜저</td>
                  <th>차량번호(매입후)</th>
                  <td>123가1234</td>
                </tr>
                <tr>
                  <th>매입딜러</th>
                  <td>홍길동</td>
                  <th>매입일</th>
                  <td>2025-08-01</td>
                  <th>차량번호(매입전)</th>
                  <td>123허1234</td>
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
                  <td>100,000,000원</td>
                  <th>상사매입비</th>
                  <td>165,000원 / 2025-08-01</td>
                  <th>취득세</th>
                  <td>300,000원</td>
                </tr>
                <tr>
                  <th>계약서번호</th>
                  <td>343543543543</td>
                  <th>이전일</th>
                  <td>2025-07-25</td>
                  <th>매도자(전소유자)</th>
                  <td>개인-홍길순</td>
                </tr>
                <tr>
                  <th>주민(법인)등록번호</th>
                  <td>999999-2******</td>
                  <th>사업자등록번호</th>
                  <td>111-11-11111</td>
                  <th>연락처</th>
                  <td>010-12**-**78</td>
                </tr>
                <tr>
                  <th>주소</th>
                  <td>경기 수원시 팔달구</td>
                  <th></th>
                  <td></td>
                  <th></th>
                  <td></td>
                </tr>
                <tr>
                  <th>매입(세금)계산서</th>
                  <td></td>
                  <th>매입계산서발행일</th>
                  <td></td>
                  <th>사실확인서</th>
                  <td></td>
                </tr>
                <tr>
                  <th>조합제시메모</th>
                  <td colSpan={5}></td>
                </tr>
                <tr>
                  <th>특이사항</th>
                  <td colSpan={5}></td>
                </tr>
                <tr>
                  <th>주차위치</th>
                  <td>위치코드-위치내용</td>
                  <th>Key번호</th>
                  <td>1256</td>
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
