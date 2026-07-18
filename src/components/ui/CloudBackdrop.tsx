export default function CloudBackdrop({ className = "" }: { className?: string }) {
  return (
    <div className={`cloud-field ${className}`} aria-hidden="true">
      <span className="cloud-ribbon cloud-ribbon-one" />
      <span className="cloud-ribbon cloud-ribbon-two" />
      <span className="cloud-ribbon cloud-ribbon-three" />
      <span className="cloud-haze" />
    </div>
  );
}
