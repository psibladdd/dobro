import { Canvas } from "@react-three/fiber";
import { Edges, OrbitControls } from '@react-three/drei';
import { useState } from 'react';
import './App.css';

const Cube = ({rot, size, color,pos}) => {
    return (
        <>
            <mesh rotation={rot} position={pos}>
                <boxGeometry args={size} />
                <meshBasicMaterial color={color} />
                <Edges color="black" />
            </mesh>
        </>
    );
}

const Road = ({ rot, size, pos }) => {
  return (
    <group rotation={rot} position={pos}>
      <mesh>
        <boxGeometry args={size} />
        <meshBasicMaterial color="#333333" />
        <Edges color="black" />
      </mesh>
        <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[size[0], size[1] * 1.1, size[2] * 0.1]}/>
            <meshBasicMaterial color="yellow"/>
        </mesh>
    </group>
  );
};

const StreetLamp = ({position, isNight}) => {
    return (
          <group position={position}>
              <mesh position={[0,0.2,0]}>
                  <cylinderGeometry args={[0.02,0.02,0.3,16]}/>
                  <meshBasicMaterial color="black"/>
                  </mesh>

                  <mesh position={[0,0.35,0]}>
                  <sphereGeometry args= {[0.05,16,16]}/>
                  <meshBasicMaterial color={isNight ? "yellow" : "white"}/>
                  </mesh>
          </group>
     );
}

const App = () => {
     const [isNight, setIsNight] = useState(false);

     const toggleNight = () => {
          setIsNight(!isNight)
     }

    return (//3
        <div style={{ position: "fixed", top: 0, left:0, height: '100vh', width: "100vw"}}>
            <button
                   onClick={toggleNight}
                   style={{
                       position: "absolute",
                       color: "gray",
                       width: "98px",
                       height: "45px",
                       zIndex:100
                    }}
               >
                  {isNight ? " Сделать день" : "Сделать ночь"}
             </button>
            <Canvas style={{ background: isNight ? "black" : 'skyblue', width:"100%",height: "100%" }}>
                <StreetLamp position={[0,0,0]} isNight={isNight}/>
                <StreetLamp position={[1,0,1]} isNight={isNight}/>
                <StreetLamp position={[1,0,-1]} isNight={isNight}/>
                <Road rot = {[0, Math.PI/4, 0]} pos ={[0.42, 0.1, 0.42]} size={[3, 0.1, 0.4]}/>
                <Cube rot={[0, Math.PI/4, 0]} size={[3, 0.25, 3]} color={"green"} pos={[0,0,0]}/>
                <Cube rot={[0, Math.PI/4, 0]} size={[3, -10, 3]} color={"darkgray"} pos={[0,-5.125,0]}/>

                <Cube rot={[0, Math.PI/4, 0]} size={[1.5, 1.5, 0.4]} color={"blue"} pos={[0,0.6,0]}/>
                <Cube rot={[0, Math.PI/4, 0]} size={[1, 1.3, 0.3]} color={"red"} pos={[0.7,0.5,0.9]}/>
                <Cube rot={[0, Math.PI/4, 0]} size={[1, 2, 0.7]} color={"purple"} pos={[-0.5,1,0.5]}/>
                <OrbitControls
                      minDistance={5}
                      maxDistance={50}
                      minPolarAngle={Math.PI/4}
                      maxPolarAngle={Math.PI/4+Math.PI/8}
                />
           </Canvas>


        </div>
    );
}

export default App;