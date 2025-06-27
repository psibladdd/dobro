import { Canvas } from "@react-three/fiber";
import { Edges, OrbitControls } from '@react-three/drei';
import { useState } from 'react';
import './App.css';

const Cube = ({rot, size, color,pos,opacity = 1}) => {
    return (
        <>
            <mesh rotation={rot} position={pos}>
                <boxGeometry args={size} />
                <meshBasicMaterial color={color}
                transparent={true}
                opacity={opacity}
                />
                <Edges color="black" />
            </mesh>
        </>
    );
}

const Road = ({rot,size,pos}) => {
  return (
    <group rotation={rot} position={pos}>
      <mesh>
        <boxGeometry args={size}/>
        <meshBasicMaterial color="#333333"/>
        <Edges color="black"/>
      </mesh>
      <mesh position={[0,0.02,0]}>
        <boxGeometry args={[size[0],size[1]*1.1,size[2]*0.1]}/>
        <meshBasicMaterial color="yellow"/>
      </mesh>

    </group>
  );
}
const Streetlamp = ({position,isNight}) => {
   return(
      <group position={position}>
         <mesh position={[0,0.2,0]}>
            <cylinderGeometry args={[0.02,0.02,1.1,16]}/>
            <meshBasicMaterial color="black"/>
          </mesh>
          <mesh position={[0,0.70,0]}>
            <sphereGeometry args={[0.1,16,16]}/>
              <meshBasicMaterial color={isNight ? "yellow" : "white"}/>
          </mesh>
      </group>


   );
}
const Sphere = ({pos,args,isNight,}) => {
  return(
    <mesh position={pos}>
      <sphereGeometry args={args}/>
      <meshBasicMaterial color={isNight ? "yellow" : "white"}/>
    </mesh>
  );
}




const Cylinder = ({pos,args,color}) => {
  return(
    <mesh position={pos}>
      <cylinderGeometry args={args}/>
      <meshBasicMaterial color={color}/>
    </mesh>
  );

}


