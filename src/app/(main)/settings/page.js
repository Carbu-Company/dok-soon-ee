'use client'
import Image from 'next/image'
export default function SettingsPage() {
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
              <li><a href="#" className="tab-menu__menu on">상사 정보 관리</a></li>
              <li><a href="#" className="tab-menu__menu">상사 딜러 관리</a></li>
              <li><a href="#" className="tab-menu__menu">매입/매도비 설정</a></li>
              <li><a href="#" className="tab-menu__menu">공인인증서 등록</a></li>
              <li><a href="#" className="tab-menu__menu">계좌 등록</a></li>
            </ul>
          </div>
  
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
                  <td>아주상사</td>
                  <th>사업자 등록번호</th>
                  <td className="text-left">123-45-56789</td>
                </tr>
                <tr>
                  <th>로그인 ID</th>
                  <td>
                    <div className="input w240">
                      <input type="text" className="input__field" placeholder="아이디" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                      </div>
                    </div>
                  </td>
                  <th>비밀번호</th>
                  <td>
                    <div className="input w240">
                      <input type="password" className="input__field" placeholder="비빌번호" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                        <button type="button" className="jsInputTypeToggle input__toggle ico ico--view">비밀번호 보기</button>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>전화</th>
                  <td>
                    <div className="input w240">
                      <input type="text" className="input__field" placeholder="- 없이 입력" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                      </div>
                    </div>
                  </td>
                  <th>이메일 주소</th>
                  <td>
                    <div className="input-group input-group--sm">
                      <div className="input w240">
                        <input type="text" className="input__field" placeholder="이메일 주소" />
                        <div className="input__utils">
                          <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                        </div>
                      </div>
                      <span className="input-group__dash">@</span>
                      <div className="select w120">
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
                  <th>휴대폰 번호</th>
                  <td colSpan={3}>
                    <div className="input w240">
                      <input type="text" className="input__field" placeholder="- 없이 입력" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
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
                        <input type="text" className="input__field" placeholder="검색 버튼을 눌러주세요" />
                        <div className="input__utils">
                          <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                        </div>
                      </div>
                      <div className="input w400">
                        <input type="text" className="input__field" placeholder="상세 주소" />
                        <div className="input__utils">
                          <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <div className="container__btns">
            <button className="btn btn--primary" type="button" disabled>확인</button>
            <button className="btn btn--primary" type="button">확인</button>
          </div>
        </main>
    );
  }
  