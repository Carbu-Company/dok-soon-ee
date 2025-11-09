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
  
  export const getMgtKey = async (carAgent) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/getMgtKey?carAgent=${carAgent}`
      );
  
      if (!res.ok) {
        throw new Error("MGTKEY를 불러오는데 실패했습니다");
      }
  
      const data = await res.json();
      return data.MgtKey;
    } catch (error) {
      console.error("MGTKEY 불러오기 오류:", error);
      throw new Error(`MGTKEY 불러오기에 실패했습니다: ${error.message}`);
    }
  };
  