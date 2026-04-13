

import React, { useEffect, useRef } from "react";
import {
  Vector3,
  MeshPhysicalMaterial,
  InstancedMesh,
  Clock,
  AmbientLight,
  CylinderGeometry,
  ShaderChunk,
  Scene,
  Color,
  Object3D,
  SRGBColorSpace,
  MathUtils,
  PMREMGenerator,
  Vector2,
  WebGLRenderer,
  PerspectiveCamera,
  PointLight,
  ACESFilmicToneMapping,
  Plane,
  Raycaster,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

class RenderEngine {
  constructor(config) {
    this.config = { ...config };
    this.camera = new PerspectiveCamera();
    this.cameraFov = this.camera.fov;
    this.scene = new Scene();
    if (this.config.canvas) {
      this.canvas = this.config.canvas;
    } else if (this.config.id) {
      this.canvas = document.getElementById(this.config.id);
    } else {
      throw new Error("Three: Missing canvas or id parameter");
    }
    this.canvas.style.display = "block";
    const rendererOptions = {
      canvas: this.canvas,
      powerPreference: "high-performance",
      ...(this.config.rendererOptions ?? {}),
    };
    this.renderer = new WebGLRenderer(rendererOptions);
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.size = {
      width: 0,
      height: 0,
      wWidth: 0,
      wHeight: 0,
      ratio: 0,
      pixelRatio: 0,
    };
    this.render = this.internalRender;
    this.onBeforeRender = () => {};
    this.onAfterRender = () => {};
    this.onAfterResize = () => {};
    this.isIntersecting = false;
    this.isAnimating = false;
    this.isDisposed = false;
    this.clock = new Clock();
    this.timeState = { elapsed: 0, delta: 0 };
    this.resize();
    this.bindEvents();
  }

  bindEvents() {
    if (!(this.config.size instanceof Object)) {
      window.addEventListener("resize", this.debounceResize.bind(this));
      if (this.config.size === "parent" && this.canvas.parentNode) {
        this.resizeObserver = new ResizeObserver(
          this.debounceResize.bind(this),
        );
        this.resizeObserver.observe(this.canvas.parentNode);
      }
    }
    this.intersectionObserver = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        root: null,
        rootMargin: "0px",
        threshold: 0,
      },
    );
    this.intersectionObserver.observe(this.canvas);
    document.addEventListener(
      "visibilitychange",
      this.handleVisibility.bind(this),
    );
  }

  unbindEvents() {
    window.removeEventListener("resize", this.debounceResize.bind(this));
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibility.bind(this),
    );
  }

  handleIntersection(entries) {
    this.isIntersecting = entries[0].isIntersecting;
    this.isIntersecting ? this.start() : this.stop();
  }

  handleVisibility() {
    if (this.isIntersecting) {
      document.hidden ? this.stop() : this.start();
    }
  }

  debounceResize() {
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(this.resize.bind(this), 100);
  }

  resize() {
    let width, height;
    if (this.config.size instanceof Object) {
      width = this.config.size.width;
      height = this.config.size.height;
    } else if (this.config.size === "parent" && this.canvas.parentNode) {
      width = this.canvas.parentNode.offsetWidth;
      height = this.canvas.parentNode.offsetHeight;
    } else {
      width = window.innerWidth;
      height = window.innerHeight;
    }
    this.size.width = width;
    this.size.height = height;
    this.size.ratio = width / height;
    this.updateCamera();
    this.updateRendererSize();
    this.onAfterResize(this.size);
  }

  updateCamera() {
    this.camera.aspect = this.size.width / this.size.height;
    if (this.camera.isPerspectiveCamera && this.cameraFov) {
      if (this.cameraMinAspect && this.camera.aspect < this.cameraMinAspect) {
        this.adjustFov(this.cameraMinAspect);
      } else if (
        this.cameraMaxAspect &&
        this.camera.aspect > this.cameraMaxAspect
      ) {
        this.adjustFov(this.cameraMaxAspect);
      } else {
        this.camera.fov = this.cameraFov;
      }
    }
    this.camera.updateProjectionMatrix();
    this.updateWorldSize();
  }

  adjustFov(aspect) {
    const t =
      Math.tan(MathUtils.degToRad(this.cameraFov / 2)) /
      (this.camera.aspect / aspect);
    this.camera.fov = 2 * MathUtils.radToDeg(Math.atan(t));
  }

  updateWorldSize() {
    if (this.camera.isPerspectiveCamera) {
      const e = (this.camera.fov * Math.PI) / 180;
      this.size.wHeight = 2 * Math.tan(e / 2) * this.camera.position.length();
      this.size.wWidth = this.size.wHeight * this.camera.aspect;
    }
  }

  updateRendererSize() {
    this.renderer.setSize(this.size.width, this.size.height);
    this.postprocessing?.setSize(this.size.width, this.size.height);
    let pixelRatio = window.devicePixelRatio;
    if (this.maxPixelRatio && pixelRatio > this.maxPixelRatio) {
      pixelRatio = this.maxPixelRatio;
    } else if (this.minPixelRatio && pixelRatio < this.minPixelRatio) {
      pixelRatio = this.minPixelRatio;
    }
    this.renderer.setPixelRatio(pixelRatio);
    this.size.pixelRatio = pixelRatio;
  }

  start() {
    if (this.isAnimating) return;
    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);
      this.timeState.delta = this.clock.getDelta();
      this.timeState.elapsed += this.timeState.delta;
      this.onBeforeRender(this.timeState);
      this.render();
      this.onAfterRender(this.timeState);
    };
    this.isAnimating = true;
    this.clock.start();
    animate();
  }

  stop() {
    if (this.isAnimating) {
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
      this.isAnimating = false;
      this.clock.stop();
    }
  }

  internalRender = () => {
    this.renderer.render(this.scene, this.camera);
  };

  clear() {
    this.scene.traverse((e) => {
      if (e.isMesh && typeof e.material === "object" && e.material !== null) {
        Object.keys(e.material).forEach((t) => {
          const i = e.material[t];
          if (
            i !== null &&
            typeof i === "object" &&
            typeof i.dispose === "function"
          ) {
            i.dispose();
          }
        });
        e.material.dispose();
        e.geometry.dispose();
      }
    });
    this.scene.clear();
  }

  dispose() {
    this.unbindEvents();
    this.stop();
    this.clear();
    this.postprocessing?.dispose();
    this.renderer.dispose();
    this.isDisposed = true;
  }
}

