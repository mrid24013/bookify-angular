import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EspaciosService } from '../../services/espacios.service';
import { Espacio } from '../../interfaces/espacio';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss'
})
export class ExploreComponent implements OnInit {
  private espaciosService = inject(EspaciosService);
  private fb = inject(FormBuilder);

  espacios: Espacio[] = [];
  espacioForm!: FormGroup;
  isEditing = false;
  editingId: number | null = null;
  loading = false;

  ngOnInit(): void {
    this.initForm();
    this.loadEspacios();
  }

  private initForm(): void {
    this.espacioForm = this.fb.group({
      nombre: ['', [Validators.required]],
      capacidad: [1, [Validators.required, Validators.min(1)]],
      descripcion: [''],
      activo: [true]
    });
  }

  loadEspacios(): void {
    this.loading = true;
    this.espaciosService.getAll().subscribe({
      next: (data) => {
        this.espacios = data;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  onSubmit(): void {
    if (this.espacioForm.invalid) return;

    const data: Espacio = this.espacioForm.value;

    if (this.isEditing && this.editingId !== null) {
      this.espaciosService.update(this.editingId, data).subscribe({
        next: () => {
          this.resetForm();
          this.loadEspacios();
        }
      });
    } else {
      this.espaciosService.create(data).subscribe({
        next: () => {
          this.resetForm();
          this.loadEspacios();
        }
      });
    }
  }

  onEdit(espacio: Espacio): void {
    if (!espacio.id) return;
    this.isEditing = true;
    this.editingId = espacio.id;
    this.espacioForm.patchValue(espacio);
  }

  onDelete(id?: number): void {
    if (!id) return;
    if (confirm('Deseas eliminar este espacio?')) {
      this.espaciosService.delete(id).subscribe({
        next: () => this.loadEspacios()
      });
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.editingId = null;
    this.espacioForm.reset({
      nombre: '',
      capacidad: 1,
      descripcion: '',
      activo: true
    });
  }
}