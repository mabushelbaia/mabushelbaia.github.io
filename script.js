// ---- data ----
var projects = [
  { num:'01', title:'Microprocessor Lab', host:'encs4110.me',
    href:'https://encs4110.me',
    desc:'A learning platform for microprocessor and embedded programming, with hands-on tutorials and code for the TM4C123 and ARM Cortex-M4.',
    tags:['Embedded','TM4C123','ARM Cortex-M4','Education'] },
  { num:'02', title:'PIC16F877A Calculator', host:'github',
    href:'https://github.com/mabushelbaia/PIC16F877A-Calculator',
    desc:'A calculator written in PIC assembly for the PIC16F877A, driving a 16×2 LCD and simulated in Proteus.',
    tags:['Assembly','PIC16F877A','LCD','Proteus'] },
  { num:'03', title:'Padding Oracle Attack', host:'github',
    href:'https://github.com/mabushelbaia/Padding-Oracle-Attack',
    desc:'A practical padding-oracle attack on CBC with PKCS#5, recovering plaintext byte by byte — packaged to run in Docker.',
    tags:['Security','Cryptography','CBC','Docker'] },
  { num:'04', title:'Course Schedule', host:'github',
    href:'https://github.com/mabushelbaia/Course-Schedule',
    desc:'A small Python tool that scrapes the weekly schedule from Ritaj and exports a calendar file you can import anywhere.',
    tags:['Python','iCalendar','Scraping'] }
];

// ---- Konami easter egg state ----
var egg = { open: false, line: '', history: [], hIdx: -1, booting: false };
var wobbleTimer = null;

function applyAccentForCurrentTheme() {
  var root = document.documentElement;
  var saved = localStorage.getItem('accent-color');
  if (!saved) {
    var oldDark = localStorage.getItem('accent-dark');
    var oldLight = localStorage.getItem('accent-light');
    saved = oldDark || oldLight || null;
    if (saved) {
      localStorage.setItem('accent-color', saved);
      localStorage.removeItem('accent-dark');
      localStorage.removeItem('accent-light');
    }
  }
  if (saved) {
    root.style.setProperty('--accent', saved);
  } else {
    root.style.removeProperty('--accent');
  }
}



// ---- render projects ----
(function () {
  var html = '';
  for (var i = 0; i < projects.length; i++) {
    var p = projects[i];
    var tags = '';
    for (var j = 0; j < p.tags.length; j++) tags += '<span>' + p.tags[j] + '</span>';
    html += '<a class="proj" href="' + p.href + '" target="_blank" rel="noopener noreferrer">' +
              '<div class="top">' +
                '<span class="title"><span class="num">' + p.num + '</span>&nbsp;&nbsp;' + p.title + '</span>' +
                '<span class="host">' + p.host + ' \u2197</span>' +
              '</div>' +
              '<div class="desc">' + p.desc + '</div>' +
              '<div class="tags">' + tags + '</div>' +
            '</a>';
  }
  document.getElementById('projects').innerHTML = html;
})();

// ---- hexdump background ----
(function () {
  var src = 'mabushelbaia :: computer engineer :: embedded systems :: ARM Cortex-M4 :: TM4C123 :: PIC16F877A :: assembly :: low-level :: systems :: ';
  var N = 16 * 80, bytes = [];
  for (var i = 0; bytes.length < N; i++) bytes.push(src.charCodeAt(i % src.length));
  var out = '';
  for (var r = 0; r < N / 16; r++) {
    var off = (r * 16).toString(16).toUpperCase();
    while (off.length < 6) off = '0' + off;
    var hex = '', asc = '';
    for (var c = 0; c < 16; c++) {
      var b = bytes[r * 16 + c];
      var h = b.toString(16).toUpperCase(); if (h.length < 2) h = '0' + h;
      hex += h + ' ';
      asc += (b >= 32 && b < 127) ? String.fromCharCode(b) : '.';
    }
    out += '0x' + off + '   ' + hex + '  ' + asc + '\n';
  }
  document.getElementById('hexdump').textContent = out + out;
})();

