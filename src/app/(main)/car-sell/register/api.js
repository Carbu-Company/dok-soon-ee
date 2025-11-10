export const getCarPurInfo = async (carRegId) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCarPurInfo?carRegId=${carRegId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('매입차량 정보 조회에 실패했습니다.');
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('매입차량 정보 조회 오류:', error);
        throw error;
    }
};


export const getAgentTradeItemInfo = async (agentId) => {
    try {

        let tradeSctCd = '';
        let tradeItemCd = '';

        // 상사 매도비 값
        tradeSctCd = '1';
        tradeItemCd = '102';

        const response1 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getAgentTradeItemInfo?agentId=${agentId}&tradeSctCd=${tradeSctCd}&tradeItemCd=${tradeItemCd}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response1.ok) {
            throw new Error('상사 매입비 정보 조회에 실패했습니다.');
        }

        const data1 = await response1.json();


        // 성능보험료 값 
        tradeSctCd = '1';
        tradeItemCd = '103';

        const response2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getAgentTradeItemInfo?agentId=${agentId}&tradeSctCd=${tradeSctCd}&tradeItemCd=${tradeItemCd}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response2.ok) {
            throw new Error('상사 성능보험료 정보 조회에 실패했습니다.');
        }

        const data2 = await response2.json();

        return {
            selCost: data1.TRADE_ITEM_AMT || 0,                       // 상사매도비
            perfInfeAmt: data2.TRADE_ITEM_AMT || 0,                    // 성능보험료
        };
    } catch (error) {
        console.error('매입차량 정보 조회 오류:', error);
        throw error;
    }
};
