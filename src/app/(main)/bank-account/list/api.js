export const getCarAcctList = async (params) => {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCarAcctList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      }).then(res => res.json());
      return { success: true, data, error: null };
    } catch (error) {
      console.error("getCarAcctList Error:", error); 
      return { success: false, data: [], error: error.message };
    }
  };
  
  export const getCarAcctSummary = async (params) => {
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCarAcctSummary`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
        }).then(res => res.json());
        return { success: true, data, error: null };
    } catch (error) {
        console.error("getCarAcctSummary Error:", error);  
        return { success: false, data: [], error: error.message };
    }
  };
  
  /** 계좌 정보 조회 */
  export const getAgentAcctList = async (agentId) => {
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getAgentAcctList?agentId=${agentId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
        }).then(res => res.json());
        return { success: true, data, error: null };
    } catch (error) {
        console.error("getAgentAcctList Error:", error);
        return { success: false, data: [], error: error.message };
    }
  };
