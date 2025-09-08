import React from "react";
import Image from 'next/image'
export default function ExperienceRegistrationModal({ open = true, onClose, onPrint }) {
  return (
    // .modal에 .modal--open 클래스 토글
    <div className={`modal ${open ? "modal--open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="experience-modal-title">
      <div className="modal__container">
        <div className="modal__header">
          <h2 id="experience-modal-title" className="modal__title">똑순이 체험 등록 신청</h2>
          <div className="modal__utils">
            <button className="modal__btn close" type="button" onClick={onClose} aria-label="닫기">
              <Image src="/images/ico-modal-close.svg" alt="닫기" width={32} height={32} />
            </button>
          </div>
        </div>

        {/* modal content :: s */}
        <div className="modal__content">
          <div className="guidebox">
            <p className="guidebox__title">체험등록 이용안내</p>
            <p className="guidebox__desc">체험등록 이용 안내 텍스트 문구가 들어갑니다. 체험등록 이용 안내 텍스트 문구가 들어갑니다. 체험등록 이용 안내 텍스트 문구가 들어갑니다. 체험등록 이용 안내 텍스트 문구가 들어갑니다. 체험등록 이용 안내 텍스트 문구가 들어갑니다.</p>
          </div>

          <div className="modal__table">
            <p className="modal__section-title">신청상사 정보</p>
            <table className="table table--lg">
              <colgroup>
                <col style={{ width: "140px" }} />
                <col style={{ width: "263px" }} />
                <col style={{ width: "140px" }} />
                <col style={{ width: "auto" }} />
              </colgroup>
              <tbody>
                <tr>
                  <th>상사명</th>
                  <td>
                    <div className="input">
                      <input type="text" className="input__field" placeholder="상사명" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                      </div>
                    </div>
                  </td>
                  <th>사업자 등록번호</th>
                  <td>
                    <div className="input-group">
                      <div className="input">
                        <input type="number" className="input__field" placeholder="- 없이 입력" />
                        <div className="input__utils">
                          <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>대표자명</th>
                  <td>
                    <div className="input">
                      <input type="text" className="input__field" placeholder="대표자명" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                      </div>
                    </div>
                  </td>
                  <th>이메일 주소</th>
                  <td>
                    <div className="input-group input-group--sm">
                      <div className="input w187">
                        <input type="text" className="input__field" placeholder="이메일 주소" />
                        <div className="input__utils">
                          <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                        </div>
                      </div>
                      <span className="input-group__dash">@</span>
                      {/* 커스텀 셀렉트 마크업 */}
                      <div className="select">
                        <input className="select__input" type="hidden" name="dealer" defaultValue="gmail.com" />
                        <button className="select__toggle" type="button">
                          <span className="select__text">gmail.com</span>
                          <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                        </button>
                        <ul className="select__menu">
                          <li className="select__option select__option--selected" data-value="gmail.com">gmail.com</li>
                          <li className="select__option" data-value="naver.com">naver.com</li>
                          <li className="select__option" data-value="daum.net">daum.net</li>
                          <li className="select__option" data-value="nate.com">nate.com</li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>조합상사코드</th>
                  <td colSpan={3}>
                    <div className="input-group">
                      <div className="input w246">
                        <input type="text" className="input__field" placeholder="코드" />
                        <div className="input__utils">
                          <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                        </div>
                      </div>
                      <button className="btn btn--dark" type="button" disabled>확인</button>
                      <button className="btn btn--dark" type="button">확인</button>

                      <span className="input-notice">등록 가능합니다. 신청을 계속 진행바랍니다.</span>
                      <span className="input-error">등록 불가합니다. 고객센터로 문의바랍니다.</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>희망 아이디</th>
                  <td>
                    <div className="input">
                      <input type="text" className="input__field" placeholder="아이디(6~12자 이내)" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                      </div>
                    </div>
                  </td>
                  <th>비밀번호</th>
                  <td>
                    <div className="input">
                      <input type="text" className="input__field" placeholder="비밀번호(6~12자 이내)" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>신청자명</th>
                  <td>
                    <div className="input">
                      <input type="text" className="input__field" placeholder="신청자명" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                      </div>
                    </div>
                  </td>
                  <th>휴대폰 번호</th>
                  <td>
                    <div className="input">
                      <input type="number" className="input__field" placeholder="- 없이 입력" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="terms">
            <p className="terms__title">이용약관 및 개인정보 이용 동의</p>
            <div className="terms__content">
              <ul className="terms__list">
                <li>본인은 서비스 제공을 위해 다음과 같은 개인정보를 수집하고 이용하는 것에 동의합니다.</li>
                <li>수집 항목: [예: 이름, 연락처, 이메일 주소, 서비스 이용 기록 등]</li>
                <li>수집 목적: [예: 회원 관리, 서비스 제공, 이벤트 및 마케팅 활용 등]</li>
                <li>보유 기간: [예: 회원 탈퇴 시까지 또는 관련 법령에서 정한 기간까지]</li>
                <li>동의 거부 권리 안내: 본인은 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으며, 동의 거부 시 서비스 이용에 제한이 있을 수 있습니다.</li>
                <li>개인정보 제3자 제공 동의 (해당 시): [예: 본인은 개인정보를 다음의 제3자에게 제공하는 것에 동의합니다. (제공받는 자, 제공 목적, 제공 항목, 제공 기간)]</li>
                <li>개인정보 처리 위탁 동의 (해당 시): [예: 본인은 개인정보 처리를 다음의 업체에 위탁하는 것에 동의합니다. (수탁업체, 위탁 업무 내용, 위탁 기간)] </li>
              </ul>
            </div>
          </div>

          <div className="modal__btns">
            <button className="btn btn--light" type="button" onClick={onClose}>취소</button>
            <button className="btn btn--primary" type="button" disabled>확인</button>
            <button className="btn btn--primary" type="button">확인</button>
          </div>
        </div>
        {/* modal content :: e */}
      </div>
    </div>
  );
}
