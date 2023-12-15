<template>
  <v-app>
    <v-main>
      <v-container fluid>

        <!-- Top buttons area -->
        <div class="buttons-container">
          <v-btn class="christmas-btn" color="blue" @click="play">Play</v-btn>
          <v-btn class="christmas-btn" color="red" @click="reset">Reset</v-btn>
          <v-btn class="christmas-btn" color="green" @click="pause">Pause</v-btn>
          <!-- Other buttons -->
        </div>

        <!-- Main content with sidebar -->
        <v-row justify="center">
          <!-- Left sidebar for shapes -->
          <v-col cols="12" sm="3" md="3" class="sidebar">
            <div id="left-sidebar">
              <v-row>
                <v-col cols="6" v-for="(shapeData, shapeName) in leftShapes" :key="`left-${shapeName}`"
                  class="puzzle-piece-container" @click="preparePieceToPlace(shapeName)">
                  <div :ref="`pieceContainer${shapeName}`"></div>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <!-- Center content -->
          <v-col cols="12" sm="6" md="6">
            <div id="container" class="text-center">
              <!-- 3D display will be here -->
            </div>

            <div class="buttons-container">
              <v-btn class="control-btn christmas-btn" @click="moveSphere('forward')">Forward</v-btn>
              <v-btn class="control-btn christmas-btn" @click="moveSphere('backward')">Back</v-btn>
              <v-btn class="control-btn christmas-btn" @click="moveSphere('left')">Left</v-btn>
              <v-btn class="control-btn christmas-btn" @click="moveSphere('right')">Right</v-btn>
              <v-btn class="control-btn christmas-btn" @click="moveSphere('up')">Up</v-btn>
              <v-btn class="control-btn christmas-btn secondary-christmas" @click="moveSphere('down')">Down</v-btn>

            </div>
          </v-col>
          <!-- Right sidebar for shapes -->
          <v-col cols="12" sm="3" md="3" class="sidebar">
            <div id="right-sidebar" class="sidebar">
              <v-row>
                <v-col cols="6" v-for="(shapeData, shapeName) in rightShapes" :key="`right-${shapeName}`"
                  class="puzzle-piece-container" @click="preparePieceToPlace(shapeName)">
                  <div :ref="`pieceContainer${shapeName}`"></div>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>

        <!-- Solutions row -->
        <!-- Solutions row -->
        <v-row class="scrollable-container" dense>
          <!-- Assume we want 4 solutions per row, so we set cols to '3' (12 / 3 = 4) -->
          <v-col v-for="(solution, index) in solutions" :key="index" cols="12" sm="6" md="3" lg="3">
            <v-card class="solution-card" @mouseover="onCardHover(index)">
              <v-card-text>
                <canvas :id="'solutionCanvas-' + index"></canvas>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>


  
<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Pyramid, { PyramidLayer } from './Pyramid';
import Scene, { inputShapes, inputCoords } from "./PolyPyramidScene"
import { solve, items, sets } from './Solver';
import { create_dicts } from "./Create_dict_objects";
import { shapeStore } from "./Shapes3D.js";
import { convert_to_pyramid_layers } from "./ConvertSolutionFormat";
import { generate_headers, populate_problem_matrix3D, reduce_problem_matrix } from "./Generate_problem_matrix3D";