// ---- typing animation ----
(function () {
  var full = 'whoami', el = document.getElementById('typed'), i = 0;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { el.textContent = full; return; }
  var t = setInterval(function () {
    i++; el.textContent = full.slice(0, i);
    if (i >= full.length) clearInterval(t);
  }, 75);
})();

// ---- theme toggle (persists in color-theme) ----
(function () {
  var btn = document.getElementById('themeToggle');
  var label = document.getElementById('themeLabel');
  function sync() {
    label.textContent = document.documentElement.classList.contains('dark') ? 'DARK' : 'LIGHT';
  }
  sync();
  btn.addEventListener('click', function () {
    var dark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('color-theme', dark ? 'dark' : 'light');
    sync();
    applyAccentForCurrentTheme();
  });
})();

// ---- highlight the nav link for the section you're viewing ----
(function () {
  var line = 104;
  var entries = Array.prototype.slice
    .call(document.querySelectorAll('nav.links a[href^="#"]'))
    .map(function (a) { return { link: a, el: document.getElementById(a.getAttribute('href').slice(1)) }; })
    .filter(function (e) { return e.el; })
    .sort(function (a, b) { return a.el.offsetTop - b.el.offsetTop; });
  if (!entries.length) return;

  var ticking = false;
  function update() {
    ticking = false;
    var current = null;
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].el.getBoundingClientRect().top <= line) current = entries[i];
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = entries[entries.length - 1];
    }
    for (var j = 0; j < entries.length; j++) {
      entries[j].link.classList.toggle('active', entries[j] === current);
    }
  }
  var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();



// ---- serial console ----
function print(text, cls) {
  var out = document.getElementById('serialOut');
  if (!out) return;
  var span = document.createElement('span');
  span.className = 'ln' + (cls ? ' ' + cls : '');
  if (/<a /.test(text)) span.innerHTML = text; else span.textContent = text;
  out.appendChild(span);
  out.scrollTop = out.scrollHeight;
}

function renderLine() {
  var el = document.getElementById('serialLine');
  if (el) el.textContent = egg.booting ? '' : egg.line;
  var serial = document.getElementById('serial');
  if (serial) serial.classList.toggle('booting', egg.booting);
}

function triggerWobble() {
  if (wobbleTimer) clearTimeout(wobbleTimer);
  document.body.classList.add('wobble');
  wobbleTimer = setTimeout(function () {
    document.body.classList.remove('wobble');
    wobbleTimer = null;
  }, 80);
}

function closeConsole() {
  egg.open = false;
  egg.booting = false;
  egg.line = '';
  document.body.classList.remove('debug');
}

