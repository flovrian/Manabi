/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv {
    readonly VITE_NODE_ENV: 'development' | 'production';
    readonly VITE_DEV_SERVER_PORT?: string;
    readonly VITE_DEV_SERVER_HOST?: string;
    readonly VITE_SERVER_PORT?: string;
    readonly VITE_SERVER_HOST?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}