const interactionBindings = new Map();
const pointerPosition = new Vector2();
let isPointerEventBound = false;

function setupInteraction(config) {
  const t = {
    position: new Vector2(),
    nPosition: new Vector2(),
    hover: false,
    touching: false,
    onEnter() {},
    onMove() {},
    onClick() {},
    onLeave() {},
    ...config,
  };
  if (!interactionBindings.has(config.domElement)) {
    interactionBindings.set(config.domElement, t);
    if (!isPointerEventBound) {
      document.body.addEventListener("pointermove", onPointerMove);
      document.body.addEventListener("pointerleave", onPointerLeave);
      document.body.addEventListener("click", onPointerClick);
      document.body.addEventListener("touchstart", onTouchStart, {
        passive: false,
      });
      document.body.addEventListener("touchmove", onTouchMove, {
        passive: false,
      });
      document.body.addEventListener("touchend", onTouchEnd, {
        passive: false,
      });
      document.body.addEventListener("touchcancel", onTouchEnd, {
        passive: false,
      });
      isPointerEventBound = true;
    }
  }
  t.dispose = () => {
    interactionBindings.delete(config.domElement);
    if (interactionBindings.size === 0) {
      document.body.removeEventListener("pointermove", onPointerMove);
      document.body.removeEventListener("pointerleave", onPointerLeave);
      document.body.removeEventListener("click", onPointerClick);
      document.body.removeEventListener("touchstart", onTouchStart);
      document.body.removeEventListener("touchmove", onTouchMove);
      document.body.removeEventListener("touchend", onTouchEnd);
      document.body.removeEventListener("touchcancel", onTouchEnd);
      isPointerEventBound = false;
    }
  };
  return t;
}

function onPointerMove(e) {
  pointerPosition.x = e.clientX;
  pointerPosition.y = e.clientY;
  processInteractions();
}

