export default function RomaSkyline({ className }: { className?: string }) {
  const arches = Array.from({ length: 11 }, (_, i) => 280 + i * 28);
  return (
    <svg viewBox="0 0 900 290" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <path d="M0 218q80-13 135-10t109 3q54-12 116-7t147 7q61-17 152-12t241-14v105H0Z" fill="var(--roma-terracotta)" opacity=".28" />
      <g opacity=".72" fill="#49281e">
        <path d="M0 245v-24h19v-28h31v22h37v-39h21v-22h37v24h58v36h44v-27h36v59Z" />
        <path d="M122 204v-41q8-31 31-38v-13h4v13q25 7 34 38v45Z" />
        <path d="M630 245v-62h32v-23h27v14h26v-39h28v37h33v-14h32v43h29v-25h27v33h36v78Z" />
        <path d="M737 185v-36q-1-38 38-55l3-13 3 13q38 17 37 55v36Z" />
      </g>

      <path d="M251 243v-97l15-10v-13l39-14 52-5 46 5v8l51 10 20 16 88 16 35 19v71Z" fill="#392119" />
      <g fill="none" stroke="#ab6c3d" strokeOpacity=".6" strokeWidth="2">
        <path d="M254 154q72-21 154-14l171 40M253 183q71-21 162-13l180 37M253 215q70-19 161-9l181 28" />
        {arches.map((x, index) => {
          const y = 185 + Math.max(index - 4, 0) * 4;
          return <path key={x} d={`M${x} ${y}v-13q7-11 14 0v13m-14 26v-13q7-11 14 0v13`} />;
        })}
      </g>
      <g fill="#201412">
        {[74, 817, 865].map((x, i) => (
          <path key={x} d={`M${x} 252v-${82 - i * 7}q-31 5-46-9-6-16 19-25 29-16 50-7 37-2 45 18 0 24-61 24v82Z`} />
        ))}
        <path d="M0 248q146-21 272-12 114-10 249 5 174-12 379-5v55H0Z" />
      </g>
    </svg>
  );
}
