import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

// This internally runs on expo-gl
import { Canvas, useFrame } from "@react-three/fiber/native";

// one may easily provide a GLView directly
// import { GLView } from 'expo-gl'

// via r3f's readme
function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef();
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += 0.01));
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Canvas style={{ width: 300, height: 300 }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} />
        </Canvas>
        {/* <GLView style={{ width: 300, height: 300 }} onContextCreate={onContextCreate}/> */}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

// via https://github.com/expo/expo/blob/master/docs/pages/versions/unversioned/sdk/gl-view.md
function onContextCreate(gl) {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(0, 1, 1, 1);

  // Create vertex shader (shape & position)
  const vert = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(
    vert,
    `
    void main(void) {
      gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
      gl_PointSize = 150.0;
    }
  `
  );
  gl.compileShader(vert);

  // Create fragment shader (color)
  const frag = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(
    frag,
    `
    void main(void) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
  `
  );
  gl.compileShader(frag);

  // Link together into a program
  const program = gl.createProgram();
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  gl.useProgram(program);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 1);

  gl.flush();
  gl.endFrameEXP();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
