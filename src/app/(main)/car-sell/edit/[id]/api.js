  export const getCarSellInfo = async (mgtKey) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCarSellDetail?carRegId=${mgtKey}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('매도차량 정보 조회에 실패했습니다.');
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('매도차량 정보 조회 오류:', error);
        throw error;
    }
};

export const updateCarSell = async (data) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/updateCarSell`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('매도차량 수정 오류:', error);
        throw error;
    }
};