export const getTradeIssueList = async (params) => {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getTradeIssueList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    }).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getTradeIssueList Error:", error); 
    return { success: false, data: [], error: error.message };
  }
};

export const getTradeIssueSummary = async (params) => {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getTradeIssueSummary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    }).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getTradeIssueSummary Error:", error);  
    return { success: false, data: [], error: error.message };
  }
};
