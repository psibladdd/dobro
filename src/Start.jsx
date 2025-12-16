import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { Text, Edges, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense, useState, useRef, useEffect, useCallback } from 'react';
import logo from './/Плажка.svg';
import graphVideo1 from './/график вниз.mp4';
import graphVideo2 from './/график нейтральный.mp4';
import graphVideo3 from './/вверх график.mp4';
import mainVideo from './/main.mp4';
import './index.css';

// ---------- CLOUDS ----------

const Cloud = ({
  position = [0, 10, 0],
  scale = 1,
  opacity = 0.8,
  animateIn = false,
  animateAway = false,
  animationPhase = 1,
  id,
  onAnimationComplete
}) => {
  const cloudRef = useRef();
  const [animatedPosition, setAnimatedPosition] = useState(position);
  const [currentOpacity, setCurrentOpacity] = useState(0);
  const [hasAnimatedAway, setHasAnimatedAway] = useState(false);

  useEffect(() => {
    if (!animateIn) return;

    const startX = position[0] > 0 ? position[0] + 80 : position[0] - 80;
    const startPos = [startX, position[1], position[2]];
    setAnimatedPosition(startPos);

    const startTime = Date.now();
    const duration = 1500;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      const newPosition = [
        startPos[0] + (position[0] - startPos[0]) * eased,
        startPos[1] + (position[1] - startPos[1]) * eased,
        startPos[2] + (position[2] - startPos[2]) * eased
      ];

      setAnimatedPosition(newPosition);
      setCurrentOpacity(opacity * eased);

      if (progress < 1) requestAnimationFrame(animate);
    };

    animate();
  }, [animateIn, position, opacity]);

  useEffect(() => {
    if (animateAway && !hasAnimatedAway) {
      setHasAnimatedAway(true);

      let targetPosition;
      if (animationPhase === 1) {
        targetPosition = [
          position[0] + (Math.random() - 0.5) * 80,
          position[1] + (Math.random() - 0.5) * 50,
          position[2] - 80 - Math.random() * 40
        ];
      } else {
        targetPosition = [
          position[0] + (Math.random() - 0.5) * 30,
          position[1] + (Math.random() - 0.5) * 20,
          position[2] - 150 - Math.random() * 50
        ];
      }

      const startTime = Date.now();
      const duration = 1500 + Math.random() * 2000;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        const newPosition = [
          position[0] + (targetPosition[0] - position[0]) * easedProgress,
          position[1] + (targetPosition[1] - position[1]) * easedProgress,
          position[2] + (targetPosition[2] - position[2]) * easedProgress
        ];

        setAnimatedPosition(newPosition);
        setCurrentOpacity(opacity * (1 - easedProgress * 0.9));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else if (onAnimationComplete) {
          onAnimationComplete(id);
        }
      };

      animate();
    }
  }, [animateAway, animationPhase, position, opacity, id, onAnimationComplete, hasAnimatedAway]);

  return (
    <group ref={cloudRef} position={animatedPosition} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.5, 16, 16]} />
        <meshLambertMaterial
          color="white"
          transparent
          opacity={currentOpacity}
          fog={true}
        />
      </mesh>
      <mesh position={[-1.8, 0.5, 0]}>
        <sphereGeometry args={[1.8, 12, 12]} />
        <meshLambertMaterial
          color="#f0f8ff"
          transparent
          opacity={currentOpacity * 0.9}
        />
      </mesh>
      <mesh position={[1.5, -0.3, 0]}>
        <sphereGeometry args={[2.1, 14, 14]} />
        <meshLambertMaterial
          color="#f8f8ff"
          transparent
          opacity={currentOpacity * 0.85}
        />
      </mesh>
      <mesh position={[0, -1.2, 0]}>
        <sphereGeometry args={[1.6, 12, 12]} />
        <meshLambertMaterial
          color="white"
          transparent
          opacity={currentOpacity * 0.95}
        />
      </mesh>
      <mesh position={[-0.8, 1.4, 0]}>
        <sphereGeometry args={[1.2, 10, 10]} />
        <meshLambertMaterial
          color="#f0f0ff"
          transparent
          opacity={currentOpacity * 0.8}
        />
      </mesh>
    </group>
  );
};

