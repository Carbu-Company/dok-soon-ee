export const getCashIssueInfo  = async (tradeSeq) => {
    try {


        console.log('tradeSeq******************', tradeSeq);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCashIssueInfo?tradeSeq=${tradeSeq}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('현금영수증 발행을 위한 정보 조회에 실패했습니다.');
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('현금영수증 발행을 위한 정보 조회 오류:', error);
        throw error;
    }
};
