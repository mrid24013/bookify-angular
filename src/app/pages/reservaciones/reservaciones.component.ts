import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ReservacionesService, Reservacion } from '../../services/reservaciones.service';
import { EspaciosService, Espacio } from '../../services/espacios.service';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservaciones.component.html',
  styleUrl: './reservaciones.component.scss'
})
export class ReservacionesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private reservacionesService = inject(ReservacionesService);
  private espaciosService = inject(EspaciosService);
  private cdr = inject(ChangeDetectorRef);

  reservas: Reservacion[] = [];
  espacios: Espacio[] = [];
  isEditing = false;
  selectedId: number | null = null;

  reservaForm: FormGroup = this.fb.group({
    espacio: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
    hora_inicio: ['', [Validators.required]],
    hora_fin: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.loadEspacios();
    this.loadReservas();
  }

  //Carga informacion de los cubiculos
  loadEspacios(): void {
    this.espaciosService.getEspacios().subscribe({
      next: (data) => {
        this.espacios = data.filter((e) => e.activo ?? e.disponible);
        this.cdr.detectChanges();
      }
    });
  }

  getNombreEspacio(espacioId: number, espacioNombre?: string): string {
    if (espacioNombre) return espacioNombre;
    const encontrado = this.espacios.find((e) => e.id === espacioId);
    return encontrado ? encontrado.nombre : `Espacio #${espacioId}`;
  }

  //Carga informacion de las reservaciones
  loadReservas(): void {
    this.reservacionesService.getReservaciones().pipe(
      finalize(() => {
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (data) => {
        this.reservas = data;
      }
    });
  }

  //CRUD
  onSubmit(): void {
    if (this.reservaForm.invalid) {
      this.reservaForm.markAllAsTouched();
      return;
    }

    const formValue = this.reservaForm.value;

    if (this.isEditing && this.selectedId !== null) {
      this.reservacionesService.updateReservacion(this.selectedId, formValue).subscribe({
        next: () => {
          this.resetForm();
          this.loadReservas();
        }
      });
    } else {
      this.reservacionesService.createReservacion(formValue).subscribe({
        next: () => {
          this.resetForm();
          this.loadReservas();
        }
      });
    }
  }

  onEdit(item: Reservacion): void {
    this.isEditing = true;
    this.selectedId = item.id ?? null;
    this.reservaForm.patchValue({
      espacio: item.espacio,
      fecha: item.fecha,
      hora_inicio: item.hora_inicio,
      hora_fin: item.hora_fin
    });
    this.cdr.detectChanges();
  }

  onDelete(id: number | undefined): void {
    if (!id) return;
    if (confirm('Cancelar reservacion?')) {
      this.reservacionesService.deleteReservacion(id).subscribe({
        next: () => this.loadReservas()
      });
    }
  }

  // Limpia formularios para operaciones de edit / create
  resetForm(): void {
    this.isEditing = false;
    this.selectedId = null;
    this.reservaForm.reset({
      espacio: '',
      fecha: '',
      hora_inicio: '',
      hora_fin: ''
    });
    this.cdr.detectChanges();
  }
}