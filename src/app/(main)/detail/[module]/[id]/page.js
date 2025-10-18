"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import DetailPage from "./DetailPage";
import {
  // 제시(매입)
  getCarPurInfo,
  // 재고금융
  getCarLoanInfo,
  // 상품화비
  getCarGoodsInfo,
  // 매도
  getCarSelInfo,
  // 현금영수증
  getCarCashInfo,
  // 전자세금계산서
  getCarTaxInfo,
  // 알선/정산
  getCarConcilInfo,
} from "@/app/(main)/api/carApi";

export default function UnifiedDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { module, id } = params;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [extraData, setExtraData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const all = await fetchAllData(id);
        const primary = all?.purchase || getMockData(module, id);
        setData(primary);
        setExtraData(all);
      } catch (err) {
        setError("데이터를 불러오는데 실패했습니다.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (module && id) {
      fetchData();
    }
  }, [module, id]);

  const fetchAllData = async (itemId) => {
    try {
      const [
        purRes,
        loanRes,
        goodsRes,
        sellRes,
        cashRes,
        taxRes,
        concilRes,
      ] = await Promise.all([
        getCarPurInfo(itemId).catch(() => null),
        getCarLoanInfo(itemId).catch(() => null),
        getCarGoodsInfo({ carRegId: itemId, carRegId: itemId }).catch(() => null),
        getCarSelInfo({ carRegId: itemId, sell_car_regid: itemId }).catch(() => null),
        getCarCashInfo({ costSeq: itemId, carRegId: itemId }).catch(() => null),
        getCarTaxInfo({ eInvoiceSeq: itemId, carRegId: itemId }).catch(() => null),
        getCarConcilInfo({ brkSeq: itemId, carRegId: itemId }).catch(() => null),
      ]);

      return {
        purchase: purRes?.success ? purRes.data : null,
        loan: loanRes?.success ? loanRes.data : null,
        goods: goodsRes?.success ? goodsRes.data : null,
        sell: sellRes?.success ? sellRes.data : null,
        cash: cashRes?.success ? cashRes.data : null,
        tax: taxRes?.success ? taxRes.data : null,
        concil: concilRes?.success ? concilRes.data : null,
      };
    } catch (e) {
      console.error("fetchAllData error:", e);
      return null;
    }
  };



  // API 호출 함수 :   getCarPurInfo

  const getMockData = (moduleType, itemId) => {
    const baseData = {
      id: itemId,
      차량번호: "123가1234",
      차량명: "그랜저",
      담당딜러: "홍길동",
    };

    switch (moduleType) {
      case "purchases":
        return {
          ...baseData,
          제시구분: "상사매입",
          매입금액: "30,000,000원",
          매입일: "2025-08-01",
          특이사항: "특이사항 없음"
        };
      
        // API 호출 함수 :  getCarLoanInfo
      case "inventory-finance":
        return {
          ...baseData,
          캐피탈사: "하나캐피탈",
          대출금액: "25,000,000원",
          대출기간: "6개월",
          딜러이율: "15%",
          월이자: "312,500원"
        };

      //  API 호출 함수 :  getCarGoodsInfo
      
      case "car-goods":
        return {
          ...baseData,
          상품화업체: "ABC상품화",
          상품화비용: "2,000,000원",
          완료일: "2025-08-15"
        };
      
        // API 호출 함수 :  getCarSelInfo
      case "car-sell":
        return {
          ...baseData,
          매도금액: "35,000,000원",
          매도일: "2025-09-01",
          구매자: "김구매"
        };
      
        // API 호출 함수 :  getCarCashInfo
      case "cash-receipts":
        return {
          발행일: "2025-08-01",
          금액: "1,000,000원",
          발행구분: "소득공제",
          승인번호: "20250801001"
        };
      
        // API 호출 함수 :  getCarTaxInfo
      case "electronic-tax-invoice":
        return {
          발행일: "2025-08-01",
          공급가액: "30,000,000원",
          세액: "3,000,000원",
          합계금액: "33,000,000원",
          공급자: "독순이상사",
          공급받는자: "구매업체"
        };

        // API 호출 함수 :  getCarConcilInfo
      
      case "car-concil":
        return {
          ...baseData,
          정산금액: "5,000,000원",
          정산일: "2025-08-31",
          정산상태: "완료"
        };
      
      default:
        return baseData;
    }
  };

  const getTitle = (moduleType) => {
    const titles = {
      "purchases": "제시정보 상세보기",
      "inventory-finance": "재고금융 상세보기",
      "car-goods": "차량상품화 상세보기",
      "car-sell": "차량매도 상세보기",
      "cash-receipts": "현금영수증 상세보기",
      "electronic-tax-invoice": "전자세금계산서 상세보기",
      "car-concil": "차량정산 상세보기"
    };
    return titles[moduleType] || "상세보기";
  };

  const handleEdit = () => {
    router.push(`/${module}/edit/${id}`);
  };

  const handleDelete = () => {
    if (confirm("정말로 삭제하시겠습니까?")) {
      // 삭제 로직 구현
      alert("삭제되었습니다.");
      router.back();
    }
  };

  const handleBack = () => {
    // 모듈별 목록 페이지로 이동
    const listPaths = {
      "purchases": "/purchases/list",
      "inventory-finance": "/inventory-finance/inventory-list",
      "car-goods": "/car-goods/list",
      "car-sell": "/car-sell",
      "cash-receipts": "/cash-receipts",
      "electronic-tax-invoice": "/electronic-tax-invoice",
      "car-concil": "/car-concil"
    };
    
    const listPath = listPaths[module];
    if (listPath) {
      router.push(listPath);
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <main className="container container--page">
        <div className="container__head">
          <h2 className="container__title">로딩 중...</h2>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container container--page">
        <div className="container__head">
          <h2 className="container__title">오류</h2>
        </div>
        <div className="container__content">
          <p>{error}</p>
          <button className="btn btn--light" onClick={() => router.back()}>
            돌아가기
          </button>
        </div>
      </main>
    );
  }

  return (
    <DetailPage
      title={getTitle(module)}
      data={data}
      dataSets={extraData}
      moduleType={module}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBack={handleBack}
    />
  );
}
