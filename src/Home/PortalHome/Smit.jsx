import React from "react";
import useWindowSize from "@rooks/use-window-size";
import ParticleImage, { forces, Vector } from "react-particle-image";
import img from './logo/images_2.png'; // Ensure the image path is correct

const round = (n, step = 20) => Math.ceil(n / step) * step;
const STEP = 30;

const particleOptions = {
  filter: ({ x, y, image }) => {
    const pixel = image.get(x, y);
    const magnitude = (pixel.r + pixel.g + pixel.b) / 3;
    return magnitude < 200;
  },
  color: ({ x, y, image }) => {
    const pixel = image.get(x, y);
    return `rgba(
      ${round(pixel.r, STEP)}, 
      ${round(pixel.g, STEP)}, 
      ${round(pixel.b, STEP)}, 
      ${round(pixel.a, STEP) / 255}
    )`;
  },
  radius: ({ x, y, image }) => {
    const pixel = image.get(x, y);
    const magnitude = (pixel.r + pixel.g + pixel.b) / 3;
    return 3 - (magnitude / 255) * 1.5;
  },
  mass: () => 40,
  friction: () => 0.15,
  initialPosition: ({ canvasDimensions }) => {
    return new Vector(canvasDimensions.width / 2, canvasDimensions.height / 2);
  }
};

const motionForce = (x, y) => {
  return forces.disturbance(x, y, 7);
};

const App = () => {
  const { innerWidth, innerHeight } = useWindowSize();

  return (
    <div className="container">
      <ParticleImage
        src={img}
        width={Math.min(innerWidth, 380)}  // Set a max width for better responsiveness
        height={Math.min(innerHeight, 400)}  // Set a max height for better responsiveness
        scale={1.90}
        entropy={1}
        maxParticles={5000}
        particleOptions={particleOptions}
        mouseMoveForce={motionForce}
        touchMoveForce={motionForce}
        backgroundColor="transparent"  // Set background color to transparent
        style={{ borderRadius: '15px',
        //  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            marginBottom : 100
         }}
      />
    </div>
  );
};

export default App;
