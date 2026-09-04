// OwnCura prototype data + illustrative valuation model.
// Public-data baseline is derived from panel size, blended revenue per patient,
// specialty margin norms and payer mix — the shape of the real engine, not the real engine.
window.OWNCURA_CLINICS = [
  { id: "bellaire", name: "Bellaire Pediatric Associates", city: "Bellaire, TX", zip: "77401", lat: 29.7058, lng: -95.4588,
    specialty: "Pediatrics", providers: 4, panel: 5200, revPerPatient: 362, marginPub: 0.205, commercial: 0.62, metroAdj: 0.30,
    status: "listed", note: "Owner retiring in 2027. Listed for sale.", sources: ["Medicare PUF 2024", "NPPES", "TX DSHS licensure"],
    ownerInputs: { ebitda: "612000", providers: "4", panel: "5400", commercial: "70", visits: "52" } },
  { id: "heights", name: "Heights Family Practice", city: "Houston Heights, TX", zip: "77008", lat: 29.7905, lng: -95.3988,
    specialty: "Family Practice", providers: 3, panel: 4100, revPerPatient: 341, marginPub: 0.178, commercial: 0.54, metroAdj: 0.22,
    status: "unlisted", note: "Not listed for sale. Estimate is ours, not the owner's.", sources: ["Medicare PUF 2024", "NPPES"] },
  { id: "katy", name: "Katy Kids Clinic", city: "Katy, TX", zip: "77494", lat: 29.7858, lng: -95.8245,
    specialty: "Pediatrics", providers: 5, panel: 6400, revPerPatient: 355, marginPub: 0.192, commercial: 0.68, metroAdj: 0.34,
    status: "portfolio", note: "Roots Health portfolio. Agent stack deploys Nov 15.", sources: ["Internal ledger", "Medicare PUF 2024"] },
  { id: "sugarland", name: "Sugar Land Family Medicine", city: "Sugar Land, TX", zip: "77479", lat: 29.6197, lng: -95.6349,
    specialty: "Family Practice", providers: 4, panel: 4800, revPerPatient: 348, marginPub: 0.186, commercial: 0.59, metroAdj: 0.26,
    status: "unlisted", note: "Not listed for sale. Estimate is ours, not the owner's.", sources: ["Medicare PUF 2024", "NPPES"] },
  { id: "memorial", name: "Memorial Pediatric Partners", city: "Memorial, TX", zip: "77024", lat: 29.7645, lng: -95.5560,
    specialty: "Pediatrics", providers: 6, panel: 7100, revPerPatient: 371, marginPub: 0.214, commercial: 0.71, metroAdj: 0.36,
    status: "listed", note: "Two partners exiting. Listed for sale.", sources: ["Medicare PUF 2024", "NPPES", "TX DSHS licensure"],
    ownerInputs: { ebitda: "884000", providers: "6", panel: "7300", commercial: "74", visits: "61" } },
  { id: "pearland", name: "Pearland Children's Health", city: "Pearland, TX", zip: "77584", lat: 29.5636, lng: -95.2860,
    specialty: "Pediatrics", providers: 3, panel: 3900, revPerPatient: 322, marginPub: 0.164, commercial: 0.44, metroAdj: 0.12,
    status: "portfolio", note: "Roots Health portfolio. Acquired Mar 2026.", sources: ["Internal ledger", "Medicare PUF 2024"] },
  { id: "springbranch", name: "Spring Branch Family Care", city: "Spring Branch, TX", zip: "77055", lat: 29.7910, lng: -95.5350,
    specialty: "Family Practice", providers: 2, panel: 3100, revPerPatient: 309, marginPub: 0.151, commercial: 0.38, metroAdj: 0.08,
    status: "unlisted", note: "Not listed for sale. Estimate is ours, not the owner's.", sources: ["Medicare PUF 2024", "NPPES"] },
  { id: "clearlake", name: "Clear Lake Pediatrics", city: "Clear Lake, TX", zip: "77058", lat: 29.5580, lng: -95.0980,
    specialty: "Pediatrics", providers: 4, panel: 4600, revPerPatient: 344, marginPub: 0.188, commercial: 0.57, metroAdj: 0.20,
    status: "unlisted", note: "Not listed for sale. In acquisition conversation.", sources: ["Medicare PUF 2024", "NPPES"] },
  { id: "montrose", name: "Montrose Family Practice", city: "Montrose, TX", zip: "77006", lat: 29.7420, lng: -95.3900,
    specialty: "Family Practice", providers: 2, panel: 2900, revPerPatient: 334, marginPub: 0.172, commercial: 0.61, metroAdj: 0.24,
    status: "listed", note: "Solo owner relocating. Listed for sale.", sources: ["Medicare PUF 2024", "NPPES", "TX DSHS licensure"],
    ownerInputs: { ebitda: "228000", providers: "2", panel: "2850", commercial: "58", visits: "34" } },
  { id: "woodlands", name: "The Woodlands Pediatrics", city: "The Woodlands, TX", zip: "77380", lat: 30.1658, lng: -95.4613,
    specialty: "Pediatrics", providers: 5, panel: 6100, revPerPatient: 368, marginPub: 0.209, commercial: 0.73, metroAdj: 0.38,
    status: "portfolio", note: "Roots Health portfolio. Acquired Nov 2025.", sources: ["Internal ledger", "Medicare PUF 2024"] },
  { id: "cypress", name: "Cypress Family Health", city: "Cypress, TX", zip: "77429", lat: 29.9691, lng: -95.6972,
    specialty: "Family Practice", providers: 3, panel: 4300, revPerPatient: 331, marginPub: 0.174, commercial: 0.51, metroAdj: 0.18,
    status: "unlisted", note: "Not listed for sale. Estimate is ours, not the owner's.", sources: ["Medicare PUF 2024", "NPPES"] }
];

