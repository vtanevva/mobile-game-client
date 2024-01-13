import React, { useEffect, useRef } from 'react';
import * as CANNON from 'cannon';
import * as THREE from 'three';

function Game() {
  const canvasContainerRef = useRef();
  const gameEndedRef = useRef(false); // Ref to track game end
  const scoreRef = useRef(0); // Ref to track the score

  useEffect(() => {
    console.clear();

    window.focus();

    class Game {
      constructor() {
        this.STATES = {
          LOADING: "loading",
          PLAYING: "playing",
          READY: "ready",
          ENDED: "ended",
          RESETTING: "resetting"
        };
        this.blocks = [];
        this.state = this.STATES.LOADING;
      }
    }

    let camera, scene, renderer; // ThreeJS globals
    let world; // CannonJs world
    let lastTime; // Last timestamp of animation
    let stack; // Parts that stay solid on top of each other
    let overhangs; // Overhanging parts that fall down
    const boxHeight = 1; // Height of each layer
    const originalBoxSize = 3; // Original width and height of a box
    let autopilot;
    let gameEnded;
    let robotPrecision; // Determines how precise the game is on autopilot

    const scoreElement = document.getElementById("score");
    const instructionsElement = document.getElementById("instructions");
    const resultsElement = document.getElementById("results");

    init();

    function startGame() {
      autopilot = false;
      gameEndedRef.current = false; // Reset gameEndedRef
      scoreRef.current = 0; // Reset scoreRef
      lastTime = 0;
      stack = [];
      overhangs = [];

      if (instructionsElement) instructionsElement.style.display = "none";
      if (resultsElement) resultsElement.style.display = "none";
      if (scoreElement) scoreElement.innerText = 0;

      if (world) {
        while (world.bodies.length > 0) {
          world.remove(world.bodies[0]);
        }
      }

      if (scene) {
        while (scene.children.find((c) => c.type === "Mesh")) {
          const mesh = scene.children.find((c) => c.type === "Mesh");
          scene.remove(mesh);
        }

        addLayer(0, 0, originalBoxSize, originalBoxSize);

        addLayer(-10, 0, originalBoxSize, originalBoxSize, "x");
      }

      if (camera) {
        camera.position.set(4, 4, 4);
        camera.lookAt(0, 0, 0);
      }
    }

    function setRobotPrecision() {
      robotPrecision = Math.random() * 1 - 0.5;
    }

    function init() {
      autopilot = true;
      gameEnded = false;
      lastTime = 0;
      stack = [];
      overhangs = [];
      setRobotPrecision();

      // Initialize CannonJS
      world = new CANNON.World();
      world.gravity.set(0, -10, 0);
      world.broadphase = new CANNON.NaiveBroadphase();
      world.solver.iterations = 40;

      // Initialize ThreeJs
      const aspect = window.innerWidth / window.innerHeight;
      const width = 10;
      const height = width / aspect;


      
      camera = new THREE.OrthographicCamera(
        width / -2,
        width / 2,
        height / 2,
        height / -2,
        0,
        100
      );

      camera.position.set(4, 4, 4);
      camera.lookAt(0, 0, 0);

      scene = new THREE.Scene();

      addLayer(0, 0, originalBoxSize, originalBoxSize);

      addLayer(-10, 0, originalBoxSize, originalBoxSize, "x");

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
      dirLight.position.set(10, 20, 0);
      scene.add(dirLight);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setAnimationLoop(animation);

      // Check if canvas element already exists, remove it if it does
      const existingCanvas = canvasContainerRef.current.querySelector('canvas');
      if (existingCanvas) {
        canvasContainerRef.current.removeChild(existingCanvas);
      }

      canvasContainerRef.current.appendChild(renderer.domElement);
    }

    function startGame() {
      autopilot = false;
      gameEnded = false;
      lastTime = 0;
      stack = [];
      overhangs = [];

      if (instructionsElement) instructionsElement.style.display = "none";
      if (resultsElement) resultsElement.style.display = "none";
      if (scoreElement) scoreElement.innerText = 0;

      if (world) {
        while (world.bodies.length > 0) {
          world.remove(world.bodies[0]);
        }
      }

      if (scene) {
        while (scene.children.find((c) => c.type == "Mesh")) {
          const mesh = scene.children.find((c) => c.type == "Mesh");
          scene.remove(mesh);
        }

        addLayer(0, 0, originalBoxSize, originalBoxSize);

        addLayer(-10, 0, originalBoxSize, originalBoxSize, "x");
      }

      if (camera) {
        camera.position.set(4, 4, 4);
        camera.lookAt(0, 0, 0);
      }
    }

    function addLayer(x, z, width, depth, direction) {
      const y = boxHeight * stack.length;
      const layer = generateBox(x, y, z, width, depth, false);
      layer.direction = direction;
      stack.push(layer);
    }

    function addOverhang(x, z, width, depth) {
      const y = boxHeight * (stack.length - 1);
      const overhang = generateBox(x, y, z, width, depth, true);
      overhangs.push(overhang);
    }

    function generateBox(x, y, z, width, depth, falls) {
      const geometry = new THREE.BoxGeometry(width, boxHeight, depth);
      const color = new THREE.Color(`hsl(${30 + stack.length * 4}, 100%, 50%)`);
      const material = new THREE.MeshLambertMaterial({ color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      scene.add(mesh);

      const shape = new CANNON.Box(
        new CANNON.Vec3(width / 2, boxHeight / 2, depth / 2)
      );
      let mass = falls ? 5 : 0;
      mass *= width / originalBoxSize;
      mass *= depth / originalBoxSize;
      const body = new CANNON.Body({ mass, shape });
      body.position.set(x, y, z);
      world.addBody(body);

      return {
        threejs: mesh,
        cannonjs: body,
        width,
        depth
      };
    }

    function cutBox(topLayer, overlap, size, delta) {
      const direction = topLayer.direction;
      const newWidth = direction == "x" ? overlap : topLayer.width;
      const newDepth = direction == "z" ? overlap : topLayer.depth;

      topLayer.width = newWidth;
      topLayer.depth = newDepth;

      topLayer.threejs.scale[direction] = overlap / size;
      topLayer.threejs.position[direction] -= delta / 2;

      topLayer.cannonjs.position[direction] -= delta / 2;

      const shape = new CANNON.Box(
        new CANNON.Vec3(newWidth / 2, boxHeight / 2, newDepth / 2)
      );
      topLayer.cannonjs.shapes = [];
      topLayer.cannonjs.addShape(shape);
    }

    window.addEventListener("mousedown", eventHandler);
    window.addEventListener("touchstart", eventHandler);
    window.addEventListener("keydown", function (event) {
      if (event.key == " ") {
        event.preventDefault();
        eventHandler();
        return;
      }
      if (event.key == "R" || event.key == "r") {
        event.preventDefault();
        startGame();
        return;
      }
    });

    function eventHandler() {
      if (autopilot) startGame();
      else splitBlockAndAddNextOneIfOverlaps();
    }

    function splitBlockAndAddNextOneIfOverlaps() {
      if (gameEnded) return;

      const topLayer = stack[stack.length - 1];
      const previousLayer = stack[stack.length - 2];

      const direction = topLayer.direction;

      const size = direction == "x" ? topLayer.width : topLayer.depth;
      const delta =
        topLayer.threejs.position[direction] -
        previousLayer.threejs.position[direction];
      const overhangSize = Math.abs(delta);
      const overlap = size - overhangSize;

      if (overlap > 0) {
        cutBox(topLayer, overlap, size, delta);

        const overhangShift =
          (overlap / 2 + overhangSize / 2) * Math.sign(delta);
        const overhangX =
          direction == "x"
            ? topLayer.threejs.position.x + overhangShift
            : topLayer.threejs.position.x;
        const overhangZ =
          direction == "z"
            ? topLayer.threejs.position.z + overhangShift
            : topLayer.threejs.position.z;
        const overhangWidth = direction == "x" ? overhangSize : topLayer.width;
        const overhangDepth = direction == "z" ? overhangSize : topLayer.depth;

        addOverhang(overhangX, overhangZ, overhangWidth, overhangDepth);

        const nextX = direction == "x" ? topLayer.threejs.position.x : -10;
        const nextZ = direction == "z" ? topLayer.threejs.position.z : -10;
        const newWidth = topLayer.width;
        const newDepth = topLayer.depth;
        const nextDirection = direction == "x" ? "z" : "x";

        if (scoreElement) scoreElement.innerText = stack.length - 1;
        addLayer(nextX, nextZ, newWidth, newDepth, nextDirection);
      } else {
        missedTheSpot();
      }
    }
    function gameEndedMessage() {
      // Display the game-ended message
      const message = document.createElement("div");
      message.innerText = "Game Ended";
      message.style.position = "absolute";
      message.style.top = "50%";
      message.style.left = "50%";
      message.style.border = "2px solid white";
      message.style.padding = "1vh"
      message.style.backgroundColor = "white";
      message.style.transform = "translate(-50%, -50%)";
      message.style.fontSize = "2em";
      message.style.color = "#ff0000"; 
      message.style.display = "none";
      message.id = "gameEndedMessage";
      canvasContainerRef.current.appendChild(message);

      // Display the restart button
      const restartButton = document.createElement("button");
      restartButton.innerText = "Restart";
      restartButton.style.position = "absolute";
      restartButton.style.top = "60%";
      restartButton.style.left = "50%";
      restartButton.style.transform = "translate(-50%, -50%)";
      restartButton.style.padding = "10px";
      restartButton.style.fontSize = "1em";
      restartButton.style.cursor = "pointer";
      restartButton.style.backgroundColor = "#4caf50"; // You can customize the color
      restartButton.style.color = "#fff"; // You can customize the color
      restartButton.style.display = "none";
      restartButton.id = "restartButton";
      restartButton.addEventListener("click", () => {
        // Refresh the page on button click
        window.location.reload();
      });
      canvasContainerRef.current.appendChild(restartButton);

      // Update gameEndedRef to true
      gameEndedRef.current = true;
    }

    function updateScore() {
      if (scoreElement && !gameEndedRef.current) {
        // Update the score display during the game
        scoreRef.current = stack.length - 1;
        scoreElement.innerText = scoreRef.current;

      }
    }


    function missedTheSpot() {
      const topLayer = stack[stack.length - 1];

      addOverhang(
        topLayer.threejs.position.x,
        topLayer.threejs.position.z,
        topLayer.width,
        topLayer.depth
      );
      world.remove(topLayer.cannonjs);
      scene.remove(topLayer.threejs);

      gameEnded = true;
      if (resultsElement && !autopilot) resultsElement.style.display = "flex";
    
      gameEndedMessage();
    }
   
    
    function animation(time) {
      if (lastTime) {
        const timePassed = time - lastTime;
        const speed = 0.008;

        const topLayer = stack[stack.length - 1];
        const previousLayer = stack[stack.length - 2];

        const boxShouldMove =
          !gameEnded &&
          (!autopilot ||
            (autopilot &&
              topLayer.threejs.position[topLayer.direction] <
                previousLayer.threejs.position[topLayer.direction] +
                  robotPrecision));

        if (boxShouldMove) {
          topLayer.threejs.position[topLayer.direction] += speed * timePassed;
          topLayer.cannonjs.position[topLayer.direction] += speed * timePassed;

          if (topLayer.threejs.position[topLayer.direction] > 10) {
            missedTheSpot();
          }
        } else {
          if (autopilot) {
            splitBlockAndAddNextOneIfOverlaps();
            setRobotPrecision();
          }
        }

        if (camera.position.y < boxHeight * (stack.length - 2) + 4) {
          camera.position.y += speed * timePassed;
        }

        updatePhysics(timePassed);
        renderer.render(scene, camera);

        // Show game-ended message and restart button only after the game ends
        if (gameEndedRef.current) {
          if (gameEndedRef.current && time > 2000) {
            // Display the game-ended message and restart button
            if (gameEndedRef.current) {
              const message = document.querySelector("#gameEndedMessage");
              if (message) {
                message.style.display = "block";
              }

              const restartButton = document.querySelector("#restartButton");
              if (restartButton) {
                restartButton.style.display = "block";
              }
            }
          }
        }

        // Update the score display during the game
        updateScore();
      }
      lastTime = time;
    
    }

    function updatePhysics(timePassed) {
      world.step(timePassed / 1000);

      overhangs.forEach((element) => {
        element.threejs.position.copy(element.cannonjs.position);
        element.threejs.quaternion.copy(element.cannonjs.quaternion);
      });
    }

    window.addEventListener("resize", () => {
      const aspect = window.innerWidth / window.innerHeight;
      const width = 10;
      const height = width / aspect;

      camera.top = height / 2;
      camera.bottom = height / -2;

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    });

    // Start the animation loop
    const animate = (time) => {
      animation(time);
      requestAnimationFrame(animate);
    };

    animate();

    // Clean up when the component unmounts
    return () => {
      // Dispose of resources, remove event listeners, etc.
      window.removeEventListener("mousedown", eventHandler);
      window.removeEventListener("touchstart", eventHandler);
      window.removeEventListener("keydown", function (event) {
        if (event.key == " ") {
          event.preventDefault();
          eventHandler();
          return;
        }
        if (event.key == "R" || event.key == "r") {
          event.preventDefault();
          startGame();
          return;
        }
      });

      // Remove the canvas element if it exists
      const existingCanvas = canvasContainerRef.current.querySelector('canvas');
      if (existingCanvas) {
        canvasContainerRef.current.removeChild(existingCanvas);
      }
    };
  }, []);

  return <div ref={canvasContainerRef} />;
}

export default Game;
