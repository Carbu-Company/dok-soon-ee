"use client";
import React, { useState } from "react";
import DetailModal from "@/components/modal/DetailModal";
import { printModal } from "@/components/utils/PrintUtils";

export default function DetailModalTrigger( props ) {
  const { car : carData } = props;
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handlePrint = () => {
    printModal({
      title: '제시(매입)차량 상세보기'
    });
  };

  return (
    <>
      <button type="button" className="btn btn--light" onClick={handleOpen}>
        <span className="ico ico--print"></span>
        인쇄
      </button>
      <DetailModal open={open} onClose={handleClose} onPrint={handlePrint} car={carData} />
    </>
  );
}


