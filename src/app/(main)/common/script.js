// 취득세 계산산식

export const getAcqTax = (carPrice, carKndCd) => {

    // 상사매입취득세 기준금액
	const DEALER_PURCHASE_TAX_THRESHOLD = 28571428;
    // 문자열로 된 금액을 숫자로 변환
    carPrice = parseInt(carPrice.replace(/,/g, ''), 10) || 0;

    // 취득세 변수
    let taxAmount = 0;
    let taxRate = 0;

    if (carKndCd === '001') {
        taxRate = 0.07;
    } else {
        taxRate = 0.05;
    }

	// 상사매입 차량인 경우만 계산, 기준금액 체크
	if (parseInt(carPrice, 10) > DEALER_PURCHASE_TAX_THRESHOLD) {

        if (carPrice * taxRate > 2000000) {
            taxAmount = (carPrice * taxRate) * 0.15;
        }

		taxAmount = Math.floor(taxAmount / 10) * 10; // 원단위 절사

	} else {
		taxAmount = 0;
	}

    return taxAmount;

    //return taxAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const autoHypenSNO = (obj) => {
    obj.value = obj.value.replace(/[^0-9]/g, "");
    obj.value = obj.value.replace(/([0-9]{6})-?/, "$1-");
}

export const autoHypenBizNO = (obj) => {
    obj.value = obj.value.replace(/[^0-9]/g, "");
    obj.value = obj.value.replace(/([0-9]{3})-?/, "$1-");
    obj.value = obj.value.replace(/([0-9]{3})-?([0-9]{2})-?/, "$1-$2-");
}

export const autoHypenTelNo = (value) => {
    // Only add hyphens, do not update DOM elements (unlike the reference).
    let num = value.replace(/[^0-9]/g, "");
    // To cover cases like 02-xxxx-xxxx, 01x-xxx(x)-xxxx, 0xx-xxx(x)-xxxx
    let reg = /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/;
    if(num.length < 4) {
        return num;
    } else if(num.length < 7) {
        // Not enough digits for area+num+4
        if(num.startsWith("02")) {
            // 서울 국번, 02-xxx(-xxxx)
            return num.replace(/(^02)(\d{0,3})/, "$1-$2");
        } else {
            // 휴대폰 또는 지방 국번, 010-xxx
            return num.replace(/(^01.{1}|[0-9]{3})(\d{0,3})/, "$1-$2");
        }
    } else if(num.length < 11) {
        // 10자리번호, 형식맞추기
        return num.replace(reg, "$1-$2-$3");
    } else {
        // 11자리번호
        return num.replace(reg, "$1-$2-$3");
    }
}


/**
 * 사업자등록번호(예: 123-45-67890)에 자동으로 하이픈을 추가합니다.
 * @param {Object} obj - value 프로퍼티(문자열)를 가진 input 또는 유사 객체
 */


/*
export const autoHypenBizNO = (obj) => {
    let value = obj.value.replace(/[^0-9]/g, "");
    if (value.length < 4) {
        obj.value = value;
    } else if (value.length < 6) {
        obj.value = value.replace(/(\d{3})(\d{1,2})/, "$1-$2");
    } else {
        obj.value = value
            .replace(/(\d{3})(\d{2})(\d{0,5})/, "$1-$2-$3")
            .replace(/(-)$/, ""); // 끝에 하이픈이 남으면 제거
    }
}

*/