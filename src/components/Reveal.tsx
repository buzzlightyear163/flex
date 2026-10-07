import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  id?: string;
  className?: string;
  children: ReactNode;
}

/** A <section> that fades/slides in the first time it enters the viewport. */
export function RevealSection({ id, className = 'section', children }: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('is-in');
            io.disconnect();
          }
        }),
      { threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section ref={ref} id={id} className={`${className} reveal`}>
      {children}
    </section>
  );
}
