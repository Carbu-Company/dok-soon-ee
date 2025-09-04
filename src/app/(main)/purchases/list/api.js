export const getDealerList = async (carAgent) => {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getDealerList?carAgent=${carAgent}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getDealerList Error:", error);
    return { success: false, data: [], error: error.message };
  }
};


export const getPurchasesListNew = async (params) => {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getSuggestListNew`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      }).then(res => res.json());
      return { success: true, data, error: null };
    } catch (error) {
      console.error("getPurchasesListNew Error:", error);
      return { success: false, data: [], error: error.message };
    }
  };
