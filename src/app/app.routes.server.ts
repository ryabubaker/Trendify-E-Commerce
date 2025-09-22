import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'home', renderMode: RenderMode.Client }, // home CSR
  { path: '**', renderMode: RenderMode.Server },   // everything else SSR (including 404)
];
