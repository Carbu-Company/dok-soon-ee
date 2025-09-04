import React from "react";
import { X } from "lucide-react"; // 닫기 아이콘 (lucide-react 설치 필요)

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* 모달 컨테이너 */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-5xl mx-4 flex flex-col">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* 모달 내용 - overflow 적용 */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {children}
        </div>

        {/* 모달 푸터 - 고정 */}
        {footer && (
          <div className="p-4 border-t mt-auto">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
