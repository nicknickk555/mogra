"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MoistureChart, defaultParameters } from "./components/MoistureChart";

const stages = [
  {
    nav: "Cone Interface",
    code: "01 / BOUNDARY FIELD",
    eyebrow: "The programmed interface begins here",
    title: "The cone is not a pocket. It is an interface.",
    text: "The outer cone creates a live boundary where compost contact, air access and drying potential meet. Before a root arrives, the geometry has already shaped its future path.",
    formula: "I_cone = compost contact + air gap + drying gradient",
    tags: ["air-side signal", "porous contact", "future pruning band"],
    action: "Activate Ruby Target",
  },
  {
    nav: "Ruby Target",
    code: "02 / BIOLOGICAL SIGNAL",
    eyebrow: "50% interface · working biological target",
    title: "Partial fill creates the working target.",
    text: "At partial fill, compost contact, airflow and drying potential enter a readable balance. The ruby appears before physical contact: a signal that the target is ready for the root.",
    formula: "partial fill → interface balance → usable ruby target",
    tags: ["50% working zone", "target readability ↑", "no full-fill requirement"],
    action: "Open Moisture Portal",
  },
  {
    nav: "Moisture Explorer",
    code: "03 / LIVE MODEL",
    eyebrow: "Portal synchronised · curves are live",
    title: "The model is ready to enter.",
    text: "The target becomes measurable. Follow three moisture curves, change the physical parameters and see the pruning point s* move in real time.",
    formula: "target quality → moisture gradient → predictable s*",
    tags: ["three scenarios", "live calculator", "instant pruning point"],
    action: "Enter the Explorer",
  },
];

export default function Home() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stage = stages[active];

  useEffect(() => {
    if (!playing) return;
    let next = active;
    const timer = window.setInterval(() => {
      next += 1;
      if (next > 2) {
        window.clearInterval(timer);
        setPlaying(false);
        return;
      }
      setActive(next);
    }, 1500);
    return () => window.clearInterval(timer);
  }, [playing]);

  const startSequence = () => {
    setActive(0);
    setPlaying(true);
  };

  return (
    <main className="site-shell portal-intro">
      <header className="portal-header panel">
        <div className="portal-heading">
          <p className="eyebrow">Venturi Carpet Technology · Interactive Library</p>
          <h1>Yellow Target Intro</h1>
          <p className="lede">A three-stage entrance into the living geometry of the cone.</p>
        </div>
        <div className="page-stamp"><strong>INTRO</strong><span>YTI v2.0</span></div>

        <nav className="portal-path" aria-label="Interactive introduction stages">
          {stages.map((item, index) => (
            <div className="path-item" key={item.nav}>
              <button
                type="button"
                className={active === index ? "active" : active > index ? "complete" : ""}
                aria-current={active === index ? "step" : undefined}
                onClick={() => { setPlaying(false); setActive(index); }}
              >
                <i>{index + 1}</i><span>{item.nav}</span><small>{active === index ? "ACTIVE" : active > index ? "SEEN" : "OPEN"}</small>
              </button>
              {index < stages.length - 1 && <b aria-hidden="true">→</b>}
            </div>
          ))}
          <button type="button" className={`sequence-button ${playing ? "playing" : ""}`} onClick={startSequence} disabled={playing}>
            <span>{playing ? "●" : "▶"}</span>{playing ? "Playing" : "Play intro"}
          </button>
        </nav>
      </header>

      <section className={`portal-deck panel portal-stage-${active}`}>
        <div className="holo-world" aria-label={`${stage.nav} interactive visual`}>
          <div className="holo-grid" />
          <div className="aurora aurora-one" />
          <div className="aurora aurora-two" />
          <div className="scan-line" />
          <div className="data-rain" aria-hidden="true"><i>01</i><i>50</i><i>75</i><i>s*</i><i>R</i><i>∆C</i></div>

          <div className="world-status">
            <span><i /> LIVE OBJECT · 00{active + 1}</span>
            <strong>{stage.nav}</strong>
          </div>

          <div className="interface-object">
            <div className="orbit orbit-a" />
            <div className="orbit orbit-b" />
            <div className="portal-ruby"><i /><b /></div>
            <div className="signal-target"><span>TARGET</span></div>
            <div className="future-root"><i/><i/><i/></div>
            <div className="holo-cone">
              <div className="holo-soil" />
              <div className="interface-line"><i/><span>{active === 0 ? "INTERFACE" : "50%"}</span></div>
            </div>
            <div className="airflow"><i/><i/><i/></div>
          </div>

          <div className="chart-portal">
            <div className="chart-portal-head"><span>MOISTURE FIELD / LIVE</span><b>C(s*) = Ccrit</b></div>
            <MoistureChart parameters={defaultParameters} activeFill={0.5} compact />
            <div className="portal-door"><i/><span>ENTER</span></div>
          </div>

          <div className="world-caption">
            <span>{active === 0 ? "CONTACT" : active === 1 ? "READABILITY" : "CALCULATION"}</span>
            <strong>{active === 0 ? "Air meets matter" : active === 1 ? "The target switches on" : "The threshold becomes visible"}</strong>
          </div>
          <div className="object-index">0{active + 1}</div>
        </div>

        <div className="portal-story" key={active}>
          <div className="story-topline"><span>{stage.code}</span><b>VENTURI / DIGITAL SPECIMEN</b></div>
          <p className="eyebrow">{stage.eyebrow}</p>
          <h2>{stage.title}</h2>
          <p className="story-copy">{stage.text}</p>
          <div className="portal-formula"><small>ACTIVE LOGIC</small><strong>{stage.formula}</strong></div>
          <div className="portal-tags">{stage.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>

          <div className="stage-meter" aria-label={`Stage ${active + 1} of 3`}>
            <div><i style={{ width: `${((active + 1) / 3) * 100}%` }} /></div>
            <span>0{active + 1} / 03</span>
          </div>

          <div className="portal-actions">
            {active < 2 ? (
              <button type="button" className="portal-primary" onClick={() => setActive(active + 1)}>
                <span>{stage.action}</span><b>→</b>
              </button>
            ) : (
              <Link className="portal-primary final" href="/explorer">
                <span>{stage.action}</span><b>↗</b>
              </Link>
            )}
            {active > 0 && <button type="button" className="portal-back" onClick={() => setActive(active - 1)}>← Previous object</button>}
          </div>

          <aside className="portal-manifesto">
            <span className="mini-ruby" />
            <div><small>THE YELLOW TARGET PRINCIPLE</small><p>The cone forms the target — not a storage pocket.</p></div>
          </aside>
        </div>
      </section>

      <section className="portal-collection" aria-label="Digital specimen collection">
        {stages.map((item, index) => (
          <button key={item.nav} type="button" onClick={() => setActive(index)} className={active === index ? "active" : ""}>
            <span>VCT — 00{index + 1}</span>
            <i className={`collection-art art-${index}`}><b/><em/></i>
            <div><small>DIGITAL SPECIMEN</small><strong>{item.nav}</strong><p>{index === 0 ? "Boundary field" : index === 1 ? "Biological signal" : "Live moisture model"}</p></div>
          </button>
        ))}
        <Link href="/explorer" className="collection-gateway"><small>THE COMPLETE MODEL</small><strong>Enter Screen 2</strong><span>Open portal ↗</span></Link>
      </section>
    </main>
  );
}
