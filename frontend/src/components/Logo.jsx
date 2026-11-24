// Parking-sign style mark: ink square, yellow "P"
export default function Logo({ size = 32, withText = true }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className="inline-flex items-center justify-center rounded-[4px] bg-ink text-accent font-extrabold leading-none"
        style={{ width: size, height: size, fontSize: size * 0.62 }}
      >
        P
      </span>
      {withText && <span className="font-bold text-lg tracking-tight">Smart Park</span>}
    </span>
  );
}