const CloudsField = ({
  count = 100,
  animationPhase = 0,
  onAnimationComplete,
  showClouds = false
}) => {
  const [clouds, setClouds] = useState([]);
  const [animatedCount, setAnimatedCount] = useState(0);
  const [remainingClouds, setRemainingClouds] = useState([]);

  useEffect(() => {
    if (!showClouds) {
      setClouds([]);
      setRemainingClouds([]);
      return;
    }
    const initialClouds = [];
    for (let i = 0; i < count; i++) {
      initialClouds.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 100,
          5 + Math.random() * 12,
          -15 - Math.random() * 30
        ],
        scale: 0.7 + Math.random() * 1.2,
        opacity: 0.5 + Math.random() * 0.4,
        animateAway: false,
        animationPhase: 0
      });
    }
    setClouds(initialClouds);
    setRemainingClouds(initialClouds);
  }, [count, showClouds]);

  useEffect(() => {
    if (!showClouds || animationPhase === 0 || remainingClouds.length === 0) return;

    setAnimatedCount(0);

    const cloudsToAnimate = animationPhase === 1
      ? remainingClouds.filter((_, index) => index % 2 === 0)
      : remainingClouds;

    setClouds(prev => prev.map(cloud => ({
      ...cloud,
      animateAway: cloudsToAnimate.some(c => c.id === cloud.id),
      animationPhase
    })));
  }, [animationPhase, remainingClouds, showClouds]);

  const handleCloudAnimationComplete = (cloudId) => {
    setAnimatedCount(prev => {
      const newCount = prev + 1;
      const totalToAnimate = animationPhase === 1
        ? Math.ceil(remainingClouds.length / 2)
        : remainingClouds.length;

      if (newCount >= totalToAnimate && animationPhase > 0) {
        const newRemainingClouds = clouds.filter(
          cloud => !cloud.animateAway
        );
        setRemainingClouds(newRemainingClouds);

        if (onAnimationComplete) {
          setTimeout(() => {
            onAnimationComplete();
          }, 500);
        }
      }
      return newCount;
    });
  };

  if (!showClouds) return null;

  return (
    <group>
      {clouds.map((cloud) => (
        <Cloud
          key={cloud.id}
          position={cloud.position}
          scale={cloud.scale}
          opacity={cloud.opacity}
          animateIn={true}
          animateAway={cloud.animateAway}
          animationPhase={cloud.animationPhase}
          id={cloud.id}
          onAnimationComplete={handleCloudAnimationComplete}
        />
      ))}
    </group>
  );
};

// ---------- LEVER ----------

