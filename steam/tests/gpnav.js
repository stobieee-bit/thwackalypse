(async () => {
  const out = [];
  const ok = (name, cond, extra) => out.push([name, !!cond].concat(extra !== undefined ? [extra] : []));
  try { localStorage.clear(); } catch (e) {}

  ok('boot v2.12', document.querySelectorAll('#scrMenu .small')[1].textContent.startsWith('v2.12'));

  // ---- menu: focus ring, wrap-around, A-select ----
  GPNAV.st = ''; GPNAV.idx = 0; gpNavPaint();
  const menuEls = gpNavEls();
  ok('menu has nav targets', menuEls.length >= 6, menuEls.length);
  ok('focus ring painted', document.querySelectorAll('.gpnav').length === 1);
  ok('first target is PLAY', menuEls[0].id === 'bPlay');
  gpNavMove(-1); // wrap backwards
  ok('wraps to last', gpNavEls()[GPNAV.idx] === menuEls[menuEls.length - 1]);
  gpNavMove(1);
  ok('wraps forward to first', GPNAV.idx === 0);
  gpNavClick(); // A on PLAY
  ok('A opened character select', G.state === 'select');

  // ---- select: cards are nav targets; B backs out ----
  GPNAV.st = ''; GPNAV.idx = 0;
  const selEls = gpNavEls();
  ok('select collects cards', selEls.some(el => el.classList.contains('charcard'))
    && selEls.some(el => el.classList.contains('mapcard')), selEls.length);
  gpNavBack();
  ok('B backs to menu', G.state === 'menu');

  // ---- settings: sliders adjust with left/right instead of moving focus ----
  document.getElementById('bSettings').click();
  GPNAV.st = ''; GPNAV.idx = 0;
  const setEls = gpNavEls();
  const musicIdx = setEls.findIndex(el => el.id === 'sMusic');
  ok('slider is a nav target', musicIdx >= 0);
  GPNAV.idx = musicIdx; gpNavPaint();
  const v0 = +document.getElementById('sMusic').value;
  const consumed = gpNavAdjust(-1);
  ok('left adjusts focused slider', consumed && +document.getElementById('sMusic').value === v0 - 5,
    v0 + '->' + document.getElementById('sMusic').value);
  ok('slider persisted to save', Math.abs(SAVE.settings.music - (v0 - 5) / 100) < 1e-9);
  GPNAV.idx = setEls.findIndex(el => el.id === 'sShake'); // an actual button
  ok('button does not consume left', GPNAV.idx >= 0 && !gpNavAdjust(-1));
  gpNavBack();
  ok('B exits settings', G.state === 'menu');

  // ---- pause + quit-confirm modal via pad ----
  TH.start('gerald'); TH.god(); dismissCoach();
  togglePause();
  GPNAV.st = ''; GPNAV.idx = 0;
  ok('pause navigable', gpNavEls().some(el => el.id === 'bQuit'));
  document.getElementById('bQuit').click();
  await new Promise(r => setTimeout(r, 60));
  ok('modal outranks screen', gpNavRoot() === 'scrModal');
  GPNAV.st = ''; GPNAV.idx = 0;
  const modalEls = gpNavEls();
  ok('modal targets are OK/CANCEL', modalEls.length === 2 && modalEls[0].id === 'modalOk');
  gpNavBack(); // B answers CANCEL
  await new Promise(r => setTimeout(r, 60));
  ok('B cancels the modal', document.getElementById('scrModal').classList.contains('hide') && G.state === 'pause' && P !== null);
  // A on OK actually quits
  document.getElementById('bQuit').click();
  await new Promise(r => setTimeout(r, 60));
  GPNAV.st = ''; GPNAV.idx = 0; gpNavClick();
  await new Promise(r => setTimeout(r, 80));
  ok('A confirms quit to menu', G.state === 'menu' && P === null);

  // ---- death screen: default focus = ONE MORE LAWN ----
  TH.start('babushka'); dismissCoach();
  P.stats.maxHp = 10; P.hp = 1; P.iT = 0; P.dashT = 0; hurtPlayer(50);
  await new Promise(r => setTimeout(r, 1200));
  GPNAV.st = ''; GPNAV.idx = 0;
  ok('dead screen first target is retry', gpNavEls()[0].id === 'bRetry');
  gpNavBack();
  ok('B on dead goes to menu', G.state === 'menu');

  // ---- trophies: d-pad scrolls the list; BACK reachable ----
  document.getElementById('bTrophies').click();
  GPNAV.st = ''; GPNAV.idx = 0;
  const tEls = gpNavEls();
  ok('trophies nav is just BACK', tEls.length === 1 && tEls[0].id === 'bBack4');
  const tr = document.getElementById('trophyRows');
  const s0 = tr.scrollTop; tr.scrollBy(0, 70);
  ok('trophy rows scrollable', tr.scrollTop > s0 || tr.scrollHeight <= tr.clientHeight);
  gpNavBack();
  ok('B exits trophies', G.state === 'menu');

  try { localStorage.clear(); } catch (e) {}
  return out;
})()
