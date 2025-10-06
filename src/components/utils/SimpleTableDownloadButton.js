"use client";
import { excelDownload } from "./ExcelDownload";

/**
 * 간단한 테이블 다운로드 버튼 컴포넌트
 * @param {Object} props
 * @param {Array} props.data - 다운로드할 데이터 배열
 * @param {Array} props.columns - 컬럼 정보 배열 (accessorKey, header, cell 속성 포함)
 * @param {Array} props.numericColumns - 숫자 형식으로 처리할 컬럼의 accessorKey 배열
 * @param {string} props.filePrefix - 파일명 접두사
 * @param {string} props.className - 버튼 CSS 클래스
 * @param {string} props.text - 버튼 텍스트
 * @param {string} props.sheetName - 엑셀 시트 이름
 */
export default function SimpleTableDownloadButton({
  data = [],
  columns = [],
  numericColumns = [],
  filePrefix = "데이터",
  className = "btn btn--white",
  text = "다운로드",
  sheetName = "데이터"
}) {
  const handleDownload = () => {
    if (!data || data.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    if (!columns || columns.length === 0) {
      alert("컬럼 정보가 없습니다.");
      return;
    }

    // 브라우저 호환성 체크
    const isArcBrowser = navigator.userAgent.includes('Arc');
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isArcBrowser || isSafari) {
      console.log("Arc 브라우저 또는 Safari 감지, 호환 모드로 다운로드 시도");
    }

    try {
      excelDownload({
        data,
        columns,
        numericColumns,
        sheetName,
        filePrefix
      });
    } catch (error) {
      console.error("다운로드 중 오류:", error);
      alert("다운로드 중 오류가 발생했습니다. 다른 브라우저에서 시도해보세요.");
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleDownload}
    >
      <span className="ico ico--download"></span>{text}
    </button>
  );
}