const ShipHornLever = ({ position, leverMode, toggleLever }) => {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;
    const startY = ref.current.position.y;
    const targetY = leverMode ? position[1] - 1.5 : position[1]; // вниз = тянем палку
    const startTime = Date.now();
    const duration = 250;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      ref.current.position.y = startY + (targetY - startY) * eased;
      if (t < 1) requestAnimationFrame(animate);
    };

    animate();
  }, [leverMode, position[1]]);

  const handleClick = (e) => {
    e.stopPropagation();
    toggleLever();
  };

  return (
    <group onClick={handleClick}>
      <mesh position={[position[0], position[1] + 0.1, position[2]]}>
        <circleGeometry args={[0.35, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      <mesh ref={ref} position={position}>
        <cylinderGeometry args={[0.2, 0.2, 3, 24]} />
        <meshStandardMaterial color="#ffcc33" metalness={0.4} roughness={0.4} />
      </mesh>
    </group>
  );
};


// ---------- REST ----------

const TexturedCube = ({ opacity = 1, cubePlacement = [0, 0.5, 0] }) => {
  const texture = useLoader(THREE.TextureLoader, logo);

  return (
    <mesh position={cubePlacement}>
      <boxGeometry args={[10, 2.85, 0.25]} />
      <meshBasicMaterial
        map={texture}
        transparent={true}
        opacity={opacity}
      />
    </mesh>
  );
};

const Main = ({ cubePlacement }) => {
  return (
    <mesh position={cubePlacement} rotation={[0.4,0,0]}>
      <cylinderGeometry args={[700, 40, 20, 64]}/>
      <meshBasicMaterial
        color='gray'
        transparent={true}
      />
    </mesh>
  );
};

const VideoTexture = ({ url, opacity = 1, position = [0, 0, 0.1], visible = false,rotation=[0.2,0,0] }) => {
  const [videoTexture, setVideoTexture] = useState();

  useEffect(() => {
    const vid = document.createElement('video');
    vid.src = url;
    vid.crossOrigin = 'anonymous';
    vid.loop = true;
    vid.muted = true;
    vid.preload = 'auto';
    vid.playsInline = true;
    vid.style.position = 'absolute';
    vid.style.top = '-100%';
    vid.style.left = '-100%';
    vid.style.width = '1px';
    vid.style.height = '1px';
    document.body.appendChild(vid);

    const texture = new THREE.VideoTexture(vid);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    setVideoTexture(texture);

    return () => {
      document.body.removeChild(vid);
      if (videoTexture) {
        videoTexture.dispose();
      }
    };
  }, [url]);

  useEffect(() => {
    if (videoTexture) {
      const videoElement = videoTexture.image;
      if (visible && videoElement) {
        videoElement.currentTime = 0;
        videoElement.play().catch(() => {});
      } else if (videoElement) {
        videoElement.pause();
      }
    }
  }, [visible, videoTexture]);

  if (!videoTexture) return null;

  return (
    <mesh position={position} visible={visible}>
      <planeGeometry args={[6, 3.5]} />
      <meshBasicMaterial
        map={videoTexture}
        rotation={rotation}
        transparent={true}
        opacity={opacity}
      />
    </mesh>
  );
};

const Table = ({
  opacity = 1,
  cubePlacement,
  cubeRot,
  index = 4,
  showGraphVideo = false,
  urlVideo,
  onClick
}) => {
  if (index===1){
    return (
      <group position={cubePlacement} rotation={cubeRot}>
        <mesh>
          <boxGeometry args={[10, 4, 0.25]}/>
          <meshBasicMaterial
            color='white'
            transparent={true}
            opacity={opacity}
          />
          <Edges color='#217EFA' lineWidth={5}/>
        </mesh>
        <Text
          position={[0, 0, 1]}
          fontSize={0.6}
          color="#4A6FFE"
          anchorX="center"
          anchorY="middle"
          maxWidth={5}
          textAlign='center'
          font="/seenonim-v1.ttf"
          onClick={onClick}
        >
          НАЧАТЬ АНАЛИЗ
        </Text>
      </group>
    );
  } else if (index === 2) {
    return (
      <group position={cubePlacement} rotation={cubeRot}>
        <mesh>
          <boxGeometry args={[10, 4, 0.25]}/>
          <meshBasicMaterial
            color='white'
            transparent={true}
            opacity={opacity}
          />
          <Edges color='#217EFA' lineWidth={5}/>
        </mesh>
        <Text
          position={[0, 0, 1]}
          fontSize={0.6}
          color="#4A6FFE"
          anchorX="center"
          anchorY="middle"
          font="/seenonim-v1.ttf"
          onClick={onClick}
        >
          УЛУЧШИТЬ
        </Text>
      </group>
    );
  } else if (index === 3) {
    return (
      <group position={cubePlacement} rotation={cubeRot}>
        <mesh>
          <boxGeometry args={[10, 4, 0.25]}/>
          <meshBasicMaterial
            color='white'
            transparent={true}
            opacity={opacity}
          />
          <Edges color='#217EFA' lineWidth={5}/>
        </mesh>
        <Text
          position={[0, 0, 1]}
          fontSize={0.6}
          color="#4A6FFE"
          anchorX="center"
          anchorY="middle"
          textAlign='center'
          maxWidth={5}
          font="/seenonim-v1.ttf"
          onClick={onClick}
        >
          ПОСТРОИТЬ ГРАФИК
        </Text>
        <VideoTexture
          url={urlVideo}
          opacity={1}
          position={[0, 0.6, 1.2]}
          visible={showGraphVideo}
        />
      </group>
    );
  }
  return null;
};

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const lerp = (start, end, progress) => start + (end - start) * progress;
const lerpArray = (startArr, endArr, progress) =>
  startArr.map((start, index) => lerp(start, endArr[index], progress));

const videos = [graphVideo1, graphVideo2, graphVideo3,mainVideo];

// ---------- SCENE ----------

const Scene = ({
  tablePlacement1, setTablePlacement1,
  tablePlacement2, setTablePlacement2,
  tablePlacement3, setTablePlacement3,
  tableRotation1, setTableRotation1,
  tableRotation2, setTableRotation2,
  tableRotation3, setTableRotation3,
  cubeOpacity, cubePlacement, mainPlacement,
  currentTable,
  isAnimating,
  prevTable, nextTable,urlVideo,seturlVideo,
  targetPlacement1, targetPlacement2, targetPlacement3,
  targetRotation1, targetRotation2, targetRotation3,
  showGraphVideo, setShowGraphVideo,
  cloudsAnimationPhase, setCloudsAnimationPhase,
  showClouds, setShowClouds,
  startFromButton,
  viewport,
  leverMode, setLeverMode,
  leftVideoPlaying, setLeftVideoPlaying
}) => {
  const { gl } = useThree();
  const dragStartX = useRef(0);
  const isDragging = useRef(false);
  const [clickCount, setClickCount] = useState(0);

  const scaleFactor = Math.max(0.7, Math.min(1, viewport.width / 1440));
  const tableXFactor = viewport.width < 768 ? 0.7 : 1;
  const leverPos = viewport.width < 768 ? [1.4, 4.1, 2] : [4, 4.1, 2];

  const handlePointerDown = useCallback((event) => {
    const rect = gl.domElement.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    if (!leverMode) {
      if (x > 0.20 && x<0.8 && y > 0.27 && currentTable === 2) {
        setShowGraphVideo(true);
        event.stopPropagation();
        event.preventDefault();
        return;
      }

      if (x > 0.20 && x<0.8 && y > 0.27 && currentTable === 1) {
        setShowClouds(true);
        event.stopPropagation();
        event.preventDefault();
        return;
      }

      if (x > 0.20 && x<0.8 && y > 0.27 && currentTable === 0) {
        if (urlVideo === 0) {
          setCloudsAnimationPhase(1);
          setClickCount(1);
          seturlVideo(1);
        } else if (urlVideo === 1) {
          setCloudsAnimationPhase(2);
          setClickCount(0);
          seturlVideo(2);
        }
        event.stopPropagation();
        event.preventDefault();
        return;
      }
    }

    dragStartX.current = event.clientX;
    isDragging.current = true;
  }, [gl.domElement, currentTable, setShowGraphVideo, urlVideo, seturlVideo, setCloudsAnimationPhase, setShowClouds, leverMode]);

  const handleCloudsAnimationComplete = useCallback(() => {
    setCloudsAnimationPhase(0);
  }, [setCloudsAnimationPhase]);

  const handlePointerMove = useCallback((event) => {
    if (!isDragging.current || !isAnimating) return;

    const deltaX = event.clientX - dragStartX.current;
    const threshold = 100;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && currentTable > 0) {
        prevTable();
      } else if (deltaX < 0 && currentTable < 2) {
        nextTable();
      }
      isDragging.current = false;
      dragStartX.current = event.clientX;
    }
  }, [currentTable, isAnimating, prevTable, nextTable]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    gl.domElement.addEventListener('pointerdown', handlePointerDown);
    gl.domElement.addEventListener('pointermove', handlePointerMove);
    gl.domElement.addEventListener('pointerup', handlePointerUp);
    gl.domElement.addEventListener('pointerleave', handlePointerUp);

    return () => {
      gl.domElement.removeEventListener('pointerdown', handlePointerDown);
      gl.domElement.removeEventListener('pointermove', handlePointerMove);
      gl.domElement.removeEventListener('pointerup', handlePointerUp);
      gl.domElement.removeEventListener('pointerleave', handlePointerUp);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp, gl.domElement]);

  const handleCenterInfoClick = () => {
    console.log('Информация о проекте');
  };

  const handleRightTeamClick = () => {
    console.log('Информация о команде');
  };

  const handleLeftVideoClick = () => {
    setLeftVideoPlaying(true);
  };

  const toggleLever = () => {
    if (leverMode) {
      setLeftVideoPlaying(false);
      setShowGraphVideo(false);
    }
    setLeverMode(!leverMode);
  };

  return (
    <>
      <directionalLight position={[0, 0, -5]} intensity={1}/>
      <ambientLight intensity={0.3}/>

      <group scale={scaleFactor}>
        <Suspense fallback={null}>
          <TexturedCube opacity={cubeOpacity} cubePlacement={cubePlacement}/>
        </Suspense>

        <ShipHornLever
          position={leverPos}
          rotation={[0, 0, 0]}
          leverMode={leverMode}
          toggleLever={toggleLever}
        />

        <CloudsField
          count={100}
          animationPhase={cloudsAnimationPhase}
          onAnimationComplete={handleCloudsAnimationComplete}
          showClouds={showClouds}
        />

        <Main cubePlacement={mainPlacement} />

        {!leverMode && (
          <>
            <Table
              cubePlacement={[tablePlacement1[0] * tableXFactor, tablePlacement1[1], tablePlacement1[2]]}
              cubeRot={tableRotation1}
              opacity={1}
              index={1}
              onClick={startFromButton}
            />
            <Table
              cubePlacement={[tablePlacement2[0] * tableXFactor, tablePlacement2[1], tablePlacement2[2]]}
              cubeRot={tableRotation2}
              opacity={1}
              index={2}
              onClick={() => {
                if (clickCount === 0) {
                  setCloudsAnimationPhase(1);
                  setClickCount(1);
                } else if (clickCount === 1) {
                  setCloudsAnimationPhase(2);
                  setClickCount(0);
                }
              }}
            />
            <Table
              cubePlacement={[tablePlacement3[0] * tableXFactor, tablePlacement3[1], tablePlacement3[2]]}
              cubeRot={tableRotation3}
              opacity={1}
              index={3}
              showGraphVideo={showGraphVideo}
              urlVideo={videos[urlVideo]}
              onClick={() => setShowGraphVideo(true)}
            />
          </>
        )}

        {leverMode && (
          <>
            {/* Левый стол — видео */}
            <group
              position={[tablePlacement1[0] * tableXFactor, tablePlacement1[1], tablePlacement1[2]]}
              rotation={tableRotation1}
              onClick={handleLeftVideoClick}
            >
              <mesh>
                <boxGeometry args={[10, 4, 0.25]} />
                <meshBasicMaterial color='white' />
                <Edges color='#217EFA' lineWidth={5}/>
              </mesh>
              <Text
                position={[0, 1.3, 1]}
                fontSize={0.5}
                color="#4A6FFE"
                anchorX="center"
                anchorY="middle"
                font="/seenonim-v1.ttf"
              >
                ВИДЕО О ПРОЕКТЕ
              </Text>
              <VideoTexture
                url={videos[3]}
                opacity={1}
                position={[0, 0, 2.1]}
                rotation = {[0,0,0]}
                visible={leftVideoPlaying}
              />
            </group>

            {/* Центральный стол — инфо о проекте */}
            <group
              position={[tablePlacement2[0] * tableXFactor, tablePlacement2[1], tablePlacement2[2]]}
              rotation={tableRotation2}
              onClick={handleCenterInfoClick}
            >
              <mesh>
                <boxGeometry args={[10, 4, 0.25]} />
                <meshBasicMaterial color='white' />
                <Edges color='#217EFA' lineWidth={5}/>
              </mesh>
              <Text
                position={[0, 0, 1]}
                fontSize={0.6}
                color="#4A6FFE"
                anchorX="center"
                anchorY="middle"
                maxWidth={7}
                textAlign='center'
                font="/seenonim-v1.ttf"
              >
                ИНФОРМАЦИЯ О ПРОЕКТЕ...
              </Text>
            </group>

            {/* Правый стол — команда */}
            <group
              position={[tablePlacement3[0] * tableXFactor, tablePlacement3[1], tablePlacement3[2]]}
              rotation={tableRotation3}
              onClick={handleRightTeamClick}
            >
              <mesh>
                <boxGeometry args={[10, 4, 0.25]} />
                <meshBasicMaterial color='white' />
                <Edges color='#217EFA' lineWidth={5}/>
              </mesh>
              <Text
                position={[0, 0, 1]}
                fontSize={0.6}
                color="#4A6FFE"
                anchorX="center"
                anchorY="middle"
                maxWidth={7}
                textAlign='center'
                font="/seenonim-v1.ttf"
              >
                КОМАНДА...
              </Text>
            </group>
          </>
        )}
      </group>

      <OrbitControls
        minDistance={5}
        maxDistance={5}
        minPolarAngle={Math.PI / 2}
        minAzimuthAngle={0}
        maxAzimuthAngle={0}
        maxPolarAngle={Math.PI / 2}
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
      />
    </>
  );
};

