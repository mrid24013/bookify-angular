import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, finalize } from 'rxjs';
import { EspaciosService, Espacio } from '../../services/espacios.service';
import { ReservacionesService, Reservacion } from '../../services/reservaciones.service';

export interface EspacioEstatus extends Espacio {
  estatusActual: 'LIBERADO' | 'OCUPADO' | 'INACTIVO';
  reservaActual?: Reservacion;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private espaciosService = inject(EspaciosService);
  private reservacionesService = inject(ReservacionesService);
  private cdr = inject(ChangeDetectorRef);

  //Valores globales
  espaciosEstatus: EspacioEstatus[] = [];
  loading = true;
  horaActualStr: string = '';
  fechaActualStr: string = '';

  totalEspacios = 0;
  totalOcupados = 0;
  totalLiberados = 0;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  //Recarga los datos al iniciar la pagina para mostrar el estado de reservacion mas reciente
  loadDashboardData(): void {
    this.loading = true;

    forkJoin({
      espacios: this.espaciosService.getEspacios(),
      reservaciones: this.reservacionesService.getReservaciones()
    })
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: ({ espacios, reservaciones }) => {
          this.procesarEstatus(espacios, reservaciones);
        }
      });
  }

  //Verifica el estado y lo muestra con los elementos apropiados
  private procesarEstatus(espacios: Espacio[], reservaciones: Reservacion[]): void {
    const ahora = new Date();

    //Fecha LOCAL (YYYY-MM-DD)
    const año = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    const hoyStr = `${año}-${mes}-${dia}`;
    this.fechaActualStr = hoyStr;

    //Conversion a hora actual LOCAL (HH:MM)
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const horaActual = `${horas}:${minutos}`;
    this.horaActualStr = horaActual;

    let ocupadosCount = 0;
    let liberadosCount = 0;

    this.espaciosEstatus = espacios.map((espacio) => {
      const estaHabilitado = espacio.activo ?? espacio.disponible ?? true;

      if (!estaHabilitado) {
        return {
          ...espacio,
          estatusActual: 'INACTIVO' as const
        };
      }

      const idEspacioActual = Number(espacio.id);
      const reservacionesHoy = reservaciones.filter((r) => {
        const idEspacioReserva = typeof r.espacio === 'object' ? Number(r.espacio?.id) : Number(r.espacio);
        const esMismoEspacio = idEspacioReserva === idEspacioActual;
        const fechaReserva = (r.fecha || '').trim().substring(0, 10);
        const esHoy = fechaReserva === hoyStr;

        return esMismoEspacio && esHoy;
      });

      // Evaluar reservaciones actuales
      const reservaEnCurso = reservacionesHoy.find((r) => {
        const inicio = (r.hora_inicio || '').substring(0, 5);
        const fin = (r.hora_fin || '').substring(0, 5);

        return horaActual >= inicio && horaActual <= fin;
      });

      if (reservaEnCurso) {
        ocupadosCount++;
        return {
          ...espacio,
          estatusActual: 'OCUPADO' as const,
          reservaActual: reservaEnCurso
        };
      } else {
        liberadosCount++;
        return {
          ...espacio,
          estatusActual: 'LIBERADO' as const
        };
      }
    });

    this.totalEspacios = espacios.length;
    this.totalOcupados = ocupadosCount;
    this.totalLiberados = liberadosCount;
  }
}