function runCommand(raw) {
  var args = raw.split(/\s+/).filter(Boolean);
  var cmd = (args[0] || '').toLowerCase();
  var P = function (t, c) { print(t, c); };
  switch (cmd) {
    case '':
      break;
    case 'help':
      P('available commands', 'ok');
      P('  help        this list');
      P('  whoami      who is this');
      P('  ls          list projects');
      P('  open <n>    open project n in a new tab');
      P('  reg         dump (fake) MCU registers');
      P('  blink       blink the onboard LED');
      P('  neofetch    system summary');
      P('  contact     how to reach me');
      P('  theme       toggle light / dark');
      P('  accent      show current accent color');
      P('  accent <c>  set accent color (hex, e.g. #ff6600)');
      P('  clear       clear the screen');
      P('  exit        detach console (or press ESC)');
      break;
    case 'whoami':
      P('Mohammad Abu-Shelbaia — computer engineer, embedded systems.', 'ok');
      P('Birzeit University grad + TA. I like seeing what the machine actually does.', 'dim');
      break;
    case 'ls':
      projects.forEach(function (p) { P('  ' + p.num + '  ' + p.title + '   ' + p.host, ''); });
      P('use `open <n>` to launch one', 'dim');
      break;
    case 'open': {
      var n = args[1];
      var hit = projects.find(function (p) { return p.num === n || p.num === ('0' + n) || p.title.toLowerCase().includes((n||'').toLowerCase()); });
      if (!n) { P('usage: open <project number>', 'warn'); break; }
      if (!hit) { P('open: no project "' + n + '"', 'err'); break; }
      P('launching ' + hit.title + ' → ' + hit.href, 'ok');
      window.open(hit.href, '_blank', 'noopener');
      break;
    }
    case 'reg':
      P('   R0  0x20000FA4     R8  0x00000000', 'dim');
      P('   R1  0x0000002A     R9  0xE000ED00', 'dim');
      P('   R2  0xDEADBEEF    R10  0x00000000', 'dim');
      P('   R3  0x00000001    R11  0x00000000', 'dim');
      P('   SP  0x20001000     LR  0x080004F1', 'dim');
      P('   PC  0x08000A3C   xPSR  0x61000000', 'dim');
      P('cpu: ARM Cortex-M4F · thumb-2 · fpu present', 'ok');
      break;
    case 'blink': {
      P('PF1 ← 1   (LED ON)', 'ok');
      var led = document.querySelector('.lights span');
      if (led) {
        var on = true, c = 0;
        var iv = setInterval(function () {
          on = !on; c++;
          if (led) led.style.boxShadow = on ? '0 0 12px 3px var(--accent)' : 'none';
          if (c >= 8) { clearInterval(iv); if (led) led.style.boxShadow = 'none'; P('PF1 ← 0   (LED OFF)', 'dim'); }
        }, 180);
      }
      break;
    }
    case 'neofetch':
      P('  ███   host    mabushelbaia.com', 'ok');
      P('  ███   mcu     ARM Cortex-M4F @ 80 MHz', '');
      P('  ███   board   TI TM4C123GXL LaunchPad', '');
      P('        os      bare-metal / FreeRTOS', '');
      P('        langs   C · ARM asm · PIC asm · Python', '');
      P('        loc     Ramallah, Palestine', '');
      break;
    case 'contact':
      P('email     <a href="mailto:mabushelbaia@gmail.com">mabushelbaia@gmail.com</a>');
      P('github    <a href="https://github.com/mabushelbaia" target="_blank" rel="noopener">github.com/mabushelbaia</a>');
      P('linkedin  <a href="https://www.linkedin.com/in/mabushelbaia/" target="_blank" rel="noopener">in/mabushelbaia</a>');
      break;
    case 'theme': {
      var root = document.documentElement;
      var dark = root.classList.toggle('dark');
      localStorage.setItem('color-theme', dark ? 'dark' : 'light');
      var label = document.getElementById('themeLabel'); if (label) label.textContent = dark ? 'DARK' : 'LIGHT';
      applyAccentForCurrentTheme();
      P('theme → ' + (dark ? 'dark' : 'light'), 'ok');
      break;
    }
    case 'accent': {
      var color = args[1];
      if (!color) {
        var stored = localStorage.getItem('accent-color') || '#ff8200';
        P('accent color: ' + stored, 'ok');
        P('  set a new one: accent &lt;hex&gt;', 'dim');
        break;
      }
      if (!/^#[0-9a-fA-F]{3,8}$/.test(color) && !/^(rgb|hsl)/.test(color)) {
        P('usage: accent &lt;hex&gt; — e.g. accent #ff6600', 'warn');
        break;
      }
      localStorage.setItem('accent-color', color);
      applyAccentForCurrentTheme();
      P('accent → ' + color, 'ok');
      break;
    }
    case 'sudo':
      P('mabushelbaia is not in the sudoers file. This incident will be reported.', 'err');
      break;
    case 'clear': {
      var out = document.getElementById('serialOut'); if (out) out.innerHTML = '';
      break;
    }
    case 'exit':
    case 'detach':
      P('detaching…', 'dim');
      setTimeout(function () { closeConsole(); }, 180);
      break;
    default:
      P(cmd + ': command not found — try `help`', 'err');
  }
}