window.OwnCuraValue = (function () {
  var BENCH_REV_PER_FTE = 392000, BENCH_VISITS = 42;

  function baseline(c) {
    var revenue = c.panel * c.revPerPatient;
    var ebitda = revenue * c.marginPub;
    var mult = 4.1 + (c.commercial - 0.45) * 2.2 + (c.specialty === "Pediatrics" ? 0.25 : 0.10) + c.metroAdj;
    var mid = ebitda * mult;
    return { revenue: revenue, ebitda: ebitda, mult: mult, mid: mid,
      low: mid * 0.78, high: mid * 1.22, spread: 0.22, confidence: 42, refined: false };
  }

  function refined(c, i) {
    var base = baseline(c);
    var filled = 0;
    ["ebitda", "providers", "panel", "commercial", "visits"].forEach(function (k) {
      if (i[k] !== "" && i[k] !== null && i[k] !== undefined && !isNaN(parseFloat(i[k]))) filled++;
    });
    var panel = num(i.panel, c.panel);
    var providers = num(i.providers, c.providers);
    var commercial = num(i.commercial, c.commercial * 100) / 100;
    var visits = num(i.visits, BENCH_VISITS);
    var revenue = panel * c.revPerPatient;
    var ebitda = num(i.ebitda, revenue * c.marginPub);

    var has = function (k) { return i[k] !== "" && i[k] !== null && i[k] !== undefined && !isNaN(parseFloat(i[k])); };
    var payerAdj = (commercial - 0.45) * 2.2;
    var revPerFte = providers > 0 ? revenue / providers : BENCH_REV_PER_FTE;
    var effAdj = (has("providers") || has("panel"))
      ? clamp((revPerFte - BENCH_REV_PER_FTE) / BENCH_REV_PER_FTE * 1.2, -0.45, 0.45) : 0;
    var throughputAdj = has("visits")
      ? clamp((visits - BENCH_VISITS) / BENCH_VISITS * 0.9, -0.30, 0.30) : 0;
    var mult = 4.1 + payerAdj + (c.specialty === "Pediatrics" ? 0.25 : 0.10) + c.metroAdj + effAdj + throughputAdj;
    var mid = ebitda * mult;
    var spread = Math.max(0.07, 0.22 - 0.03 * filled);

    return { revenue: revenue, ebitda: ebitda, mult: mult, mid: mid,
      low: mid * (1 - spread), high: mid * (1 + spread), spread: spread,
      confidence: Math.min(93, 42 + 10 * filled), refined: filled > 0, filled: filled,
      factors: [
        { label: "Reported EBITDA", value: money(ebitda), effect: ebitda - base.ebitda,
          note: i.ebitda ? "Owner-supplied. Replaces the margin norm we assumed." : "Estimated from the public margin norm for this specialty." },
        { label: "Payer mix", value: Math.round(commercial * 100) + "% commercial", effect: (payerAdj - (c.commercial - 0.45) * 2.2) * ebitda,
          note: "Commercial share above 45% lifts the multiple." },
        { label: "Provider efficiency", value: (has("providers") || has("panel")) ? money(revPerFte) + " per provider" : "not supplied",
          effect: effAdj * ebitda, note: "Benchmarked against $392K revenue per provider." },
        { label: "Throughput", value: has("visits") ? Math.round(visits) + " visits/day" : "not supplied",
          effect: throughputAdj * ebitda, note: "Benchmarked against 42 visits per day." }
      ] };
  }

  function num(v, fallback) { var n = parseFloat(v); return isNaN(n) ? fallback : n; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function money(n) {
    if (n >= 1e6) return "$" + (n / 1e6).toFixed(n / 1e6 < 10 ? 2 : 1) + "M";
    if (n >= 1e3) return "$" + Math.round(n / 1e3) + "K";
    return "$" + Math.round(n);
  }
  return { baseline: baseline, refined: refined, money: money };
})();
