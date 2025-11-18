export async function searchDealers(carAgent) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/getDealerList/?carAgent=${carAgent}`
      );
  
      if (!response.ok) {
        throw new Error(`API 응답 오류: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("딜러 검색 오류:", error);
      return [];
    }
  }
  
  export const calculateTax = async (carAgent) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/getDealerList/?carAgent=${carAgent}`
      );
      
      if (!response.ok) {
        throw new Error(`API 응답 오류: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("세액 계산 오류:", error);
      return [];
    }
  };
  
  export async function searchCD(grpCD) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/getCDList/?grpCD=${grpCD}`
      );
  
      if (!response.ok) {
        throw new Error(`API 응답 오류: ${response.status}`);
      }
  
      const data = await response.json();
  
      console.log(data);
      return data;
    } catch (error) {
      console.error("CD 검색 오류:", error);
      return [];
    }
  }
  
  export const getCashMgmtKey = async (agentId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/getCashMgmtKey?agentId=${agentId}`
      );

      if (!res.ok) {
        throw new Error("CASHMGTKEY를 불러오는데 실패했습니다");
      }
  
      const data = await res.json();
      return data.MgtKey;
    } catch (error) {
      console.error("CASHMGTKEY 불러오기 오류:", error);
      throw new Error(`CASHMGTKEY 불러오기에 실패했습니다: ${error.message}`);
    }
  };
  
  export const getTaxMgmtKey = async (agentId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/getTaxMgmtKey?agentId=${agentId}`
      );

      if (!res.ok) {
        throw new Error("TAXMGTKEY를 불러오는데 실패했습니다");
      }
  
      const data = await res.json();
      return data.MgtKey;
    } catch (error) {
      console.error("TAXMGTKEY 불러오기 오류:", error);
      throw new Error(`TAXMGTKEY 불러오기에 실패했습니다: ${error.message}`);
    }
  };
  