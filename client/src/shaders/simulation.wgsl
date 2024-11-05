// Hash function from H. Schechter & R. Bridson, goo.gl/RXiKaH
fn Hash(p: u32) -> u32
{
    var s = p; 
    s ^= 2747636419u;
    s *= 2654435769u;
    s ^= s >> 16;
    s *= 2654435769u;
    s ^= s >> 16;
    s *= 2654435769u;
    return s;
}

fn Random(seed: u32) -> f32
{
    return f32(Hash(seed)) / 4294967295.0; // 2^32-1
}

struct Uniforms {
    width: u32,
    height: u32,
    agentCount: u32,
    time: u32,
    sampleDistance: u32,
    wrap: u32,
    turnJitter: f32,
    steerFactor: f32,
    acceleration: f32,
    cosSampleAngle: f32,
    sinSampleAngle: f32,
    speed: f32,
}

struct Ant {
    position: vec2f,
    direction: vec2f,
    pheromoneChannel: u32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@group(0) @binding(1) var<storage, read_write> agents: array<vec4f>;
@group(0) @binding(2) var pheromonesIn: texture_storage_2d<rgba8unorm, read>;
@group(0) @binding(3) var pheromonesOut: texture_storage_2d<rgba8unorm, write>;

fn samplePheromone(position: vec2<f32>, direction: vec2<f32>, steps: u32) -> f32 {
    let sampleStart = position + direction * 2;
    var sum = 0.;
    let fSteps = f32(steps);
    for (var i = 0.; i < fSteps; i += 1.) {
        var samplePixel = vec2<u32>(round(sampleStart + i * direction));
        if (uniforms.wrap == 1) {
            if (samplePixel.x < 0) {
                samplePixel.x += uniforms.width;
            } else if (samplePixel.x >= uniforms.width) {
                samplePixel.x -= uniforms.width; 
            }
            if (samplePixel.y < 0) {
                samplePixel.y += uniforms.height;
            } else if (samplePixel.y >= uniforms.height) {
                samplePixel.y -= uniforms.height; 
            }
        }
        sum += textureLoad(pheromonesIn, samplePixel).x;
    }
    return sum;
}

@compute @workgroup_size(64)
fn simulate(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let index = global_id.x;
    let width = f32(uniforms.width);
    let height = f32(uniforms.height);
    // Trim off the excess if agentCount % WORKGROUP_SIZE != 0
    if (index >= uniforms.agentCount) {
        return;
    }

    var agent = agents[index];

    agent.x += agent.z;
    agent.y += agent.w;

    if (uniforms.wrap == 1) {
        if (agent.x < 0.) {
            agent.x += width;
        } else if (agent.x >= width) {
            agent.x -= width; 
        }
        if (agent.y < 0.) {
            agent.y += height;
        } else if (agent.y >= height) {
            agent.y -= height; 
        }
    } else {
        if (agent.x >= width || agent.x < 0) {
            agent.z = -agent.z;
        }
        if (agent.y >= height || agent.y < 0) {
            agent.w = -agent.w;
        }
    }
    let randomDirChange = uniforms.turnJitter * vec2(Random(uniforms.time + global_id.x) - .5, Random(uniforms.time + global_id.x + uniforms.height) - .5);
    var velocity = normalize(agent.zw + randomDirChange);

    let leftSampleMatrix =  mat2x2(uniforms.cosSampleAngle, uniforms.sinSampleAngle, -uniforms.sinSampleAngle, uniforms.cosSampleAngle);
    let rightSampleMatrix = mat2x2(uniforms.cosSampleAngle, -uniforms.sinSampleAngle, uniforms.sinSampleAngle, uniforms.cosSampleAngle);

    // Take pheromone samples
    let rightSampleDir = rightSampleMatrix * velocity;
    let rightSamplePixel = vec2<i32>(round(agent.xy + 3 * rightSampleDir));

    let forwardSamplePixel = vec2<i32>(round(agent.xy + 3 * velocity));


    let leftSampleDir = leftSampleMatrix * velocity;

    let rightSample = samplePheromone(agent.xy, rightSampleDir, uniforms.sampleDistance);
    let forwardSample = samplePheromone(agent.xy, velocity, uniforms.sampleDistance);
    let leftSample = samplePheromone(agent.xy, leftSampleDir, uniforms.sampleDistance);

    var maxSample = 0.;
    if (forwardSample < rightSample || forwardSample < leftSample) {
        if (rightSample > leftSample) {
            velocity += uniforms.steerFactor * rightSampleDir;
            maxSample = rightSample;
        } else {
            velocity += uniforms.steerFactor * leftSampleDir;
            maxSample = leftSample; 
        }
        velocity = normalize(velocity);
    } else {
        maxSample = forwardSample;
    }

    velocity *= uniforms.speed + (uniforms.acceleration * maxSample / f32(uniforms.sampleDistance));

    let pixel = vec2<i32>(round(agent.xy));
    let red = vec3(1., 0., 0.);
    textureStore(pheromonesOut, pixel, vec4(red, 1.));

    agent.z = velocity.x;
    agent.w = velocity.y;
    agents[index] = agent;
}