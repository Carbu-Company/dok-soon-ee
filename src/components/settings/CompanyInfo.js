'use client'
import Image from 'next/image'

export default function CompanyInfo({ 
  companyInfo, 
  emailDomains, 
  onCompanyInfoChange, 
  loading 
}) {
  return (
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
            <td>
              <div className="input w240">
                <input 
                  type="text" 
                  className="input__field" 
                  placeholder="상사명" 
                  value={companyInfo.companyName}
                  onChange={(e) => onCompanyInfoChange('companyName', e.target.value)}
                />
                <div className="input__utils">
                  <button 
                    type="button" 
                    className="jsInputClear input__clear ico ico--input-delete"
                    onClick={() => onCompanyInfoChange('companyName', '')}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </td>
            <th>사업자 등록번호</th>
            <td className="text-left">
              <div className="input w240">
                <input 
                  type="text" 
                  className="input__field" 
                  placeholder="123-45-67890" 
                  value={companyInfo.businessNumber}
                  onChange={(e) => onCompanyInfoChange('businessNumber', e.target.value)}
                />
                <div className="input__utils">
                  <button 
                    type="button" 
                    className="jsInputClear input__clear ico ico--input-delete"
                    onClick={() => onCompanyInfoChange('businessNumber', '')}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <th>로그인 ID</th>
            <td>
              <div className="input w240">
                <input 
                  type="text" 
                  className="input__field" 
                  placeholder="아이디" 
                  value={companyInfo.loginId}
                  onChange={(e) => onCompanyInfoChange('loginId', e.target.value)}
                />
                <div className="input__utils">
                  <button 
                    type="button" 
                    className="jsInputClear input__clear ico ico--input-delete"
                    onClick={() => onCompanyInfoChange('loginId', '')}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </td>
            <th>비밀번호</th>
            <td>
              <div className="input w240">
                <input 
                  type="password" 
                  className="input__field" 
                  placeholder="비밀번호" 
                  value={companyInfo.password}
                  onChange={(e) => onCompanyInfoChange('password', e.target.value)}
                />
                <div className="input__utils">
                  <button 
                    type="button" 
                    className="jsInputClear input__clear ico ico--input-delete"
                    onClick={() => onCompanyInfoChange('password', '')}
                  >
                    삭제
                  </button>
                  <button type="button" className="jsInputTypeToggle input__toggle ico ico--view">비밀번호 보기</button>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <th>전화</th>
            <td>
              <div className="input w240">
                <input 
                  type="text" 
                  className="input__field" 
                  placeholder="- 없이 입력" 
                  value={companyInfo.phone}
                  onChange={(e) => onCompanyInfoChange('phone', e.target.value)}
                />
                <div className="input__utils">
                  <button 
                    type="button" 
                    className="jsInputClear input__clear ico ico--input-delete"
                    onClick={() => onCompanyInfoChange('phone', '')}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </td>
            <th>이메일 주소</th>
            <td>
              <div className="input-group input-group--sm">
                <div className="input w240">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="이메일 주소" 
                    value={companyInfo.email}
                    onChange={(e) => onCompanyInfoChange('email', e.target.value)}
                  />
                  <div className="input__utils">
                    <button 
                      type="button" 
                      className="jsInputClear input__clear ico ico--input-delete"
                      onClick={() => onCompanyInfoChange('email', '')}
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <span className="input-group__dash">@</span>
                <div className="select w120">
                  <input className="select__input" type="hidden" name="emailDomain" value={companyInfo.emailDomain} />
                  <button className="select__toggle" type="button">
                    <span className="select__text">{companyInfo.emailDomain}</span>
                    <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                  </button>
                  <ul className="select__menu">
                    {emailDomains.map((domain) => (
                      <li 
                        key={domain.value}
                        className={`select__option ${companyInfo.emailDomain === domain.value ? 'select__option--selected' : ''}`}
                        onClick={() => onCompanyInfoChange('emailDomain', domain.value)}
                      >
                        {domain.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <th>휴대폰 번호</th>
            <td colSpan={3}>
              <div className="input w240">
                <input 
                  type="text" 
                  className="input__field" 
                  placeholder="- 없이 입력" 
                  value={companyInfo.mobile}
                  onChange={(e) => onCompanyInfoChange('mobile', e.target.value)}
                />
                <div className="input__utils">
                  <button 
                    type="button" 
                    className="jsInputClear input__clear ico ico--input-delete"
                    onClick={() => onCompanyInfoChange('mobile', '')}
                  >
                    삭제
                  </button>
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
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="검색 버튼을 눌러주세요" 
                    value={companyInfo.address}
                    onChange={(e) => onCompanyInfoChange('address', e.target.value)}
                  />
                  <div className="input__utils">
                    <button 
                      type="button" 
                      className="jsInputClear input__clear ico ico--input-delete"
                      onClick={() => onCompanyInfoChange('address', '')}
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <div className="input w400">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="상세 주소" 
                    value={companyInfo.detailAddress}
                    onChange={(e) => onCompanyInfoChange('detailAddress', e.target.value)}
                  />
                  <div className="input__utils">
                    <button 
                      type="button" 
                      className="jsInputClear input__clear ico ico--input-delete"
                      onClick={() => onCompanyInfoChange('detailAddress', '')}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
