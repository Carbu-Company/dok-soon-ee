import { S3Client } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'

export async function POST(request) {
    try {
        // AWS S3 클라이언트 생성
        const s3Client = new S3Client({
            region: 'ap-northeast-2',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
        
        // 요청에서 파일명 가져오기
        const { searchParams } = new URL(request.url);
        const fileName = searchParams.get('file');
        
        if (!fileName) {
            return Response.json({ error: 'File name is required' }, { status: 400 });
        }

        const presignedPost = await createPresignedPost(s3Client, {
            Bucket: 'aibizimpage', // 임시 하드코딩
            Key: fileName,
            Expires: 60, // seconds
            Conditions: [
                ['content-length-range', 0, 52428800], //파일용량 50MB 까지 제한
            ],
        });

        return Response.json(presignedPost);
    } catch (error) {
        console.error('Image upload error:', error);
        return Response.json({ error: 'Failed to create upload URL' }, { status: 500 });
    }
}

// 다른 API 엔드포인트에서 NEXT_PUBLIC_API_URL 사용 예시
export async function GET() {
    try {
        // 내부 API 호출 시에는 API_URL을 사용 (NEXT_PUBLIC_ 접두사 없음)
        const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
        
        console.log('API URL:', apiUrl);
        
        return Response.json({ 
            message: 'API URL configured',
            apiUrl: apiUrl 
        });
    } catch (error) {
        console.error('API error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
} 