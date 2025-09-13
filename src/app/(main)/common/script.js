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


