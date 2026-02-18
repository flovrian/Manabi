
const IS_DEVELOPMENT = import.meta.env.VITE_NODE_ENV === 'development';

const SERVER_PORT = Number(
    IS_DEVELOPMENT
        ? import.meta.env.VITE_DEV_SERVER_PORT ?? 5000
        : import.meta.env.VITE_SERVER_PORT ?? 80
);

const SERVER_HOST = IS_DEVELOPMENT
    ? import.meta.env.VITE_DEV_SERVER_HOST ?? 'localhost'
    : import.meta.env.VITE_SERVER_HOST ?? 'manabi.xyz';

export const config = {
    apiUrl: `${IS_DEVELOPMENT ? 'http' : 'https'}://${SERVER_HOST}${IS_DEVELOPMENT || SERVER_PORT !== 80 ? `:${SERVER_PORT}` : ''}/api`,
};

