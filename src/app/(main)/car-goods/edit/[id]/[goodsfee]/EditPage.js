"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function EditPage(param) {
  let { session, carPurInfo = [], expdCdList = [], evdcCdList = [], goodsFeeDetail = {}, updateGoodsFee = async (data)=>{} } = param;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // 상품화비용 행 상태 초기값(빈 배열로 시작)
  const [productCostRows, setProductCostRows] = useState([]);

  // goodsFeeDetail이 있으면 테이블 행으로 매핑하여 초기화
  useEffect(() => {
    if (!goodsFeeDetail) return;

    // API에서 단일 객체 또는 배열로 올 수 있으므로 normalize
    const details = Array.isArray(goodsFeeDetail)
      ? goodsFeeDetail
      : goodsFeeDetail.GOODS_FEE_SEQ || goodsFeeDetail.EXPD_ITEM_CD
      ? [goodsFeeDetail]
      : [];

    if (details.length === 0) return;

    const mappedRows = details.map((d, idx) => {
      // 지출구분(EXPD_SCT_CD): '01' -> dealer, else company
      const expenseType = d.EXPD_SCT_CD === '01' ? 'dealer' : 'company';
      // 과세구분(TAX_SCT_CD): '01' -> taxable, else taxFree
      const taxType = d.TAX_SCT_CD === '01' ? 'taxable' : 'taxFree';
      // 정산반영(ADJ_INCLUS_YN): 'Y' -> true
      const settlementReflect = (d.ADJ_INCLUS_YN || '').toUpperCase() === 'Y';

      // 금액/공급가/부가세는 숫자 필드로 들어올 수 있음
      const amount = d.EXPD_AMT != null ? String(d.EXPD_AMT) : '';
      const supplyPrice = d.EXPD_SUP_PRC != null ? String(d.EXPD_SUP_PRC) : '';
      const taxAmount = d.EXPD_VAT != null ? String(d.EXPD_VAT) : '';

      return {
        id: d.GOODS_FEE_SEQ != null ? d.GOODS_FEE_SEQ : Date.now() + idx,
        productItem: d.EXPD_ITEM_CD || '',
        expenseType,
        taxType,
        amount,
        supplyPrice,
        taxAmount,
        settlementReflect,
        paymentDate: d.EXPD_DT || d.PAY_DT || '',
        expenseProof: d.EXPD_EVDC_CD || '',
        remarks: d.RMRK || d.REMARK || ''
      };
    });

    setProductCostRows(mappedRows);
  }, [goodsFeeDetail]);

  // 제시구분 코드를 텍스트로 변환하는 함수
  const getCarStatusText = (statusCode) => {
    const statusMap = {
      '001': '상사매입',
      '002': '일반판매',
      '003': '알선판매'
    };
    return statusMap[statusCode] || statusCode || '';
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

  // 상품화비용 수정 API 호출
  const updateGoodsFeeHandler = async () => {
    if (!productCostRows || productCostRows.length === 0) {
      alert('수정할 상품화비용이 없습니다.');
      return;
    }

    // 클릭 시 현재 테이블 상태 로그 출력
    console.log('updateGoodsFeeHandler - productCostRows:', productCostRows);
    console.log('updateGoodsFeeHandler - carRegId:', carPurInfo?.CAR_REG_ID || null);

    setLoading(true);
    try {
      const payloadRows = productCostRows.map((row) => ({
        goodsFeeSeq: row.id,
        carRegId: carPurInfo?.CAR_REG_ID || '',
        expdItemCd: row.productItem || '',
        expdItemNm: expdCdList.find(item => item.CD === row.productItem)?.CD_NM || '',
        expdSctCd: row.expenseType === 'dealer' ? '01' : '02',
        expdAmt: parseFloat(row.amount) || 0,
        expdSupPrc: parseFloat(row.supplyPrice) || 0,
        expdVat: parseFloat(row.taxAmount) || 0,
        expdDt: row.paymentDate || '',
        expdMethCd: '',
        expdEvdcCd: row.expenseProof || '',
        taxSctCd: row.taxType === 'taxable' ? '01' : '02',
        txblIssuDt: '',
        rmrk: row.remarks || '',
        adjInclusYn: row.settlementReflect ? 'Y' : 'N',
        cashRecptRcgnNo: '',
        cashMgmtkey: '',
        delYn: 'N',
        regDtime: new Date().toISOString(),
        regrId: session?.usrId || '',
        modDtime: new Date().toISOString(),
        modrId: session?.usrId || ''
      }));

      // 서버 컨트롤러가 한 건씩 업데이트 하도록 설계되어 있으므로
      // 각 행을 개별 payload로 호출합니다.
      console.log('updateGoodsFeeHandler - payloadRows:', payloadRows);

      if (updateGoodsFee && typeof updateGoodsFee === 'function') {
        // server action으로 각 행을 병렬로 전송
        const results = await Promise.all(
          payloadRows.map((r) => updateGoodsFee({
            goodsFeeSeq: r.goodsFeeSeq,
            carRegId: r.carRegId,
            expdItemCd: r.expdItemCd,
            expdItemNm: r.expdItemNm,
            expdSctCd: r.expdSctCd,
            expdAmt: r.expdAmt,
            expdSupPrc: r.expdSupPrc,
            expdVat: r.expdVat,
            expdDt: r.expdDt,
            expdMethCd: r.expdMethCd,
            expdEvdcCd: r.expdEvdcCd,
            taxSctCd: r.taxSctCd,
            txblIssuDt: r.txblIssuDt,
            rmrk: r.rmrk,
            adjInclusYn: r.adjInclusYn,
            cashRecptRcgnNo: r.cashRecptRcgnNo,
            cashMgmtkey: r.cashMgmtkey,
            delYn: r.delYn,
            regDtime: r.regDtime,
            regrId: r.regrId,
            modDtime: r.modDtime,
            modrId: r.modrId
          }))
        );

        const failed = results.find(r => r && r.success === false);
        if (failed) throw new Error(failed.error || failed.message || '일부 수정에 실패했습니다');
      } else {
        throw new Error('updateGoodsFee server action이 제공되지 않았습니다.');
      }
      alert('상품화비용이 성공적으로 수정되었습니다.');
      setLoading(false);
    } catch (error) {
      console.error('상품화비용 수정 오류:', error);
      setError(error.message);
      alert('상품화비용 수정 중 오류가 발생했습니다: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">상품화비용 수정</h2>

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
              <td>{carPurInfo?.CAR_STAT_NM || ""}</td>
              <th>차량번호</th>
              <td>{carPurInfo?.CAR_NO || ""}</td>
              <th>매입딜러</th>
              <td>{carPurInfo?.DLR_NM || ""}</td>
              <th>차량명</th>
              <td>{carPurInfo?.CAR_NM || ""}</td>
              <th>매입일</th>
              <td>{carPurInfo?.CAR_PUR_DT || ""}</td>
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
                      value={row.productItem}
                      onChange={(e) => updateProductCostRow(row.id, 'productItem', e.target.value)}
                    />
                    <button 
                      className="select__toggle" 
                      type="button"
                      onClick={() => {
                        // Toggle dropdown logic here
                      }}
                    >
                      <span className="select__text">
                        {expdCdList.find(item => item.CD === row.productItem)?.CD_NM || '선택'}
                      </span>
                      <Image
                        className="select__arrow"
                        src="/images/ico-dropdown.svg"
                        alt=""
                        width={16}
                        height={16}
                      />
                    </button>

                    <ul className="select__menu">
                      <li 
                        className="select__option select__option--selected"
                        onClick={() => updateProductCostRow(row.id, 'productItem', '')}
                      >
                        선택
                      </li>
                      {expdCdList.map((item) => (
                        <li
                          key={item.CD}
                          className={`select__option ${row.productItem === item.CD ? 'select__option--selected' : ''}`}
                          onClick={() => updateProductCostRow(row.id, 'productItem', item.CD)}
                        >
                          {item.CD_NM}
                        </li>
                      ))}
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
                      value={row.expenseProof}
                      onChange={(e) => updateProductCostRow(row.id, 'expenseProof', e.target.value)}
                    />
                    <button className="select__toggle" type="button">
                      <span className="select__text">
                        {evdcCdList.find(item => item.CD === row.expenseProof)?.CD_NM || '선택'}
                      </span>
                      <Image
                        className="select__arrow"
                        src="/images/ico-dropdown.svg"
                        alt=""
                        width={16}
                        height={16}
                      />
                    </button>

                    <ul className="select__menu">
                      <li className="select__option select__option--selected" data-value="">선택</li>
                      {evdcCdList.map((item) => (
                        <li 
                          key={item.CD}
                          className={`select__option ${row.expenseProof === item.CD ? 'select__option--selected' : ''}`}
                          data-value={item.CD}
                          onClick={() => updateProductCostRow(row.id, 'expenseProof', item.CD)}
                        >
                          {item.CD_NM}
                        </li>
                      ))}
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
            window.history.back();
          }}
        >
          취소
        </button>
        <button 
          className="btn btn--primary" 
          type="button" 
          onClick={updateGoodsFeeHandler}
          disabled={loading}
        >
          {loading ? '수정 중...' : '확인'}
        </button>
      </div>
    </main>
  );
}
