export const getCarTaxIssueInfo = async (carRegId) => {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCarTaxIssueInfo?carRegId=${carRegId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(res => res.json());
      return { success: true, data, error: null };
    } catch (error) {
      console.error("getCarTaxIssueInfo Error:", error); 
      return { success: false, data: [], error: error.message };
    }
  };
  
  export const getTaxIssueInfo = async (tradeSeq) => {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getTaxIssueInfo?tradeSeq=${tradeSeq}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(res => res.json());
      return { success: true, data, error: null };
    } catch (error) {
      console.error("getTaxIssueInfo Error:", error);  
      return { success: false, data: [], error: error.message };
    }
  };
  