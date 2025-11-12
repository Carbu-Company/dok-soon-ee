'use client'
import Image from 'next/image'
import { useState } from 'react'
import { openPostcodeSearch } from '@/components/modal/AddressModal'

export default function CompanyInfo({ 
  companyInfo, 
  onCompanyInfoChange, 
  loading 
}) {


  console.log('companyInfo*************', companyInfo);
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

  const getFieldValue = (fieldName) => {
    const value = companyInfo?.[fieldName]
    return value === null || value === undefined ? '' : value
  }
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
                  value={getFieldValue('companyName')}
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
                  value={getFieldValue('businessNumber')}
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
            <th>전화 번호</th>
            <td>
              <div className="input w240">
                <input 
                  type="text" 
                  className={`input__field ${getFieldClassName('phone')}`}
                  placeholder="- 없이 입력" 
                  value={getFieldValue('phone')}
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
            <th>FAX 번호</th>
            <td>
            <div className="input w240">
                <input 
                  type="text" 
                  className={`input__field ${getFieldClassName('fax')}`}
                  placeholder="02-123-4567" 
                  value={getFieldValue('fax')}
                  onChange={(e) => handleFieldChange('fax', e.target.value)}
                  readOnly={!isEditMode}
                />
                <div className="input__utils">
                  <button 
                    type="button" 
                    className="jsInputClear input__clear ico ico--input-delete"
                    onClick={() => handleFieldChange('fax', '')}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </td>
          </tr>          
          <tr>
            <th>대표자명</th>
            <td>
              <div className="input w240">
                <input 
                  type="text" 
                  className={`input__field ${getFieldClassName('presidentName')}`}
                  placeholder="대표자명" 
                  value={getFieldValue('presidentName')}
                  onChange={(e) => handleFieldChange('presidentName', e.target.value)}
                  readOnly={!isEditMode}
                />
                <div className="input__utils">
                  <button 
                    type="button" 
                    className="jsInputClear input__clear ico ico--input-delete"
                    onClick={() => handleFieldChange('presidentName', '')}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </td>
            <th>대표자 연락처</th>
            <td>
            <div className="input w240">
                <input 
                  type="text" 
                  className={`input__field ${getFieldClassName('presidentPhone')}`}
                  placeholder="02-123-4567" 
                  value={getFieldValue('presidentPhone')}
                  onChange={(e) => handleFieldChange('presidentPhone', e.target.value)}
                  readOnly={!isEditMode}
                />
                <div className="input__utils">
                  <button 
                    type="button" 
                    className="jsInputClear input__clear ico ico--input-delete"
                    onClick={() => handleFieldChange('presidentPhone', '')}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <th>상사 이메일</th>
            <td colSpan={3}>
              <div className="input w400">
                <input 
                  type="text" 
                  className={`input__field ${getFieldClassName('email')}`}
                  placeholder="example@example.com" 
                  value={getFieldValue('email')}
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
            </td>
          </tr>
          <tr>
            <th>주소</th>
            <td colSpan={3}>
              <div className="input-group">
                <div className="input w100">
                  <input 
                    type="text" 
                    className={`input__field ${getFieldClassName('zip')}`}
                    placeholder="" 
                    value={getFieldValue('zip')}
                    onChange={(e) => handleFieldChange('zip', e.target.value)}
                    readOnly={!isEditMode}
                  />
                  <div className="input__utils">
                    <button 
                      type="button" 
                      className="jsInputClear input__clear ico ico--input-delete"
                      onClick={() => handleFieldChange('zip', '')}
                    >
                      삭제
                    </button>
                  </div>
                </div>
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
                    value={getFieldValue('address')}
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
                    value={getFieldValue('detailAddress')}
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
