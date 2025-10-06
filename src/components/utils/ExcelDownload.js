import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/**
 * 엑셀 다운로드 공통 함수
 * @param {Array} data - 다운로드할 데이터 배열
 * @param {Array} columns - 컬럼 정보 배열 (accessorKey, header, cell 속성 포함)
 * @param {Array} numericColumns - 숫자 형식으로 처리할 컬럼의 accessorKey 배열
 * @param {string} sheetName - 엑셀 시트 이름 (기본값: "데이터")
 * @param {string} filePrefix - 파일명 접두사 (기본값: "데이터")
 */
export const excelDownload = ({
  data,
  columns,
  numericColumns = [],
  sheetName = "데이터",
  filePrefix = "데이터"
}) => {
  try {
    // 데이터가 없는 경우 처리
    if (!data || data.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    // 엑셀 헤더 준비 (BUTTON 컬럼 제외)
    const headers = columns
      .filter(col => col.accessorKey !== "BUTTON")
      .map(col => col.header);

    // 엑셀에 넣을 데이터 가공
    const excelData = data.map((row) => {
      const rowData = {};
      columns
        .filter((column) => column.accessorKey !== "BUTTON")
        .forEach((column) => {
          // 숫자 컬럼인지 확인
          const isNumeric = numericColumns.includes(column.accessorKey);
          let cellValue = row[column.accessorKey];

          // 숫자 컬럼이면 숫자로 변환
          if (isNumeric && cellValue) {
            // 이미 콤마가 있는 경우 제거
            if (typeof cellValue === 'string') {
              cellValue = cellValue.replace(/,/g, '');
            }
            const num = Number(cellValue);
            if (!isNaN(num)) {
              cellValue = num; // 숫자 타입으로 저장
            }
          }

          // 렌더러 처리 (숫자 컬럼이 아닌 경우에만)
          if (column.cell && !isNumeric) {
            try {
              const rendered = column.cell({ value: cellValue });
              if (typeof rendered === 'object' && rendered.props && rendered.props.children) {
                cellValue = rendered.props.children;
              }
            } catch (e) {
              // 오류 시 원래 값 사용
            }
          }

          rowData[column.header] = cellValue;
        });
      return rowData;
    });

    // 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(excelData, { header: headers });

    // 워크시트 스타일 설정
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    
    // 각 컬럼에 스타일 적용
    for (let C = range.s.c; C <= range.e.c; C++) {
      const headerCell = XLSX.utils.encode_cell({ r: 0, c: C });
      const header = worksheet[headerCell].v;
      
      // 숫자 컬럼 여부 확인
      const matchingColumn = columns.find(col => col.header === header);
      const isNumericHeader = matchingColumn && numericColumns.includes(matchingColumn.accessorKey);
      
      if (isNumericHeader) {
        // 데이터 행의 셀에 숫자 형식 적용
        for (let R = range.s.r + 1; R <= range.e.r; R++) {
          const cell = XLSX.utils.encode_cell({ r: R, c: C });
          if (!worksheet[cell]) continue;
          
          // 숫자 형식 설정: 천 단위 구분자 (#,##0)
          worksheet[cell].z = '#,##0';
          
          // 오른쪽 정렬 스타일 설정
          if (!worksheet[cell].s) worksheet[cell].s = {};
          worksheet[cell].s.alignment = { horizontal: 'right' };
        }
      }
    }
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // 엑셀 파일 생성 및 다운로드
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true
    });
    
    const fileName = `${filePrefix}_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    // Arc 브라우저 호환성을 위한 다중 다운로드 방식
    try {
      // 방법 1: file-saver 사용
      const dataBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(dataBlob, fileName);
    } catch (error) {
      console.warn("file-saver 방식 실패, 대체 방식 시도:", error);
      
      try {
        // 방법 2: 직접 URL.createObjectURL 사용
        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        
        // 임시 링크 생성하여 다운로드
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        
        // DOM에 추가하고 클릭 후 제거
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // URL 해제
        setTimeout(() => URL.revokeObjectURL(url), 100);
      } catch (error2) {
        console.warn("URL.createObjectURL 방식도 실패, 최종 방식 시도:", error2);
        
        // 방법 3: Data URL 사용 (최후의 수단)
        const base64 = btoa(String.fromCharCode(...excelBuffer));
        const dataUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
        
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = fileName;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }

    console.log("엑셀 다운로드 완료:", fileName);
    return true;
  } catch (error) {
    console.error("엑셀 다운로드 중 오류 발생:", error);
    alert("엑셀 다운로드 중 오류가 발생했습니다.");
    return false;
  }
};
