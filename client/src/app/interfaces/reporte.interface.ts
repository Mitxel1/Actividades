export interface Comentario {
    _id?: string;
    contenido: string;
    creadoPor: any;
    fechaCreacion: Date;
  }
  
  export interface Reporte {
    _id?: string;
    actividad: any;
    titulo: string;
    contenido: string;
    recursos: string[];
    problemas: string[];
    soluciones: string[];
    comentariosAdmin: Comentario[];
    estado: 'Pendiente de Revisión' | 'Revisado' | 'Requiere Cambios';
    creadoPor: any;
    fechaCreacion: Date;
  }