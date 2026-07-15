const stages = [
  {
    eyebrow: "The programmed interface begins here",
    title: "The cone is not a pocket. It is an interface.",
    text: "The outer cone creates a live boundary where compost contact, air access and drying potential meet. Before a root arrives, geometry has already shaped its future path.",
    logic: "I_cone = compost contact + air gap + drying gradient",
    tags: ["air-side signal", "porous contact", "future pruning band"],
    action: "Activate Ruby Target",
    caption: "Air meets matter"
  },
  {
    eyebrow: "50% interface · working biological target",
    title: "Partial fill creates the working target.",
    text: "At partial fill, compost contact, airflow and drying potential enter a readable balance. The ruby appears before physical contact: a signal that the target is ready for the root.",
    logic: "partial fill → interface balance → usable ruby target",
    tags: ["50% working zone", "target readability", "no full-fill requirement"],
    action: "Open Moisture Portal",
    caption: "The target switches on"
  },
  {
    eyebrow: "The curves are ready",
    title: "The model is ready to enter.",
    text: "The target becomes measurable. Follow three moisture curves, change physical parameters and see the pruning point s* move in real time.",
    logic: "target quality → moisture gradient → predictable s*",
    tags: ["three scenarios", "interactive calculator", "instant pruning point"],
    action: "Enter Screen 2 · Explorer",
    caption: "The threshold becomes visible"
  }
];

let stage = 0;
let playing = false;
const portal = document.getElementById("portal");
const portalCopy = document.getElementById("portalCopy");
const playButton = document.getElementById("playIntro");

function animateCopy() {
  portalCopy.classList.remove("is-changing");
  void portalCopy.offsetWidth;
  portalCopy.classList.add("is-changing");
}

function setStage(index) {
  stage = index;
  portal.className = `portal card stage-${index}`;
  document.querySelectorAll(".stage-button").forEach((button, buttonIndex) => {
    button.classList.toggle("active", buttonIndex === index);
  });

  const item = stages[index];
  document.getElementById("stageEyebrow").textContent = item.eyebrow;
  document.getElementById("stageTitle").textContent = item.title;
  document.getElementById("stageText").textContent = item.text;
  document.getElementById("stageLogic").textContent = item.logic;
  document.getElementById("stageTags").innerHTML = item.tags.map((tag) => `<span>${tag}</span>`).join("");
  document.getElementById("stageProgress").style.width = `${((index + 1) / 3) * 100}%`;
  document.getElementById("visualCaption").textContent = item.caption;

  const action = document.getElementById("stageAction");
  action.textContent = item.action;
  action.classList.toggle("final", index === 2);
  action.onclick = () => {
    if (index < 2) {
      setStage(index + 1);
    } else {
      window.location.href = "explorer.html";
    }
  };
  animateCopy();
}

document.querySelectorAll(".stage-button").forEach((button) => {
  button.addEventListener("click", () => setStage(Number(button.dataset.stage)));
});

playButton.addEventListener("click", () => {
  if (playing) return;
  playing = true;
  playButton.classList.add("playing");
  playButton.innerHTML = '<i aria-hidden="true"></i> Playing intro';
  setStage(0);
  let nextStage = 1;
  const timer = window.setInterval(() => {
    if (nextStage > 2) {
      window.clearInterval(timer);
      playing = false;
      playButton.classList.remove("playing");
      playButton.innerHTML = '<i aria-hidden="true"></i> Play intro';
      return;
    }
    setStage(nextStage);
    nextStage += 1;
  }, 1500);
});

document.getElementById("openIntro").addEventListener("click", () => {
  setStage(0);
  portal.scrollIntoView({ behavior: "smooth", block: "start" });
});

setStage(stage);
