const atharv_mandlavdiya = `
   _  _   _                   __  __              _ _           _ _
  /_\\| |_| |_  __ _ _ ___ __ |  \\/  |__ _ _ _  __| | |__ ___ ____| (_)_  _ __ _
 / _ \\  _| ' \\/ _\` | '_\\ V / | |\\/| / _\` | ' \\/ _\` | / _\` \\ V / _\` | | || / _\` |
/_/ \\_\\__|_||_\\__,_|_|  \\_/  |_|  |_\\__,_|_||_\\__,_|_\\__,_|\\_/\\__,_|_|\\_, \\__,_|
                                                                          |__/
`;

export function atharvm() {
  console.log(atharv_mandlavdiya);
}

const _svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650 200" width="650" height="200">
  <defs>
    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#404040" stop-opacity="1" />
      <stop offset="100%" stop-color="#4ecdc4" stop-opacity="1" />
    </linearGradient>
    <filter id="noise" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n" />
      <feColorMatrix in="n" type="saturate" values="0" />
    </filter>
  </defs>
  <rect width="650" height="200" fill="#000" />
  <rect width="650" height="200" filter="url(#noise)" opacity="0.15" style="mix-blend-mode:overlay" />
  <path
    d="M 73 100 C 140.5 62, 230.5 78, 298 40 C 320.5 38, 350.5 102, 373 100 C 283 80, 163 120, 73 100 C 122.5 62, 188.5 78, 238 40 C 251.5 56, 269.5 144, 283 160 C 337 140, 409 180, 463 160 C 346 122, 190 138, 73 100 C 172 98, 304 162, 403 160 C 340 122, 256 138, 193 100 C 301 80, 445 120, 553 100 C 409 80, 217 120, 73 100 C 136 98, 220 162, 283 160 C 256 122, 220 138, 193 100 C 278.5 62, 392.5 78, 478 40 C 442 20, 394 60, 358 40 C 272.5 38, 158.5 102, 73 100"
    fill="none"
    stroke="url(#pathGradient)"
    stroke-width="3"
    stroke-linecap="round"
    stroke-linejoin="round"
    pathLength="1000"
    stroke-dasharray="1000"
  >
    <animate
      attributeName="stroke-dashoffset"
      values="1000;0;0;-1000"
      keyTimes="0;0.6;0.85;1"
      dur="6s"
      repeatCount="indefinite"
    />
  </path>
</svg>`;

export function signature() {
  return _svg;
}

export function sign() {
  const PATH_D = "M 73 100 C 140.5 62, 230.5 78, 298 40 C 320.5 38, 350.5 102, 373 100 C 283 80, 163 120, 73 100 C 122.5 62, 188.5 78, 238 40 C 251.5 56, 269.5 144, 283 160 C 337 140, 409 180, 463 160 C 346 122, 190 138, 73 100 C 172 98, 304 162, 403 160 C 340 122, 256 138, 193 100 C 301 80, 445 120, 553 100 C 409 80, 217 120, 73 100 C 136 98, 220 162, 283 160 C 256 122, 220 138, 193 100 C 278.5 62, 392.5 78, 478 40 C 442 20, 394 60, 358 40 C 272.5 38, 158.5 102, 73 100";
  const SVG_W = 650;
  const SVG_H = 200;

  return `<canvas id="am-sig-canvas" style="display:block;touch-action:pan-y;" width="1300" height="400"></canvas>
