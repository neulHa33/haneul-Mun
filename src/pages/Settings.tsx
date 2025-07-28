import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">설정</h2>
        
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">애플리케이션 설정</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">API 구성</h4>
                <p className="text-sm text-gray-600">
                  기본 URL: <code className="bg-gray-100 px-2 py-1 rounded">http://www.braincoach.kr</code>
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">인증</h4>
                <p className="text-sm text-gray-600">
                  모든 API 요청에 대해 Bearer 토큰 인증이 활성화되어 있습니다.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">기능</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 페이지네이션이 있는 상품 목록</li>
                  <li>• 이미지 업로드가 있는 상품 생성</li>
                  <li>• 상품 편집 및 삭제</li>
                  <li>• 폼 검증 및 오류 처리</li>
                  <li>• Tailwind CSS를 사용한 반응형 디자인</li>
                  <li>• Bearer 토큰 인증</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 