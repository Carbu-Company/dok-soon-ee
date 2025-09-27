export const getCarLoanList = async (params) => {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCarLoanList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    }).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getCarLoanList Error:", error); 
    return { success: false, data: [], error: error.message };
  }
};

export const getCarLoanSummary = async (params) => {
try {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCarLoanSummary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  }).then(res => res.json());
  return { success: true, data, error: null };
} catch (error) {
  console.error("getCarLoanSummary Error:", error);  
  return { success: false, data: [], error: error.message };
}
};
