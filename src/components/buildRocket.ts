import * as THREE from "three";

// A chunky toy rocket built from primitives (no model file): fat white body,
// red nose and fins, a round blue porthole with a glass dome, a blue collar,
// and a soft orange flame. The nose points along +Y and the porthole faces +Z.
// `model` is the part that sways; `flameRoot` sits at the nozzle.

const RED = 0xe9442a;
const BLUE = 0x2f7de0;

const FLAME_VERT = /* glsl */ `
	uniform float uTime;
	varying float vH;
	varying vec3 vN;
	void main() {
		vH = clamp(-position.y / 1.5, 0.0, 1.0);
		vec3 p = position;
		float w = 1.0 + 0.09 * sin(uTime * 28.0 + position.y * 9.0) * vH;
		p.xz *= w;
		vN = normalize(normalMatrix * normal);
		gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
	}
`;
const FLAME_FRAG = /* glsl */ `
	uniform float uWhite;
	varying float vH;
	varying vec3 vN;
	void main() {
		float edge = pow(abs(vN.z), 0.9);
		float a = pow(1.0 - vH, 1.2) * edge;
		vec3 yellow = vec3(1.0, 0.86, 0.3);
		vec3 orange = vec3(1.0, 0.5, 0.1);
		vec3 red = vec3(0.95, 0.25, 0.1);
		vec3 c = mix(yellow, orange, smoothstep(0.0, 0.5, vH));
		c = mix(c, red, smoothstep(0.5, 1.0, vH));
		// The inner core is yellow-white instead.
		c = mix(c, vec3(1.0, 0.95, 0.6), uWhite * (1.0 - vH));
		gl_FragColor = vec4(c, a);
	}
`;

/** Body radius at height y, so the porthole can sit exactly on the surface. */
const BODY: [number, number][] = [
	[0.3, -0.8],
	[0.45, -0.72],
	[0.56, -0.5],
	[0.66, -0.15],
	[0.72, 0.2],
	[0.68, 0.5],
	[0.62, 0.6],
];
function bodyRadiusAt(y: number) {
	for (let i = 0; i < BODY.length - 1; i++) {
		const [r0, y0] = BODY[i];
		const [r1, y1] = BODY[i + 1];
		if (y >= y0 && y <= y1) return r0 + ((r1 - r0) * (y - y0)) / (y1 - y0);
	}
	return 0.7;
}

export function buildRocket() {
	const disposables: { dispose(): void }[] = [];
	const track = <T extends { dispose(): void }>(d: T) => (disposables.push(d), d);

	const root = new THREE.Group();
	const model = new THREE.Group();
	model.position.y = -0.25; // centre the whole rocket on the group origin
	root.add(model);

	// Soft toy plastic: a little shine, no mirror finish.
	const plastic = (color: number, extra: THREE.MeshPhysicalMaterialParameters = {}) =>
		track(
			new THREE.MeshPhysicalMaterial({
				color,
				roughness: 0.42,
				metalness: 0,
				clearcoat: 0.5,
				clearcoatRoughness: 0.3,
				...extra,
			}),
		);
	const mesh = (geo: THREE.BufferGeometry, mat: THREE.Material) => {
		track(geo);
		const m = new THREE.Mesh(geo, mat);
		model.add(m);
		return m;
	};
	const lathe = (pts: [number, number][], seg = 56) =>
		new THREE.LatheGeometry(
			pts.map(([x, y]) => new THREE.Vector2(x, y)),
			seg,
		);

	// Body and red nose.
	mesh(lathe(BODY), plastic(0xfbfaf8, { roughness: 0.38 }));
	const nose: [number, number][] = [];
	for (let i = 0; i <= 20; i++) {
		const t = i / 20;
		nose.push([0.62 * Math.pow(1 - Math.pow(t, 2.2), 0.6), 0.6 + 0.85 * t]);
	}
	mesh(lathe(nose), plastic(RED));

	// Blue collar around the tail.
	mesh(
		lathe([
			[0.49, -0.74],
			[0.58, -0.66],
			[0.6, -0.5],
			[0.58, -0.4],
			[0.55, -0.37],
		]),
		plastic(BLUE),
	);

	// Porthole: blue ring + a glassy light-blue dome, sitting on the +Z side.
	const py = 0.2;
	const pz = bodyRadiusAt(py);
	const ring = mesh(new THREE.TorusGeometry(0.3, 0.085, 20, 48), plastic(BLUE));
	ring.position.set(0, py, pz - 0.02);
	const glass = mesh(
		new THREE.SphereGeometry(0.26, 32, 24),
		plastic(0x8fd8f7, { roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.08 }),
	);
	glass.scale.z = 0.5;
	glass.position.set(0, py, pz - 0.02);

	// Nozzle.
	mesh(
		lathe(
			[
				[0.3, -0.8],
				[0.26, -0.9],
				[0.0, -0.9],
			],
			32,
		),
		track(new THREE.MeshStandardMaterial({ color: 0x3b3f4a, roughness: 0.5, side: THREE.DoubleSide })),
	);

	// Three fat, curved, swept-back fins.
	const fin = new THREE.Shape();
	fin.moveTo(0.52, 0.05);
	fin.bezierCurveTo(1.15, 0.0, 1.32, -0.55, 1.1, -1.02);
	fin.bezierCurveTo(0.95, -1.06, 0.72, -0.86, 0.52, -0.62);
	fin.lineTo(0.52, 0.05);
	const finGeo = track(
		new THREE.ExtrudeGeometry(fin, {
			depth: 0.16,
			bevelEnabled: true,
			bevelSize: 0.06,
			bevelThickness: 0.06,
			bevelSegments: 4,
			curveSegments: 18,
		}),
	);
	finGeo.translate(0, 0, -0.08);
	const finMat = plastic(RED);
	for (let i = 0; i < 3; i++) {
		const f = new THREE.Mesh(finGeo, finMat);
		f.rotation.y = (i * Math.PI * 2) / 3 + Math.PI / 3;
		model.add(f);
	}

	// Flame: two nested open cones, additive, soft at the edges.
	const flameMat = track(
		new THREE.ShaderMaterial({
			vertexShader: FLAME_VERT,
			fragmentShader: FLAME_FRAG,
			uniforms: { uTime: { value: 0 }, uWhite: { value: 0 } },
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
			side: THREE.DoubleSide,
		}),
	);
	const coreMat = track(flameMat.clone());
	coreMat.uniforms = { uTime: flameMat.uniforms.uTime, uWhite: { value: 1 } };
	const cone = track(new THREE.ConeGeometry(0.34, 1.5, 28, 1, true));
	cone.rotateX(Math.PI);
	cone.translate(0, -0.75, 0); // base at the nozzle, tip pointing down
	const flameRoot = new THREE.Group();
	flameRoot.position.y = -0.9 - 0.25;
	flameRoot.add(new THREE.Mesh(cone, flameMat));
	const core = new THREE.Mesh(cone, coreMat);
	core.scale.set(0.55, 0.6, 0.55);
	flameRoot.add(core);
	root.add(flameRoot);

	return {
		root,
		model,
		flameRoot,
		flameMat,
		dispose: () => disposables.forEach(d => d.dispose()),
	};
}
