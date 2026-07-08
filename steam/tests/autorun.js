(async () => {
  try { localStorage.clear(); } catch (e) {}
  const click = () => {
    if (G.state === 'levelup') { const cs = document.querySelectorAll('#cards .upcard'); if (cs.length) cs[Math.floor(Math.random() * cs.length)].click(); }
    else if (G.state === 'chest') document.getElementById('bChestOk').click();
  };
  TH.autopilot = true; TH.start('gerald');
  let guard = 0, ultFires = 0, prev = 0;
  while (G.state !== 'dead' && G.state !== 'won' && guard < 16000) {
    if (G.ult >= 1) G.ultLatch = true;
    TH.tick(0.066, 30);
    if (prev >= 1 && G.ult < 0.5) ultFires++; prev = G.ult;
    click(); guard += 30;
    if (guard % 1200 === 0) await new Promise(r => setTimeout(r, 0));
  }
  let w = 0; while (G.state === 'play' && w++ < 50) { TH.tick(0.066, 20); await new Promise(r => setTimeout(r, 0)); }
  const res = { state: G.state, t: Math.round(G.t), kills: G.kills, won: G.won, comboMax: G.comboMax, ultFires };
  try { localStorage.clear(); } catch (e) {}
  return res;
})()
