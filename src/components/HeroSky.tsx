import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildRocket } from "./buildRocket";

// A deep sky that feels endless. Stars sit between 8 and 272 units away, spread
// evenly in log-distance (so plenty are near, and the far ones thin into dust),
// and all drift toward the camera in log-distance, wrapping at the far end where
// they fade in: a slow, permanent zoom, so there is always more to fly into. Each star has a fixed screen
// direction, so near ones sweep outward past you while the far ones, down to
// sub-pixel dust, hardly move: that is the parallax. A faint diagonal band of
// dense, tiny, bluer stars acts as a distant galaxy.

const STARS = 2300;
const DMIN = 8; // nearest / farthest distance from the camera
const DMAX = 272;
const DRIFT = 0.02; // log-distance per second: a slow zoom into the dark
const SCROLL_PARALLAX = 0.0065; // world units of camera lift per scrolled px
const POINTER_X = 1.1;
const POINTER_Y = 0.7;
const EASE = 0.04; // camera follows its target this fast (per 60Hz frame)

function mulberry32(seed: number) {
	let a = seed;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const VERT = /* glsl */ `
	attribute float aSize;
	attribute float aPhase;
	attribute vec3 aColor;
	uniform float uTime;
	uniform float uTravel;
	uniform float uPx;
	uniform vec2 uRocket;
	uniform float uAspect;
	uniform float uPush;
	varying float vA;
	varying float vFade;
	varying float vSoft;
	varying vec3 vCol;
	const float DMIN = ${DMIN}.0;
	const float DMAX = ${DMAX}.0;
	void main() {
		// position = (screen-direction x, y, phase 0..1 in log-distance). The
		// phase slides and wraps; world position follows from distance, so each
		// star keeps its direction while it approaches.
		float dist = DMIN * exp(log(DMAX / DMIN) * fract(position.z - uTravel));
		float z = 12.0 - dist;
		vec4 mv = modelViewMatrix * vec4(position.x * dist, position.y * dist, z, 1.0);
		vec4 clip = projectionMatrix * mv;
		// Rocket wake: stars near it are pushed aside (in screen space) and glow.
		vec2 ndc = clip.xy / clip.w;
		vec2 dlt = ndc - uRocket;
		float wake = smoothstep(0.4, 0.0, length(dlt * vec2(uAspect, 1.0))) * uPush;
		ndc += dlt / (length(dlt) + 0.02) * wake * 0.07;
		clip.xy = ndc * clip.w;
		gl_Position = clip;

		// Far stars shrink below a pixel: hold a 1px floor and fade instead, so
		// the distance reads as faint dust rather than shimmering noise.
		float ps = aSize * uPx * (30.0 / dist) * (1.0 + wake * 0.6);
		float floorPx = 1.9 * uPx;
		gl_PointSize = clamp(ps, floorPx, 12.0 * uPx);
		float sub = clamp(ps / floorPx, 0.3, 1.0);

		// Seam fade (far end), close fade (right in front of the lens), and
		// atmospheric dimming with distance.
		float far = 1.0 - smoothstep(170.0, DMAX, dist);
		float close = smoothstep(DMIN, 18.0, dist);
		float haze = mix(1.0, 0.65, clamp((dist - 40.0) / 200.0, 0.0, 1.0));

		// Every star has its own pace: most breathe slowly, a few flicker fast.
		float tw = 0.5 + 0.5 * sin(uTime * (0.3 + aPhase * aPhase * 2.6) + aPhase * 40.0);
		vA = min(1.0, tw + wake * 0.9);
		vFade = far * close * haze * sub;
		// Nearer stars are out of focus: wider, softer edge.
		vSoft = 1.0 - clamp((dist - 6.0) / 34.0, 0.0, 1.0);
		// Distant stars drift toward blue.
		vCol = mix(aColor, vec3(0.45, 0.58, 1.0), clamp((dist - 50.0) / 200.0, 0.0, 1.0) * 0.7);
	}
`;
const FRAG = /* glsl */ `
	uniform vec2 uRes;
	varying float vA;
	varying float vFade;
	varying float vSoft;
	varying vec3 vCol;
	void main() {
		vec2 pc = gl_PointCoord - vec2(0.5);
		float d = length(pc);
		float core = smoothstep(0.5, mix(0.3, 0.0, vSoft), d);
		float a = core * (0.55 + 0.45 * vA) * mix(1.0, 0.6, vSoft) * vFade * 1.3;
		// Calm zone: stars dim behind the headline so the text keeps the focus,
		// and are at full strength toward the edges.
		vec2 v = gl_FragCoord.xy / uRes;
		float dd = length(vec2((v.x - 0.5) * 1.25, v.y - 0.55));
		a *= mix(0.22, 1.0, smoothstep(0.12, 0.55, dd));
		gl_FragColor = vec4(vCol, clamp(a, 0.0, 1.0));
	}
`;

const TRAIL_VERT = /* glsl */ `
	attribute float aAge;
	uniform float uPx;
	varying float vAge;
	void main() {
		vAge = aAge;
		vec4 mv = modelViewMatrix * vec4(position, 1.0);
		gl_Position = projectionMatrix * mv;
		gl_PointSize = mix(20.0, 3.0, aAge) * uPx * (12.0 / -mv.z);
	}
`;
const TRAIL_FRAG = /* glsl */ `
	varying float vAge;
	void main() {
		float d = length(gl_PointCoord - vec2(0.5));
		float a = smoothstep(0.5, 0.0, d) * pow(1.0 - vAge, 1.6) * 0.6;
		vec3 yellow = vec3(1.0, 0.88, 0.45);
		vec3 orange = vec3(1.0, 0.5, 0.14);
		vec3 ember = vec3(0.75, 0.3, 0.3);
		vec3 c = vAge < 0.35 ? mix(yellow, orange, vAge / 0.35) : mix(orange, ember, (vAge - 0.35) / 0.65);
		gl_FragColor = vec4(c, a);
	}
`;

const METEOR_VERT = /* glsl */ `
	varying vec2 vUv;
	void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const METEOR_FRAG = /* glsl */ `
	uniform float uAlpha;
	varying vec2 vUv;
	void main() {
		float along = pow(1.0 - vUv.x, 2.2);          // bright head at x=0
		float across = exp(-abs(vUv.y - 0.5) * 22.0);   // thin streak
		gl_FragColor = vec4(0.85, 0.93, 1.0, along * across * uAlpha);
	}
`;

export default function HeroSky() {
	const host = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = host.current;
		if (!el) return;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		const px = Math.min(window.devicePixelRatio, 2);
		renderer.setPixelRatio(px);
		renderer.setClearColor(0x000000, 0);
		renderer.domElement.style.cssText =
			"position:absolute;inset:0;display:block;width:100%;height:100%";
		el.appendChild(renderer.domElement);

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 400);
		camera.position.set(0, 0, 12);

		// position = (screen direction x, y, depth phase), see the vertex shader.
		const rand = mulberry32(23);
		const gauss = () => (rand() + rand() + rand() - 1.5) * 0.8;
		const pos = new Float32Array(STARS * 3);
		const size = new Float32Array(STARS);
		const phase = new Float32Array(STARS);
		const color = new Float32Array(STARS * 3);
		const palette: [number, number, number][] = [
			[0.85, 0.92, 1.0], // cool white
			[1.0, 1.0, 1.0], // white
			[1.0, 0.84, 0.64], // warm
			[0.45, 0.7, 1.0], // blue
			[0.82, 0.68, 1.0], // violet
		];
		const bandColors: [number, number, number][] = [
			[0.62, 0.72, 1.0],
			[0.78, 0.7, 1.0],
			[0.9, 0.93, 1.0],
		];
		for (let i = 0; i < STARS; i++) {
			const band = rand() < 0.32;
			let rx: number;
			let ry: number;
			if (band) {
				// The galaxy band: tiny, dense, bluish, along a diagonal.
				rx = (rand() - 0.5) * 2.4;
				ry = rx * 0.32 + gauss() * 0.09;
			} else {
				// 0.466 = tan(half fov); the extra top headroom covers scroll lift.
				rx = (rand() - 0.5) * 2.3;
				ry = -0.55 + rand() * 1.25;
			}
			pos[i * 3] = rx;
			pos[i * 3 + 1] = ry;
			pos[i * 3 + 2] = rand();
			const k = rand();
			const pal = band
				? bandColors[Math.floor(rand() * 3)]
				: palette[k < 0.5 ? 0 : k < 0.68 ? 1 : k < 0.82 ? 2 : k < 0.94 ? 3 : 4];
			color.set(pal, i * 3);
			// Wide spread: mostly pinpricks, a fair number of mid stars, a few big soft ones.
			size[i] = band ? 0.5 + rand() * 0.7 : 0.6 + Math.pow(rand(), 3) * 6.5;
			phase[i] = rand();
		}
		const geo = new THREE.BufferGeometry();
		geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
		geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
		geo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
		geo.setAttribute("aColor", new THREE.BufferAttribute(color, 3));
		const mat = new THREE.ShaderMaterial({
			vertexShader: VERT,
			fragmentShader: FRAG,
			uniforms: {
				uTime: { value: 0 },
				uTravel: { value: 0 },
				uPx: { value: px },
				uRes: { value: new THREE.Vector2(1, 1) },
				uRocket: { value: new THREE.Vector2(9, 9) },
				uAspect: { value: 1 },
				uPush: { value: 0.3 },
			},
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
		});
		const stars = new THREE.Points(geo, mat);
		stars.frustumCulled = false; // positions are directions, not world coords
		stars.renderOrder = 2;
		scene.add(stars);

		const disposables: { dispose(): void }[] = [geo, mat];

		// Shooting star: one thin streak, respawned near the camera every so often.
		const meteorMat = new THREE.ShaderMaterial({
			vertexShader: METEOR_VERT,
			fragmentShader: METEOR_FRAG,
			uniforms: { uAlpha: { value: 0 } },
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
		});
		const meteorGeo = new THREE.PlaneGeometry(4.5, 0.09);
		meteorGeo.translate(2.25, 0, 0); // pivot at the head
		const meteor = new THREE.Mesh(meteorGeo, meteorMat);
		meteor.rotation.z = Math.atan2(0.42, 1); // tail trails up and to the right
		meteor.renderOrder = 3;
		scene.add(meteor);
		disposables.push(meteorMat, meteorGeo);
		const MET_LIFE = 1.5; // s
		let metT = -3 - rand() * 4; // negative = waiting
		let metX = 0;
		let metY = 0;


		// ---- The rocket -------------------------------------------------------
		// Lives on a plane glued to the camera (so scroll parallax doesn't carry
		// it away). Three modes: it cruises a lazy loop by itself; grabbing it
		// with the mouse drags it with a little spring lag; letting go throws it,
		// and it coasts, bounces off the edges, then drifts back to its loop. A
		// tap (grab without moving) fires a boost. Stars part around it.
		const PLANE_Z = -12;
		const HALF_H = Math.tan(THREE.MathUtils.degToRad(25)) * -PLANE_Z;
		const S = 0.6; // rocket scale
		const plane = new THREE.Group();
		plane.position.z = PLANE_Z;
		camera.add(plane);
		scene.add(camera);
		const lightRig: [THREE.Light, number, number, number][] = [
			[new THREE.PointLight(0xffffff, 95, 22, 2), 3, 4, -6],
			[new THREE.PointLight(0xffa066, 60, 22, 2), -4, -3, -7],
			[new THREE.PointLight(0x6a8bff, 70, 22, 2), 4, 2, -8],
		];
		for (const [l, x, y, z] of lightRig) {
			l.position.set(x, y, z);
			camera.add(l);
		}
		const ambient = new THREE.AmbientLight(0xdde4ff, 1.6);
		camera.add(ambient);

		const rocket = buildRocket();
		rocket.root.scale.setScalar(S);
		plane.add(rocket.root);
		disposables.push(rocket);

		// Exhaust sparks: a small ring-buffer pool of fading points.
		const TRAIL = 170;
		const tPos = new Float32Array(TRAIL * 3);
		const tVel = new Float32Array(TRAIL * 2);
		const tAge = new Float32Array(TRAIL).fill(1);
		const trailGeo = new THREE.BufferGeometry();
		const tPosAttr = new THREE.BufferAttribute(tPos, 3);
		const tAgeAttr = new THREE.BufferAttribute(tAge, 1);
		tPosAttr.setUsage(THREE.DynamicDrawUsage);
		tAgeAttr.setUsage(THREE.DynamicDrawUsage);
		trailGeo.setAttribute("position", tPosAttr);
		trailGeo.setAttribute("aAge", tAgeAttr);
		const trailMat = new THREE.ShaderMaterial({
			vertexShader: TRAIL_VERT,
			fragmentShader: TRAIL_FRAG,
			uniforms: { uPx: { value: px } },
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
		});
		const trail = new THREE.Points(trailGeo, trailMat);
		trail.frustumCulled = false;
		trail.renderOrder = 4;
		plane.add(trail);
		disposables.push(trailGeo, trailMat);
		let tNext = 0;

		type Mode = "cruise" | "drag" | "coast";
		let mode: Mode = "cruise";
		let rx = 0;
		let ry = 0;
		let rvx = 0;
		let rvy = 0;
		let heading = Math.PI * 0.3;
		let thrust = 0.4;
		let boost = 0;
		let placed = false;
		let hover = false;
		let hasMouse = false;
		let grabDX = 0;
		let grabDY = 0;
		let dragMoved = 0;
		let lastCX = 0;
		let lastCY = 0;
		const ptr = new THREE.Vector2(); // pointer in NDC

		const dims = () => ({ hh: HALF_H, hw: HALF_H * camera.aspect });
		const cruisePath = (t: number, hw: number, hh: number) => ({
			x: Math.sin(t * 0.16) * hw * 0.74,
			y: (Math.sin(t * 0.23 + 1) * 0.55 - 0.1) * hh * 0.85,
		});
		const hitRocket = () => {
			const { hw, hh } = dims();
			const px0 = ptr.x * hw;
			const py0 = ptr.y * hh;
			const ax = Math.cos(heading) * 0.9 * S;
			const ay = Math.sin(heading) * 0.9 * S;
			const x1 = rx - ax;
			const y1 = ry - ay;
			const vx = ax * 2;
			const vy = ay * 2;
			const t = Math.min(
				1,
				Math.max(0, ((px0 - x1) * vx + (py0 - y1) * vy) / (vx * vx + vy * vy)),
			);
			return Math.hypot(px0 - (x1 + vx * t), py0 - (y1 + vy * t)) < 0.75 * S;
		};
		const setHover = (over: boolean) => {
			if (over === hover) return;
			hover = over;
			el.style.pointerEvents = over ? "auto" : "none";
			el.style.cursor = over ? "grab" : "";
		};
		const placeRocket = () => {
			rocket.root.position.set(rx, ry, 0);
			rocket.root.rotation.z = heading - Math.PI / 2;
		};

		const onDown = (e: PointerEvent) => {
			if (e.pointerType === "touch" || !hover) return;
			const { hw, hh } = dims();
			ptr.set(
				(e.clientX / window.innerWidth) * 2 - 1,
				-((e.clientY / window.innerHeight) * 2 - 1),
			);
			mode = "drag";
			grabDX = ptr.x * hw - rx;
			grabDY = ptr.y * hh - ry;
			dragMoved = 0;
			lastCX = e.clientX;
			lastCY = e.clientY;
			el.setPointerCapture(e.pointerId);
			el.style.cursor = "grabbing";
		};
		const onUp = () => {
			if (mode !== "drag") return;
			mode = "coast";
			el.style.cursor = "grab";
			if (dragMoved < 5) {
				// A tap: kick it forward.
				rvx += Math.cos(heading) * 0.3;
				rvy += Math.sin(heading) * 0.3;
				boost = 1.2;
			}
			const sp = Math.hypot(rvx, rvy);
			if (sp > 0.45) {
				rvx *= 0.45 / sp;
				rvy *= 0.45 / sp;
			}
		};
		el.addEventListener("pointerdown", onDown);
		el.addEventListener("pointerup", onUp);
		el.addEventListener("pointercancel", onUp);

		const stepRocket = (dt: number, time: number) => {
			const { hw, hh } = dims();
			if (!placed) {
				const p0 = cruisePath(time, hw, hh);
				rx = p0.x;
				ry = p0.y;
				placed = true;
			}
			if (mode === "cruise") {
				const p = cruisePath(time, hw, hh);
				const wantX = Math.max(-0.08, Math.min(0.08, (p.x - rx) * 0.05));
				const wantY = Math.max(-0.08, Math.min(0.08, (p.y - ry) * 0.05));
				const k = 1 - Math.pow(1 - 0.04, dt);
				rvx += (wantX - rvx) * k;
				rvy += (wantY - rvy) * k;
				rx += rvx * dt;
				ry += rvy * dt;
			} else if (mode === "drag") {
				const k = 1 - Math.pow(1 - 0.28, dt);
				const mx = (ptr.x * hw - grabDX - rx) * k;
				const my = (ptr.y * hh - grabDY - ry) * k;
				rx += mx;
				ry += my;
				rvx += (mx / dt - rvx) * 0.5;
				rvy += (my / dt - rvy) * 0.5;
			} else {
				rx += rvx * dt;
				ry += rvy * dt;
				const fr = Math.pow(0.985, dt);
				rvx *= fr;
				rvy *= fr;
				const lx = hw - 0.9;
				const ly = hh - 0.9;
				if (rx > lx) ((rx = lx), (rvx = -Math.abs(rvx) * 0.7));
				if (rx < -lx) ((rx = -lx), (rvx = Math.abs(rvx) * 0.7));
				if (ry > ly) ((ry = ly), (rvy = -Math.abs(rvy) * 0.7));
				if (ry < -ly) ((ry = -ly), (rvy = Math.abs(rvy) * 0.7));
				if (Math.hypot(rvx, rvy) < 0.045) mode = "cruise";
			}

			const speed = Math.hypot(rvx, rvy);
			if (speed > 0.012) {
				let diff = Math.atan2(rvy, rvx) - heading;
				diff = Math.atan2(Math.sin(diff), Math.cos(diff));
				heading += diff * (1 - Math.pow(1 - 0.1, dt));
			}
			placeRocket();

			// Flame follows effort: bigger when moving fast or boosting.
			boost *= Math.pow(0.95, dt);
			const want = Math.min(1.4, 0.3 + speed * 5 + boost);
			thrust += (want - thrust) * 0.15;
			rocket.flameMat.uniforms.uTime.value = time;
			const flick = 1 + Math.sin(time * 37) * 0.05;
			rocket.flameRoot.scale.set(0.8 + thrust * 0.3, (0.45 + thrust * 1.0) * flick, 0.8 + thrust * 0.3);
			// Sway, so the porthole stays mostly facing us while the fins show depth.
			rocket.model.rotation.y = Math.sin(time * 0.8) * 0.5;

			// Sparks out of the nozzle, thrown backwards.
			const dx = Math.cos(heading);
			const dy = Math.sin(heading);
			const emit = 1 + Math.floor(thrust * 2);
			for (let n = 0; n < emit; n++) {
				const i = tNext++ % TRAIL;
				const back = 1.05 * S + Math.random() * 0.2;
				tPos[i * 3] = rx - dx * back + (Math.random() - 0.5) * 0.12;
				tPos[i * 3 + 1] = ry - dy * back + (Math.random() - 0.5) * 0.12;
				tVel[i * 2] = -dx * (0.01 + thrust * 0.02) + (Math.random() - 0.5) * 0.008;
				tVel[i * 2 + 1] = -dy * (0.01 + thrust * 0.02) + (Math.random() - 0.5) * 0.008;
				tAge[i] = 0;
			}
			for (let i = 0; i < TRAIL; i++) {
				if (tAge[i] >= 1) continue;
				tAge[i] = Math.min(1, tAge[i] + dt / 54); // ~0.9s life
				tPos[i * 3] += tVel[i * 2] * dt;
				tPos[i * 3 + 1] += tVel[i * 2 + 1] * dt;
			}
			tPosAttr.needsUpdate = true;
			tAgeAttr.needsUpdate = true;

			// Hover test last, against this frame's position.
			if (hasMouse && mode !== "drag") {
				setHover(window.scrollY < window.innerHeight * 0.5 && hitRocket());
			}
			mat.uniforms.uRocket.value.set(rx / hw, ry / hh);
			mat.uniforms.uPush.value = 0.3 + Math.min(1, speed * 4) * 0.7;
		};

		const draw = () => {
			renderer.render(scene, camera);
		};
		const layout = () => {
			const w = el.clientWidth || 1;
			const h = el.clientHeight || 1;
			renderer.setSize(w, h, false);
			mat.uniforms.uRes.value.set(w * px, h * px);
			mat.uniforms.uAspect.value = w / h;
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
			if (reduce) draw();
		};

		// Pointer on the window: the sky is decoration, so text above it stays
		// free to take clicks and we still get the sway.
		const target = new THREE.Vector2();
		const onMove = (e: PointerEvent) => {
			if (e.pointerType !== "touch") {
				hasMouse = true;
				ptr.set(
					(e.clientX / window.innerWidth) * 2 - 1,
					-((e.clientY / window.innerHeight) * 2 - 1),
				);
				if (mode === "drag") {
					dragMoved += Math.abs(e.clientX - lastCX) + Math.abs(e.clientY - lastCY);
					lastCX = e.clientX;
					lastCY = e.clientY;
				}
			}
			target.set(
				(e.clientX / window.innerWidth - 0.5) * 2 * POINTER_X,
				-(e.clientY / window.innerHeight - 0.5) * 2 * POINTER_Y,
			);
		};

		const clock = new THREE.Clock();
		const frame = () => {
			if (document.hidden || window.scrollY > window.innerHeight * 1.3) {
				clock.getDelta(); // keep a long pause from becoming one big step
				return;
			}
			const dt = Math.min(clock.getDelta(), 0.05) * 60;
			const ease = 1 - Math.pow(1 - EASE, dt);
			const lift = window.scrollY * SCROLL_PARALLAX;
			camera.position.x += (target.x - camera.position.x) * ease;
			camera.position.y += (target.y + lift - camera.position.y) * ease;
			const time = clock.elapsedTime;
			mat.uniforms.uTime.value = time;
			mat.uniforms.uTravel.value = time * DRIFT;
			stars.rotation.z = Math.sin(time * 0.04) * 0.03; // slow drift of the whole field
			stepRocket(dt, time);

			// Shooting star: wait, then streak down-left across the view.
			metT += dt / 60;
			if (metT >= MET_LIFE) {
				metT = -(5 + rand() * 7);
				meteorMat.uniforms.uAlpha.value = 0;
			} else if (metT >= 0) {
				if (metT - dt / 60 < 0) {
					metX = camera.position.x + 2 + rand() * 10;
					metY = camera.position.y + 3 + rand() * 4;
				}
				const k = metT / MET_LIFE;
				meteor.position.set(metX - k * 20, metY - k * 8.4, -4);
				meteorMat.uniforms.uAlpha.value = Math.sin(Math.min(1, k) * Math.PI);
			}
			draw();
		};

		const obs = new ResizeObserver(layout);
		obs.observe(el);
		layout();
		if (reduce) {
			stepRocket(0.0001, 0);
			draw();
		} else {
			window.addEventListener("pointermove", onMove, { passive: true });
			renderer.setAnimationLoop(frame);
		}

		return () => {
			renderer.setAnimationLoop(null);
			obs.disconnect();
			window.removeEventListener("pointermove", onMove);
			el.removeEventListener("pointerdown", onDown);
			el.removeEventListener("pointerup", onUp);
			el.removeEventListener("pointercancel", onUp);
			el.style.pointerEvents = "";
			el.style.cursor = "";
			disposables.forEach(d => d.dispose());
			renderer.dispose();
			renderer.domElement.remove();
		};
	}, []);

	return <div ref={host} className="pointer-events-none absolute inset-0" />;
}