<script>
(function() {
  var VERTEX_SHADER = \`
    attribute vec2 aPosition;
    attribute float aSize;
    attribute float aAlpha;
    uniform vec2 uResolution;
    varying float vAlpha;
    void main() {
      vec2 clip = (aPosition / uResolution) * 2.0 - 1.0;
      clip.y *= -1.0;
      gl_Position = vec4(clip, 0.0, 1.0);
      gl_PointSize = aSize;
      vAlpha = aAlpha;
    }
  \`;

  var FRAGMENT_SHADER = \`
    precision mediump float;
    varying float vAlpha;
    void main() {
      vec2 d = gl_PointCoord - 0.5;
      float r = length(d) * 2.0;
      if (r > 1.0) discard;
      float a = (1.0 - smoothstep(0.55, 0.95, r)) * vAlpha;
      gl_FragColor = vec4(1.0, 1.0, 1.0, a);
    }
  \`;

  var canvas = document.getElementById('am-sig-canvas');
  if (!canvas) return;

  var gl = canvas.getContext('webgl', { premultipliedAlpha: false, alpha: true, antialias: true });
  if (!gl) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function compile(type, source) {
    var s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    return s;
  }

  var program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX_SHADER));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
  gl.linkProgram(program);
  gl.useProgram(program);

  var aPos   = gl.getAttribLocation(program, 'aPosition');
  var aSize  = gl.getAttribLocation(program, 'aSize');
  var aAlpha = gl.getAttribLocation(program, 'aAlpha');
  var uRes   = gl.getUniformLocation(program, 'uResolution');

  var posBuf   = gl.createBuffer();
  var sizeBuf  = gl.createBuffer();
  var alphaBuf = gl.createBuffer();

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  var sampleScale = 2;
  var svgW = ${SVG_W};
  var svgH = ${SVG_H};
  var rW = svgW * sampleScale;
  var rH = svgH * sampleScale;

  var svgBlob = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + svgW + ' ' + svgH + '" width="' + rW + '" height="' + rH + '">'
    + '<path d="${PATH_D}" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
    + '</svg>';

  var svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgBlob);

  var img = new Image();
  img.onload = function() {
    var PAD = 60;
    var canvasW = rW + 2 * PAD;
    var canvasH = rH + 2 * PAD;

    var off = document.createElement('canvas');
    off.width = rW;
    off.height = rH;
    var ctx = off.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, rW, rH);
    var data = ctx.getImageData(0, 0, rW, rH).data;

    var targets = [];
    for (var y = 0; y < rH; y++) {
      for (var x = 0; x < rW; x++) {
        var a = data[(y * rW + x) * 4 + 3] || 0;
        if (a > 64) targets.push({ x: x + 0.5, y: y + 0.5, a: a / 255 });
      }
    }

    canvas.width  = canvasW;
    canvas.height = canvasH;
    gl.viewport(0, 0, canvasW, canvasH);
    gl.uniform2f(uRes, canvasW, canvasH);

    var cx = canvasW / 2;
    var cy = canvasH / 2;

    var particles = targets.map(function(t) {
      var tx = t.x + PAD;
      var ty = t.y + PAD;
      var angle = Math.random() * Math.PI * 2;
      var dist  = Math.max(canvasW, canvasH) * (0.55 + Math.random() * 0.6);
      var delay = reduced ? 0 : (t.x / rW) * 0.48 + Math.random() * 0.24;
      return {
        tx: tx, ty: ty,
        x: reduced ? tx : cx + Math.cos(angle) * dist,
        y: reduced ? ty : cy + Math.sin(angle) * dist,
        vx: 0, vy: 0,
        delay: delay,
        arrived: reduced,
        size: 1.5 + Math.random() * 0.4,
        baseAlpha: t.a,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2
      };
    });

    var N = particles.length;
    var positions = new Float32Array(N * 2);
    var alphas    = new Float32Array(N);
    var sizesArr  = new Float32Array(N);
    for (var i = 0; i < N; i++) sizesArr[i] = particles[i].size;

    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuf);
    gl.bufferData(gl.ARRAY_BUFFER, sizesArr, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(aSize);
    gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuf);
    gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(aAlpha);
    gl.vertexAttribPointer(aAlpha, 1, gl.FLOAT, false, 0, 0);

    var k          = 0.014;
    var damp       = 0.8;
    var mr         = 130;
    var mForce     = 5.5;
    var driftAmp   = 0.12;
    var fadeDur    = 0.48;
    var revealBand = 140;
    var arriveDist = 6;

    function smoothstep(e0, e1, x) {
      var t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
      return t * t * (3 - 2 * t);
    }

    var mouse = { x: -1e6, y: -1e6, has: false };
    var startTime    = 0;
    var rafId        = null;
    var rafScheduled = false;
    var isVisible    = true;

    function step(elapsed) {
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var t = elapsed - p.delay;
        if (t < 0) {
          positions[i * 2]     = -1e6;
          positions[i * 2 + 1] = -1e6;
          alphas[i] = 0;
          continue;
        }

        var driftX = Math.sin(elapsed * 0.5 + p.tx * 0.006 + p.phaseX * 0.15) * driftAmp;
        var driftY = Math.cos(elapsed * 0.42 + p.ty * 0.01  + p.phaseY * 0.15) * driftAmp;
        var tgtX = p.tx + driftX;
        var tgtY = p.ty + driftY;

        var ax = (tgtX - p.x) * k;
        var ay = (tgtY - p.y) * k;

        if (!reduced && mouse.has) {
          var dx  = p.x - mouse.x;
          var dy  = p.y - mouse.y;
          var d2  = dx * dx + dy * dy;
          if (d2 < mr * mr && d2 > 0.5) {
            var d       = Math.sqrt(d2);
            var falloff = 1 - d / mr;
            var force   = falloff * falloff * mForce;
            ax += (dx / d) * force;
            ay += (dy / d) * force;
          }
        }

        p.vx = (p.vx + ax) * damp;
        p.vy = (p.vy + ay) * damp;
        p.x += p.vx;
        p.y += p.vy;

        positions[i * 2]     = p.x;
        positions[i * 2 + 1] = p.y;

        var alpha = Math.min(1, t / fadeDur) * p.baseAlpha;
        if (!p.arrived) {
          var dxr   = p.tx - p.x;
          var dyr   = p.ty - p.y;
          var dist2 = dxr * dxr + dyr * dyr;
          if (dist2 < arriveDist * arriveDist) {
            p.arrived = true;
          } else {
            alpha *= 1 - smoothstep(arriveDist, revealBand, Math.sqrt(dist2));
          }
        }
        alphas[i] = alpha;
      }
    }

    var STEP_MS = 1000 / 60;
    var lastNow = 0;
    var accMs   = 0;
    var simMs   = 0;

    function render() {
      rafScheduled = false;
      if (!isVisible) return;

      var now = performance.now();
      if (startTime === 0) {
        startTime = now;
        lastNow   = now - STEP_MS;
      }

      var frameDt = now - lastNow;
      lastNow = now;
      if (frameDt > 250) frameDt = STEP_MS;

      accMs += frameDt;
      if (accMs > STEP_MS * 5) accMs = STEP_MS * 5;

      while (accMs >= STEP_MS) {
        step(simMs / 1000);
        simMs += STEP_MS;
        accMs -= STEP_MS;
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);

      gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, alphas);

      gl.drawArrays(gl.POINTS, 0, particles.length);

      rafScheduled = true;
      rafId = requestAnimationFrame(render);
    }

    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) { isVisible = e.isIntersecting; });
      if (isVisible && !rafScheduled) {
        rafScheduled = true;
        rafId = requestAnimationFrame(render);
      }
    }, { threshold: 0 });
    io.observe(canvas);

    rafScheduled = true;
    rafId = requestAnimationFrame(render);

    function setMouse(cx, cy) {
      var rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      mouse.x   = (cx - rect.left) * (canvas.width  / rect.width);
      mouse.y   = (cy - rect.top)  * (canvas.height / rect.height);
      mouse.has = true;
    }

    window.addEventListener('mousemove', function(e) { setMouse(e.clientX, e.clientY); }, { passive: true });
    canvas.addEventListener('touchmove', function(e) { var t = e.touches[0]; if (t) setMouse(t.clientX, t.clientY); }, { passive: true });
    canvas.addEventListener('touchend',    function() { mouse.has = false; }, { passive: true });
    canvas.addEventListener('touchcancel', function() { mouse.has = false; }, { passive: true });
    document.addEventListener('mouseleave', function() { mouse.has = false; });
  };

  img.src = svgUrl;
})();
</script>`;
}
