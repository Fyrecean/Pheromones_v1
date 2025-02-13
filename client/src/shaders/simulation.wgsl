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
    turnJitter: f32,
    steerFactor: f32,
    speed: f32,
    energyCost: f32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@group(0) @binding(1) var<storage, read_write> agents: array<Ant>;
@group(0) @binding(2) var pheromonesIn: texture_storage_2d<rgba8unorm, read>;
@group(0) @binding(3) var pheromonesOut: texture_storage_2d<rgba8unorm, write>;

fn samplePheromone(position: vec2<f32>, direction: vec2<f32>, steps: u32) -> f32 {
    let sampleStart = position + direction * 2;
    var sum = 0.;
    let fSteps = f32(steps);
    for (var i = 0.; i < fSteps; i += 1.) {
        var samplePixel = vec2<u32>(round(sampleStart + i * direction));
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
        sum += textureLoad(pheromonesIn, samplePixel).x;
    }
    return sum;
}

@compute @workgroup_size(64)
fn simulate(@builtin(global_invocation_id) global_id: vec3<u32>) {
    // Trim off the excess if agentCount % WORKGROUP_SIZE != 0
    let index = global_id.x;
    if (index >= uniforms.agentCount) {
        return;
    }
    let width = f32(uniforms.width);
    let height = f32(uniforms.height);

    var agent = agents[index];

    // Move
    let randomDirChange = uniforms.turnJitter * (2. * Random(uniforms.time + global_id.x) - 1.);
    agent.angle += randomDirChange;
    var velocity = angle_to_vec2(agent.angle);
    agent.position += velocity * uniforms.speed;
    agent.energy -= uniforms.energyCost;
    if (agent.energy <= 0) {
        agent.position = vec2(f32(uniforms.width / 2), f32(uniforms.height / 2));
        agent.energy = 1.;
        agent.angle = Random(uniforms.time + global_id.x) * 6.2831853072;
    }
    if (agent.position.x >= width) { agent.position.x -= width; }
    if (agent.position.x < 0.) {agent.position.x += width;}
    if (agent.position.y >= height) { agent.position.y -= height; }
    if (agent.position.y < 0.) {agent.position.y += height;}

    // Sniff
    let rightSampleDir = rotate(velocity, 0.3);
    let leftSampleDir = rotate(velocity, -0.3);

    let rightSample = samplePheromone(agent.position, rightSampleDir, uniforms.sampleDistance);
    let forwardSample = samplePheromone(agent.position, velocity, uniforms.sampleDistance);
    let leftSample = samplePheromone(agent.position, leftSampleDir, uniforms.sampleDistance);

    if (forwardSample < rightSample || forwardSample < leftSample) {
        if (rightSample > leftSample) {
            agent.angle -= uniforms.steerFactor;
        } else {
            agent.angle += uniforms.steerFactor;
        }
        velocity = normalize(velocity);
    }

    let pixel = vec2<i32>(round(agent.position));
    let red = vec3(agent.hue * agent.energy, 1., 1.);
    textureStore(pheromonesOut, pixel, vec4(red, 1.));

    agents[index] = agent;
}