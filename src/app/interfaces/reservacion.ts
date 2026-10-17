export interface Reservacion {
    id?: number;
    espacio: number;
    espacio_nombre?: string;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    motivo?: string;
    usuario?: number;
  }