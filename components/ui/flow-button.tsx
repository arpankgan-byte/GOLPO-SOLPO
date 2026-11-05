'use client';

import { ArrowRight } from 'lucide-react';

type FlowButtonProps = {
  text?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
};

export function FlowButton({ text = 'Modern Button', onClick, type = 'button' }: FlowButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="group relative flex cursor-pointer items-center gap-1 overflow-hidden rounded-full border-[1.5px] border-[#333333]/40 bg-transparent px-8 py-3 text-sm font-semibold text-[#111111] transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-xl hover:border-transparent hover:text-white active:scale-95"
    >
      <ArrowRight className="absolute left-[-25%] z-10 h-4 w-4 stroke-[#111111] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:left-4 group-hover:stroke-white" aria-hidden="true" />
      <span className="relative z-10 -translate-x-3 transition-transform duration-[800ms] ease-out group-hover:translate-x-3">{text}</span>
      <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#111111] opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:h-[220px] group-hover:w-[220px] group-hover:opacity-100" aria-hidden="true" />
      <ArrowRight className="absolute right-4 z-10 h-4 w-4 stroke-[#111111] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:right-[-25%] group-hover:stroke-white" aria-hidden="true" />
    </button>
  );
}
