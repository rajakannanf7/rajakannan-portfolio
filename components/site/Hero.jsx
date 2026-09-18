'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Accent } from './bits';

gsap.registerPlugin(ScrollTrigger);

const FS = `precision highp float;
uniform sampler2D A,B,M;uniform vec2 res,ir;uniform float t,sc;varying vec2 uv;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
vec2 cover(vec2 u){float rs=res.x/res.y,ri=ir.x/ir.y;vec2 s=rs>ri?vec2(1.,ri/rs):vec2(rs/ri,1.);return (u-.5)*s+.5;}
void main(){
  float nz=n(uv*5.+t*.12)*.6+n(uv*13.-t*.18)*.3+n(uv*31.+t*.3)*.1;
  float mk=texture2D(M,uv).r;
  float e=smoothstep(.32,.62,mk+(nz-.5)*.55);
  float ring=clamp(e*(1.-e)*4.,0.,1.);
  vec2 cu=cover((uv-.5)*(1.-sc*.08)+.5);
  vec2 d=(vec2(nz,n(uv*7.+3.))-.5)*.05*ring;
  vec3 a=texture2D(A,cu+d*.5).rgb;
  float ca=.007*ring+.0012*e;
  vec3 b=vec3(texture2D(B,cu+d+vec2(ca,0.)).r,texture2D(B,cu+d).g,texture2D(B,cu+d-vec2(ca,0.)).b);
  vec3 c=mix(a,b,e);
  c+=vec3(1.,.23,.12)*pow(ring,1.5)*.55;
  c*=1.-.45*pow(length(uv-.5)*1.25,2.);
  c*=1.-sc*.55;
  gl_FragColor=vec4(c,1.);
}`;
const VS = 'attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';

