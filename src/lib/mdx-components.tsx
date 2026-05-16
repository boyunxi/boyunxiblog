import Image from "next/image";
import Link from "next/link";

function CustomImage({ src, alt }: React.ImgHTMLAttributes<HTMLImageElement>) {
  if (!src) return null;
  if (src.startsWith("http")) {
    return (
      <span className="block my-8">
        <img src={src} alt={alt || ""} className="max-w-full rounded" />
      </span>
    );
  }
  return (
    <span className="block my-8">
      <Image src={src} alt={alt || ""} width={800} height={450} className="max-w-full rounded" />
    </span>
  );
}

function CustomLink({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (!href) return <a {...props}>{children}</a>;
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

function Callout({ type = "info", children }: { type?: "info" | "warning" | "error"; children: React.ReactNode }) {
  const borderColor = {
    info: "rgba(var(--gold-rgb),0.3)",
    warning: "#e5a000",
    error: "#e04040",
  }[type];
  const bgColor = {
    info: "rgba(var(--gold-rgb),0.05)",
    warning: "rgba(229,160,0,0.08)",
    error: "rgba(224,64,64,0.08)",
  }[type];
  return (
    <div
      className="my-6 px-5 py-4 rounded-sm text-sm"
      style={{ borderLeft: `3px solid ${borderColor}`, background: bgColor }}
    >
      {children}
    </div>
  );
}

export const mdxComponents = {
  img: CustomImage as any,
  a: CustomLink as any,
  Callout,
};
