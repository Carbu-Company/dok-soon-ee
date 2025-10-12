export const getCarAcctDetail = async (acctDtlSeq) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCarAcctDetail?acctDtlSeq=${acctDtlSeq}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('계좌 정보 조회에 실패했습니다.');
        }

        const data = await response.json();

        console.log("response", response);

        return data;
    } catch (error) {
        console.error('계좌 정보 조회 오류:', error);
        throw error;
    }
};
