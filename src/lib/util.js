export function isValidResidentNumber(registNum) {
    // 1. 입력값 정제 (하이픈 제거)
    const cleanedNumber = registNum.replace(/-/g, '');
    
    // 2. 패턴 검사 (13자리 숫자인지 확인)
    if (cleanedNumber.length !== 13) {
      return false;
    }
    
    const numberArr = cleanedNumber.split('').map(Number);
    
    // 3. 성별 코드 확인 (7번째 자리)
    const genderCode = numberArr[6];
    if (![1, 2, 3, 4].includes(genderCode)) {
      return false;
    }
    
    // 4. 월과 일 유효성 검사
    const month = parseInt(cleanedNumber.slice(2, 4));
    const day = parseInt(cleanedNumber.slice(4, 6));
    
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    // 5. 체크섬 검증
    const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
    let sum = 0;
    
    for (let i = 0; i < 12; i++) {
      sum += numberArr[i] * weights[i];
    }
    
    const checkDigit = (11 - (sum % 11)) % 10;
    
    return numberArr[12] === checkDigit;
  }



export function isValidCorporateNumber(corporateNumber) {
    // 1. 입력값 정제 (하이픈 제거)
    const cleanedNumber = corporateNumber.replace(/-/g, '');
  
    // 2. 패턴 검사 (13자리 숫자인지 확인)
    if (cleanedNumber.length !== 13) {
      return false;
    }
  
    const numberArr = cleanedNumber.split('').map(Number);
  
    // 3. 검증 로직 구현
    let sum = 0;
    const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2]; // 각 자리에 곱할 가중치
  
    for (let i = 0; i < weights.length; i++) {
      let temp = numberArr[i] * weights[i];
      // 곱한 결과가 10 이상이면 각 자리수를 더함
      if (temp >= 10) {
        temp = Math.floor(temp / 10) + (temp % 10);
      }
      sum += temp;
    }
  
    // 체크 디지트 계산
    const checkDigit = (10 - (sum % 10)) % 10;
  
    // 마지막 자리와 체크 디지트가 일치하는지 확인
    return numberArr[12] === checkDigit;
  }




export function checkBizID(bizID) {
  // bizID는 숫자만 10자리로 해서 문자열로 넘김
  const checkID = [1, 3, 7, 1, 3, 7, 1, 3, 5, 1];
  let chkSum = 0;
  
  // 하이픈 제거
  bizID = bizID.replace(/-/gi,'');

  // 앞 8자리 검증
  for (let i = 0; i <= 7; i++) {
    chkSum += checkID[i] * parseInt(bizID.charAt(i));
  }

  // 9번째 자리 검증
  const c2 = String(checkID[8] * parseInt(bizID.charAt(8))).padStart(2, '0');
  chkSum += parseInt(c2.charAt(0)) + parseInt(c2.charAt(1));

  // 검증 결과 확인
  const remainder = (10 - (chkSum % 10)) % 10;
  
  return parseInt(bizID.charAt(9)) === remainder;
}


import imageCompression from 'browser-image-compression';

// 이미지 업로드 함수
export const handleImageUpload = async (file, idx, currentImageUrls, onUpdateImageUrls) => {
    try {
        if (!file) return;
        
        let processedFile = file;
        
        // 이미지 파일인 경우 압축 시도
        if (file.type.startsWith('image/')) {
            try {
                const options = {
                    maxSizeMB: 10, // 최대 10MB로 압축
                    maxWidthOrHeight: 1920, // 최대 해상도 1920px
                    useWebWorker: true
                };
                
                console.log('원본 파일 크기:', (file.size / 1024 / 1024).toFixed(2), 'MB');
                processedFile = await imageCompression(file, options);
                console.log('압축 후 파일 크기:', (processedFile.size / 1024 / 1024).toFixed(2), 'MB');
                
                if (processedFile.size < file.size) {
                    alert(`이미지가 압축되었습니다. (${(file.size / 1024 / 1024).toFixed(2)}MB → ${(processedFile.size / 1024 / 1024).toFixed(2)}MB)`);
                }
            } catch (compressionError) {
                console.warn('이미지 압축 실패, 원본 파일 사용:', compressionError);
                processedFile = file;
            }
        }
        
        // 파일 크기 체크 (50MB = 52428800 bytes)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (processedFile.size > maxSize) {
            alert(`파일 크기가 너무 큽니다. 최대 50MB까지 업로드 가능합니다. (현재: ${(processedFile.size / 1024 / 1024).toFixed(2)}MB)`);
            return;
        }
        
        const filename = encodeURIComponent(processedFile.name || file.name);
        
        // 1. Presigned URL 가져오기
        let res = await fetch('/api/imageUpload?file=' + filename, {
            method: 'POST'
        });
        
        if (!res.ok) {
            throw new Error('Failed to get upload URL');
        }
        
        const uploadData = await res.json();
        console.log('Upload Data:', uploadData);
        
        // 2. S3에 파일 업로드
        const formData = new FormData();
        Object.entries(uploadData.fields).forEach(([key, value]) => {
            formData.append(key, value);
        });
        formData.append('file', processedFile);
        
        console.log('Uploading to S3 with form data:', formData);
        
        const uploadRes = await fetch(uploadData.url, {
            method: 'POST',
            body: formData,
        });
        
        console.log('Upload response status:', uploadRes.status);
        
        if (uploadRes.ok) {
            // S3 업로드 후 실제 파일 URL 구성
            const bucketName = 'aibizimpage'; // 임시 하드코딩
            const region = 'ap-northeast-2';
            // AWS SDK v3에서는 key가 fields에 없을 수 있음
            const key = uploadData.fields.key || uploadData.key || filename;
            
            console.log('Bucket:', bucketName, 'Region:', region, 'Key:', key);
            
            const imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
            
            console.log('Final image URL:', imageUrl);
            
            // 이미지 URL 업데이트 (콜백 함수 호출)
            const newImageUrls = [...currentImageUrls];
            newImageUrls[idx] = imageUrl;
            onUpdateImageUrls(newImageUrls);
            
            //alert('이미지 업로드가 완료되었습니다.');
            return imageUrl;
        } else {
            const errorText = await uploadRes.text();
            console.error('Upload failed:', errorText);
            throw new Error('Failed to upload image');
        }
    } catch (error) {
        console.error('Image upload error:', error);
        //alert('이미지 업로드에 실패했습니다.');
        throw error;
    }
};

