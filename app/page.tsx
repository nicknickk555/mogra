import Link from "next/link";
import { MoistureChart, defaultParameters } from "./components/MoistureChart";

const miniMetrics = [
  ["0%", "open cone", "early / sharp"],
  ["50%", "working target", "balanced"],
  ["75%", "strong target", "late / soft"],
];

export default function Home() {
  return (
    <main className="site-shell intro-screen">
      <header className="library-header">
        <div>
          <p className="eyebrow">Venturi Carpet Technology · Interactive Library</p>
          <h1>Yellow Target Intro</h1>
          <p className="lede">
            Full cone filling is not the objective. A readable biological target forms
            when compost contact, air access and drying potential reach a useful balance.
          </p>
        </div>
        <div className="page-stamp"><strong>INTRO</strong><span>YTI v1.1</span></div>
        <nav className="crumbs" aria-label="Learning path">
          <span>Cone Interface</span><b>→</b><span className="active">Ruby Target</span><b>→</b><span>Moisture Explorer</span>
        </nav>
      </header>

      <section className="intro-grid panel">
        <div className="target-visual" aria-label="Half-filled cone and ruby target">
          <div className="visual-caption">
            <span>50% interface · working biological target</span>
            <strong>Ruby quality determines pruning potential</strong>
          </div>
          <div className="cone-stage">
            <div className="ruby"><i /></div>
            <div className="target-ring"><span>target</span></div>
            <div className="cone">
              <div className="soil" />
              <div className="fill-line">50%</div>
            </div>
            <div className="air-lines"><i /><i /></div>
          </div>
          <p className="diagram-note">partial fill → interface balance → readable biological target</p>
          <div className="fill-scale">
            <span><i className="green" />0% — open</span>
            <span><i className="blue" />50% — working</span>
            <span><i className="purple" />75% — strong</span>
          </div>
        </div>

        <div className="intro-copy">
          <p className="eyebrow">50% interface · working biological target</p>
          <h2>Partial fill creates the working target.</h2>
          <p>
            Compost contact, airflow and drying potential begin to balance before the
            cone is full. The ruby marks the moment the interface becomes readable for
            the root — before physical contact.
          </p>
          <div className="logic-strip">partial fill → compost / air balance → usable ruby target</div>
          <div className="tag-row"><span>air gap</span><span>compost contact</span><span>ruby target</span><span>no 100% requirement</span></div>
          <aside className="logic-callout">
            <small>VCT target logic</small>
            <p><strong>Full cone filling is not the objective.</strong> Air-Pot fills the cone. VCT forms the target.</p>
          </aside>

          <div className="metric-row">
            {miniMetrics.map(([value, label, result]) => (
              <div key={value} className={value === "50%" ? "selected" : ""}>
                <strong>{value}</strong><span>{label}</span><small>{result}</small>
              </div>
            ))}
          </div>

          <div className="preview-chart">
            <div className="section-kicker"><strong>Target scenario reference</strong><span>calculation intro</span></div>
            <MoistureChart parameters={defaultParameters} activeFill={0.5} compact />
          </div>

          <div className="enter-strip">
            <div><small>FINISH FRAME →</small><strong>The cone forms the target, not a storage pocket.</strong></div>
            <Link className="enter-button" href="/explorer">Enter <span>→</span></Link>
          </div>
        </div>
      </section>

      <section className="principles" aria-label="Core concepts">
        <article><span className="principle-icon cone-icon" /><div><h3>Cone Interface</h3><p>Boundary layer where compost contact, air access and drying potential meet.</p><code>I<sub>cone</sub> = contact + air gap + gradient</code></div></article>
        <article><span className="principle-icon ruby-icon" /><div><h3>Ruby Indicator</h3><p>A diagnostic marker showing when the target becomes readable before contact.</p><code>Ruby ↑ = readability ↑</code></div></article>
        <article><span className="principle-icon ring-icon" /><div><h3>Target Formation</h3><p>The target forms when resistance, moisture transfer and pruning potential balance.</p><code>Target = R + M + A</code></div></article>
        <article><span className="principle-icon branch-icon" /><div><h3>Pruning Potential</h3><p>The programmed interface has already defined the future pruning point.</p><code>P<sub>prune</sub> ∝ target quality</code></div></article>
      </section>
    </main>
  );
}
