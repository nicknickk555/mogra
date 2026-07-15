const inputIds = ["L", "kg", "Ah", "C0", "Cinf", "Ccrit", "Dp", "Da", "Ap", "Aa"];
const fills = [0, 0.5, 0.75];
let activeFill = 0;

function values() {
  const parameters = {};
  inputIds.forEach((id) => {
    parameters[id] = Number(document.getElementById(id).value) || 0;
  });
  return parameters;
}

function scenarios(parameters) {
  return fills.map((fill) => {
    const length = Math.max(parameters.L, 0.001);
    const fillLength = fill * length;
    const porousResistance = fillLength > 0 ? fillLength / Math.max(parameters.Dp * parameters.Ap, 1e-12) : 0;
    const airResistance = (length - fillLength) / Math.max(parameters.Da * parameters.Aa, 1e-12);
    const transferResistance = 1 / Math.max(parameters.kg * parameters.Ah, 1e-12);
    const totalResistance = porousResistance + airResistance + transferResistance;
    const flux = (parameters.C0 - parameters.Cinf) / Math.max(totalResistance, 1e-12);
    const compostCandidate = (parameters.C0 - parameters.Ccrit) * parameters.Dp * parameters.Ap / Math.max(flux, 1e-12);
    const rawPoint = compostCandidate <= fillLength
      ? compostCandidate
      : fillLength + (parameters.C0 - parameters.Ccrit - flux * porousResistance) * parameters.Da * parameters.Aa / Math.max(flux, 1e-12);
    const pruningPoint = Math.min(length, Math.max(0, rawPoint));
    const region = rawPoint < 0
      ? "before inlet"
      : rawPoint > length
        ? "beyond outlet"
        : pruningPoint <= fillLength && fillLength > 0
          ? "in compost"
          : "in air gap";
    const points = Array.from({ length: 61 }, (_, index) => {
      const position = index / 60 * length;
      const concentration = position <= fillLength && fillLength > 0
        ? parameters.C0 - flux / Math.max(parameters.Dp * parameters.Ap, 1e-12) * position
        : (parameters.C0 - flux * porousResistance) - flux / Math.max(parameters.Da * parameters.Aa, 1e-12) * (position - fillLength);
      return { position, concentration };
    });
    return { fill, length, fillLength, flux, pruningPoint, region, points };
  });
}

function redrawCurve(curve) {
  curve.classList.remove("redraw");
  void curve.getBoundingClientRect();
  curve.classList.add("redraw");
}

function render() {
  const parameters = values();
  const data = scenarios(parameters);
  const left = 72;
  const top = 30;
  const width = 800;
  const height = 286;
  const maxConcentration = Math.max(parameters.C0, parameters.Ccrit) * 1.08;
  const minConcentration = Math.min(parameters.Cinf, parameters.Ccrit) * 0.78;
  const x = (position) => left + position / Math.max(parameters.L, 0.001) * width;
  const y = (concentration) => top + (maxConcentration - concentration) / Math.max(maxConcentration - minConcentration, 1e-12) * height;
  const thresholdY = y(parameters.Ccrit);

  document.getElementById("threshold").setAttribute("d", `M${left} ${thresholdY}H${left + width}`);
  document.getElementById("thresholdLabel").setAttribute("y", thresholdY - 9);
  document.getElementById("thresholdLabel").textContent = `Ccrit = ${parameters.Ccrit}`;

  data.forEach((item, index) => {
    const curve = document.getElementById(`curve${index}`);
    curve.setAttribute("points", item.points.map((point) => `${x(point.position).toFixed(1)},${y(point.concentration).toFixed(1)}`).join(" "));
    redrawCurve(curve);

    const marker = document.getElementById(`marker${index}`);
    marker.setAttribute("cx", x(item.pruningPoint));
    marker.setAttribute("cy", thresholdY);
    document.getElementById(`card${index}`).textContent = `${item.pruningPoint.toFixed(2)} mm`;
    document.getElementById(`region${index}`).textContent = item.region;

    const focused = item.fill === activeFill;
    curve.setAttribute("opacity", focused ? 1 : 0.42);
    marker.setAttribute("opacity", focused ? 1 : 0.55);
  });

  const active = data.find((item) => item.fill === activeFill) || data[0];
  document.getElementById("resultLabel").textContent = `${Math.round(active.fill * 100)}% fill`;
  document.getElementById("resultValue").textContent = `s* = ${active.pruningPoint.toFixed(2)} mm`;
  document.getElementById("resultDetail").textContent = `${active.region} · J = ${active.flux.toExponential(3)}`;
  document.querySelectorAll(".scenario-tabs button").forEach((button) => button.classList.toggle("active", Number(button.dataset.fill) === activeFill));
  document.querySelectorAll(".result-cards button").forEach((button) => button.classList.toggle("active", Number(button.dataset.result) === activeFill));
}

inputIds.forEach((id) => document.getElementById(id).addEventListener("input", render));
document.querySelectorAll("[data-fill], [data-result]").forEach((button) => {
  button.addEventListener("click", () => {
    activeFill = Number(button.dataset.fill ?? button.dataset.result);
    render();
  });
});

render();