const App = () => {
  const [isNight, setIsNight] = useState(false)

  const toggleNight = () => {
    setIsNight(!isNight)
  }
  return (//3
    <div style={{position: 'fixed', top: 0, left: 0, height: '100vh', width: '100vw'}}>
      <button
        onClick={toggleNight}
        style={{
          position: 'absolute',
          color: 'gray',
          width: '90px',
          height: '45px',
          zIndex: 100
        }}
      >

        {isNight ? 'день' : 'ночь'}
      </button>
      <Canvas style={{background: isNight ? "black" : 'skyblue', width: '100%', height: '100%'}}>
        <Streetlamp position={[0,0,1.25]} isNight={isNight}/>
        <Cube rot={[0, Math.PI / 4, 0]} size={[5.5, 0.25,9]} color={"green"} pos={[-2.87, 0, -1.13]} />
        <Cube rot={[0, Math.PI / 4, 0]} size={[0.5, 2,0.5]} color={"purple"} pos={[1.6, 1, 0]}/>
        <Cube rot={[0, Math.PI / 4, 0]} size={[0.8, 1.1,1]} color={"red"} pos={[-0.9, 0.5, 0.6]}/>
        <Road rot={[0,Math.PI/4,0]} pos = {[0.42,0.1,0.42]} size={[3,0.1,0.4]}/>
        <Road rot={[0,-Math.PI/4,0]} pos = {[0.42,0.1,-1.43]} size={[3,0.1,0.4]}/>
        <Cube rot={[0, Math.PI / 4, 0]} size={[0.75, 2,0.75]} color={"#27677a"} opacity={0.81} pos={[0.4, 1.1, -0.50]}/>
        <Cube rot={[0, Math.PI / 4, 0]} size={[0.74, 0.1,0.74]} color={"grey"} pos={[0.4, 0.1, -0.50]}/>
        <Cube rot={[0, Math.PI / 4, 0]} size={[0.74, 0.1,0.74]} color={"grey"} pos={[0.4, 0.4, -0.50]}/>
        <Cube rot={[0, Math.PI / 4, 0]} size={[0.74, 0.1,0.74]} color={"grey"} pos={[0.4, 0.8, -0.50]}/>
        <Cube rot={[0, Math.PI / 4, 0]} size={[0.94, 0.1,0.94]} color={"white"} pos={[0.4, 1.2, -0.50]}/>
        <Cube rot={[0, Math.PI / 4, 0]} size={[0.94, 0.1,0.94]} color={"white"} pos={[0.4, 1.6, -0.50]}/>
        <Cube rot={[0, Math.PI / 4, 0]} size={[0.94, 0.1,0.94]} color={"white"} pos={[0.4, 2.1, -0.50]}/>
        <Cylinder pos={[0.4,2.3,0]} args={[0.03,0.03,0.4,16]} color={"black"}/>
        <Sphere pos={[0.4,2.5,0]} args={[0.1,16,16]} isNight={isNight}/>
        <Cube rot={[0, Math.PI / 4, 0]} size={[0.8, 0.1,0.8]} color={"black"} pos={[-0.2, 0.1, -1]} />
        <Cube rot={[0, Math.PI / 4, 0]} size={[5.45, 0.01,5]} color={"grey"} pos={[-4.25, 0.125, -2.45]} />
         <Cube rot={[0, Math.PI / 4, 0]} size={[1.8, 1,1]} color={"#27677a"} opacity={0.81} pos={[-1.7, 0.6, -2.5]}/>
        <Road rot={[0,Math.PI/4,0]} pos = {[-3,0.1,-2.99]} size={[3,0.1,0.4]}/>
        <Road rot={[0,Math.PI/4,0]} pos = {[-3.25,0.1,-3.24]} size={[3,0.1,0.4]}/>
        <Road rot={[0,Math.PI/4,0]} pos = {[-5,0.1,-1.49]} size={[3,0.1,0.4]}/>
        <Road rot={[0,Math.PI/4,0]} pos = {[-4.745,0.1,-1.235]} size={[3,0.1,0.4]}/>
        <Cube rot={[0, Math.PI / 4, 0]} size={[1, 2,1]} color={"black"}  pos={[-6.5, 0.6, -2.3]}/>
        <Cube rot={[0, Math.PI / 4, 0]} size={[1.5, 1,1.5]} color={"#27677a"} opacity={0.81} pos={[-6.5, 2.1, -2.3]}/>
         <Road rot={[0,Math.PI/4,0]} pos = {[-1.33,0.1,2.17]} size={[3,0.1,0.4]}/>
         <Cube rot={[0, Math.PI / 4, 0]} size={[0.75, 2,0.75]} color={"#ae0fbd"} opacity={0.81} pos={[-2, 1.1, 1.9]}/>
        <Cube rot={[0, Math.PI / 4, 0]} size={[0.74, 0.1,0.74]} color={"grey"} pos={[-2, 0.1, 1.9]}/>
        <Cube rot={[0, Math.PI / 4, 0]} size={[0.74, 0.1,0.74]} color={"grey"} pos={[-2, 0.4, 1.9]}/>
        <Cube rot={[0, Math.PI / 4, 0]} size={[0.94, 0.1,0.94]} color={"white"} pos={[-2, 0.8, 1.9]}/>
        <Cube rot={[0, Math.PI / 4, 0]} size={[0.74, 0.1,0.74]} color={"white"} pos={[-2, 1.2, 1.9]}/>
        <Cube rot={[0, Math.PI / 4, 0]} size={[0.94, 0.1,0.94]} color={"white"} pos={[-2, 1.6, 1.9]}/>
        <Cube rot={[0, Math.PI / 4, 0]} size={[0.94, 0.1,0.94]} color={"white"} pos={[-2, 2.1, 1.9]}/>
        <Streetlamp position={[-1.25,0,2.5]} isNight={isNight}/>
        <OrbitControls
          minDistance={5}
          maxDistance={50}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 4 + Math.PI / 8}
       />
      </Canvas>

    </div>


  );
}
export default App;
