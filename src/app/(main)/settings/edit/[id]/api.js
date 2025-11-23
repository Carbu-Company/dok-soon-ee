  export const getAgentInfo = async (agentId) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getAgentInfo?agentId=${agentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('상사 정보 조회에 실패했습니다.');
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('상사 정보 조회 오류:', error);
        throw error;
    }
};

export const updateAgentInfo = async (data) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/updateAgentInfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('상사 수정 오류:', error);
        throw error;
    }
};