function processInteractions() {
  for (const [elem, t] of interactionBindings) {
    const rect = elem.getBoundingClientRect();
    if (isInsideBoundingRect(rect)) {
      updatePositions(t, rect);
      if (!t.hover) {
        t.hover = true;
        t.onEnter(t);
      }
      t.onMove(t);
    } else if (t.hover && !t.touching) {
      t.hover = false;
      t.onLeave(t);
    }
  }
}

function onPointerClick(e) {
  pointerPosition.x = e.clientX;
  pointerPosition.y = e.clientY;
  for (const [elem, t] of interactionBindings) {
    const rect = elem.getBoundingClientRect();
    updatePositions(t, rect);
    if (isInsideBoundingRect(rect)) t.onClick(t);
  }
}

function onPointerLeave() {
  for (const t of interactionBindings.values()) {
    if (t.hover) {
      t.hover = false;
      t.onLeave(t);
    }
  }
}

function onTouchStart(e) {
  if (e.touches.length > 0) {
    pointerPosition.x = e.touches[0].clientX;
    pointerPosition.y = e.touches[0].clientY;
    for (const [elem, t] of interactionBindings) {
      const rect = elem.getBoundingClientRect();
      if (isInsideBoundingRect(rect)) {
        t.touching = true;
        updatePositions(t, rect);
        if (!t.hover) {
          t.hover = true;
          t.onEnter(t);
        }
        t.onMove(t);
      }
    }
  }
}

function onTouchMove(e) {
  if (e.touches.length > 0) {
    pointerPosition.x = e.touches[0].clientX;
    pointerPosition.y = e.touches[0].clientY;
    for (const [elem, t] of interactionBindings) {
      const rect = elem.getBoundingClientRect();
      updatePositions(t, rect);
      if (isInsideBoundingRect(rect)) {
        if (!t.hover) {
          t.hover = true;
          t.touching = true;
          t.onEnter(t);
        }
        t.onMove(t);
      } else if (t.hover && t.touching) {
        t.onMove(t);
      }
    }
  }
}

function onTouchEnd() {
  for (const [, t] of interactionBindings) {
    if (t.touching) {
      t.touching = false;
      if (t.hover) {
        t.hover = false;
        t.onLeave(t);
      }
    }
  }
}

function updatePositions(e, rect) {
  const { position, nPosition } = e;
  position.x = pointerPosition.x - rect.left;
  position.y = pointerPosition.y - rect.top;
  nPosition.x = (position.x / rect.width) * 2 - 1;
  nPosition.y = (-position.y / rect.height) * 2 + 1;
}

function isInsideBoundingRect(rect) {
  const { x, y } = pointerPosition;
  const { left, top, width, height } = rect;
  return x >= left && x <= left + width && y >= top && y <= top + height;
}

const { randFloat, randFloatSpread } = MathUtils;
const tempVec1 = new Vector3();
const tempVec2 = new Vector3();
const tempVec3 = new Vector3();
const tempVec4 = new Vector3();
const tempVec5 = new Vector3();
const tempVec6 = new Vector3();
const tempVec7 = new Vector3();
const tempVec8 = new Vector3();
const tempVec9 = new Vector3();
const tempVec10 = new Vector3();

class PhysicsEngine {
  constructor(config) {
    this.config = config;
    this.positionData = new Float32Array(3 * config.count).fill(0);
    this.velocityData = new Float32Array(3 * config.count).fill(0);
    this.sizeData = new Float32Array(config.count).fill(1);
    this.center = new Vector3();
    this.initPositions();
    this.setSizes();
  }

  initPositions() {
    this.center.toArray(this.positionData, 0);
    for (let i = 1; i < this.config.count; i++) {
      const offset = 3 * i;
      this.positionData[offset] = randFloatSpread(2 * this.config.maxX);
      this.positionData[offset + 1] = randFloatSpread(2 * this.config.maxY);
      this.positionData[offset + 2] = randFloatSpread(2 * this.config.maxZ);
    }
  }

  setSizes() {
    this.sizeData[0] = this.config.size0;
    for (let i = 1; i < this.config.count; i++) {
      this.sizeData[i] = randFloat(this.config.minSize, this.config.maxSize);
    }
  }

