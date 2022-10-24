export interface Character {
    name: string;
    description: string;
    traits: string[];
}

export interface Scene {
    name: string;
    description: string;
    traits: string[];
}

export interface Bit {
    name: string;
    description: string;
    traits: string[];
}

export interface TokenPerks {
    maxPriorityActions: number;
    startPriority: number;
    contextTokens: number;
    moduleTrainingSteps: number;
    unlimitedMaxPriority: boolean;
    voiceGeneration: boolean;
    imageGeneration: boolean;
    unlimitedImageGeneration: boolean;
    unlimitedImageGenerationLimits: {
        resolution: number;
        maxPrompts: number;
    }[];
}

export interface AccessToken {
    tier: number;
    active: boolean;
    expiresAt: number;
    perks: TokenPerks;
    trainingStepsLeft: {
        fixedTrainingStepsLeft: number;
        purchasedTrainingSteps: number;
    };
}