export default {
  name: 'ThreePuzzle',
  data() {
    return {
      scene: null,
      shapeStore: shapeStore,
      isPaused: false,
      camera: null,
      renderer: null,
      solutions: [],
      pyramid: new Pyramid(5, 1), // 创建金字塔实例
      pyramidSpheres: [],
      pyramidGrid: [],
      input_shapes: [],
      input_squares: [],
      problem_mat: [],
      problem_def: [],
      headers: [],
      solutionCount: 0,
      stopExecution: false,
      pieceColors: ['#ff0000', '#f00295', '#d989ba', '#3471eb', '#ffe100', '#3471eb', '#3471eb', '#3471eb', '#3471eb', '#3471eb', '#3471eb', '#3471eb'],
      pieceGeometries: [
        [new THREE.Vector3(0, 0, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(-1, -1, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(1, -1, 0)],
        [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, -1, 0), new THREE.Vector3(-1, -1, 0), new THREE.Vector3(-2, -1, 0)],
        [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, -1, 0), new THREE.Vector3(1, -1, 0)],
        [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -1, 0), new THREE.Vector3(-1, -1, 0), new THREE.Vector3(1, -1, 0), new THREE.Vector3(2, -1, 0)],
        [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, -1, 0), new THREE.Vector3(1, -1, 0), new THREE.Vector3(-1, -1, 0)],
        [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(2, 0, 0), new THREE.Vector3(2, -1, 0), new THREE.Vector3(2, -2, 0)],
        [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -1, 0), new THREE.Vector3(1, -1, 0), new THREE.Vector3(2, -1, 0), new THREE.Vector3(3, -1, 0)],
        [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(1, -1, 0), new THREE.Vector3(2, -1, 0), new THREE.Vector3(2, -2, 0)],

        [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -1, 0), new THREE.Vector3(-1, -1, 0), new THREE.Vector3(1, -1, 0)],
        [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, -1, 0), new THREE.Vector3(-1, -1, 0)],
        [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, -2, 0)],

        [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -1, 0), new THREE.Vector3(1, -1, 0)],
      ],
      scene: new Scene(),
      uiTimer: null,
      dicts: [],
      solution: null, // 存储解决方案的路径
      pieces: [],
      selectedPiece: null,
      selectedPieceIndex: null,
      pyramidLayers: 5, // 假设金字塔有5层
      cellSize: 25, // 每个球体的尺寸
      colours: {
        "A": 0xC0392B, // 圣诞红
        "B": 0x27AE60, // 圣诞绿
        "C": 0xECF0F1, // 雪白色
        "D": 0xF1C40F, // 金色
        "E": 0xBDC3C7, // 银色
        "F": 0x9B59B6, // 深紫色，可以作为装饰色
        "G": 0x34495E, // 深蓝/夜空色，也可以作为装饰色
        "H": 0xE74C3C, // 另一种红色，可以用于变化
        "I": 0x16A085, // 翡翠绿，圣诞树的颜色
        "J": 0x2ECC71, // 浅绿色，圣诞花环的颜色
        "K": 0xF39C12, // 橙色，圣诞灯光的颜色
        "L": 0x7F8C8D  // 石板灰，可以作为中性色平衡鲜艳的颜色
      },
    };
  },
  mounted() {
    this.initThree();
    this.createPieceCanvases();
    // // initPyramidGrid();
    this.createPyramid();
    this.renderer.domElement.addEventListener('mousedown', this.onDocumentMouseDown, false);
    this.renderer.domElement.addEventListener('click', this.onCanvasClick, false);
    // this.onSolveButtonClick();


  },
  computed: {
    leftShapes() {
      const keys = Object.keys(this.shapeStore);
      const firstHalfKeys = keys.slice(0, 6);
      const firstHalf = {};
      for (const key of firstHalfKeys) {
        firstHalf[key] = this.shapeStore[key];
      }
      return firstHalf;
    },
    rightShapes() {
      const keys = Object.keys(this.shapeStore);
      const firstHalfKeys = keys.slice(6, 12);
      const firstHalf = {};
      for (const key of firstHalfKeys) {
        firstHalf[key] = this.shapeStore[key];
      }
      return firstHalf;
    },
    // ... 其他计算属性 ...
  },
  methods: {
    onCardHover(index) {
      if (this.isPaused) {
        this.drawPosition(this.solutions[index]);
      }

    },



    pause() {
      this.isPaused = true;
    },
    reset() {
      this.isPaused = true;
      this.solutionCount = 0;
      this.solutions = [];

      this.pyramid = new Pyramid(5, 1);
      this.createPyramid();
      // this.drawPosition(this.solutions[0]);
    },
    drawPosition(position) {
      for (let layer = 0; layer < position.length; layer++) {
        for (let i = 0; i < position[layer].length; i++) {
          for (let j = 0; j < position[layer].length; j++) {
            if (["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].indexOf(position[layer][i][j]) !== -1) {
              // Set to shape colour
              this.pyramid.getLayer(5 - layer).set(i, j, this.colours[position[layer][i][j]]);
            }
            else {
              // Set to black to indicate empty
              this.pyramid.getLayer(5 - layer).set(i, j, 0x233333);
            }
          }
        }
      }
      this.createPyramid();
    },
    beforeDestroy() {
      // 组件销毁前清除定时器
      // clearInterval(this.solutionTimer);
    },

    checkInput(shapes, coords) {
      for (let i = 0; i < shapes.length; i++) {
        if (shapeStore[shapes[i]].layout.length !== coords[i].length) {
          // Wrong number of spheres for shape, abort.
          return false;
        }
      }
      return true;
    },
    addSolution(newSolution) {
      this.$nextTick(() => {
        const index = this.solutions.length - 1;
        console.log(index);
        this.draw2DSolution(newSolution, index);
      });
    },
    draw2DSolution(pyramidLayers, index) {
      const canvasId = 'solutionCanvas-' + index;
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.height = 450;

      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let startY = 0;
      const radius = 10;
      const padding = 5;

      pyramidLayers = pyramidLayers.slice().reverse();

      pyramidLayers.forEach(layer => {
        // 计算每层的最大列数
        const maxCols = Math.max(...layer.map(row => row.length));
        // 计算每层的宽度
        const layerWidth = maxCols * (2 * radius + padding);
        // 计算每层的起始 x 坐标以居中绘制
        const startX = (canvas.width - layerWidth) / 2 + radius + padding;

        layer.forEach((row, rowIndex) => {
          row.forEach((cell, cellIndex) => {
            if (cell !== '') {
              // 根据字母选择颜色
              const color = this.colours[cell];
              ctx.fillStyle = `#${color.toString(16)}`;
              ctx.beginPath();
              // 使用 startX 调整 x 坐标
              const x = startX + cellIndex * (2 * radius + padding);
              const y = rowIndex * (2 * radius + padding) + radius + padding + startY;
              ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
              ctx.fillStyle = `#${color.toString(16)}`;
              ctx.shadowOffsetX = 2;
              ctx.shadowOffsetY = 2;
              ctx.shadowBlur = 4;
              ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
              ctx.fill();
              ctx.lineWidth = 1;
              // ctx.strokeStyle = '#003300';
              ctx.stroke();
            }
          });
        });
        // 更新下一层的起始 Y 坐标
        startY += layer.length * (2 * radius + padding) + 10; // 10 是每层之间的间隔
      });
    },
    matchSphereToPyramidCell(sphere, threshold = 0.1) {
      // for (let layerIndex = 0; layerIndex < this.pyramid.layers.length; layerIndex++) {
      //   let layer = this.pyramid.layers[layerIndex];
      //   for (let rowIndex = 0; rowIndex < layer.size; rowIndex++) {
      //     for (let colIndex = 0; colIndex < layer.size; colIndex++) {
      //       let cell = layer.get(rowIndex, colIndex);


      //       // const z1 = 5 - Math.round(sphere.position.y / Math.sqrt(2));

      //       // let x1 = (cell.pos[0] - 1 - 1 * (5 - z1)) / (2 * 1);
      //       // let y1 = (cell.pos[1] - 1 - 1 * (5 - z1)) / (2 * 1);
      //       // console.log(x1, y1, z1);
      //       // console.log(...cell.pos);
      //       // let cellPosition = new THREE.Vector3(...cell.pos);
      //       // Check if the sphere is close enough to the cell position
      //       // if (sphere.position.distanceTo(cellPosition) < threshold) {
      //       //   return { layer: layerIndex, row: rowIndex, col: colIndex };
      //       // }
      //     }
      //   }
      // }
      // return null; // Return null if no matching cell is found

      for (let layerIndex = 0; layerIndex <  this.pyramid.layers.length; layerIndex++) {
        let layer =  this.pyramid.layers[layerIndex];
        for (let rowIndex = 0; rowIndex < layer.size; rowIndex++) {
          for (let colIndex = 0; colIndex < layer.size; colIndex++) {
            let cell = layer.get(rowIndex, colIndex);
            let worldPosition = new THREE.Vector3();

            cell.userData.getWorldPosition(worldPosition);
// console.log(child.position);

console.log('cell.userData', worldPosition); // This will log the position of each sphere

            // console.log(cell.userData.position.x,cell.userData.position.y,cell.userData.position.z);
            // Assuming the sphere's position matches the cell's position
            if (cell.userData === sphere) {
              console.log('!!!!!!!!!!!!!!!');
              return { layer: layerIndex, row: rowIndex, col: colIndex };
            }
          }
        }
      }
      return null;
    },

    play() {


      // const y = 5 - Math.round(this.selectedPiece.position.y / Math.sqrt(2));


      // const x = this.selectedPiece.position.x;

      // const z = this.selectedPiece.position.z;


      // // console.log(x, y, z);
      // // this.matchSphereToPyramidCell();

      // this.selectedPiece.children.forEach((sphere) => {

      //   let coords = this.matchSphereToPyramidCell(sphere);

      //   // console.log(sphere.position);

      //   let worldPosition = new THREE.Vector3();

      //   sphere.getWorldPosition(worldPosition);
      //   // console.log(child.position);

      //   console.log('worldPosition', worldPosition); // This will log the position of each sphere
      // });

     




      // return;

      this.solutionCount = 0;
      this.isPaused = false;

      let input_shapes = inputShapes.get();
      let input_coords = inputCoords.get();

      if (!this.checkInput(input_shapes, inputCoords)) {
        return;
      }

      let problemMat = populate_problem_matrix3D();
      let problemDef = reduce_problem_matrix(problemMat, generate_headers(problemMat), input_shapes, input_coords, false); // 假设 isFourLevel 状态为 false
      problemMat = problemDef[0];
      let headers = problemDef[1];
      let dicts = create_dicts(problemMat, headers, false);

      let ret = solve(dicts[0], dicts[1], [], false, headers);

      this.uiTimer = setInterval(() => {
        if (this.isPaused) {
          return;
        }
        let arr = ret.next().value;
        if (!arr) {
          clearInterval(this.uiTimer);
          this.uiTimer = null;
          return;
        }

        this.solutionCount += 1;
        let pyramidLayers = convert_to_pyramid_layers(arr, problemMat, headers, input_shapes, input_coords);
        this.solutions.push(pyramidLayers);

        this.addSolution(pyramidLayers);
        this.drawPosition(pyramidLayers);
      }, 1000 / 20);
    },
    createPyramid() {
      // 确保金字塔和场景已初始化
      if (!this.pyramid || !this.scene) {
        return;
      }

      // 遍历金字塔的每层
      for (let i = 0; i < this.pyramid.layers.length; i++) {
        const layer = this.pyramid.layers[i];
        for (let x = 0; x < layer.size; x++) {
          for (let y = 0; y < layer.size; y++) {
            const cell = layer.get(x, y);
            let pos = cell.pos;
            let color = cell.color;

            if (!cell.userData) {
              // 创建新的球体

              cell.userData = this.createSphere(pos[0], pos[1], pos[2], color, this.pyramid.radius());
              this.scene.add(cell.userData);
            } else {
              // 更新已有球体的颜色
              cell.userData.material.color.set(color);
              cell.userData.material.specular.set(color);
              cell.userData.material.needsUpdate = true;
            }
          }
        }
      }
    },

    createSphere(x, y, z, color, radius) {
      console.log(x, y, z);
      const material = new THREE.MeshPhongMaterial({
        color: color,
        specular: color,
        shininess: 30
      });
      const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
      const sphere = new THREE.Mesh(sphereGeometry, material);
      sphere.position.set(x, z, y);
      return sphere;
    },
    initThree() {
      const scene = new THREE.Scene();
      // scene.background = new THREE.Color(0xffffff);
      const width = document.getElementById('container').clientWidth;
      const height = document.getElementById('container').clientHeight;
      const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
      camera.fov = 45;
      camera.near = 0.2;
      camera.far = 300;
      camera.position.z = 18;
      camera.position.x = -15
      camera.position.y = 9;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);

      renderer.shadowMap.enabled = false;


      document.getElementById('container').appendChild(renderer.domElement);
      const ambientLight = new THREE.AmbientLight(0xffe0bd);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffb84d, 0.7); // 暖橙色，较亮
      directionalLight.position.set(-1, 1, 1); // 可以调整位置以获得最佳阴影效果
      scene.add(directionalLight);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;

      controls.target = new THREE.Vector3(5, 3.8, 5);

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();
      this.scene = scene;
      this.camera = camera;
      this.renderer = renderer;
    },
    createSphere(x, y, z, color, radius, segs) {
      let mat = new THREE.MeshPhongMaterial({
        color: color,
        specular: color,
        shininess: 30
      });
      mat.castShadow = true;
      mat.receiveShadow = true;
      let sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segs, segs), mat);
      sphere.position.set(x, z, y);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      sphere.name = ["s", x, y, z].join(",");
      return sphere;
    },
    createPieceCanvases() {
      for (let shape of Object.values(shapeStore)) {
        const canvas = document.createElement('canvas');
        canvas.width = 150;
        canvas.height = 150;
        this.$refs[`pieceContainer${shape.name}`][0].appendChild(canvas);
        this.createPieceScene(shape.layout, this.colours[shape.name], canvas);
      }

    },
    createPieceScene(shapeCoords, color, canvas) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);

      camera.position.z = 5;
      const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio); // 设置为设备的像素比率

      shapeCoords.forEach(([x, y]) => {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: color });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(x, -y, 0);
        scene.add(sphere);
      });

      // 添加光照
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(0, 1, 1);
      scene.add(directionalLight);



      // 渲染场景
      renderer.render(scene, camera);
    },
    onCanvasClick(event) {
      // 获取鼠标在canvas中的位置
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // 转换为标准化设备坐标（NDC）
      const ndcX = (x / rect.width) * 2 - 1;
      const ndcY = -(y / rect.height) * 2 + 1;

      // 创建射线投射器
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera({ x: ndcX, y: ndcY }, this.camera);

      // 获取与射线相交的对象列表
      const intersects = raycaster.intersectObjects(this.scene.children);

      // 如果有对象相交
      if (intersects.length > 0) {
        // 检测第一个相交的对象
        const firstObject = intersects[0].object;

        // 如果是球体
        if (firstObject.geometry.type === 'SphereGeometry') {
          // 获取球体的世界坐标
          // const spherePosition = firstObject.getWorldPosition(new THREE.Vector3());
          // console.log(firstObject.position);

          // this.pyramid.getLayer(1).set(firstObject.position.x, Math.round(firstObject.position.y), this.colours['A']);


          const material = new THREE.MeshStandardMaterial({
            color: 0x27AE60,
            metalness: 0.5, // 金属感，介于0（非金属）到1（金属）之间
            roughness: 0.5, // 粗糙度，介于0（光滑）到1（粗糙）之间
          });
          const group = new THREE.Group();
          // console.log(geometryPositions);
          // geometryPositions.forEach(position => {
          //   const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
          //   const sphere = new THREE.Mesh(sphereGeometry, material);
          //   sphere.position.copy(position);
          //   group.add(sphere);
          // });

          // const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
          // const sphere = new THREE.Mesh(sphereGeometry, material);
          // sphere.position.copy(0,0,0);


          // group.add(sphere);

          // this.scene.add(group)

          // 改变球体颜色
          // firstObject.material.color.set(0xff0000); // 设置为红色

          // 可以调用一个方法来处理更多逻辑
          // this.handleSphereClick(spherePosition);
        }
      }
    },

    moveSphere(direction) {
      if (!this.selectedPiece) {
        console.warn("No sphere is selected for movement.");
        return;
      }

      const distance = 1;

      // 计算新的位置
      let newPosition = this.selectedPiece.position.clone();

      switch (direction) {
        case 'forward':
          this.selectedPiece.position.z -= distance;
          break;
        case 'backward':
          this.selectedPiece.position.z += distance;
          break;
        case 'left':
          this.selectedPiece.position.x -= distance;
          break;
        case 'right':
          this.selectedPiece.position.x += distance;
          break;
        case 'up':
          this.selectedPiece.position.y += Math.sqrt(2);
          break;
        case 'down':
          this.selectedPiece.position.y -= Math.sqrt(2);
          break;
        default:
          console.warn("Invalid direction. Must be one of 'forward', 'backward', 'left', 'right', 'up', or 'down'.");
          return;
      }




    },
    preparePieceToPlace(pieceIndex) {
      if (this.selectedPiece) {
        this.scene.remove(this.selectedPiece);
      }

      const STEP = Math.sqrt(2);

      function calcPosition(layer, radius, x, y, maxLayer) {
        let z = (maxLayer - layer) * STEP + radius;
        let xx = radius + 2 * x * radius + radius * (maxLayer - layer);
        let yy = radius + 2 * y * radius + radius * (maxLayer - layer);
        return [xx, yy, z];
      }

      const piece = new THREE.Group();

      for (let position of shapeStore[pieceIndex].layout) {
        let p = calcPosition(5, 1, position[0] - 1, position[1], 5);
        const sphere = this.createSphere(p[0], p[1], p[2], this.colours[pieceIndex], 1);
        piece.add(sphere);
      }

      this.scene.add(piece);
      this.selectedPiece = piece;
      this.selectedPieceIndex = pieceIndex;
    },
    rotatePiece(axis) {
      if (!this.selectedPiece) return;
      const angle = Math.PI / 2;
      if (axis === 'x') this.selectedPiece.rotateX(angle);
      if (axis === 'y') this.selectedPiece.rotateY(angle);
      if (axis === 'z') this.selectedPiece.rotateZ(angle);
    },
    submitPiece() {
      if (!this.selectedPiece) return;
      this.pieces[this.selectedPieceIndex] = this.selectedPiece;
      this.selectedPiece = null;
      this.selectedPieceIndex = null;
    },
    createPiece(geometryPositions, color) {

      const material = new THREE.MeshPhongMaterial({
        color: color,
        specular: color,
        shininess: 30
      });
      const group = new THREE.Group();
      geometryPositions.forEach(position => {
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        const sphere = new THREE.Mesh(sphereGeometry, material);
        sphere.position.copy(position);
        group.add(sphere);
      });
      return group;

    }
  }
};
</script>
  
