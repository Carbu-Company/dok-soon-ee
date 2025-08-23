/**
 * 테이블 데이터 인쇄 공통 함수
 * @param {Array} data - 인쇄할 데이터 배열
 * @param {Array} columns - 컬럼 정보 배열 (accessorKey, header, cell 속성 포함)
 * @param {Array} numericColumns - 숫자 형식으로 처리할 컬럼의 accessorKey 배열
 * @param {string} title - 인쇄 제목 (기본값: "데이터 목록")
 * @param {Object} options - 추가 옵션 설정
 */
export const printTable = ({
  data,
  columns,
  numericColumns = [],
  title = "데이터 목록",
  options = {}
}) => {
  try {
    // 데이터가 없는 경우 처리
    if (!data || data.length === 0) {
      alert("인쇄할 데이터가 없습니다.");
      return false;
    }

    // 인쇄용 임시 창 생성
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.");
      return false;
    }

    // 기본 스타일 설정
    const defaultStyles = {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      margin: '1cm',
      titleFontSize: '18px',
      ...options.styles
    };

    // 인쇄할 HTML 생성
    let printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8">
        <style>
          @page {
            margin: ${defaultStyles.margin};
          }
          body {
            font-family: ${defaultStyles.fontFamily};
            font-size: ${defaultStyles.fontSize};
          }
          .print-title {
            font-size: ${defaultStyles.titleFontSize};
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          .number-cell {
            text-align: right;
            font-family: 'Courier New', monospace;
          }
          .print-footer {
            margin-top: 20px;
            font-size: 10px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="print-title">${title}</div>
        <table>
          <thead>
            <tr>
    `;

    // 헤더 추가 (BUTTON 컬럼 제외)
    columns
      .filter((col) => col.accessorKey !== "BUTTON")
      .forEach((column) => {
        printContent += `<th>${column.header}</th>`;
      });

    printContent += `
            </tr>
          </thead>
          <tbody>
    `;

    // 데이터 행 추가
    data.forEach((row) => {
      printContent += "<tr>";

      columns
        .filter((col) => col.accessorKey !== "BUTTON")
        .forEach((column) => {
          let cellValue = row[column.accessorKey];
          const isNumeric = numericColumns.includes(column.accessorKey);

          // 숫자 값 형식화 (천 단위 구분)
          if (isNumeric && cellValue) {
            // 숫자인 경우에만 포맷팅 적용
            const numValue = Number(cellValue);
            if (!isNaN(numValue)) {
              cellValue = numValue.toLocaleString();
            }
          }

          // 셀 렌더러 처리 (숫자 컬럼이 아닌 경우에만)
          if (column.cell && !isNumeric) {
            try {
              const rendered = column.cell({ value: cellValue });
              if (typeof rendered === "object") {
                // React 요소인 경우 텍스트만 추출 시도
                cellValue = cellValue || "-";
              } else {
                cellValue = rendered || "-";
              }
            } catch (e) {
              cellValue = cellValue || "-";
            }
          }

          // 숫자 컬럼에 클래스 적용
          if (isNumeric) {
            printContent += `<td class="number-cell">${cellValue || "0"}</td>`;
          } else {
            printContent += `<td>${cellValue || "-"}</td>`;
          }
        });

      printContent += "</tr>";
    });

    printContent += `
          </tbody>
        </table>
        <div class="print-footer">
          출력일시: ${new Date().toLocaleString()}
        </div>
        <script>
          // 창이 로드되면 자동으로 인쇄 다이얼로그 표시
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    // 인쇄용 창에 내용 작성
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    console.log("인쇄 준비 완료:", title);
    return true;
  } catch (error) {
    console.error("인쇄 중 오류 발생:", error);
    alert("인쇄 중 오류가 발생했습니다.");
    return false;
  }
};
