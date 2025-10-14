'use client'
import Image from 'next/image'
import { useState } from 'react'
import { openPostcodeSearch } from '@/components/modal/AddressModal'

export default function CompanyInfo({ 
  companyInfo, 
  emailDomains, 
  onCompanyInfoChange, 
  loading 
}) {
  // 수정 모드 상태 관리
  const [isEditMode, setIsEditMode] = useState(false)
  const [originalData, setOriginalData] = useState({})
  const [modifiedFields, setModifiedFields] = useState(new Set())

  // 수정 모드 시작
  const handleEditStart = () => {
    setOriginalData({ ...companyInfo })
    setModifiedFields(new Set())
    setIsEditMode(true)
  }

  // 수정 모드 취소
  const handleEditCancel = () => {
    // 원본 데이터로 복원
    Object.keys(originalData).forEach(key => {
      onCompanyInfoChange(key, originalData[key])
    })
    setModifiedFields(new Set())
    setIsEditMode(false)
  }

  // 수정 모드 저장
  const handleEditSave = () => {
    // 여기에 저장 API 호출 로직 추가 예정
    alert('저장되었습니다.')
    setOriginalData({ ...companyInfo })
    setModifiedFields(new Set())
    setIsEditMode(false)
  }

  // 필드 변경 감지
  const handleFieldChange = (field, value) => {
    onCompanyInfoChange(field, value)
    
    if (isEditMode && originalData[field] !== value) {
      setModifiedFields(prev => new Set([...prev, field]))
    } else if (isEditMode && originalData[field] === value) {
      setModifiedFields(prev => {
        const newSet = new Set(prev)
        newSet.delete(field)
        return newSet
      })
    }
  }

  // 주소 검색 함수
  const handleAddressSearch = () => {
    openPostcodeSearch((data) => {
      handleFieldChange('address', data.address);
    });
  };

  // 필드 클래스명 생성
  const getFieldClassName = (fieldName) => {
    if (!isEditMode) {
      return 'settings-readonly'
    }
    // 수정 모드에서는 변경된 필드만 노란색으로 표시
    if (modifiedFields.has(fieldName)) {
      return 'settings-modified'
    }
    // 수정 모드이지만 변경되지 않은 필드는 기본 스타일
    return ''
  };
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
                  className={`input__field ${getFieldClassName('companyName')}`}
                  placeholder="상사명" 
                  value={companyInfo.companyName}
                  onChange={(e) => handleFieldChange('companyName', e.target.value)}
                  readOnly={!isEditMode}
                />
                <div className="input__utils">
                  <button 
                    type="button" 
                    className="jsInputClear input__clear ico ico--input-delete"
                    onClick={() => handleFieldChange('companyName', '')}
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
                  className={`input__field ${getFieldClassName('businessNumber')}`}
                  placeholder="123-45-67890" 
                  value={companyInfo.businessNumber}
                  onChange={(e) => handleFieldChange('businessNumber', e.target.value)}
                  readOnly={!isEditMode}
                />
                <div className="input__utils">
                  <button 
                    type="button" 
                    className="jsInputClear input__clear ico ico--input-delete"
                    onClick={() => handleFieldChange('businessNumber', '')}
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
                  className={`input__field ${getFieldClassName('loginId')}`}
                  placeholder="아이디" 
                  value={companyInfo.loginId}
                  onChange={(e) => handleFieldChange('loginId', e.target.value)}
                  readOnly={!isEditMode}
                />
                <div className="input__utils">
                  <button 
                    type="button" 
                    className="jsInputClear input__clear ico ico--input-delete"
                    onClick={() => handleFieldChange('loginId', '')}
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
                  className={`input__field ${getFieldClassName('password')}`}
                  placeholder="비밀번호" 
                  value={companyInfo.password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  readOnly={!isEditMode}
                />
                <div className="input__utils">
                  <button 
                    type="button" 
                    className="jsInputClear input__clear ico ico--input-delete"
                    onClick={() => handleFieldChange('password', '')}
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
                  className={`input__field ${getFieldClassName('phone')}`}
                  placeholder="- 없이 입력" 
                  value={companyInfo.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  readOnly={!isEditMode}
                />
                <div className="input__utils">
                  <button 
                    type="button" 
                    className="jsInputClear input__clear ico ico--input-delete"
                    onClick={() => handleFieldChange('phone', '')}
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
                    className={`input__field ${getFieldClassName('email')}`}
                    placeholder="이메일 주소" 
                    value={companyInfo.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    readOnly={!isEditMode}
                  />
                  <div className="input__utils">
                    <button 
                      type="button" 
                      className="jsInputClear input__clear ico ico--input-delete"
                      onClick={() => handleFieldChange('email', '')}
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <span className="input-group__dash">@</span>
                <div className="select w120">
                  <input className="select__input" type="hidden" name="emailDomain" value={companyInfo.emailDomain} />
                  <button 
                    className={`select__toggle ${getFieldClassName('emailDomain')}`}
                    type="button"
                    disabled={!isEditMode}
                  >
                    <span className="select__text">{companyInfo.emailDomain}</span>
                    <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                  </button>
                  {isEditMode && (
                    <ul className="select__menu">
                      {emailDomains.map((domain) => (
                        <li 
                          key={domain.value}
                          className={`select__option ${companyInfo.emailDomain === domain.value ? 'select__option--selected' : ''}`}
                          onClick={() => handleFieldChange('emailDomain', domain.value)}
                        >
                          {domain.label}
                        </li>
                      ))}
                    </ul>
                  )}
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
                  className={`input__field ${getFieldClassName('mobile')}`}
                  placeholder="- 없이 입력" 
                  value={companyInfo.mobile}
                  onChange={(e) => handleFieldChange('mobile', e.target.value)}
                  readOnly={!isEditMode}
                />
                <div className="input__utils">
                  <button 
                    type="button" 
                    className="jsInputClear input__clear ico ico--input-delete"
                    onClick={() => handleFieldChange('mobile', '')}
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
                <button 
                  className="btn btn--dark" 
                  type="button" 
                  onClick={handleAddressSearch}
                  disabled={!isEditMode}
                >
                  주소 검색
                </button>
                <div className="input w400">
                  <input 
                    type="text" 
                    className={`input__field ${getFieldClassName('address')}`}
                    placeholder="검색 버튼을 눌러주세요" 
                    value={companyInfo.address}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    readOnly={!isEditMode}
                  />
                  <div className="input__utils">
                    <button 
                      type="button" 
                      className="jsInputClear input__clear ico ico--input-delete"
                      onClick={() => handleFieldChange('address', '')}
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <div className="input w400">
                  <input 
                    type="text" 
                    className={`input__field ${getFieldClassName('detailAddress')}`}
                    placeholder="상세 주소" 
                    value={companyInfo.detailAddress}
                    onChange={(e) => handleFieldChange('detailAddress', e.target.value)}
                    readOnly={!isEditMode}
                  />
                  <div className="input__utils">
                    <button 
                      type="button" 
                      className="jsInputClear input__clear ico ico--input-delete"
                      onClick={() => handleFieldChange('detailAddress', '')}
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
      
      {/* 수정/저장/취소 버튼 */}
      <div className="settings-buttons">
        {!isEditMode ? (
          <button 
            className="btn btn--primary" 
            type="button"
            onClick={handleEditStart}
            disabled={loading}
          >
            수정
          </button>
        ) : (
          <>
            <button 
              className="btn btn--primary" 
              type="button"
              onClick={handleEditSave}
              disabled={loading}
            >
              저장
            </button>
            <button 
              className="btn btn--light" 
              type="button"
              onClick={handleEditCancel}
              disabled={loading}
            >
              취소
            </button>
          </>
        )}
      </div>
    </div>
  )
}
