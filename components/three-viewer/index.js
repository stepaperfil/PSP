import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class ThreeViewerComponent {
    constructor(parentContainer, modelUrl) {
        this.parent = parentContainer;
        this.modelUrl = modelUrl;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.animationId = null;
    }

    async render() {
        this.parent.innerHTML = '';

        this.parent.style.width = '100%';
        this.parent.style.height = '500px';
        this.parent.style.position = 'relative';
        this.parent.style.borderRadius = '24px';
        this.parent.style.overflow = 'hidden';
        this.parent.style.background = '#1a1a2e';
        this.parent.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';

        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        this.parent.appendChild(canvas);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);

        const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
        this.scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(2, 3, 4);
        this.scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0xffaa66, 0.5);
        fillLight.position.set(-1, 1, -2);
        this.scene.add(fillLight);

        const backLight = new THREE.DirectionalLight(0x88aaff, 0.4);
        backLight.position.set(0, 1, -3);
        this.scene.add(backLight);

        const bottomLight = new THREE.PointLight(0x8866ff, 0.3);
        bottomLight.position.set(0, -2, 0);
        this.scene.add(bottomLight);

        this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);

        this.renderer = new THREE.WebGLRenderer({ canvas, alpha: false });
        this.renderer.setSize(this.parent.clientWidth, this.parent.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.controls = new OrbitControls(this.camera, canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.enableZoom = true;
        this.controls.enablePan = false;
        this.controls.target.set(0, 0, 0);

        const handleResize = () => {
            const width = this.parent.clientWidth;
            const height = this.parent.clientHeight;
            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', handleResize);

        try {
            const loader = new GLTFLoader();
            const gltf = await loader.loadAsync(this.modelUrl);
            this.model = gltf.scene;

            const box = new THREE.Box3().setFromObject(this.model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            const maxDim = Math.max(size.x, size.y, size.z);
            const desiredSize = 2.5;
            const scale = desiredSize / maxDim;
            this.model.scale.set(scale, scale, scale);

            this.model.updateMatrixWorld();
            const newBox = new THREE.Box3().setFromObject(this.model);
            const newCenter = newBox.getCenter(new THREE.Vector3());

            this.model.position.x -= newCenter.x;
            this.model.position.y -= newCenter.y;
            this.model.position.z -= newCenter.z;


            this.scene.add(this.model);

            const distance = desiredSize / (2 * Math.tan(Math.PI * this.camera.fov / 360));
            this.camera.position.set(distance * 0.8, distance * 0.5, distance);
            this.controls.target.set(0, 0, 0);
            this.controls.update();

            const animate = () => {
                this.animationId = requestAnimationFrame(animate);
                this.controls.update();
                this.renderer.render(this.scene, this.camera);
            };
            animate();

        } catch (err) {
            console.error('Ошибка загрузки 3D-модели:', err);
            this.parent.innerHTML = '<div style="color: #ff8888; text-align:center; padding:20px;">❌ Не удалось загрузить 3D-модель<br><small>Проверьте путь к файлу и формат .glb</small></div>';
        }

        this.cleanup = () => {
            window.removeEventListener('resize', handleResize);
            if (this.animationId) cancelAnimationFrame(this.animationId);
            if (this.renderer) this.renderer.dispose();
            if (this.controls) this.controls.dispose();
        };
    }

    destroy() {
        if (this.cleanup) this.cleanup();
        if (this.parent) this.parent.innerHTML = '';
    }
}