// ---------- APP ----------

const App = () => {
  const [cubeOpacity, setCubeOpacity] = useState(1);
  const [cubePlacement, setCubePlacement] = useState([0, 0.5, 0]);
  const [buttonOpacity, setButtonOpacity] = useState(1);
  const [buttonROpacity, setButtonROpacity] = useState(0);
  const [buttonLOpacity, setButtonLOpacity] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showGraphVideo, setShowGraphVideo] = useState(false);
  const [showClouds, setShowClouds] = useState(false);

  const [tablePlacement1, setTablePlacement1] = useState([0, -10, 0]);
  const [tablePlacement2, setTablePlacement2] = useState([-12, -10, 0]);
  const [tablePlacement3, setTablePlacement3] = useState([12, -10, 0]);
  const [mainPlacement, setmainPlacement] = useState([0, -1000, 0]);

  const [tableRotation1, setTableRotation1] = useState([-0.2, 0, 0]);
  const [tableRotation2, setTableRotation2] = useState([-0.2, 0, 0.5]);
  const [tableRotation3, setTableRotation3] = useState([-0.2, 0, -0.5]);

  const targetPlacement1 = [0, -1.5, 0];
  const targetPlacement2 = [-12, -3.5, 0];
  const targetPlacement3 = [12, -3.5, 0];

  const [currentTable, setCurrentTable] = useState(1);
  const [urlVideo, seturlVideo] = useState(0);

  const targetRotation1 = [-0.1, 0, 0];
  const targetRotation2 = [-0.1, 0, 0.2];
  const targetRotation3 = [-0.1, 0, -0.2];

  const [cloudsAnimationPhase, setCloudsAnimationPhase] = useState(0);

  const [leverMode, setLeverMode] = useState(false);
  const [leftVideoPlaying, setLeftVideoPlaying] = useState(false);

  const animationRef = useRef(null);

  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const prevTable = useCallback(() => {
    const newTable = Math.max(0, currentTable - 1);
    if(currentTable!==0){
      setCurrentTable(newTable);

      const startTime = Date.now();
      const duration = 500;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);

        if (newTable === 0) {
          const newPlacement1 = lerpArray(targetPlacement1, targetPlacement3, easedProgress);
          const newPlacement2 = lerpArray(targetPlacement2, targetPlacement1, easedProgress);
          const newPlacement3 = lerpArray(targetPlacement3, [100,-10,0], easedProgress);

          setTablePlacement1(newPlacement1);
          setTablePlacement2(newPlacement2);
          setTablePlacement3(newPlacement3);

          const newRotation1 = lerpArray(targetRotation1, targetRotation3, easedProgress);
          const newRotation2 = lerpArray(targetRotation2, targetRotation1, easedProgress);
          const newRotation3 = lerpArray(targetRotation3, targetRotation3, easedProgress);

          setTableRotation1(newRotation1);
          setTableRotation2(newRotation2);
          setTableRotation3(newRotation3);
        } else if (newTable === 1) {
          const newPlacement1 = lerpArray(targetPlacement2, targetPlacement1, easedProgress);
          const newPlacement2 = lerpArray([-100,-10,0], targetPlacement2, easedProgress);
          const newPlacement3 = lerpArray(targetPlacement1, targetPlacement3, easedProgress);

          const newRotation1 = lerpArray(targetRotation2, targetRotation1, easedProgress);
          const newRotation2 = lerpArray(targetRotation2, targetRotation2, easedProgress);
          const newRotation3 = lerpArray(targetRotation1, targetRotation3, easedProgress);

          setTableRotation1(newRotation1);
          setTableRotation2(newRotation2);
          setTableRotation3(newRotation3);
          setTablePlacement1(newPlacement1);
          setTablePlacement2(newPlacement2);
          setTablePlacement3(newPlacement3);
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, [currentTable]);

  const nextTable = useCallback(() => {
    const newTable = Math.min(2, currentTable + 1);
    if (currentTable!==2){
      setCurrentTable(newTable);

      const startTime = Date.now();
      const duration = 500;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);

        if (newTable === 2) {
          const newPlacement1 = lerpArray(targetPlacement1, targetPlacement2, easedProgress);
          const newPlacement2 = lerpArray(targetPlacement2, [-100,-10,0], easedProgress);
          const newPlacement3 = lerpArray(targetPlacement3, targetPlacement1, easedProgress);

          setTablePlacement1(newPlacement1);
          setTablePlacement2(newPlacement2);
          setTablePlacement3(newPlacement3);

          const newRotation1 = lerpArray(targetRotation1, targetRotation2, easedProgress);
          const newRotation2 = lerpArray(targetRotation2, targetRotation2, easedProgress);
          const newRotation3 = lerpArray(targetRotation3, targetRotation1, easedProgress);

          setTableRotation1(newRotation1);
          setTableRotation2(newRotation2);
          setTableRotation3(newRotation3);
        } else if (newTable === 1) {
          const newPlacement1 = lerpArray(targetPlacement3, targetPlacement1, easedProgress);
          const newPlacement2 = lerpArray(targetPlacement1, targetPlacement2, easedProgress);
          const newPlacement3 = lerpArray([100,-10,0], targetPlacement3, easedProgress);

          setTablePlacement1(newPlacement1);
          setTablePlacement2(newPlacement2);
          setTablePlacement3(newPlacement3);

          const newRotation1 = lerpArray(targetRotation3, targetRotation1, easedProgress);
          const newRotation2 = lerpArray(targetRotation1, targetRotation2, easedProgress);
          const newRotation3 = lerpArray(targetRotation3, targetRotation3, easedProgress);

          setTableRotation1(newRotation1);
          setTableRotation2(newRotation2);
          setTableRotation3(newRotation3);
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, [currentTable]);

  const startFromButton = () => {
    if (!isAnimating) {
      setIsAnimating(true);

      const startTime = Date.now();
      const duration = 500;
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easedProgress = easeOutCubic(progress);

        setCubeOpacity(1 - easedProgress);
        setButtonOpacity(1 - easedProgress);
        setButtonROpacity(easedProgress);
        setButtonLOpacity(easedProgress);

        const newZ = lerp(0, 5, easedProgress);
        setCubePlacement([0, 0.5, newZ]);
        setmainPlacement(lerpArray(mainPlacement, [0, -350, -100], easedProgress));
        const newPlacement2 = lerpArray([-12, -10, 0], targetPlacement2, easedProgress);
        const newPlacement1 = lerpArray([0, -10, 0], targetPlacement1, easedProgress);
        const newPlacement3 = lerpArray([12, -10, 0], targetPlacement3, easedProgress);

        setTablePlacement2(newPlacement2);
        setTablePlacement1(newPlacement1);
        setTablePlacement3(newPlacement3);

        const newRotation1 = lerpArray([-0.2, 0, 0], targetRotation1, easedProgress);
        const newRotation2 = lerpArray([-0.2, 0, 0.5], targetRotation2, easedProgress);
        const newRotation3 = lerpArray([-0.2, 0, -0.5], targetRotation3, easedProgress);

        setTableRotation1(newRotation1);
        setTableRotation2(newRotation2);
        setTableRotation3(newRotation3);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setButtonOpacity(0);
        }
      };

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      animationRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const buttonWidth = viewport.width < 480 ? '220px' : '300px';
  const buttonFont = viewport.width < 480 ? '24px' : '36px';
  const buttonLeft = viewport.width < 480 ? 'calc(50% - 110px)' : '35%';

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, height: '100vh', width: "100vw",
      backgroundColor: '#F7F7F7',
      cursor: isAnimating ? 'default' : 'grab',
      userSelect: 'none'
    }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0
        }}
      >
        <source src="/SeaGas2.mp4" type="video/mp4"/>
        Ваш браузер не поддерживает видео.
      </video>

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        zIndex: 1
      }} />

      <Canvas style={{
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2
      }}>
        <Scene
          tablePlacement1={tablePlacement1} setTablePlacement1={setTablePlacement1}
          tablePlacement2={tablePlacement2} setTablePlacement2={setTablePlacement2}
          tablePlacement3={tablePlacement3} setTablePlacement3={setTablePlacement3}
          tableRotation1={tableRotation1} setTableRotation1={setTableRotation1}
          tableRotation2={tableRotation2} setTableRotation2={setTableRotation2}
          tableRotation3={tableRotation3} setTableRotation3={setTableRotation3}
          cubeOpacity={cubeOpacity} cubePlacement={cubePlacement}
          mainPlacement={mainPlacement}
          currentTable={currentTable} setCurrentTable={setCurrentTable}
          isAnimating={isAnimating}
          urlVideo={urlVideo}
          seturlVideo={seturlVideo}
          prevTable={prevTable}
          nextTable={nextTable}
          targetPlacement1={targetPlacement1}
          targetPlacement2={targetPlacement2}
          targetPlacement3={targetPlacement3}
          targetRotation1={targetRotation1}
          targetRotation2={targetRotation2}
          targetRotation3={targetRotation3}
          showGraphVideo={showGraphVideo}
          setShowGraphVideo={setShowGraphVideo}
          cloudsAnimationPhase={cloudsAnimationPhase}
          setCloudsAnimationPhase={setCloudsAnimationPhase}
          showClouds={showClouds}
          setShowClouds={setShowClouds}
          startFromButton={startFromButton}
          viewport={viewport}
          leverMode={leverMode}
          setLeverMode={setLeverMode}
          leftVideoPlaying={leftVideoPlaying}
          setLeftVideoPlaying={setLeftVideoPlaying}
        />
      </Canvas>

      <button
        style={{
          fontFamily: 'Seenonim, sans-serif',
          fontSize: buttonFont,
          color: 'white',
          position: 'absolute',
          bottom: '15%',
          left: buttonLeft,
          width: buttonWidth,
          height: '70px',
          padding: 0,
          background: '#217EFA',
          border: 'none',
          zIndex: 3,
          opacity: buttonOpacity,
          transition: 'opacity 0.5s ease-out',
          cursor: 'pointer'
        }}
        onClick={startFromButton}
        disabled={isAnimating}
      >
        Начать
      </button>
    </div>
  );
};

export default App;