// Full-screen "develop" effect: the cursor paints a fading mask that reveals the
// unreal render under the captured photo. Falls back to the plain photo without WebGL.
export default function Hero({ site }) {
  const root = useRef(null);
  const canvas = useRef(null);
  const [loader, setLoader] = useState(true);
  const [glOk, setGlOk] = useState(false);

  // ---------- loader (first visit per session only) ----------
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem('rk-loaded') === '1'; } catch {}
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lines = root.current.querySelectorAll('h1 .ln>span');
    const rest = root.current.querySelectorAll('.hero-row, .tagl, .readout');
    const reveal = (delay = 0) => {
      if (reduce) { gsap.set(lines, { y: 0 }); return; }
      gsap.to(lines, { y: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out', delay });
      gsap.from(rest, { opacity: 0, y: 20, duration: 1, stagger: 0.08, ease: 'expo.out', delay: delay + 0.3 });
    };
    if (seen || reduce) { setLoader(false); reveal(0.1); return; }

    document.body.classList.add('is-loading');
    const cnt = document.getElementById('ld-count'), bar = document.getElementById('ld-bar');
    const imgs = [site.heroCaptured, site.heroUnreal];
    let loaded = 0, raf;
    imgs.forEach((s) => { const i = new Image(); i.onload = i.onerror = () => loaded++; i.src = s; });
    const t0 = performance.now();
    const tick = () => {
      const el = performance.now() - t0, ok = loaded === imgs.length;
      const v = Math.min(ok ? 100 : 90, el / 16);
      cnt.textContent = String(Math.floor(v)).padStart(3, '0');
      bar.style.width = v + '%';
      if (v < 100 && el < 4000) { raf = requestAnimationFrame(tick); return; }
      try { sessionStorage.setItem('rk-loaded', '1'); } catch {}
      gsap.timeline({ onComplete: () => setLoader(false) })
        .to('.safelight', { scaleY: 1, duration: 0.55, ease: 'expo.in' })
        .add(() => { document.body.classList.remove('is-loading'); document.querySelector('.loader').style.display = 'none'; })
        .set('.safelight', { transformOrigin: 'top' })
        .to('.safelight', { scaleY: 0, duration: 0.8, ease: 'expo.out' })
        .add(() => reveal(0), '-=.55');
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); document.body.classList.remove('is-loading'); };
  }, [site.heroCaptured, site.heroUnreal]);

  // ---------- WebGL ----------
  useEffect(() => {
    const cv = canvas.current, heroEl = root.current;
    const gl = cv.getContext('webgl', { antialias: false });
    if (!gl) return;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (k) => gl.getUniformLocation(pr, k);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    const tex = (unit, src) => {
      const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
      [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((p) => gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src); return t;
    };
    gl.uniform1i(U('A'), 0); gl.uniform1i(U('B'), 1); gl.uniform1i(U('M'), 2);

    const MW = 256, MH = 144, mc = document.createElement('canvas'), mx = mc.getContext('2d', { willReadFrequently: true });
    mc.width = MW; mc.height = MH; mx.fillStyle = '#000'; mx.fillRect(0, 0, MW, MH);

    const size = () => { const d = Math.min(devicePixelRatio, 1.75); cv.width = cv.clientWidth * d; cv.height = cv.clientHeight * d; gl.viewport(0, 0, cv.width, cv.height); gl.uniform2f(U('res'), cv.width, cv.height); };
    size(); addEventListener('resize', size);

    let px = 0.5, py = 0.5, lx = 0.5, ly = 0.5, last = -1e4, inView = true, scroll = 0, frame = 0, raf, alive = true;
    const move = (e) => { const r = heroEl.getBoundingClientRect(); px = (e.clientX - r.left) / r.width; py = (e.clientY - r.top) / r.height; last = performance.now(); };
    heroEl.addEventListener('pointermove', move);
    const io = new IntersectionObserver(([en]) => (inView = en.isIntersecting)); io.observe(heroEl);
    const onScroll = () => (scroll = Math.min(1, scrollY / innerHeight));
    addEventListener('scroll', onScroll, { passive: true });
    const xy = heroEl.querySelector('#xy'), dev = heroEl.querySelector('#dev');
    const load = (src) => new Promise((r) => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });

    const loop = (now) => {
      if (!alive) return;
      raf = requestAnimationFrame(loop);
      if (!inView) return;
      const t = now / 1000, idle = now - last > 2200;
      if (idle) { px = 0.5 + 0.3 * Math.sin(t * 0.55) + 0.08 * Math.sin(t * 1.7); py = 0.5 + 0.22 * Math.sin(t * 0.8 + 1.2); }
      const dx = px - lx, dy = py - ly, sp = Math.min(1, Math.hypot(dx, dy) * 18);
      lx += dx * 0.18; ly += dy * 0.18;
      mx.globalCompositeOperation = 'source-over'; mx.fillStyle = 'rgba(0,0,0,0.028)'; mx.fillRect(0, 0, MW, MH);
      mx.globalCompositeOperation = 'lighter';
      const R = (idle ? 26 : 22) + sp * 26, g = mx.createRadialGradient(lx * MW, ly * MH, 0, lx * MW, ly * MH, R);
      g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      mx.fillStyle = g; mx.beginPath(); mx.arc(lx * MW, ly * MH, R, 0, 7); mx.fill();
      gl.activeTexture(gl.TEXTURE2); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mc);
      gl.uniform1f(U('t'), t); gl.uniform1f(U('sc'), scroll);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (++frame % 10 === 0 && xy) {
        const d = mx.getImageData(0, 0, MW, MH).data; let s = 0;
        for (let i = 0; i < d.length; i += 64) if (d[i] > 110) s++;
        xy.textContent = `X ${lx.toFixed(3)} · Y ${ly.toFixed(3)}`;
        dev.textContent = Math.round((s / (d.length / 64)) * 100) + '%';
      }
    };

    Promise.all([load(site.heroCaptured), load(site.heroUnreal)]).then(([a, b]) => {
      if (!alive || !a || !b) return;
      try { tex(0, a); tex(1, b); tex(2, mc); } catch { return; } // cross-origin image without CORS
      gl.uniform2f(U('ir'), a.width, a.height);
      setGlOk(true);
      raf = requestAnimationFrame(loop);
    });

    // headline drifts up and fades as you leave the hero
    const st = matchMedia('(prefers-reduced-motion: reduce)').matches ? null :
      gsap.to(heroEl.querySelector('.hero-ui'), { yPercent: -18, opacity: 0, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } });

    return () => {
      alive = false; cancelAnimationFrame(raf); io.disconnect();
      removeEventListener('resize', size); removeEventListener('scroll', onScroll);
      heroEl.removeEventListener('pointermove', move);
      st && st.scrollTrigger && st.scrollTrigger.kill(); st && st.kill();
      // No loseContext() here: React strict mode remounts on the same canvas,
      // and a lost context can't be reacquired. The GC frees it on real unmount.
    };
  }, [site.heroCaptured, site.heroUnreal]);

  const [l1, l2] = String(site.headline || '').split('|');

  return (
    <>
      {loader && (
        <>
          <div className="loader" aria-hidden="true">
            <div className="top mono"><span>RK / Darkroom</span><span>Developing roll 07</span></div>
            <div className="count" id="ld-count">000</div>
            <div className="bot mono"><span>{site.city}</span><span>Loading the frame</span></div>
            <div className="bar" id="ld-bar" />
          </div>
          <div className="safelight" aria-hidden="true" />
        </>
      )}
      <section className="hero" ref={root}>
        <img className="fallback" src={site.heroCaptured} alt="Studio photograph that turns into its CGI version under the cursor" style={{ visibility: glOk ? 'hidden' : 'visible' }} />
        <canvas ref={canvas} aria-hidden="true" />
        <div className="shade" />
        <div className="tagl mono"><b />Live / Frame 0701<br />Hasselblad 80mm → Redshift</div>
        <div className="readout mono"><span id="xy">X 0.500 · Y 0.500</span><br />Developed <b id="dev">0%</b></div>
        <div className="hero-ui">
          <h1>
            <span className="ln"><span>{l1}</span></span>
            <span className="ln"><span>{l2} <span className="it">{site.headlineAccent}</span></span></span>
          </h1>
          <div className="hero-row">
            <p>{site.intro}</p>
            <div className="hint mono"><i>↔</i><span>Move to develop the frame</span></div>
          </div>
        </div>
      </section>
    </>
  );
}