function handleConsoleKey(e) {
  if (e.key === 'Escape') { e.preventDefault(); closeConsole(); return; }
  if (egg.booting) { e.preventDefault(); return; }

  if (e.key === 'Enter') {
    e.preventDefault();
    var cmd = egg.line.trim();
    print('mabushelbaia@cortex-m4:~$ ' + egg.line, 'cmd-echo');
    if (cmd) { egg.history.unshift(cmd); egg.hIdx = -1; }
    runCommand(cmd);
    egg.line = '';
    renderLine();
  } else if (e.key === 'Backspace') {
    e.preventDefault();
    egg.line = egg.line.slice(0, -1);
    renderLine();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (egg.hIdx < egg.history.length - 1) { egg.hIdx++; egg.line = egg.history[egg.hIdx]; renderLine(); }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (egg.hIdx > 0) { egg.hIdx--; egg.line = egg.history[egg.hIdx]; }
    else { egg.hIdx = -1; egg.line = ''; }
    renderLine();
  } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    egg.line += e.key;
    renderLine();
  }
}

function openConsole() {
  if (egg.open) return;
  document.body.classList.add('debug');
  egg.open = true;
  egg.booting = true;
  var out = document.getElementById('serialOut');
  if (out) out.innerHTML = '';
  renderLine();

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var boot = [
    ['dim','[    0.000000] reset: power-on, vector table @ 0x00000000'],
    ['dim','[    0.000412] clock: PLL locked, SYSCLK = 80.000 MHz'],
    ['dim','[    0.001190] mpu: 8 regions, D-cache off, I-cache on'],
    ['dim','[    0.002048] gpio: PORTF initialized, onboard LED @ PF1..PF3'],
    ['dim','[    0.003501] uart0: 115200 8N1, fifo enabled'],
    ['ok', '[    0.004933] rtos: scheduler started, 3 tasks ready'],
    ['ok', '[    0.005120] init: userspace up'],
    ['', ''],
    ['ok', 'mabushelbaia firmware v1.0.0  —  type `help` for commands, ESC to detach'],
    ['', '']
  ];
  var i = 0;
  (function step() {
    if (!egg.open) return;
    if (i >= boot.length) { egg.booting = false; renderLine(); return; }
    var row = boot[i++];
    print(row[1], row[0]);
    setTimeout(step, reduce ? 0 : 95 + Math.random() * 110);
  })();
}

// ---- Konami easter egg ----
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  var seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var pos = 0;

  function updateHint() {
    var kbds = document.querySelectorAll('.konami-hint kbd');
    for (var i = 0; i < kbds.length; i++) kbds[i].classList.toggle('matched', i < pos);
  }

  console.log('%c psst — try ▲▲▼▼◀▶◀▶BA', 'color:#ff8200;font-family:monospace');

  window.addEventListener('keydown', function (e) {
    if (egg.open) { handleConsoleKey(e); return; }
    var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    var wasCorrect = (key === seq[pos]);
    pos = wasCorrect ? pos + 1 : (key === seq[0] ? 1 : 0);
    if (wasCorrect) triggerWobble();
    updateHint();
    if (pos === seq.length) {
      pos = 0;
      updateHint();
      openConsole();
    }
  });
})();

// ---- paste into terminal ----
window.addEventListener('paste', function (e) {
  if (!egg.open) return;
  e.preventDefault();
  egg.line += (e.clipboardData || window.clipboardData).getData('text/plain').replace(/[\r\n]+/g, '');
  renderLine();
});

// ---- accent color persistence on page load ----
(function () {
  var saved = localStorage.getItem('accent-color');
  if (saved) applyAccentForCurrentTheme();
})();

