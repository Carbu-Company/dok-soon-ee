export const getCarBrkTradeInfo  = async (brkTradeSeq) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCarBrkTradeInfo?brkTradeSeq=${brkTradeSeq}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('알선 정보 조회에 실패했습니다.');
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('알선 정보 조회 오류:', error);
        throw error;
    }
};

export const updateCarBrkTrade = async (data) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/updateCarBrkTrade`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('알선 수정 오류:', error);
        throw error;
    }
};