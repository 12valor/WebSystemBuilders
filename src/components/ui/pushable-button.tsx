"use client";

import React from "react";
import Link from "next/link";

interface PushableButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function PushableButton({
  children,
  href,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: PushableButtonProps) {
  const content = (
    <>
      <span className="shadow" />
      <span className="edge" />
      <span className="front">{children}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`pushable ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`pushable ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`}
    >
      {content}
    </button>
  );
}

export default PushableButton;
