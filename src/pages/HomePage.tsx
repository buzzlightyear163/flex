import { Hero } from '../components/hero/Hero';
import { Tape } from '../components/Tape';
import { SplitLoop } from '../components/SplitLoop';
import { AnswerCards } from '../components/AnswerCards';
import { Cortex } from '../components/Cortex';
import { Playground } from '../components/Playground';
import { ModelToken } from '../components/ModelToken';
import { Faq } from '../components/Faq';
import { useBrainFeed } from '../hooks/useBrainFeed';
import { useHashScroll } from '../hooks/useHashScroll';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { site } from '../data/site';

export function HomePage() {
  const { state, rows, tape, latest, decisions, skew } = useBrainFeed();
  useHashScroll();
  useDocumentTitle(`${site.name} · ${site.slogan}`);
  return (
    <main>
      <Hero state={state} decisions={decisions} />
      <Tape rows={tape} />
      <div className="wrap">
        <SplitLoop />
        <AnswerCards feed={latest} />
        <Cortex state={state} rows={rows} skew={skew} />
        <Playground />
        <ModelToken facts={state?.model ?? null} />
        <Faq />
      </div>
    </main>
  );
}