  update(timeState) {
    const { config, center, positionData, sizeData, velocityData } = this;
    let startIndex = 0;
    if (config.controlSphere0) {
      startIndex = 1;
      tempVec1.fromArray(positionData, 0);
      tempVec1.lerp(center, 0.1).toArray(positionData, 0);
      tempVec4.set(0, 0, 0).toArray(velocityData, 0);
    }
    // Apply gravity and friction
    for (let idx = startIndex; idx < config.count; idx++) {
      const base = 3 * idx;
      tempVec2.fromArray(positionData, base);
      tempVec5.fromArray(velocityData, base);
      tempVec5.y -= timeState.delta * config.gravity * sizeData[idx];
      tempVec5.multiplyScalar(config.friction);
      tempVec5.clampLength(0, config.maxVelocity);
      tempVec2.add(tempVec5);
      tempVec2.toArray(positionData, base);
      tempVec5.toArray(velocityData, base);
    }
    // Collisions
    for (let idx = startIndex; idx < config.count; idx++) {
      const base = 3 * idx;
      tempVec2.fromArray(positionData, base);
      tempVec5.fromArray(velocityData, base);
      const radius = sizeData[idx];
      for (let jdx = idx + 1; jdx < config.count; jdx++) {
        const otherBase = 3 * jdx;
        tempVec3.fromArray(positionData, otherBase);
        tempVec6.fromArray(velocityData, otherBase);
        const otherRadius = sizeData[jdx];
        tempVec7.copy(tempVec3).sub(tempVec2);
        const dist = tempVec7.length();
        const sumRadius = radius + otherRadius;
        if (dist < sumRadius) {
          const overlap = sumRadius - dist;
          tempVec8
            .copy(tempVec7)
            .normalize()
            .multiplyScalar(0.5 * overlap);
          tempVec9
            .copy(tempVec8)
            .multiplyScalar(Math.max(tempVec5.length(), 1));
          tempVec10
            .copy(tempVec8)
            .multiplyScalar(Math.max(tempVec6.length(), 1));
          tempVec2.sub(tempVec8);
          tempVec5.sub(tempVec9);
          tempVec2.toArray(positionData, base);
          tempVec5.toArray(velocityData, base);
          tempVec3.add(tempVec8);
          tempVec6.add(tempVec10);
          tempVec3.toArray(positionData, otherBase);
          tempVec6.toArray(velocityData, otherBase);
        }
      }
      if (config.controlSphere0) {
        tempVec7.copy(tempVec1).sub(tempVec2);
        const dist = tempVec7.length();
        const sumRadius0 = radius + sizeData[0];
        if (dist < sumRadius0) {
          const diff = sumRadius0 - dist;
          tempVec8.copy(tempVec7.normalize()).multiplyScalar(diff);
          tempVec9
            .copy(tempVec8)
            .multiplyScalar(Math.max(tempVec5.length(), 2));
          tempVec2.sub(tempVec8);
          tempVec5.sub(tempVec9);
        }
      }
      // Boundaries
      if (Math.abs(tempVec2.x) + radius > config.maxX) {
        tempVec2.x = Math.sign(tempVec2.x) * (config.maxX - radius);
        tempVec5.x = -tempVec5.x * config.wallBounce;
      }
      if (config.gravity === 0) {
        if (Math.abs(tempVec2.y) + radius > config.maxY) {
          tempVec2.y = Math.sign(tempVec2.y) * (config.maxY - radius);
          tempVec5.y = -tempVec5.y * config.wallBounce;
        }
      } else if (tempVec2.y - radius < -config.maxY) {
        tempVec2.y = -config.maxY + radius;
        tempVec5.y = -tempVec5.y * config.wallBounce;
        // Custom bounce for firecrackers logic for visual effect
        tempVec5.x += randFloatSpread(0.1);
        tempVec5.z += randFloatSpread(0.1);
      }
      const maxBoundary = Math.max(config.maxZ, config.maxSize);
      if (Math.abs(tempVec2.z) + radius > maxBoundary) {
        tempVec2.z = Math.sign(tempVec2.z) * (config.maxZ - radius);
        tempVec5.z = -tempVec5.z * config.wallBounce;
      }
      tempVec2.toArray(positionData, base);
      tempVec5.toArray(velocityData, base);
    }
  }
}