<style>
#app-container {
  font-family: 'Roboto', sans-serif;
}

canvas {
  display: block;


  /* 移除了可能存在的 height 属性 */
}

#container {
  min-height: 50vh;
  /* adjust height as per your content */
  display: flex;
  justify-content: center;
  align-items: center;
}


.v-main {
  background-image: url('https://images3.alphacoders.com/129/1295531.jpg');
  background-repeat: repeat;
  /* background-position: center;
  background-size: cover; */

  /* animation: snow 20s linear infinite; */

}

.solution-card {

  background-color: #F8F8F8;
  /* 淡色背景 */
  border: 1px solid #D6D6D6;
  /* 轻微边框 */
  border-radius: 10px;
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
  overflow: hidden;
  /* 确保内容不溢出 */
  /* margin: 10px 0; 添加一些外边距 */
}

.scrollable-container {
  height: 500px;
  /* 或者您希望的高度 */
  overflow-y: auto;
}

.v-card {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

.solution-card {
  background-color: transparent !important;
}

/* 如果 .v-card-text 或 .v-card-title 设置了背景，也需要确保它们透明 */
.v-card-text,
.v-card-title {
  background-color: transparent !important;
}

.christmas-btn {
  margin: 10px;
  border-radius: 5px;
  /* 圆角按钮 */
  color: white;
  /* 白色文字 */

  transition: transform 0.3s ease, background-color 0.3s ease;

  &:hover {
    transform: scale(1.1);
    /* 放大效果 */
    background-color: #E74C3C;
    /* 颜色变化 */
  }

  border-radius: 50%;
  /* 圆形按钮 */
  padding: 10px 15px;
  /* 适当的内边距 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  border: 2px solid #FFFFFF;
  /* 白色边框 */
}

.sidebar {
  padding-left: 0;
  padding-right: 0;
}

.buttons-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  flex-wrap: wrap;
}

.christmas-btn {
  color: white;
  /* 白色文字 */
  background-color: red;
  /* 红色背景 */
  border: 2px solid green;
  /* 绿色边框 */
  border-radius: 5px;
  /* 圆角边框 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  /* 轻微阴影 */
  margin: 5px;
  /* 略微间距 */
}

.secondary-christmas {
  background-color: green;
  /* 变化一个按钮为绿色背景 */
  border-color: red;
  /* 红色边框 */
}</style>

