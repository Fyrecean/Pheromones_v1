const shader = `
    @compute @workgroup_size(8, 8)
    fn attenuate(@builtin(global_invocation_id) global_id: vec3<u32>) {
        let current = textureLoad(textureOut, global_id.xy);
        textureStore(textureOut, global_id.xy, max(vec4(0.), current - 0.1));
    }
`