class ScatteringMaterial extends MeshPhysicalMaterial {
  constructor(parameters) {
    super(parameters);
    this.uniforms = {
      thicknessDistortion: { value: 0.1 },
      thicknessAmbient: { value: 0 },
      thicknessAttenuation: { value: 0.1 },
      thicknessPower: { value: 2 },
      thicknessScale: { value: 10 },
    };
    this.defines.USE_UV = "";
    this.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this.uniforms);
      shader.fragmentShader =
        `
        uniform float thicknessPower;
        uniform float thicknessScale;
        uniform float thicknessDistortion;
        uniform float thicknessAmbient;
        uniform float thicknessAttenuation;
      ` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        "void main() {",
        `
        void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, inout ReflectedLight reflectedLight) {
          vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));
          float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;
          #ifdef USE_COLOR
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * vColor;
          #else
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * diffuse;
          #endif
          reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;
        }

        void main() {
        `,
      );

      const modifiedInclude = ShaderChunk.lights_fragment_begin.replaceAll(
        "RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );",
        `
          RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
          RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);
        `,
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <lights_fragment_begin>",
        modifiedInclude,
      );
      if (this.onBeforeCompile2) this.onBeforeCompile2(shader);
    };
  }
}

const DEFAULT_CONFIG = {
  count: 100,
  colors: ["#ff3b30", "#ff9500", "#ffd60a"], // Firecracker reds and golds
  ambientColor: 0xffffff,
  ambientIntensity: 1,
  lightIntensity: 200,
  materialParams: {
    metalness: 0.4,
    roughness: 0.7,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
  },
  minSize: 0.5,
  maxSize: 0.8,
  size0: 1,
  gravity: 0.2,
  friction: 0.9975,
  wallBounce: 0.85,
  maxVelocity: 0.15,
  maxX: 5,
  maxY: 5,
  maxZ: 2,
  controlSphere0: false,
  followCursor: true,
};

const dummyObject = new Object3D();

class InstancedFirecrackers extends InstancedMesh {
  constructor(renderer, config = {}) {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };
    const pmremGenerator = new PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envMap = pmremGenerator.fromScene(new RoomEnvironment()).texture;
    // Replace SphereGeometry with CylinderGeometry for Firecrackers
    // Make them look like little sticks
    const geometry = new CylinderGeometry(0.3, 0.3, 1.2, 16);
    const material = new ScatteringMaterial({
      envMap,
      ...mergedConfig.materialParams,
    });
    material.envMapRotation.x = -Math.PI / 2;
    super(geometry, material, mergedConfig.count);
    this.config = mergedConfig;
    this.physics = new PhysicsEngine(mergedConfig);
    this.rotations = new Float32Array(this.config.count * 3);
    this.angularVelocities = new Float32Array(this.config.count * 3);
    for (let i = 0; i < this.config.count; i++) {
      this.rotations[i * 3] = randFloatSpread(Math.PI * 2);
      this.rotations[i * 3 + 1] = randFloatSpread(Math.PI * 2);
      this.rotations[i * 3 + 2] = randFloatSpread(Math.PI * 2);
      this.angularVelocities[i * 3] = randFloatSpread(0.1);
      this.angularVelocities[i * 3 + 1] = randFloatSpread(0.1);
      this.angularVelocities[i * 3 + 2] = randFloatSpread(0.1);
    }
    this.initLights();
    this.setColors(mergedConfig.colors);
  }

  initLights() {
    this.ambientLight = new AmbientLight(
      this.config.ambientColor,
      this.config.ambientIntensity,
    );
    this.add(this.ambientLight);
    this.light = new PointLight(
      this.config.colors[0],
      this.config.lightIntensity,
    );
    this.add(this.light);
  }

  setColors(hexColors) {
    if (Array.isArray(hexColors) && hexColors.length > 0) {
      const colors = hexColors.map((c) => new Color(c));
      const getColorAt = (ratio, out = new Color()) => {
        const scaled = Math.max(0, Math.min(1, ratio)) * (colors.length - 1);
        const idx = Math.floor(scaled);
        const start = colors[idx];
        if (idx >= colors.length - 1) return start.clone();
        const alpha = scaled - idx;
        const end = colors[idx + 1];
        out.r = start.r + alpha * (end.r - start.r);
        out.g = start.g + alpha * (end.g - start.g);
        out.b = start.b + alpha * (end.b - start.b);
        return out;
      };
      for (let idx = 0; idx < this.count; idx++) {
        const c = getColorAt(idx / this.count);
        this.setColorAt(idx, c);
        if (idx === 0) {
          this.light.color.copy(c);
        }
      }
      if (this.instanceColor) this.instanceColor.needsUpdate = true;
    }
  }

  update(timeState) {
    this.physics.update(timeState);
    for (let idx = 0; idx < this.count; idx++) {
      dummyObject.position.fromArray(this.physics.positionData, 3 * idx);
      // Update Rotations to Tumble
      if (idx > 0) {
        this.rotations[idx * 3] +=
          this.angularVelocities[idx * 3] * timeState.delta * 50;
        this.rotations[idx * 3 + 1] +=
          this.angularVelocities[idx * 3 + 1] * timeState.delta * 50;
        this.rotations[idx * 3 + 2] +=
          this.angularVelocities[idx * 3 + 2] * timeState.delta * 50;
      }
      dummyObject.rotation.set(
        this.rotations[idx * 3],
        this.rotations[idx * 3 + 1],
        this.rotations[idx * 3 + 2],
      );

      if (idx === 0 && this.config.followCursor === false) {
        dummyObject.scale.setScalar(0);
      } else {
        dummyObject.scale.setScalar(this.physics.sizeData[idx]);
      }
      dummyObject.updateMatrix();
      this.setMatrixAt(idx, dummyObject.matrix);
      if (idx === 0) this.light.position.copy(dummyObject.position);
    }
    this.instanceMatrix.needsUpdate = true;
  }
}

