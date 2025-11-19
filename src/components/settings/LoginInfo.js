'use client'
import Image from 'next/image'
import { useState } from 'react'
import { openPostcodeSearch } from '@/components/modal/AddressModal'
import { autoHypenTelNo } from '@/app/(main)/common/script.js'

export default function LoginInfo({ 
  loginInfo, 
  onLoginInfoChange, 
  loading 
}) {


  console.log('loginInfo*************', loginInfo);
  // 수정 모드 상태 관리
  const [isEditMode, setIsEditMode] = useState(false)
  const [originalData, setOriginalData] = useState({})
  const [modifiedFields, setModifiedFields] = useState(new Set())

  // 수정 모드 시작
  const handleEditStart = () => {
    setOriginalData({ ...loginInfo })
    setModifiedFields(new Set())
    setIsEditMode(true)
  }

  // 수정 모드 취소
  const handleEditCancel = () => {
    // 원본 데이터로 복원
    Object.keys(originalData).forEach(key => {
      onLoginInfoChange(key, originalData[key])
    })
    setModifiedFields(new Set())
    setIsEditMode(false)
  }

  // 수정 모드 저장
  const handleEditSave = () => {
    // 여기에 저장 API 호출 로직 추가 예정
    alert('저장되었습니다.')
    setOriginalData({ ...loginInfo })
    setModifiedFields(new Set())
    setIsEditMode(false)
  }

  // 필드 변경 감지
  const handleFieldChange = (field, value) => {
    onLoginInfoChange(field, value)
    
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
    const value = loginInfo?.[fieldName]
    return value === null || value === undefined ? '' : value
  }
  return (
    <div className="table-wrap">
      <h2 className="table-wrap__title">로그인 정보 관리</h2>
      <table className="table table--lg">
        <colgroup>
          <col style={{ width: "140px" }} />
          <col style={{ width: "auto" }} />
          <col style={{ width: "140px" }} />
          <col style={{ width: "auto" }} />
        </colgroup>
        <tbody>
          <tr>
            <th>로그인 ID</th>
            <td>
              <div className="input w240">
                <input 
                  type="text" 
                  className={`input__field ${getFieldClassName('loginId')}`}
                  placeholder="로그인 ID" 
                  value={getFieldValue('loginId')}
                  onChange={(e) => handleFieldChange('loginId', e.target.value)}
                  readOnly={true}
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
            <td className="text-left">
              <div className="input w240">
                <input 
                  type="text" 
                  className={`input__field ${getFieldClassName('password')}`}
                  placeholder="비밀번호" 
                  value={getFieldValue('password')}
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
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <th>핸드폰 번호</th>
            <td>
              <div className="input w240">
                <input 
                  type="text" 
                  className={`input__field ${getFieldClassName('mobilePhone')}`}
                  placeholder="- 없이 입력" 
                  value={getFieldValue('mobilePhone')}
                  onChange={(e) => {
                    let value = autoHypenTelNo(e.target.value);
                    handleFieldChange('mobilePhone', value);
                  }}
                  readOnly={!isEditMode}
                />
                <div className="input__utils">
                  <button 
                    type="button" 
                    className="jsInputClear input__clear ico ico--input-delete"
                    onClick={() => handleFieldChange('mobilePhone', '')}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </td>
            <th>이메일</th>
            <td>
            <div className="input w240">
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
