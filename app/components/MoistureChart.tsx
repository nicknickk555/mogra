"use client";

import { useMemo } from "react";

export type ModelParameters = {
  L: number; kg: number; Ah: number; C0: number; Cinf: number;
  Ccrit: number; Dp: number; Da: number; Ap: number; Aa: number;
};

export const defaultParameters: ModelParameters = {
  L: 20, kg: 0.001, Ah: 1, C0: 0.02, Cinf: 0.005,
  Ccrit: 0.01, Dp: 0.000002, Da: 0.00001, Ap: 1, Aa: 1,
};

export type ScenarioResult = {
  fill: number; lf: number; Rp: number; Ra: number; Rh: number;
  Rtot: number; J: number; sstar: number; region: string;
  points: { s: number; C: number }[];
};

export function calculateScenarios(p: ModelParameters): ScenarioResult[] {
  return [0, 0.5, 0.75].map((fill) => {
    const L = Math.max(p.L, 0.001);
    const lf = fill * L;
    const Rp = lf > 0 ? lf / Math.max(p.Dp * p.Ap, 1e-12) : 0;
    const Ra = (L - lf) / Math.max(p.Da * p.Aa, 1e-12);
    const Rh = 1 / Math.max(p.kg * p.Ah, 1e-12);
    const Rtot = Rp + Ra + Rh;
    const J = (p.C0 - p.Cinf) / Math.max(Rtot, 1e-12);
    const points = Array.from({ length: 61 }, (_, index) => {
      const s = (index / 60) * L;
      const C = s <= lf && lf > 0
        ? p.C0 - (J / Math.max(p.Dp * p.Ap, 1e-12)) * s
        : (p.C0 - J * Rp) - (J / Math.max(p.Da * p.Aa, 1e-12)) * (s - lf);
      return { s, C };
    });
    const compostCandidate = (p.C0 - p.Ccrit) * p.Dp * p.Ap / Math.max(J, 1e-12);
    const rawSstar = compostCandidate <= lf
      ? compostCandidate
      : lf + (p.C0 - p.Ccrit - J * Rp) * p.Da * p.Aa / Math.max(J, 1e-12);
    const sstar = Math.min(L, Math.max(0, rawSstar));
    const region = rawSstar < 0 ? "before inlet" : rawSstar > L ? "beyond outlet" : sstar <= lf && lf > 0 ? "in compost" : "in air gap";
    return { fill, lf, Rp, Ra, Rh, Rtot, J, sstar, region, points };
  });
}

const colors = ["#16a062", "#2e9bd3", "#9557bd"];

export function MoistureChart({ parameters, activeFill, compact = false }:{ parameters: ModelParameters; activeFill: number; compact?: boolean }) {
  const scenarios = useMemo(() => calculateScenarios(parameters), [parameters]);
  const width = 900, height = compact ? 250 : 380;
  const left = 72, right = 28, top = 30, bottom = compact ? 46 : 64;
  const plotW = width - left - right, plotH = height - top - bottom;
  const maxC = Math.max(parameters.C0, parameters.Ccrit) * 1.08;
  const minC = Math.min(parameters.Cinf, parameters.Ccrit) * 0.78;
  const x = (s:number) => left + (s / Math.max(parameters.L, 0.001)) * plotW;
  const y = (c:number) => top + ((maxC - c) / Math.max(maxC - minC, 1e-12)) * plotH;
  const thresholdY = y(parameters.Ccrit);
  const ticks = [0, .25, .5, .75, 1];

  return (
    <svg className="moisture-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Moisture gradient curves and pruning points for zero, fifty and seventy-five percent cone fill">
      <defs>
        <linearGradient id="plotWash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#eef8f4"/><stop offset="1" stopColor="#f9fbfd"/></linearGradient>
      </defs>
      <rect x={left} y={top} width={plotW} height={plotH} rx="12" fill="url(#plotWash)" />
      {ticks.map((tick) => <g key={tick}>
        <line x1={x(tick * parameters.L)} y1={top} x2={x(tick * parameters.L)} y2={top + plotH} stroke="#dce8ef" />
        <text x={x(tick * parameters.L)} y={height - 20} textAnchor="middle">{(tick * parameters.L).toFixed(tick === 0 ? 0 : 1)}</text>
      </g>)}
      {[0, .5, 1].map((tick) => {
        const value = minC + tick * (maxC - minC);
        return <g key={tick}><line x1={left} y1={y(value)} x2={left + plotW} y2={y(value)} stroke="#dce8ef"/><text x={left - 10} y={y(value) + 4} textAnchor="end">{value.toFixed(3)}</text></g>;
      })}
      <line x1={left} y1={thresholdY} x2={left + plotW} y2={thresholdY} stroke="#ed851e" strokeWidth="2" strokeDasharray="8 7" />
      <text x={left + 10} y={thresholdY - 9} className="threshold-label">Ccrit = {parameters.Ccrit}</text>
      {scenarios.map((scenario, index) => {
        const path = scenario.points.map((point) => `${x(point.s).toFixed(1)},${y(point.C).toFixed(1)}`).join(" ");
        const focused = scenario.fill === activeFill;
        return <g key={scenario.fill} className="curve-group" opacity={focused ? 1 : .48}>
          <polyline points={path} fill="none" stroke={colors[index]} strokeWidth={focused ? 5 : 3} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={x(scenario.sstar)} cy={thresholdY} r={focused ? 8 : 6} fill={colors[index]} stroke="#fff" strokeWidth="3" />
          {!compact && <text x={Math.min(x(scenario.sstar) + 9, width - 95)} y={thresholdY - 12} fill={colors[index]} className="point-label">s* {scenario.sstar.toFixed(2)}</text>}
        </g>;
      })}
      <line x1={left} y1={top + plotH} x2={left + plotW} y2={top + plotH} stroke="#173958" strokeWidth="2" />
      <line x1={left} y1={top} x2={left} y2={top + plotH} stroke="#173958" strokeWidth="2" />
      <text x={left + plotW} y={height - 4} textAnchor="end" className="axis-title">s (mm)</text>
      <text x="17" y={top + plotH / 2} transform={`rotate(-90 17 ${top + plotH / 2})`} textAnchor="middle" className="axis-title">C(s)</text>
    </svg>
  );
}
