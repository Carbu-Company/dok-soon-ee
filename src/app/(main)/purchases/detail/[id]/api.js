export const getSuggestOne = async (car_regid) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getSuggestDetailNew?car_regid=${car_regid}`, {
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


/* 재고금융 이용 현황 */
export const getInventoryFinanceStatus = async (agent_id) => {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getInventoryFinanceStatus?agent_id=${agent_id}`).then(res => res.json());
      return { success: true, data, error: null };
    } catch (error) {
      console.error("재고금융 조회 오류:", error);
      return { success: false, data: [], error: error.message };
    }
  };