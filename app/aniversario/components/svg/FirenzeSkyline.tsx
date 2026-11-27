export default function FirenzeSkyline({ className, fill }: { className?: string; fill: string }) {
  return (
    <svg viewBox="0 0 760 242" className={className} preserveAspectRatio="xMidYMax meet" aria-hidden>
      <path d="M0 169Q58 133 101 145t104 5q31-22 84-15 62 9 104 30 39-24 92-24 66-21 128 6 59-21 147-3v98H0Z" fill={fill} opacity=".29" />
      <path d="M0 194q49-4 103-22t109 6 101-13q77 5 126 19t136-8 185 12v54H0Z" fill={fill} opacity=".48" />
      <g fill={fill} strokeLinejoin="round">
        <path d="M0 212h28v-19l19-13 18 9h34v-42l15-9 29 2 20 14v26h40v-19l17-9 26 9v19h25v-27h73v19h15v-17h36v-11l32-17 18 12v22h29v-11l25-12 31 12v20h21v-25l21-15 36 18v21h14v-47l22-15 35 20v29h35v-15l34-12 18 11v67H0Z" />
        {/* Palazzo Vecchio tower and crenellations. */}
        <path d="M201 178v-39h40V90h-5V77h5v-6h7v5h5v-5h7v5h5v-5h6v9h5v10h-5v49h17v44Z" />
        {/* Campanile and Brunelleschi's dome from across the Arno. */}
        <path d="M475 206V99h-4V88h7V78h7v7h14v-7h8v8h7v13h-5v107Z" />
        <path d="M300 205V127h43v-15q14-60 56-76V25h-5l9-10 5-15 6 15 9 10h-5v11q43 16 57 76v15h49v78Z" />
      </g>
      <g fill="none" stroke="#d68a65" strokeWidth="1.7" strokeOpacity=".8">
        <path d="M348 115h123M345 125h130M302 143h219M302 149h219M354 110q17-59 46-73m-22 74q6-57 25-75m42 75q-6-57-25-75m47 74q-17-59-46-73M401 37h16" />
        <path d="M478 109h27m-27 25h27m-27 29h27m-27 25h27m-26-34v-10q4-7 8 0v10m5 0v-10q4-7 8 0v10" />
        <path d="M124 162h18m-21 14h20m224-7q4-8 8 0v18h-8Zm42 0q4-8 8 0v18h-8Zm40 0q4-8 8 0v18h-8ZM249 91h14m-14 24h14" />
      </g>
      <path d="M0 221q53-19 112-12t123 5q68-10 124-3t118 0q67-16 133 0t150-4v35H0Z" fill={fill} />
      <path d="M0 233q59-5 143 0m412-1q108-9 205-3" fill="none" stroke="#d68a65" opacity=".55" />
    </svg>
  );
}