function createFirecrackerPit(canvasElement, config = {}) {
  const engine = new RenderEngine({
    canvas: canvasElement,
    size: "parent",
    rendererOptions: { antialias: true, alpha: true },
  });
  let instancedMesh;
  engine.renderer.toneMapping = ACESFilmicToneMapping;
  engine.camera.position.set(0, 0, 20);
  engine.camera.lookAt(0, 0, 0);
  engine.cameraMaxAspect = 1.5;
  engine.resize();
  const setupMesh = (conf) => {
    if (instancedMesh) {
      engine.clear();
      engine.scene.remove(instancedMesh);
    }
    instancedMesh = new InstancedFirecrackers(engine.renderer, conf);
    engine.scene.add(instancedMesh);
  };
  setupMesh(config);
  const raycaster = new Raycaster();
  const plane = new Plane(new Vector3(0, 0, 1), 0);
  const intersectPoint = new Vector3();
  let isPaused = false;

  canvasElement.style.touchAction = "none";
  canvasElement.style.userSelect = "none";
  canvasElement.style.webkitUserSelect = "none";

  const interaction = setupInteraction({
    domElement: canvasElement,
    onMove() {
      raycaster.setFromCamera(interaction.nPosition, engine.camera);
      engine.camera.getWorldDirection(plane.normal);
      raycaster.ray.intersectPlane(plane, intersectPoint);
      instancedMesh.physics.center.copy(intersectPoint);
      instancedMesh.config.controlSphere0 = true;
    },
    onLeave() {
      instancedMesh.config.controlSphere0 = false;
    },
  });

  engine.onBeforeRender = (timeState) => {
    if (!isPaused && instancedMesh) instancedMesh.update(timeState);
  };

  engine.onAfterResize = (size) => {
    if (instancedMesh) {
      instancedMesh.config.maxX = size.wWidth / 2;
      instancedMesh.config.maxY = size.wHeight / 2;
    }
  };

  return {
    engine,
    get mesh() {
      return instancedMesh;
    },
    setCount(count) {
      setupMesh({ ...instancedMesh.config, count });
    },
    togglePause() {
      isPaused = !isPaused;
    },
    dispose() {
      interaction.dispose();
      engine.dispose();
    },
  };
}

export function FirecrackerPit({
  className = "",
  followCursor = true,
  ...props
}) {
  const canvasRef = useRef(null);
  const pitInstanceRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    pitInstanceRef.current = createFirecrackerPit(canvas, {
      followCursor,
      ...props,
    });

    return () => {
      if (pitInstanceRef.current) {
        pitInstanceRef.current.dispose();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      className={className}
      ref={canvasRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
