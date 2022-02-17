<template>
    <div >
        <div ref="threeRef" class="container" style="background: #fff;"></div>
    </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


import GLTFLoader from '@/assets/GLTFLoader';

import landModel from '@/assets/models/land.glb';
import flagModel from '@/assets/models/flag.glb';
import bingdundunModel from '@/assets/models/bingdundun.glb';



import sky from '@/assets/models/sky.jpg';
import snow from '@/assets/models/snow.png';
import tree from '@/assets/models/tree.png';
import flagTexture from '@/assets/models/flag.png';


export default {
    data: function() {
        return {
        };
    },
    mounted() {
        const meshes = [];
        const fiveCyclesGroup = new THREE.Group();
        let land;
        const scene = new THREE.Scene();
        scene.background = new THREE.TextureLoader().load(sky);

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 30, 100)
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        (this.$refs.threeRef).appendChild(renderer.domElement);


        const cubeGeometry = new THREE.BoxGeometry(0.001, 0.001, 0.001);
        const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xdc161a });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(0, 0, 0);
         const light = new THREE.DirectionalLight(0xffffff, 1);
        light.intensity = 1;
        light.position.set(16, 16, 8);
        light.castShadow = true;
        light.target = cube;
        light.shadow.mapSize.width = 512 * 12;
        light.shadow.mapSize.height = 512 * 12;
        light.shadow.camera.top = 40;
        light.shadow.camera.bottom = -40;
        light.shadow.camera.left = -40;
        light.shadow.camera.right = 40;
        scene.add(light);


        var ambientLight = new THREE.AmbientLight(0xcfffff);
      ambientLight.intensity = 1;
      scene.add(ambientLight);

      const manager = new THREE.LoadingManager();
      manager.onStart = (url, loaded, total) => {};
      manager.onLoad = () => { console.log('Loading complete!')};
      manager.onProgress = async(url, loaded, total) => {
        // if (Math.floor(loaded / total * 100) === 100) {
        //   _this.loadingProcessTimeout && clearTimeout(_this.loadingProcessTimeout);
        //   _this.loadingProcessTimeout = setTimeout(() => {
        //     _this.setState({ loadingProcess: Math.floor(loaded / total * 100) });
        //     Animations.animateCamera(camera, controls, { x: 0, y: -1, z: 20 }, { x: 0, y: 0, z: 0 }, 3600, () => {});
        //   }, 800);
        // } else {
        //   _this.setState({ loadingProcess: Math.floor(loaded / total * 100) });
        // }
      };


