/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
declare module '*.png'  { const v: string; export default v; }
declare module '*.jpg'  { const v: string; export default v; }
declare module '*.jpeg' { const v: string; export default v; }
declare module '*.svg'  {
  import * as React from 'react';
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string; export default src;
}