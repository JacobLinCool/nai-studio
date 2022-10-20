export const model = {
    safe: "safe-diffusion",
    full: "nai-diffusion",
    furry: "nai-diffusion-furry",
} as const;

export const resolution = {
    small: {
        landscape: { width: 640, height: 384 },
        portrait: { width: 384, height: 640 },
        square: { width: 512, height: 512 },
    },
    normal: {
        landscape: { width: 768, height: 512 },
        portrait: { width: 512, height: 768 },
        square: { width: 640, height: 640 },
    },
    large: {
        landscape: { width: 1024, height: 512 },
        portrait: { width: 512, height: 1024 },
        square: { width: 1024, height: 1024 },
    },
} as const;

export const sampler = {
    k_euler_ancestral: "k_euler_ancestral",
    k_euler: "k_euler",
    k_lms: "k_lms",
    plms: "plms",
    ddim: "ddim",
} as const;
