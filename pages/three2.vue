<template>
  <div class="three-v-2">
    <div ref="threeRef" class="container" />
    <div id="info">Description</div>
  </div>
</template>

<script>
import * as THREE from 'three'

import FontLoader from 'three/examples/jsm/loaders/FontLoader'

export default {
    data: function() {
        return {
        }
    },
    mounted() {
        const scene = new THREE.Scene()

        const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 )
        camera.position.set( 0, 0, 100 )
        camera.lookAt( 0, 0, 0 )

        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(window.innerWidth, window.innerHeight);
        (this.$refs.threeRef).appendChild(renderer.domElement)


        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        const cube = new THREE.Mesh(geometry, material)

        // scene.add(cube)





        // 线
        const lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
        const lineGeometry = new THREE.BufferGeometry()
        const pointsArray = []
    //加2000个顶点，范围为-1到1
    for(let i = 0;i<300;i++){
      const x = Math.random() * 20 - 1 //范围在-1到1
      const y = Math.random() * 20 - 1
      const z = Math.random() * 20 - 1 
      pointsArray.push(new THREE.Vector3(x,y,z))
      //顶点
      //geometry.vertices.push(new THREE.Vector3(x,y,z))
    }
    //用这个api传入顶点数组
    lineGeometry.setFromPoints(pointsArray)

        const line = new THREE.Line(lineGeometry, lineMaterial)
        line.position.set(0,6,0)
        scene.add( line );

        // camera.position.z = 5
        function animate() {
            requestAnimationFrame( animate )
            cube.rotation.x += 0.01
            cube.rotation.y += 0.01
            renderer.render( scene, camera )
        }
        animate()

    },
    methods: {
    },
}
</script>

<style>
.three-v-2 {
    position: relative;
}
.container {
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-color: pink;
}
#info {
	position: absolute;
	top: 10px;
	width: 100%;
	text-align: center;
	z-index: 100;
	display:block;
}
</style>
