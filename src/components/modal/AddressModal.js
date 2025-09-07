"use client";

// 다음 우편번호 서비스 스크립트 로드 함수
export function loadPostcodeScript() {
  return new Promise((resolve, reject) => {
    if (window.daum && window.daum.Postcode) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('다음 우편번호 스크립트 로드 실패'));
    document.head.appendChild(script);
  });
}

// 다음 우편번호 검색 함수
export function openPostcodeSearch(callback) {
  loadPostcodeScript().then(() => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        const fullAddress = data.roadAddress || data.jibunAddress;
        const zonecode = data.zonecode;
        
        if (callback && typeof callback === 'function') {
          callback({
            zonecode: zonecode,
            address: fullAddress,
            roadAddress: data.roadAddress,
            jibunAddress: data.jibunAddress
          });
        }
      },
      width: '100%',
      height: '100%'
    }).open();
  }).catch((error) => {
    console.error('우편번호 검색 오류:', error);
    alert('우편번호 검색 서비스를 불러올 수 없습니다.');
  });
}