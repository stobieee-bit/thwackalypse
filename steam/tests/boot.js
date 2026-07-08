(async () => {
  const out = [];
  try { localStorage.clear(); } catch (e) {}
  out.push(['TH present', typeof window.TH === 'object']);
  out.push(['state menu', G.state === 'menu']);
  out.push(['version', document.querySelectorAll('#scrMenu .small')[1].textContent.slice(0, 6).trim()]);
  // drive a quick sim: start, tick, kill, ult, die
  TH.start('gerald'); TH.god();
  for (let i = 0; i < 30; i++) spawnEnemy('gnome', P.x + 60 + i, P.y);
  for (const e of [...enemies]) if (e.type === 'gnome') { e.hp = 1; hitEnemy(e, 9999, {}); }
  out.push(['kills counted', G.kills >= 25, G.kills]);
  out.push(['ult charging', +G.ult.toFixed(3)]);
  G.ult = 1; fireUlt();
  out.push(['ult fired', G.ult === 0]);
  const s = TH.snap();
  out.push(['render alive', s.colors > 3, s.colors]);
  P.stats.maxHp = 10; P.hp = 1; P.iT = 0; P.dashT = 0; hurtPlayer(50);
  out.push(['dying', G.dying === true]);
  await new Promise(r => setTimeout(r, 1200));
  out.push(['dead screen', !document.getElementById('scrDead').classList.contains('hide')]);
  out.push(['grade card', /GRADE [SABCD]/.test(document.getElementById('deadStats').textContent)]);
  try { localStorage.clear(); } catch (e) {}
  return out;
})()
