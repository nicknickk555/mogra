"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { calculateScenarios, defaultParameters, ModelParameters, MoistureChart } from "../components/MoistureChart";

const fieldGroups: { title: string; fields: [keyof ModelParameters, string, string][] }[] = [
  { title: "Geometry & transfer", fields: [["L", "L", "mm"], ["kg", "k₍g₎", "m/s"], ["Ah", "A₍h₎", "m²"]] },
  { title: "Concentration", fields: [["C0", "C(0)", "kg/m³"], ["Cinf", "C∞", "kg/m³"], ["Ccrit", "Ccrit", "kg/m³"]] },
  { title: "Compost & air", fields: [["Dp", "D₍p₎", "m²/s"], ["Da", "D₍a₎ eff", "m²/s"], ["Ap", "A₍p₎", "m²"], ["Aa", "A₍a₎", "m²"]] },
];

export default function ExplorerPage() {
  const [parameters, setParameters] = useState<ModelParameters>(defaultParameters);
  const [activeFill, setActiveFill] = useState(0.5);
  const results = useMemo(() => calculateScenarios(parameters), [parameters]);
  const active = results.find((item) => item.fill === activeFill) ?? results[1];

  const update = (key:keyof ModelParameters, value:string) => {
    const parsed = Number(value);
    setParameters((current) => ({ ...current, [key]: Number.isFinite(parsed) ? parsed : 0 }));
  };

  return (
    <main className="site-shell explorer-screen">
      <header className="explorer-header panel">
        <div>
          <Link href="/" className="back-link">Yellow Target Intro</Link>
          <p className="eyebrow">Venturi Carpet Technology · Interactive Library</p>
          <h1>Moisture Gradient &amp; Pruning Point</h1>
          <p className="lede">One continuous workspace: model, live calculator, main conclusion and practical appendix.</p>
        </div>
        <nav className="section-nav" aria-label="Page sections"><a href="#model">Model</a><a href="#conclusion">Conclusion</a><a href="#appendix">Appendix</a></nav>
      </header>

      <section id="model" className="workspace-grid">
        <aside className="calculator panel">
          <h2 className="calculator-title">Calculator</h2>
          {fieldGroups.map((group) => <fieldset key={group.title}>
            <legend>{group.title}</legend>
            <div className="input-grid">
              {group.fields.map(([key, label, unit]) => <label key={key}>
                <span>{label}<small>{unit}</small></span>
                <input type="number" value={parameters[key]} step="any" onChange={(event) => update(key, event.target.value)} aria-label={`${label} in ${unit}`} />
              </label>)}
            </div>
          </fieldset>)}
          <button className="reset-button" onClick={() => setParameters(defaultParameters)}>Reset reference values</button>
          <div className="result-hero">
            <small>Primary result · {Math.round(active.fill * 100)}% fill</small>
            <strong>s* = {active.sstar.toFixed(2)} mm</strong>
            <span>{active.region} · J = {active.J.toExponential(3)}</span>
          </div>
        </aside>

        <div className="graph-panel panel">
          <div className="graph-head">
            <div><h2>Moisture gradient and pruning point</h2></div>
            <div className="scenario-tabs" role="tablist" aria-label="Fill scenario">
              {results.map((item, index) => <button key={item.fill} onClick={() => setActiveFill(item.fill)} className={activeFill === item.fill ? "active" : ""} style={{"--scenario": ["#16a062", "#2e9bd3", "#9557bd"][index]} as React.CSSProperties}>{Math.round(item.fill * 100)}% fill</button>)}
            </div>
          </div>
          <MoistureChart parameters={parameters} activeFill={activeFill} />
          <div className="result-cards">
            {results.map((item) => <button key={item.fill} onClick={() => setActiveFill(item.fill)} className={activeFill === item.fill ? "active" : ""}>
              <span>{Math.round(item.fill * 100)}% fill</span><strong>{item.sstar.toFixed(2)} mm</strong><small>{item.region}</small>
            </button>)}
          </div>
          <p className="chart-note"><span />The dashed threshold is C<sub>crit</sub>. Each dot marks where C(s*) = C<sub>crit</sub>; the highlighted curve follows the selected fill scenario.</p>
        </div>
      </section>

      <section className="formula-band panel" aria-labelledby="equations-title">
        <div className="formula-intro"><h2 id="equations-title">Resistance balance &amp; root cutoff</h2><p>The same flux J passes through porous compost, the air gap and the external transfer layer.</p></div>
        <div className="equation-grid">
          <article><small>Resistances</small><div className="equation">R<sub>p</sub> = <span className="frac"><i>ℓ<sub>f</sub></i><i>D<sub>p</sub>A<sub>p</sub></i></span>&nbsp; R<sub>a</sub> = <span className="frac"><i>L−ℓ<sub>f</sub></i><i>D<sub>a</sub><sup>eff</sup>A<sub>a</sub></i></span>&nbsp; R<sub>h</sub> = <span className="frac"><i>1</i><i>k<sub>g</sub>A<sub>h</sub></i></span></div></article>
          <article><small>Total flow</small><div className="equation">R<sub>tot</sub> = R<sub>p</sub> + R<sub>a</sub> + R<sub>h</sub><br/>J = <span className="frac"><i>C(0) − C<sub>∞</sub></i><i>R<sub>tot</sub></i></span></div></article>
          <article><small>Inside compost</small><div className="equation">s* = <span className="frac"><i>[C(0) − C<sub>crit</sub>] D<sub>p</sub>A<sub>p</sub></i><i>J</i></span>, &nbsp;s* ≤ ℓ<sub>f</sub></div></article>
          <article><small>Inside air gap</small><div className="equation">s* = ℓ<sub>f</sub> + <span className="frac"><i>[C(0) − C<sub>crit</sub> − JR<sub>p</sub>]D<sub>a</sub><sup>eff</sup>A<sub>a</sub></i><i>J</i></span></div></article>
        </div>
      </section>

      <section id="conclusion" className="conclusion panel">
        <div className="conclusion-copy"><h2>Geometry reshapes resistance.<br/>Venturi flow decides pruning.</h2><p>A near-horizontal shelf increases fill length ℓ<sub>f</sub> and porous resistance R<sub>p</sub>. The narrowing accelerates airflow, increasing k<sub>g</sub> and D<sub>a</sub><sup>eff</sup>, while reducing R<sub>a</sub> and R<sub>h</sub>.</p><div className="equation conclusion-equation">Sh = <span className="frac"><i>k<sub>g</sub>ℓ</i><i>D<sub>a</sub></i></span> ∼ a·Re<sup>m</sup>·Sc<sup>1/3</sup><br/>u<sub>eff</sub> ≈ <span className="frac"><i>u<sub>0</sub></i><i>cos θ</i></span></div></div>
        <div className="geometry-diagram" aria-label="Animated geometry influence diagram">
          <div className="shelf-label">Shelf → ℓ<sub>f</sub> ↑ · R<sub>p</sub> ↑</div>
          <div className="venturi-label">Venturi → u<sub>eff</sub> ↑ · R<sub>a</sub>, R<sub>h</sub> ↓</div>
          <div className="geometry-lines"><i/><i/><b/></div>
          <div className="balance-pill">usable balance → s* becomes predictable</div>
        </div>
      </section>

      <section id="appendix" className="appendix-section">
        <div className="section-title"><h2>Influence of geometry &amp; practical guidelines</h2></div>
        <div className="appendix-grid">
          <article className="panel"><span className="number">01</span><h3>Empty cone · f = 0</h3><p>R<sub>p</sub> = 0 and J is maximal. The concentration falls sharply through air; pruning is early and hard, close to the cone base.</p><strong>early · sharp · intense branching</strong></article>
          <article className="panel featured"><span className="number">02</span><h3>Half-filled · f = 0.5</h3><p>R<sub>p</sub>, R<sub>a</sub> and R<sub>h</sub> balance. The gradient softens and s* stays near the compost–air interface.</p><strong>balanced · optimal · readable</strong></article>
          <article className="panel"><span className="number">03</span><h3>Three-quarter · f = 0.75</h3><p>R<sub>p</sub> dominates and J decreases. Moisture remains high longer; pruning shifts outward and becomes softer.</p><strong>delayed · soft · smooth transition</strong></article>
        </div>
        <div className="guideline-grid">
          <article className="panel"><h3>Practical guidelines</h3><ul><li><b>Target fill:</b> aim for approximately 50%; let gravity settle the mix.</li><li><b>Texture:</b> use a friable, airy mix; avoid fines that raise tortuosity.</li><li><b>Airflow:</b> maintain gentle crossflow around the shell; keep the 8 mm aperture clear.</li><li><b>Monitoring:</b> look for dense, soft branching around the cone midsection.</li></ul></article>
          <article className="panel"><h3>When to deviate</h3><ul><li><b>Dry ambient:</b> increase fill toward 60% for a smoother gradient.</li><li><b>Humid ambient:</b> reduce fill to 20–30% for earlier pruning.</li><li><b>Sensitive species:</b> prefer 40–60% fill to avoid harsh desiccation.</li><li><b>Avoid overfilling:</b> 75%+ moves pruning too late for standard use.</li></ul></article>
          <article className="panel quick-check"><h3>Quick field check</h3><p>If the cone wall feels cool or damp beyond mid-height, reduce fill next cycle.</p><p>If white, bushy laterals form inside the cone volume, the target is in the optimal band.</p><div>Air, Angle, Root — One System.</div></article>
        </div>
      </section>

      <footer className="site-footer"><span>Venturi Carpet Technology</span><strong>The cone forms the target.</strong><Link href="/">Back to intro</Link></footer>
    </main>
  );
}
