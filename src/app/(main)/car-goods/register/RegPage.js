"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/navigation';
import CarSearchModal from "@/components/modal/CarSearchModal";
import Image from "next/image";

export default function ProductCostRegisterPage({ 
  
    session, 
    dealerList = [], 
    expdCdList = [], 
    carPurDetail = [] 

}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productCostRows, setProductCostRows] = useState([
    {
      id: 1,
      productItem: '',
      expenseType: 'dealer',
      taxType: 'taxable',
      amount: '',
      supplyPrice: '',
      taxAmount: '',
      settlementReflect: true,
      paymentDate: '',
      expenseProof: '',
      remarks: ''
    }
  ]);

  // 페이지 로드 시 모달 자동 열기 (한 번만 실행)
  useEffect(() => {
    // 차량 정보가 없으면 모달을 자동으로 열기 (페이지 로드 시에만)
    if (!carPurDetail || !carPurDetail.CAR_REG_ID) {
      console.log('차량 정보 없음 - 모달 열기');
      setIsModalOpen(true);
    } else {
      console.log('차량 정보 있음 - 모달 열지 않음');
    }
  }, []); // 빈 의존성 배열로 변경하여 한 번만 실행

  // 제시구분 코드를 텍스트로 변환하는 함수
  const getCarStatusText = (statusCode) => {
    const statusMap = {
      '001': '상사매입',
      '002': '일반판매',
      '003': '알선판매'
    };
    return statusMap[statusCode] || statusCode || '';
  };

  // 차량 선택 핸들러
  const handleCarSelect = (car) => {
    console.log('선택된 차량:', car);
    setSelectedCar(car);
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCarSearchClick = () => {
    setIsModalOpen(true);
  };

  // 상품화비용 행 추가
  const addProductCostRow = () => {
    const newRow = {
      id: Date.now(), // 고유 ID 생성
      productItem: '',
      expenseType: 'dealer',
      taxType: 'taxable',
      amount: '',
      supplyPrice: '',
      taxAmount: '',
      settlementReflect: true,
      paymentDate: '',
      expenseProof: '',
      remarks: ''
    };
    setProductCostRows([...productCostRows, newRow]);
  };

  // 상품화비용 행 삭제
  const removeProductCostRow = (id) => {
    if (productCostRows.length > 1) { // 최소 1개 행은 유지
      setProductCostRows(productCostRows.filter(row => row.id !== id));
    }
  };

  // 상품화비용 행 데이터 업데이트
  const updateProductCostRow = (id, field, value) => {
    setProductCostRows(prevRows => 
      prevRows.map(row => 
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  // 합계 계산 함수들 (useMemo로 최적화)
  const totals = useMemo(() => {
    const totalsData = {
      settlementReflect: {
        totalAmount: 0,
        supplyPrice: 0,
        taxAmount: 0,
        count: 0
      },
      settlementExclude: {
        totalAmount: 0,
        supplyPrice: 0,
        taxAmount: 0,
        count: 0
      }
    };

    productCostRows.forEach(row => {
      const amount = parseFloat(row.amount) || 0;
      const supplyPrice = parseFloat(row.supplyPrice) || 0;
      const taxAmount = parseFloat(row.taxAmount) || 0;
      
      if (row.settlementReflect) {
        totalsData.settlementReflect.totalAmount += amount;
        totalsData.settlementReflect.supplyPrice += supplyPrice;
        totalsData.settlementReflect.taxAmount += taxAmount;
        totalsData.settlementReflect.count += 1;
      } else {
        totalsData.settlementExclude.totalAmount += amount;
        totalsData.settlementExclude.supplyPrice += supplyPrice;
        totalsData.settlementExclude.taxAmount += taxAmount;
        totalsData.settlementExclude.count += 1;
      }
    });

    return totalsData;
  }, [productCostRows]);

  // 금액 입력 시 공급가와 부가세 자동 계산
  const calculateAmounts = (amount, taxType) => {
    const amountValue = parseFloat(amount) || 0;
    
    if (taxType === 'taxable') {
      // 과세: 공급가 = 금액 / 1.1, 부가세 = 금액 - 공급가
      const supplyPrice = Math.round(amountValue / 1.1);
      const taxAmount = amountValue - supplyPrice;
      return { supplyPrice, taxAmount };
    } else {
      // 면세: 공급가 = 금액, 부가세 = 0
      return { supplyPrice: amountValue, taxAmount: 0 };
    }
  };

  // 상품화비용 등록 API 호출
  const insertGoodsFee = async () => {
    const carRegId = selectedCar?.CAR_REG_ID || (carPurDetail && carPurDetail.CAR_REG_ID);
    if (!carRegId) {
      alert('차량 정보가 없습니다. 차량을 먼저 선택해주세요.');
      setIsModalOpen(true); // 모달을 다시 열기
      return;
    }

    if (productCostRows.length === 0) {
      alert('상품화비용을 입력해주세요.');
      return;
    }

    // 유효한 데이터가 있는 행만 필터링
    const validRows = productCostRows.filter(row => 
      row.amount && parseFloat(row.amount) > 0
    );

    if (validRows.length === 0) {
      alert('유효한 상품화비용을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 각 행에 대해 API 호출
      const promises = validRows.map(async (row) => {
        const formValues = {
          carRegId: carRegId,           // 차량 등록 ID
          expdItemCd: row.productItem || '',           // 지출 항목 코드
          expdItemNm: row.productItem || '',            // 지출 항목 명
          expdSctCd: row.expenseType === 'dealer' ? '01' : '02', // 지출 구분 코드 (딜러: 01, 상사: 02)
          expdAmt: parseFloat(row.amount) || 0,        // 지출 금액
          expdSupPrc: parseFloat(row.supplyPrice) || 0, // 지출 공급가
          expdVat: parseFloat(row.taxAmount) || 0,     // 지출 부가세
          expdDt: row.paymentDate || '',               // 지출 일자
          expdMethCd: '',                              // 지출 방식 코드
          expdEvdcCd: row.expenseProof || '',          // 지출 증빙 코드
          taxSctCd: row.taxType === 'taxable' ? '01' : '02', // 세금 구분 코드 (과세: 01, 면세: 02)
          txblIssuDt: '',                               // 세금계산서 발행 일자
          rmrk: row.remarks || '',                     // 비고
          adjInclusYn: row.settlementReflect ? 'Y' : 'N', // 정산 포함 여부
          cashRecptRcgnNo: '',                         // 현금 영수증 식별 번호
          cashMgmtkey: '',                              // 현금 관리키
          delYn: 'N',                                  // 삭제여부
          regDtime: new Date().toISOString(),           // 등록 일시
          regrId: session?.usrId || '',                // 등록자 ID
          modDtime: '',                                // 수정 일시
          modrId: ''                                   // 수정자 ID
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insertGoodsFee`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formValues)
        });

        const res = await response.json();
        
        if (!res.success) {
          throw new Error(res.message || '상품화비용 등록에 실패했습니다');
        }

        return res;
      });

      await Promise.all(promises);
      
      alert('상품화비용이 성공적으로 등록되었습니다.');
      setLoading(false);
      // 성공 후 목록 페이지로 이동하거나 필요한 처리
      // router.push('/car-goods/list');
      
    } catch (error) {
      console.error('상품화비용 등록 오류:', error);
      setError(error.message);
      alert('상품화비용 등록 중 오류가 발생했습니다: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">상품화비용 등록</h2>

        <div className="guidebox">
          <p className="guidebox__title">
            차 정보를 가지고 인입 시 차량 선택 모달 창 불필요.(차량 검색은 필요. 변경가능)
          </p>
          <p className="guidebox__title">
            상사별 환경설정에 가져와야 함. 상품화항목 선택 시 항목(지출구분,과세구분,정산반영) 연계
          </p>
          <p className="guidebox__title">비용등록시 종합업무현황-상사매입자료에 자동 반영</p>
        </div>
        
        {error && (
          <div className="alert alert--error" style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px' }}>
            <strong>오류:</strong> {error}
          </div>
        )}
      </div>

      <div className="table-wrap">
        <div className="table-wrap__head">
          <h2 className="table-wrap__title">기준차량</h2>
          <button
            className="btn btn--dark btn--padding--r20"
            type="button"
            id="openBtn"
            onClick={handleCarSearchClick}
          >
            <span className="ico ico--add"></span>차량검색
          </button>
        </div>
        <table className="table">
          <colgroup>
            <col style={{ width: "100px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "auto" }} />
          </colgroup>
          <tbody>
            <tr>
              <th>제시구분</th>
              <td>{selectedCar?.CAR_STAT_NM || (carPurDetail && carPurDetail.CAR_STAT_NM) || ""}</td>
              <th>차량번호</th>
              <td>{selectedCar?.CAR_NO || (carPurDetail && carPurDetail.CAR_NO) || ""}</td>
              <th>매입딜러</th>
              <td>{selectedCar?.DLR_NM || (carPurDetail && carPurDetail.DLR_NM) || ""}</td>
              <th>차량명</th>
              <td>{selectedCar?.CAR_NM || (carPurDetail && carPurDetail.CAR_NM) || ""}</td>
              <th>매입일</th>
              <td>{selectedCar?.CAR_PUR_DT || (carPurDetail && carPurDetail.CAR_PUR_DT) || ""}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="table-wrap">
        <div className="table-wrap__head">
          <h2 className="table-wrap__title">상품화비용</h2>
          <button 
            className="btn btn--dark btn--padding--r20" 
            type="button" 
            onClick={addProductCostRow}
          >
            <span className="ico ico--add"></span>상품화비용 추가
          </button>
        </div>
        <table className="table table--xl" id="myTable">
          <colgroup>
            <col style={{ width: "180px" }} />
            <col style={{ width: "180px" }} />
            <col style={{ width: "180px" }} />
            <col style={{ width: "180px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "180px" }} />
            <col style={{ width: "180px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "64px" }} />
          </colgroup>
          <thead>
            <tr>
              <th rowSpan={2}>상품화항목</th>
              <th rowSpan={2}>지출구분</th>
              <th rowSpan={2}>과세구분</th>
              <th colSpan={3} className="col-half">
                상품화비
              </th>
              <th rowSpan={2}>
                정산반영
                <div className="tooltip">
                  <button className="jsTooltipBtn tooltip__btn btn btn--ico">
                    <span className="ico ico--help">보기</span>
                  </button>
                  <div className="tooltip__box">
                    <p>매입비용(매입원가)으로 처리할 경우 &apos;체크&apos;</p>
                  </div>
                </div>
              </th>
              <th rowSpan={2}>결제일</th>
              <th rowSpan={2}>지출증빙</th>
              <th rowSpan={2}>비고/지출처</th>
              <th rowSpan={2}>삭제</th>
            </tr>
            <tr>
              <th className="col-half">금액</th>
              <th className="col-half">공급가</th>
              <th className="col-half">부가세</th>
            </tr>
          </thead>
          <tbody>
            {productCostRows.map((row, index) => (
              <tr key={`product-cost-row-${row.id}`}>
                <td>
                  <div className="select">
                    <input
                      className="select__input"
                      type="hidden"
                      name={`productItem_${row.id}`}
                      defaultValue="value1"
                    />
                    <button className="select__toggle" type="button">
                      <span className="select__text">선택</span>
                      <Image
                        className="select__arrow"
                        src="/images/ico-dropdown.svg"
                        alt=""
                        width={16}
                        height={16}
                      />
                    </button>

                    <ul className="select__menu">
                      <li className="select__option select__option--selected" data-value="value1">
                        선택
                      </li>
                      <li className="select__option" data-value="value2">
                        선택2
                      </li>
                      {/* 필요 시 더 추가 (10개 초과 시 내부 스크롤) */}
                    </ul>
                  </div>
                </td>
                <td>
                  {/*select 로 처리해도 됨*/}
                  <div className="form-option-wrap">
                    <div className="form-option">
                      <label className="form-option__label">
                        <input 
                          type="radio" 
                          id={`expenseType_dealer_${row.id}`}
                          name={`expenseType_row_${row.id}`} 
                          value="dealer"
                          checked={row.expenseType === 'dealer'}
                          onChange={(e) => updateProductCostRow(row.id, 'expenseType', e.target.value)}
                        />
                        <span className="form-option__title">딜러</span>
                      </label>
                    </div>
                    <div className="form-option">
                      <label className="form-option__label">
                        <input 
                          type="radio" 
                          id={`expenseType_company_${row.id}`}
                          name={`expenseType_row_${row.id}`} 
                          value="company"
                          checked={row.expenseType === 'company'}
                          onChange={(e) => updateProductCostRow(row.id, 'expenseType', e.target.value)}
                        />
                        <span className="form-option__title">상사</span>
                      </label>
                    </div>
                  </div>
                </td>
                <td>
                  {/*select 로 처리해도 됨*/}
                  <div className="form-option-wrap">
                    <div className="form-option">
                      <label className="form-option__label">
                        <input 
                          type="radio" 
                          id={`taxType_taxable_${row.id}`}
                          name={`taxType_row_${row.id}`} 
                          value="taxable"
                          checked={row.taxType === 'taxable'}
                          onChange={(e) => {
                            const taxType = e.target.value;
                            updateProductCostRow(row.id, 'taxType', taxType);
                            if (row.amount) {
                              const calculated = calculateAmounts(row.amount, taxType);
                              updateProductCostRow(row.id, 'supplyPrice', calculated.supplyPrice.toString());
                              updateProductCostRow(row.id, 'taxAmount', calculated.taxAmount.toString());
                            }
                          }}
                        />
                        <span className="form-option__title">과세</span>
                      </label>
                    </div>
                    <div className="form-option">
                      <label className="form-option__label">
                        <input 
                          type="radio" 
                          id={`taxType_taxFree_${row.id}`}
                          name={`taxType_row_${row.id}`} 
                          value="taxFree"
                          checked={row.taxType === 'taxFree'}
                          onChange={(e) => {
                            const taxType = e.target.value;
                            updateProductCostRow(row.id, 'taxType', taxType);
                            if (row.amount) {
                              const calculated = calculateAmounts(row.amount, taxType);
                              updateProductCostRow(row.id, 'supplyPrice', calculated.supplyPrice.toString());
                              updateProductCostRow(row.id, 'taxAmount', calculated.taxAmount.toString());
                            }
                          }}
                        />
                        <span className="form-option__title">면세</span>
                      </label>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="" 
                      value={row.amount}
                      onChange={(e) => {
                        const amount = e.target.value;
                        const calculated = calculateAmounts(amount, row.taxType);
                        updateProductCostRow(row.id, 'amount', amount);
                        updateProductCostRow(row.id, 'supplyPrice', calculated.supplyPrice.toString());
                        updateProductCostRow(row.id, 'taxAmount', calculated.taxAmount.toString());
                      }}
                    />
                    <div className="input__utils">
                      <button
                        type="button"
                        className="jsInputClear input__clear ico ico--input-delete"
                      ></button>
                    </div>
                  </div>
                </td>
                <td>{row.supplyPrice ? Number(row.supplyPrice).toLocaleString() : '0'}</td>
                <td>{row.taxAmount ? Number(row.taxAmount).toLocaleString() : '0'}</td>
                <td>
                  <div className="form-option form-option--icon">
                    <label className="form-option__label">
                      <input 
                        type="checkbox" 
                        checked={row.settlementReflect}
                        onChange={(e) => updateProductCostRow(row.id, 'settlementReflect', e.target.checked)}
                      />
                      <span className="form-option__title">선택</span>
                    </label>
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input
                      type="date"
                      className="input__field react-date-input"
                      value={row.paymentDate}
                      onChange={(e) => updateProductCostRow(row.id, 'paymentDate', e.target.value)}
                    />
                  </div>
                </td>

                <td>
                  <div className="select">
                    <input
                      className="select__input"
                      type="hidden"
                      name={`expenseProof_${row.id}`}
                      defaultValue="value1"
                    />
                    <button className="select__toggle" type="button">
                      <span className="select__text">선택</span>
                      <Image
                        className="select__arrow"
                        src="/images/ico-dropdown.svg"
                        alt=""
                        width={16}
                        height={16}
                      />
                    </button>

                    <ul className="select__menu">
                      <li className="select__option select__option--selected" data-value="value1">
                        선택
                      </li>
                      <li className="select__option" data-value="value2">
                        전자세금계산서
                      </li>
                      <li className="select__option" data-value="value3">
                        카드영수증
                      </li>
                      <li className="select__option" data-value="value3">
                        현금영수증
                      </li>
                      {/* 필요 시 더 추가 (10개 초과 시 내부 스크롤) */}
                    </ul>
                  </div>
                </td>

                <td>
                  <div className="input">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="" 
                      value={row.remarks}
                      onChange={(e) => updateProductCostRow(row.id, 'remarks', e.target.value)}
                    />
                    <div className="input__utils">
                      <button
                        type="button"
                        className="jsInputClear input__clear ico ico--input-delete"
                      >
                        비고/지출처
                      </button>
                    </div>
                  </div>
                </td>

                <td>
                  <button 
                    type="button" 
                    className="btn btn--ico"
                    onClick={() => removeProductCostRow(row.id)}
                    disabled={productCostRows.length === 1}
                  >
                    <span className="ico ico--trash"></span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-wrap">
        <div className="table-wrap__head">
          <h2 className="table-wrap__title">합계</h2>
        </div>
        <table className="table">
          <colgroup>
            <col style={{ width: "180px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "auto" }} />
          </colgroup>
          <tbody>
            <tr>
              <th></th>
              <th>합계금액</th>
              <th>공급가</th>
              <th>부가세</th>
              <th>건수</th>
            </tr>
            <tr>
              <td>정산반영</td>
              <td>{totals.settlementReflect.totalAmount.toLocaleString()}원</td>
              <td>{totals.settlementReflect.supplyPrice.toLocaleString()}원</td>
              <td>{totals.settlementReflect.taxAmount.toLocaleString()}원</td>
              <td>{totals.settlementReflect.count}건</td>
            </tr>
            <tr>
              <td>정산제외</td>
              <td>{totals.settlementExclude.totalAmount.toLocaleString()}원</td>
              <td>{totals.settlementExclude.supplyPrice.toLocaleString()}원</td>
              <td>{totals.settlementExclude.taxAmount.toLocaleString()}원</td>
              <td>{totals.settlementExclude.count}건</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th>합계</th>
              <th>{(totals.settlementReflect.totalAmount + totals.settlementExclude.totalAmount).toLocaleString()}원</th>
              <th>{(totals.settlementReflect.supplyPrice + totals.settlementExclude.supplyPrice).toLocaleString()}원</th>
              <th>{(totals.settlementReflect.taxAmount + totals.settlementExclude.taxAmount).toLocaleString()}원</th>
              <th>{totals.settlementReflect.count + totals.settlementExclude.count}건</th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="container__btns">
        <button
          className="btn btn--light"
          type="button"
          onClick={() => {
            if (typeof window !== "undefined") window.location.href = "m2.jsp";
          }}
        >
          취소
        </button>
        <button 
          className="btn btn--primary" 
          type="button" 
          onClick={insertGoodsFee}
          disabled={loading}
        >
          {loading ? '등록 중...' : '확인'}
        </button>
      </div>

      {/* 차량 검색 모달 */}
      <CarSearchModal 
        open={isModalOpen} 
        onClose={handleModalClose} 
        onCarSelect={handleCarSelect}
        agentId={session}
      />
    </main>
  );
}
