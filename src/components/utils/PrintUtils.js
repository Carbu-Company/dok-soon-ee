/**
 * 인쇄 유틸리티 모듈
 * 다양한 컴포넌트에서 재사용 가능한 인쇄 기능 제공
 */

/**
 * 기본 인쇄 스타일 템플릿
 */
const getDefaultPrintStyles = () => `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 20px;
    padding: 0;
    color: #000;
    background: white;
  }
  h1, h2, h3, h4, h5, h6 {
    font-weight: bold;
    margin-bottom: 20px;
    border-bottom: 2px solid #000;
    padding-bottom: 10px;
  }
  h2 {
    font-size: 18px;
  }
  .modal__section-title, .section-title {
    font-size: 16px;
    font-weight: bold;
    margin: 20px 0 10px 0;
    color: #000;
  }
  .md-table, .table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 20px;
  }
  .md-table th, .md-table td,
  .table th, .table td {
    border: 1px solid #000;
    padding: 8px;
    font-size: 12px;
    line-height: 1.4;
    text-align: left;
  }
  .md-table th, .table th {
    background-color: #f5f5f5;
    font-weight: bold;
  }
  .btn, .modal__btn, .modal__btns {
    display: none !important;
  }
  @page {
    margin: 15mm;
    size: A4;
  }
  @media print {
    body { margin: 0; }
  }
`;

/**
 * HTML 요소의 내용을 새 창에서 인쇄
 * @param {Object} options - 인쇄 옵션
 * @param {string} options.selector - 인쇄할 요소의 CSS 셀렉터
 * @param {string} options.title - 인쇄 문서 제목 (기본값: '인쇄')
 * @param {string} options.titleSelector - 제목을 가져올 요소의 셀렉터 (옵션)
 * @param {string} options.customStyles - 추가 CSS 스타일 (옵션)
 * @param {boolean} options.autoClose - 인쇄 후 창 자동 닫기 여부 (기본값: true)
 * @param {Object} options.windowOptions - 새 창 옵션 (기본값: {width: 800, height: 600})
 */
export const printElement = (options = {}) => {
  const {
    selector,
    title = '인쇄',
    titleSelector = null,
    customStyles = '',
    autoClose = true,
    windowOptions = { width: 800, height: 600 }
  } = options;

  if (!selector) {
    console.error('PrintUtils: selector는 필수 매개변수입니다.');
    return;
  }

  // 인쇄할 요소 찾기
  const element = document.querySelector(selector);
  if (!element) {
    console.error(`PrintUtils: '${selector}' 요소를 찾을 수 없습니다.`);
    return;
  }

  // 제목 요소 찾기 (옵션)
  let documentTitle = title;
  if (titleSelector) {
    const titleElement = document.querySelector(titleSelector);
    if (titleElement) {
      documentTitle = titleElement.textContent || title;
    }
  }

  // 새 창 생성
  const { width, height } = windowOptions;
  const printWindow = window.open('', '_blank', `width=${width},height=${height}`);
  
  if (!printWindow) {
    console.error('PrintUtils: 팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.');
    return;
  }

  // 인쇄용 HTML 생성
  const printHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${documentTitle}</title>
      <meta charset="utf-8">
      <style>
        ${getDefaultPrintStyles()}
        ${customStyles}
      </style>
    </head>
    <body>
      <h2>${documentTitle}</h2>
      ${element.innerHTML}
    </body>
    </html>
  `;

  // 새 창에 HTML 작성
  printWindow.document.open();
  printWindow.document.write(printHTML);
  printWindow.document.close();

  // 로드 완료 후 인쇄
  printWindow.onload = () => {
    printWindow.print();
    if (autoClose) {
      printWindow.close();
    }
  };
};

/**
 * 모달 전용 인쇄 함수 (편의 함수)
 * @param {Object} options - 인쇄 옵션
 * @param {string} options.modalContentSelector - 모달 내용 셀렉터 (기본값: '.modal__content')
 * @param {string} options.modalTitleSelector - 모달 제목 셀렉터 (기본값: '.modal__title')
 * @param {string} options.title - 기본 제목 (기본값: '상세보기')
 * @param {string} options.customStyles - 추가 CSS 스타일
 */
export const printModal = (options = {}) => {
  const {
    modalContentSelector = '.modal__content',
    modalTitleSelector = '.modal__title',
    title = '상세보기',
    customStyles = '',
    ...restOptions
  } = options;

  printElement({
    selector: modalContentSelector,
    titleSelector: modalTitleSelector,
    title,
    customStyles,
    ...restOptions
  });
};

/**
 * 테이블 전용 인쇄 함수 (편의 함수)
 * @param {Object} options - 인쇄 옵션
 * @param {string} options.tableSelector - 테이블 셀렉터
 * @param {string} options.title - 문서 제목 (기본값: '테이블')
 * @param {string} options.customStyles - 추가 CSS 스타일
 */
export const printTable = (options = {}) => {
  const {
    tableSelector,
    title = '테이블',
    customStyles = `
      .md-table, .table {
        font-size: 11px;
      }
      .md-table th, .md-table td,
      .table th, .table td {
        padding: 6px;
      }
    `,
    ...restOptions
  } = options;

  printElement({
    selector: tableSelector,
    title,
    customStyles,
    ...restOptions
  });
};

/**
 * 현재 페이지 전체 인쇄 (기존 window.print() 대안)
 * @param {Object} options - 인쇄 옵션
 * @param {string} options.hideSelectors - 인쇄 시 숨길 요소들의 셀렉터 (쉼표로 구분)
 */
export const printPage = (options = {}) => {
  const { hideSelectors = '' } = options;

  if (hideSelectors) {
    // 임시로 요소들 숨기기
    const elementsToHide = document.querySelectorAll(hideSelectors);
    const originalDisplays = [];
    
    elementsToHide.forEach((element, index) => {
      originalDisplays[index] = element.style.display;
      element.style.display = 'none';
    });

    // 인쇄 실행
    window.print();

    // 원래 상태로 복원
    elementsToHide.forEach((element, index) => {
      element.style.display = originalDisplays[index];
    });
  } else {
    window.print();
  }
};

export default {
  printElement,
  printModal,
  printTable,
  printPage
};
