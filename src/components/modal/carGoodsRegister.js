'use client';
import Image from 'next/image'

export default function CarGoodsRegisterModal({ open, onClose }) {
  if (!open) return null;

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div className="modal modal--open" role="dialog" aria-modal="true" aria-labelledby="car-goods-register-modal-title">
      <div className="modal__container">
        <div className="modal__header">
          <h2 id="car-goods-register-modal-title" className="modal__title">차량선택</h2>
          <div className="modal__utils">
            {/* 
            <button className="modal__btn print" type="button">
              <Image src="/images/ico-print.svg" alt="프린트" width={16} height={16} />
            </button>
            */}
            <button className="modal__btn close" type="button" onClick={handleClose} aria-label="닫기">
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
          <p className="modal__section-title">검색</p>
          <table className="table table--lg">
            <colgroup>
              <col style={{ width: '16%' }} />
              <col style={{ width: '30%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: 'auto' }} />
            </colgroup>
            <tbody>
              <tr>
                <th>검색</th>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="차량 번호" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
                <th>담당딜러</th>
                <td>
                  <div className="input-group">
                    <div className="select w246">
                      <input className="select__input" type="hidden" name="dealer" defaultValue="딜러1" />
                      <button className="select__toggle" type="button">
                        <span className="select__text">딜러1</span>
                        <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                      </button>

                      <ul className="select__menu">
                        <li className="select__option select__option--selected" data-value="딜러1">
                          딜러1
                        </li>
                        <li className="select__option" data-value="딜러2">
                          딜러2
                        </li>
                        <li className="select__option" data-value="딜러3">
                          딜러3
                        </li>
                        <li className="select__option" data-value="딜러4">
                          딜러4
                        </li>
                      </ul>
                    </div>
                    <button type="submit" className="btn btn--dark" disabled>
                      <span className="ico ico--search"></span>검색
                    </button>
                    <button type="submit" className="btn btn--dark">
                      <span className="ico ico--search"></span>검색
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="modal__table">
          <div className="modal__table-head">
            <p className="modal__section-title">
              리스트 <span>Total 100건</span>
            </p>
            <div className="modal__table-options"></div>
            <div className="input-group">
              {/* 딜러명 */}
              <div className="select select--dark w160">
                <input className="select__input" type="hidden" name="dealer" defaultValue="딜러명1" />
                <button className="select__toggle" type="button">
                  <span className="select__text">딜러명1</span>
                  <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                </button>

                <ul className="select__menu">
                  <li className="select__option select__option--selected" data-value="딜러명1">
                    딜러명1
                  </li>
                  <li className="select__option" data-value="딜러명2">
                    딜러명2
                  </li>
                  <li className="select__option" data-value="딜러명3">
                    딜러명3
                  </li>
                  <li className="select__option" data-value="딜러명4">
                    딜러명4
                  </li>
                </ul>
              </div>

              {/* 정렬순서 */}
              <div className="select select--dark w160">
                <input className="select__input" type="hidden" name="dealer" defaultValue="desc" />
                <button className="select__toggle" type="button">
                  <span className="select__text">내림차순</span>
                  <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                </button>

                <ul className="select__menu">
                  <li className="select__option select__option--selected" data-value="desc">
                    내림차순
                  </li>
                  <li className="select__option" data-value="asc">
                    오름차순
                  </li>
                </ul>
              </div>

              {/* 건수 */}
              <div className="select select--dark w160">
                <input className="select__input" type="hidden" name="dealer" defaultValue="10" />
                <button className="select__toggle" type="button">
                  <span className="select__text">10건씩</span>
                  <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                </button>

                <ul className="select__menu">
                  <li className="select__option select__option--selected" data-value="10">
                    10건씩
                  </li>
                  <li className="select__option" data-value="20">
                    20건씩
                  </li>
                  <li className="select__option" data-value="30">
                    30건씩
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <table className="table">
            <colgroup>
              <col style={{ width: '64px' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: '151px' }} />
              <col style={{ width: '151px' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: '151px' }} />
            </colgroup>
            <thead>
              <tr>
                <th>선택</th>
                <th>차량번호</th>
                <th>차량명</th>
                <th>담당 딜러</th>
                <th>매입 금액</th>
                <th>매입일</th>
                <th>차주명</th>
                <th>등록일</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="form-option form-option--icon">
                    <label className="form-option__label">
                      <input type="radio" name="radiogroup" defaultChecked />
                      <span className="form-option__title">선택</span>
                    </label>
                  </div>
                </td>
                <td>그랜저</td>
                <td>홍길동</td>
                <td>1,000,000원</td>
                <td>2025-06-31</td>
                <td>백두산</td>
                <td>2025-07-10</td>
              </tr>
              <tr>
                <td>
                  <div className="form-option form-option--icon">
                    <label className="form-option__label">
                      <input type="radio" name="radiogroup" />
                      <span className="form-option__title">선택</span>
                    </label>
                  </div>
                </td>
                <td>그랜저</td>
                <td>홍길동</td>
                <td>1,000,000원</td>
                <td>2025-06-31</td>
                <td>백두산</td>
                <td>2025-07-10</td>
              </tr>
              <tr>
                <td>
                  <div className="form-option form-option--icon">
                    <label className="form-option__label">
                      <input type="radio" name="radiogroup" />
                      <span className="form-option__title">선택</span>
                    </label>
                  </div>
                </td>
                <td>그랜저</td>
                <td>홍길동</td>
                <td>1,000,000원</td>
                <td>2025-06-31</td>
                <td>백두산</td>
                <td>2025-07-10</td>
              </tr>
              <tr>
                <td>
                  <div className="form-option form-option--icon">
                    <label className="form-option__label">
                      <input type="radio" name="radiogroup" />
                      <span className="form-option__title">선택</span>
                    </label>
                  </div>
                </td>
                <td>그랜저</td>
                <td>홍길동</td>
                <td>1,000,000원</td>
                <td>2025-06-31</td>
                <td>백두산</td>
                <td>2025-07-10</td>
              </tr>
              <tr>
                <td>
                  <div className="form-option form-option--icon">
                    <label className="form-option__label">
                      <input type="radio" name="radiogroup" />
                      <span className="form-option__title">선택</span>
                    </label>
                  </div>
                </td>
                <td>그랜저</td>
                <td>홍길동</td>
                <td>1,000,000원</td>
                <td>2025-06-31</td>
                <td>백두산</td>
                <td>2025-07-10</td>
              </tr>
            </tbody>
          </table>

          <div className="pagination">
            <button
              type="button"
              className="pagination__btn pagination__btn--prev"
            >
              이전
            </button>
            {/* MEMO: button 태그에 .on 추가 시, selected 상태 적용 */}
            <button type="button" className="pagination__btn on">
              1
            </button>
            <button type="button" className="pagination__btn">
              2
            </button>
            <button type="button" className="pagination__btn">
              3
            </button>
            <button type="button" className="pagination__btn">
              ...
            </button>
            <button type="button" className="pagination__btn">
              9
            </button>
            <button type="button" className="pagination__btn">
              10
            </button>
            <button
              type="button"
              className="pagination__btn pagination__btn--next"
            >
              다음
            </button>
          </div>
        </div>

        <div className="modal__btns">
          <button className="btn btn--light close" type="button" onClick={handleClose}>
            취소
          </button>
          <button className="btn btn--primary" type="button">
            확인
          </button>
        </div>
      </div>
      {/* modal content :: e */}
      </div>
    </div>
  );
}
