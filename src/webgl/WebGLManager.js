import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { LiquidChromeVertexShader, LiquidChromeFragmentShader } from './shaders/LiquidChromeShader.js';

export default class WebGLManager {
  constructor(canvasId = "canvas") {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.z = 5;
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    
    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.raycaster = new THREE.Raycaster();
    
    this.model = null;
    this.chromeModel = null;
    this.baseY = -0.6; // Modèle remonté pour prendre plus de place au centre
    
    this.customUniforms = {
      uMousePos: { value: new THREE.Vector3(0, 0, 0) },
      uTime: { value: 0 },
      uRadius: { value: 0.0 }
    };
  }

  async init() {
    this.initLights();
    await this.loadModel();
    this.addEvents();
    this.resize();
    this.render();
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3.0);
    directionalLight.position.set(0, 1.5, 4);
    this.scene.add(directionalLight);
    
    const rimLight = new THREE.DirectionalLight(0xff2800, 5.0);
    rimLight.position.set(-3, 2, -2);
    this.scene.add(rimLight);
    
    const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
    fillLight.position.set(3, 0, 2);
    this.scene.add(fillLight);
  }

  loadModel() {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      
      loader.load(
        '/models/portrait.glb',
        (gltf) => {
          this.model = gltf.scene;
          
          const box = new THREE.Box3().setFromObject(this.model);
          const center = box.getCenter(new THREE.Vector3());
          
          this.model.position.x = -center.x;
          this.model.position.y = -center.y;
          this.model.position.z = -center.z;
          
          this.modelGroup = new THREE.Group();
          this.modelGroup.add(this.model);
          
          // Duplication pour l'effet Chrome
          this.chromeModel = this.model.clone();
          
          const shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: LiquidChromeVertexShader,
            fragmentShader: LiquidChromeFragmentShader,
            uniforms: this.customUniforms,
            transparent: true,
            side: THREE.DoubleSide
          });
          
          this.chromeModel.traverse((child) => {
            if (child.isMesh) {
              child.material = shaderMaterial;
            }
          });
          
          // Ajout d'un léger décalage Z pour éviter le z-fighting
          this.chromeModel.position.z += 0.001;
          this.modelGroup.add(this.chromeModel);
          
          // Plan invisible pour capter le Raycaster uniformément (optimisation)
          const planeGeo = new THREE.PlaneGeometry(5, 5);
          const planeMat = new THREE.MeshBasicMaterial({ visible: false });
          this.hitPlane = new THREE.Mesh(planeGeo, planeMat);
          this.hitPlane.position.z = 0.5; // Légèrement en avant
          this.modelGroup.add(this.hitPlane);
          
          this.modelGroup.scale.set(2.4, 2.4, 2.4);
          this.modelGroup.position.y = this.baseY;
          
          this.scene.add(this.modelGroup);
          document.body.classList.add('model-loaded');
          resolve();
        },
        undefined,
        (error) => {
          console.error('Erreur de chargement du modèle:', error);
          reject(error);
        }
      );
    });
  }

  addEvents() {
    window.addEventListener('resize', this.resize.bind(this));
    
    window.addEventListener('mousemove', (e) => {
      this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      if (this.modelGroup && this.hitPlane) {
        this.raycaster.setFromCamera(this.targetMouse, this.camera);
        // Intersecter uniquement le plan invisible pour les performances
        const intersects = this.raycaster.intersectObject(this.hitPlane);
        
        if (intersects.length > 0) {
          const point = intersects[0].point;
          this.customUniforms.uMousePos.value.copy(point);
          
          gsap.to(this.customUniforms.uRadius, { 
            value: 0.7, // Rayon réduit pour effet ciblé
            duration: 0.8, 
            ease: "power2.out" 
          });
        } else {
          gsap.to(this.customUniforms.uRadius, { 
            value: 0.0, 
            duration: 0.5, 
            ease: "power2.in" 
          });
        }
      }
    });
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.mouse.lerp(this.targetMouse, 0.05);

    if (this.modelGroup) {
      this.modelGroup.rotation.y = this.mouse.x * 0.4;
      this.modelGroup.rotation.x = -this.mouse.y * 0.2;
      
      const time = performance.now() * 0.001;
      this.customUniforms.uTime.value = time;
      
      this.modelGroup.position.y = this.baseY + Math.sin(time) * 0.05;
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }

  setupScrollAnimations() {
    // Si tu veux des animations au scroll, tu peux les remettre ici
    console.log("Les animations de scroll seront gérées par le main.js ou script.js existant");
  }
}