// 添加地面
      var loader = new GLTFLoader(manager);
      loader.load(landModel, function (mesh) {
        mesh.scene.traverse(function (child) {
          if (child.isMesh) {
            meshes.push(child)
            child.material.metalness = .1;
            child.material.roughness = .8;
            // 地面
            if (child.name === 'Mesh_2') {
              child.material.metalness = .5;
              child.receiveShadow = true;
            }
            // 围巾
            if (child.name === 'Mesh_17') {
              child.material.metalness = .2;
              child.material.roughness = .8;
            }
            // 帽子
            if (child.name === 'Mesh_17') {}
          }
        });
        mesh.scene.rotation.y = Math.PI / 4;
        mesh.scene.position.set(15, -20, 0);
        mesh.scene.scale.set(.9, .9, .9);
        land = mesh.scene;
        scene.add(land);
      });

      // 旗帜
      loader.load(flagModel, mesh => {
        mesh.scene.traverse(child => {
          if (child.isMesh) {
            meshes.push(child)
            child.castShadow = true;
            // 旗帜
            if (child.name === 'mesh_0001') {
              child.material.metalness = .1;
              child.material.roughness = .1;
              child.material.map = new THREE.TextureLoader().load(flagTexture);
            }
            // 旗杆
            if (child.name === '柱体') {
              child.material.metalness = .6;
              child.material.roughness = 0;
              child.material.refractionRatio = 1;
              child.material.color = new THREE.Color(0xeeeeee);
            }
          }
        });
        mesh.scene.rotation.y = Math.PI / 24;
        mesh.scene.position.set(2, -7, -1);
        mesh.scene.scale.set(4, 4, 4);
        // 动画
        let meshAnimation = mesh.animations[0];
        const mixer = new THREE.AnimationMixer(mesh.scene);
        let animationClip = meshAnimation;
        let clipAction = mixer.clipAction(animationClip).play();
        animationClip = clipAction.getClip();
        scene.add(mesh.scene);
      });

      // bingdundun
      loader.load(bingdundunModel, function (mesh) {
        mesh.scene.traverse(function (child) {
          if (child.isMesh) {
            meshes.push(child)
            if (child.name === 'oldtiger001') {
              child.material.metalness = .5
              child.material.roughness = .8
            }
            if (child.name === 'oldtiger002') {
              child.material.transparent = true;
              child.material.opacity = .5
              child.material.metalness = .2
              child.material.roughness = 0
              child.material.refractionRatio = 1
              child.castShadow = true;
            }
          }
        });
        mesh.scene.rotation.y = Math.PI / 24;
        mesh.scene.position.set(-8, -12, 0);
        mesh.scene.scale.set(24, 24, 24);
        scene.add(mesh.scene);
      });

      // 添加树
      let treeMaterial = new THREE.MeshPhysicalMaterial({
        map: new THREE.TextureLoader().load(tree),
        transparent: true,
        side: THREE.DoubleSide,
        metalness: .2,
        roughness: .8,
        depthTest: true,
        depthWrite: false,
        skinning: false,
        fog: false,
        reflectivity: 0.1,
        refractionRatio: 0,
      });
      let treeCustomDepthMaterial = new THREE.MeshDepthMaterial({
        depthPacking: THREE.RGBADepthPacking,
        map: new THREE.TextureLoader().load(tree),
        alphaTest: 0.5
      });
      loader.load(tree, function (mesh) {
        mesh.scene.traverse(function (child) {
          if (child.isMesh) {
            meshes.push(child)
            child.material = treeMaterial;
            child.custromMaterial = treeCustomDepthMaterial;
          }
        });
        mesh.scene.position.set(14, -9, 0);
        mesh.scene.scale.set(16, 16, 16);
        scene.add(mesh.scene);
        let tree2 = mesh.scene.clone();
        tree2.position.set(10, -8, -15);
        tree2.scale.set(18, 18, 18);
        scene.add(tree2)
        let tree3 = mesh.scene.clone();
        tree3.position.set(-18, -8, -16);
        tree3.scale.set(22, 22, 22);
        scene.add(tree3)
      });


      // 创建五环
      const fiveCycles = [
        { key: 'cycle_0', color: 0x0885c2, position: { x: -250, y: 0, z: 0 }},
        { key: 'cycle_1', color: 0x000000, position: { x: -10, y: 0, z: 5 }},
        { key: 'cycle_2', color: 0xed334e, position: { x: 230, y: 0, z: 0 }},
        { key: 'cycle_3', color: 0xfbb132, position: { x: -125, y: -100, z: -5 }},
        { key: 'cycle_4', color: 0x1c8b3c, position: { x: 115, y: -100, z: 10 }}
      ];
      fiveCycles.map(item => {
        let cycleMesh = new THREE.Mesh(new THREE.TorusGeometry(100, 10, 10, 50), new THREE.MeshLambertMaterial({
          color: new THREE.Color(item.color),
          side: THREE.DoubleSide
        }));
        cycleMesh.castShadow = true;
        cycleMesh.position.set(item.position.x, item.position.y, item.position.z);
        meshes.push(cycleMesh);
        fiveCyclesGroup.add(cycleMesh);
      });
      fiveCyclesGroup.scale.set(.036, .036, .036);
      fiveCyclesGroup.position.set(0, 10, -8);
      scene.add(fiveCyclesGroup);

      // 创建雪花
    //   let texture = new THREE.TextureLoader().load(snow);
    //   let geometry = new THREE.Geometry();
    //   let pointsMaterial = new THREE.PointsMaterial({
    //     size: 1,
    //     transparent: true,
    //     opacity: 0.8,
    //     map: texture,
    //     blending: THREE.AdditiveBlending,
    //     sizeAttenuation: true,
    //     depthTest: false
    //   });
    //   let range = 100;
    //   let vertices = []
    //   for (let i = 0; i < 1500; i++) {
    //     let vertice = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range * 1.5, Math.random() * range - range / 2);
    //     // 纵向移动速度
    //     vertice.velocityY = 0.1 + Math.random() / 3;
    //     // 横向移动速度
    //     vertice.velocityX = (Math.random() - 0.5) / 3;
    //     // 将顶点加入几何
    //     geometry.vertices.push(vertice);
    //   }
    //   geometry.center();
    //   points = new THREE.Points(geometry, pointsMaterial);
    //   points.position.y = -30;
    //   scene.add(points);

    const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.enableZoom = false;
      // 垂直旋转角度限制
      controls.minPolarAngle = 1.4;
      controls.maxPolarAngle = 1.8;
      // 水平旋转角度限制
      controls.minAzimuthAngle = -.6;
      controls.maxAzimuthAngle = .6;
    //   window.addEventListener('resize', onWindowResize, false);

        function animate() {
            requestAnimationFrame( animate );
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render( scene, camera );
        }
        animate();

    },
    methods: {
    },
};
</script>

<style>
.container {
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-color: pink;
}
</style>
