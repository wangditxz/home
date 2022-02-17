<template>
    <div >
        <div ref="threeRef" class="container"></div>
    </div>
</template>

<script>
import * as THREE from 'three';

export default {
    data: function() {
        return {
        };
    },
    mounted() {
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        (this.$refs.threeRef).appendChild(renderer.domElement);


        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);

        scene.add(cube);


        camera.position.z = 5;
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
