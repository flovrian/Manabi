/* Declare to silence TypeScript's whining due to module syntax */
declare module '*.module.css' {
    const content: Record<string, string>;
    export default content;
}
declare module '*.png' {
    const value: string;
    export default value;
}
declare module '*.mp3' {
    const value: string;
    export default value;
}
declare module "*.json" {
    const value: any;
    export default value;
}
