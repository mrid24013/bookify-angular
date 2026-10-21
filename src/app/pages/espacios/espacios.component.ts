import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { EspaciosService, Espacio } from '../../services/espacios.service';

@Component({
  selector: 'app-espacios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './espacios.component.html',
  styleUrl: './espacios.component.scss'
})
export class EspaciosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private espaciosService = inject(EspaciosService);
  private cdr = inject(ChangeDetectorRef);

  espacios: Espacio[] = [];
  isEditing = false;
  selectedId: number | null = null;

  espacioForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    capacidad: [1, [Validators.required, Validators.min(1)]],
    descripcion: [''],
    activo: [true]
  });

  ngOnInit(): void {
    this.loadEspacios();
  }

  //Carga informacion de los espacios
  loadEspacios(): void {
    this.espaciosService.getEspacios().pipe(
      finalize(() => {
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (data) => {
        this.espacios = data;
      }
    });
  }

  //CRUD
  onSubmit(): void {
    if (this.espacioForm.invalid) {
      this.espacioForm.markAllAsTouched();
      return;
    }

    const formValue = this.espacioForm.value;

    if (this.isEditing && this.selectedId !== null) {
      this.espaciosService.updateEspacio(this.selectedId, formValue).subscribe({
        next: () => {
          this.resetForm();
          this.loadEspacios();
        }
      });
    } else {
      this.espaciosService.createEspacio(formValue).subscribe({
        next: () => {
          this.resetForm();
          this.loadEspacios();
        }
      });
    }
  }

  onEdit(item: Espacio): void {
    this.isEditing = true;
    this.selectedId = item.id ?? null;
    this.espacioForm.patchValue({
      nombre: item.nombre,
      capacidad: item.capacidad,
      descripcion: item.descripcion || '',
      activo: item.activo ?? true
    });
    this.cdr.detectChanges();
  }

  onDelete(id: number | undefined): void {
    if (!id) return;
    if (confirm('¿Estás seguro de que deseas eliminar este espacio?')) {
      this.espaciosService.deleteEspacio(id).subscribe({
        next: () => this.loadEspacios()
      });
    }
  }

  //Limpia formularios para operaciones de edit / create
  resetForm(): void {
    this.isEditing = false;
    this.selectedId = null;
    this.espacioForm.reset({
      nombre: '',
      capacidad: 1,
      descripcion: '',
      activo: true
    });
    this.cdr.detectChanges();
  }
}