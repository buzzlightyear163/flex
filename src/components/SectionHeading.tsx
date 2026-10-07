interface Props {
  kick: string;
  title: string;
  titleDim?: string;
  sub?: string;
}

export function SectionHeading({ kick, title, titleDim, sub }: Props) {
  return (
    <>
      <div className="kick">{kick}</div>
      <h2 className="section__title">
        {title}
        {titleDim && (
          <>
            {' '}
            <span>{titleDim}</span>
          </>
        )}
      </h2>
      {sub && <p className="section__sub">{sub}</p>}
    </>
  );
}
