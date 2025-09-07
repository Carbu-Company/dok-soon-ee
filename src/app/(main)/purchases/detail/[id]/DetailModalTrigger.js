"use client";
import React, { useState } from "react";
import DetailModal from "@/components/modal/DetailModal";

export default function DetailModalTrigger() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handlePrint = () => {
    // 실제 인쇄 기능은 필요에 따라 구현
    window.print();
  };

  return (
    <>
      <button type="button" className="btn btn--light" onClick={handleOpen}>
        <span className="ico ico--print"></span>
        인쇄
      </button>
      <DetailModal open={open} onClose={handleClose} onPrint={handlePrint} />
    </>
  );
}


