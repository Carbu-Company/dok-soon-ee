export const getCarTaxList = async (params) => {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCarTaxList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      }).then(res => res.json());
      return { success: true, data, error: null };
    } catch (error) {
      console.error("getCarTaxList Error:", error); 
      return { success: false, data: [], error: error.message };
    }
  };

export const getCarTaxSummary = async (params) => {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCarTaxSummary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    }).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getCarTaxSummary Error:", error);  
    return { success: false, data: [], error: error.message };
  }
};
