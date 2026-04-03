# Ant Simulation

A WebGPU compute shader to simulate "ants" which have a position, direction, and a pheromone color. Each ant places a colored pixel at their position, then senses for colored pixels in front of it and steers towards them. Another compute shader pass blurs the pheromone image each frame.

See it live: https://carters.dev/pages/pheromone-trails/
(Use Chrome, Edge for best results, see [browser compatibility table](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API#browser_compatibility))

Use the config the dropdown to save a configuration to your browsers cookies.

# How to run it
The root directory contains a Rocket Rust web server which can be run with `cargo run`. Alternatively, serve the ./client/public directory with any web server of your choice after generating the code using:
```
cd ./client
npx webpack
```

Use `npm run dev` in the client directory for web pack to file watch continuously. 


