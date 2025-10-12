"use client";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { getCustomerList, getDealerList } from "../../app/(main)/api/carApi";
import Pagination from "@/components/ui/pagination";

export default function CustSearchModal({ open, onClose, onCarSelect, agentId }) {
  const [customerList, setCustomerList] = useState([]);
  const [dealerList, setDealerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    custNm: "",  // 고객명
    custPhon: "", // 고객전화번호
    custAddr: "", // 고객주소
    custZip: "", // 고객우편번호
    page: 1,
    pageSize: 5,
    orderItem: "등록일",
    ordAscDesc: "desc"
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // 입력 필드 ref 추가
  const custNmInputRef = useRef(null);

  const handleClose = () => {
    if (onClose) onClose();
  };

  // 취소 버튼 핸들러
  const handleCancel = () => {
    if (onClose) onClose();
  };

  // 초기 데이터 로드
  useEffect(() => {
    if (open) {
      loadInitialData();
    }
  }, [open]);

  // 딜러 리스트 로드
  const loadDealerList = async () => {
    try {
      if (!agentId || !agentId.agentId) {
        console.error("agentId가 없습니다:", agentId);
        return;
      }
      const response = await getDealerList(agentId.agentId);
      if (response.success && response.data) {
        setDealerList(response.data || []);
      }
    } catch (error) {
      console.error("딜러 리스트 로드 실패:", error);
    }
  };

  // 초기 데이터 병렬 로드
  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadCustomerList(),
        //loadDealerList()
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 차량 목록 로드
  const loadCustomerList = async (params = {}) => {
    try {
      if (!agentId || !agentId.agentId) {
        console.error("agentId가 없습니다:", agentId);
        return;
      }
      // 딜러 필터링을 위해 서버에서는 딜러 파라미터를 제거하고 모든 데이터를 가져옴
      const payload = {
        carAgent: agentId.agentId, // 세션에서 carAgent 가져오기
        page: params.page || searchParams.page,
        pageSize: params.pageSize || searchParams.pageSize,
        custNm: params.custNm !== undefined ? params.custNm : searchParams.custNm,
        // dealer: params.dealer || searchParams.dealer, // 서버 필터링 비활성화
        orderItem: params.orderItem || searchParams.orderItem,
        ordAscDesc: params.ordAscDesc || searchParams.ordAscDesc
      };

      console.log("고객 목록 로드 payload:", payload);
      const response = await getCustomerList(payload);
      console.log("고객 목록 응답:", response);
      
      if (response.success && response.data) {
        let filteredList = response.data.customerlist || [];
        
        // 딜러 필터링 (클라이언트 사이드)
        const dealerFilter = params.dealer !== undefined ? params.dealer : searchParams.dealer;
        if (dealerFilter && dealerFilter !== "") {
          filteredList = filteredList.filter(customer => customer.DLR_NM === dealerFilter);
          console.log("딜러 필터링 적용:", dealerFilter, "결과:", filteredList.length, "건");
        }
        
        setCustomerList(filteredList);
        setTotalCount(filteredList.length);
      }
    } catch (error) {
      console.error("차량 목록 로드 실패:", error);
    }
  };

  // 검색 핸들러 - 실제 입력 필드 값을 직접 읽어서 사용
  const handleSearch = async () => {
    setLoading(true);
    try {
      // 현재 입력 필드의 실제 값을 가져옴
      const currentCarNo = carNoInputRef.current?.value || "";
      
      const searchData = {
        ...searchParams,
        carNo: currentCarNo,
        page: 1
      };
      
      await loadCarList(searchData);
      setSearchParams(searchData);
    } finally {
      setLoading(false);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setSearchParams(prev => ({ ...prev, page }));
    loadCarList({ ...searchParams, page });
  };

  // 페이지 크기 변경 핸들러
  const handlePageSizeChange = (pageSize) => {
    setSearchParams(prev => ({ ...prev, pageSize, page: 1 }));
    loadCarList({ ...searchParams, pageSize, page: 1 });
  };

  // 정렬 변경 핸들러
  const handleSortChange = (ordAscDesc) => {
    setSearchParams(prev => ({ ...prev, ordAscDesc, page: 1 }));
    loadCarList({ ...searchParams, ordAscDesc, page: 1 });
  };

  // 차량 선택 핸들러
  const handleCarSelect = (car) => {
    setSelectedCar(car);
  };

  // 딜러 선택 핸들러
  const handleDealerChange = (dealer) => {
    setSearchParams(prev => ({ ...prev, dealer }));
  };

  // 차량번호 입력 핸들러
  const handleCarNoChange = (e) => {
    const value = e.target.value;
    setSearchParams(prev => ({ ...prev, carNo: value }));
  };

  // 차량번호 삭제 핸들러
  const handleCarNoClear = () => {
    setSearchParams(prev => ({ ...prev, carNo: "" }));
    if (carNoInputRef.current) {
      carNoInputRef.current.value = "";
    }
  };

  // 확인 버튼 핸들러
  const handleConfirm = () => {
    if (selectedCar) {
      // 차량이 선택된 경우 - 알림 없이 진행
      if (onCarSelect) {
        onCarSelect(selectedCar);
      }
    }
    if (onClose) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="modal modal--open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="car-goods-register-modal-title"
      style={{ zIndex: 10000 }}
    >
      <div className="modal__container">
        <div className="modal__header">
          <h2 id="car-goods-register-modal-title" className="modal__title">
            차량선택
          </h2>
          <div className="modal__utils">
            {/* 
            <button className="modal__btn print" type="button">
              <Image src="/images/ico-print.svg" alt="프린트" width={16} height={16} />
            </button>
            */}
            <button
              className="modal__btn close"
              type="button"
              onClick={handleClose}
              aria-label="닫기"
            >
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
                <col style={{ width: "16%" }} />
                <col style={{ width: "30%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "auto" }} />
              </colgroup>
              <tbody>
                <tr>
                  <th>검색</th>
                  <td>
                    <div className="input">
                      <input 
                        ref={custNmInputRef}
                        type="text" 
                        className="input__field" 
                        placeholder="차량 번호" 
                        value={searchParams.custNm}
                        onChange={handleCarNoChange}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      />
                      <div className="input__utils">
                        <button
                          type="button"
                          className="jsInputClear input__clear ico ico--input-delete"
                          onClick={handleCustNmClear}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="modal__table">
            <div className="modal__table-head">
              <p className="modal__section-title">
                리스트 <span>Total {totalCount}건</span>
              </p>
              <div className="modal__table-options"></div>
              <div className="input-group">
                {/* 정렬 항목 */}
                <div className="select select--dark w160">
                  <input className="select__input" type="hidden" name="dealer" defaultValue="매도(판매)일" />
                  <button
                    className="select__toggle"
                    type="button"
                    onClick={() => {
                      closeAllToggles();
                      setIsOrdItemSelectOpenDtl(!isOrdItemSelectOpenDtl);
                    }}
                  >
                    <span className="select__text">{ordItemDtl || "제시일"}</span>
                    <Image
                      className="select__arrow"
                      src="/images/ico-dropdown.svg"
                      alt=""
                      width={10}
                      height={10}
                    />
                  </button>

                  <ul
                    className="select__menu"
                    style={{ display: isOrdItemSelectOpenDtl ? "block" : "none" }}
                    >
                    <li
                      className={`select__option ${ordItemDtl === "제시일" ? "select__option--selected" : ""}`}
                      onClick={() => {
                        setOrdItemDtl("매도(판매)일");
                        setIsOrdItemSelectOpenDtl(false);
                        handleSearch(1);
                      }}
                    >
                      매도(판매)일
                    </li>
                    <li
                      className={`select__option ${ordItemDtl === "제시(매입)일" ? "select__option--selected" : ""}`}
                      onClick={() => {
                        setOrdItemDtl("제시(매입)일");
                        setIsOrdItemSelectOpenDtl(false);
                        handleSearch(1);
                      }}
                    >
                      제시(매입)일
                    </li>
                  </ul>
                </div>

                {/* 정렬순서 */}
                <div className="select select--dark w160">
                  <input
                    className="select__input"
                    type="hidden"
                    name="ordAscDesc"
                    value={searchParams.ordAscDesc}
                  />
                  <button className="select__toggle" type="button">
                    <span className="select__text">{searchParams.ordAscDesc === "desc" ? "내림차순" : "오름차순"}</span>
                    <Image
                      className="select__arrow"
                      src="/images/ico-dropdown.svg"
                      alt=""
                      width={10}
                      height={10}
                    />
                  </button>

                  <ul className="select__menu">
                    <li 
                      className={`select__option ${searchParams.ordAscDesc === "desc" ? "select__option--selected" : ""}`}
                      data-value="desc"
                      onClick={() => handleSortChange("desc")}
                    >
                      내림차순
                    </li>
                    <li 
                      className={`select__option ${searchParams.ordAscDesc === "asc" ? "select__option--selected" : ""}`}
                      data-value="asc"
                      onClick={() => handleSortChange("asc")}
                    >
                      오름차순
                    </li>
                  </ul>
                </div>

                {/* 건수 */}
                <div className="select select--dark w160">
                  <input className="select__input" type="hidden" name="pageSize" value={searchParams.pageSize} />
                  <button className="select__toggle" type="button">
                    <span className="select__text">{searchParams.pageSize}건씩</span>
                    <Image
                      className="select__arrow"
                      src="/images/ico-dropdown.svg"
                      alt=""
                      width={10}
                      height={10}
                    />
                  </button>

                  <ul className="select__menu">
                    <li 
                      className={`select__option ${searchParams.pageSize === 10 ? "select__option--selected" : ""}`}
                      data-value="5"
                      onClick={() => handlePageSizeChange(5)}
                    >
                      5건씩
                    </li>
                    <li 
                      className={`select__option ${searchParams.pageSize === 20 ? "select__option--selected" : ""}`}
                      data-value="10"
                      onClick={() => handlePageSizeChange(10)}
                    >
                      10건씩
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <table className="table">
              <colgroup>
                <col style={{ width: "64px" }} />
                <col style={{ width: "auto" }} />
                <col style={{ width: "auto" }} />
                <col style={{ width: "151px" }} />
                <col style={{ width: "151px" }} />
                <col style={{ width: "auto" }} />
                <col style={{ width: "151px" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>선택</th>
                  <th>고객번호</th>
                  <th>고객명</th>
                  <th>고객 연락처</th>
                  <th>우편번호</th>
                  <th>주소</th>
                  <th>등록일</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                      로딩 중...
                    </td>
                  </tr>
                ) : carList.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                      데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  customerList.map((customer, index) => (
                    <tr key={customer.CUST_NO || index}>
                      <td>
                        <div className="form-option form-option--icon">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              name="radiogroup" 
                              checked={selectedCustomer?.CUST_NO === customer.CUST_NO}
                              onChange={() => handleCustSelect(customer)}
                            />
                            <span className="form-option__title">선택</span>
                          </label>
                        </div>
                      </td>
                      <td>{customer.CUST_NO || "-"}</td>
                      <td>{customer.CUST_NM || "-"}</td>
                      <td>{customer.CUST_PHON || "-"}</td>
                      <td>{customer.CUST_ZIP || "-"}</td>
                      <td>{customer.CUST_ADDR || "-"}</td>
                      <td>{customer.REGDATE || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {totalCount > 0 && (
              <Pagination
                currentPage={searchParams.page}
                totalPages={Math.ceil(totalCount / searchParams.pageSize)}
                onPageChange={handlePageChange}
                showPrevNext={true}
                showEllipsis={true}
                maxVisiblePages={10}
              />
            )}
          </div>

          <div className="modal__btns">
            <button className="btn btn--light close" type="button" onClick={handleCancel}>
              취소
            </button>
            <button 
              className="btn btn--primary" 
              type="button"
              onClick={handleConfirm}
            >
              확인
            </button>
          </div>
        </div>
        {/* modal content :: e */}
      </div>
    </div>
  );
}