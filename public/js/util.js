export function isValidResidentNumber(registNum) {
    // 1. 입력값 정제 (하이픈 제거)
    const cleanedNumber = registNum.replace(/-/g, '');
    
    // 2. 패턴 검사 (13자리 숫자인지 확인)
    if (cleanedNumber.length !== 13) {
      return false;
    }
    
    const numberArr = cleanedNumber.split('').map(Number);
    
    // 3. 성별 코드 확인 (7번째 자리)
    const genderCode = numberArr[6];
    if (![1, 2, 3, 4].includes(genderCode)) {
      return false;
    }
    
    // 4. 월과 일 유효성 검사
    const month = parseInt(cleanedNumber.slice(2, 4));
    const day = parseInt(cleanedNumber.slice(4, 6));
    
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    // 5. 체크섬 검증
    const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
    let sum = 0;
    
    for (let i = 0; i < 12; i++) {
      sum += numberArr[i] * weights[i];
    }
    
    const checkDigit = (11 - (sum % 11)) % 10;
    
    return numberArr[12] === checkDigit;
  }


export function isValidBusinessNumber(businessNumber) {
    // 1. 입력값 정제 (하이픈 제거)
    const cleanedNumber = businessNumber.replace(/-/g, '');
  
    // 2. 패턴 검사 (10자리 숫자인지 확인)
    if (cleanedNumber.length !== 10) {
      return false;
    }
  
    // 3. 숫자가 아닌 문자가 포함되어 있는지 검사
    if (!/^\d{10}$/.test(cleanedNumber)) {
      return false;
    }
  
    const numberArr = cleanedNumber.split('').map(Number);
  
    // 4. 검증 로직 구현 (국세청 공식)
    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5]; // 앞 9자리에 대한 가중치
  
    // 앞 9자리에 가중치를 곱해서 합계 계산
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += numberArr[i] * weights[i];
    }
    
    // 계산된 합에 마지막 자리 숫자를 더함
    sum += numberArr[9];
    
    // 총합을 10으로 나눈 나머지가 0이면 유효한 사업자등록번호
    return sum % 10 === 0;
  }
  

export function isValidCorporateNumber(corporateNumber) {
    // 1. 입력값 정제 (하이픈 제거)
    const cleanedNumber = corporateNumber.replace(/-/g, '');
  
    // 2. 패턴 검사 (13자리 숫자인지 확인)
    if (cleanedNumber.length !== 13) {
      return false;
    }
  
    const numberArr = cleanedNumber.split('').map(Number);
  
    // 3. 검증 로직 구현
    let sum = 0;
    const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2]; // 각 자리에 곱할 가중치
  
    for (let i = 0; i < weights.length; i++) {
      let temp = numberArr[i] * weights[i];
      // 곱한 결과가 10 이상이면 각 자리수를 더함
      if (temp >= 10) {
        temp = Math.floor(temp / 10) + (temp % 10);
      }
      sum += temp;
    }
  
    // 체크 디지트 계산
    const checkDigit = (10 - (sum % 10)) % 10;
  
    // 마지막 자리와 체크 디지트가 일치하는지 확인
    return numberArr[12] === checkDigit;
  }


  