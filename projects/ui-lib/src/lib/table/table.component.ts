import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn, TableAction } from '../models/types';
import { ButtonComponent } from '../button/button.component';

/**
 * Tabla genérica que renderiza columnas dinámicas y emite acciones.
 * No conoce el dominio — solo renderiza y emite.
 */
@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full overflow-x-auto rounded-xl border border-space-light">
      <table class="w-full text-sm text-left">
        <!-- Header -->
        <thead class="bg-space-light text-portal-green uppercase text-xs tracking-wider">
          <tr>
            @for (col of columns(); track col.key) {
              <th class="px-4 py-3 font-semibold">{{ col.header }}</th>
            }
            <th class="px-4 py-3 font-semibold">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <!-- Estado: loading skeleton -->
          @if (loading()) {
            @for (row of skeletonRows; track $index) {
              <tr class="border-t border-space-light">
                @for (col of columns(); track col.key) {
                  <td class="px-4 py-3">
                    <div class="h-4 bg-space-light rounded animate-pulse w-3/4"></div>
                  </td>
                }
                <td class="px-4 py-3">
                  <div class="h-4 bg-space-light rounded animate-pulse w-1/2"></div>
                </td>
              </tr>
            }
          }

          <!-- Estado: error -->
          @else if (errorMessage()) {
            <tr>
              <td [attr.colspan]="columns().length + 1" class="px-4 py-10 text-center text-rick-orange">
                ⚠️ {{ errorMessage() }}
              </td>
            </tr>
          }

          <!-- Estado: vacío -->
          @else if (rows().length === 0) {
            <tr>
              <td [attr.colspan]="columns().length + 1" class="px-4 py-10 text-center text-slate-400">
                🌀 {{ emptyMessage() }}
              </td>
            </tr>
          }

          <!-- Estado: datos -->
          @else {
            @for (row of rows(); track $index) {
              <tr class="border-t border-space-light hover:bg-space-light/50 transition-colors duration-150">
                @for (col of columns(); track col.key) {
                  <td class="px-4 py-3 text-slate-300">
                    {{ getCell(row, col.key) }}
                  </td>
                }
                <td class="px-4 py-3 flex gap-2">
                  <ui-button
                    label="Ver"
                    variant="secondary"
                    size="sm"
                    (clicked)="actionTriggered.emit({ action: 'view', row: row })"
                  />
                  <ui-button
                    label="Eliminar"
                    variant="danger"
                    size="sm"
                    (clicked)="actionTriggered.emit({ action: 'delete', row: row })"
                  />
                </td>
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
  `,
})
export class TableComponent<T extends Record<string, unknown>> {
  /** Definición de columnas */
  columns = input.required<TableColumn[]>();

  /** Datos a renderizar */
  rows = input<T[]>([]);

  /** Muestra skeleton mientras carga */
  loading = input<boolean>(false);

  /** Mensaje cuando no hay filas */
  emptyMessage = input<string>('No hay resultados');

  /** Mensaje de error de red */
  errorMessage = input<string | null>(null);

  /** Emite la acción y la fila correspondiente */
  actionTriggered = output<TableAction<T>>();

  /** Filas fantasma para el skeleton (5 filas) */
  readonly skeletonRows = Array(5).fill(null);

  /** Obtiene el valor de una celda de forma segura */
  getCell(row: T, key: string): string {
    const val = row[key];
    return val !== null && val !== undefined ? String(val) : '—';
  }
}
