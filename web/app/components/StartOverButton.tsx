"use client";

interface StartOverButtonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function StartOverButton({ className, style, children }: StartOverButtonProps) {
  const handleClick = () => {
    // Ensure the next view always starts from the top.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    if (window.location.pathname !== "/" || window.location.search || window.location.hash) {
      // Force a full document navigation to the app start.
      window.location.replace("/");
      return;
    }

    // Already on root: force a full page refresh.
    window.location.reload();
  };

  return (
    <button type="button" onClick={handleClick} className={className} style={style}>
      {children ?? "Start Over"}
    </button>
  );
}


