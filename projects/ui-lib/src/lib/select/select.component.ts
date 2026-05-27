import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectOption } from '../models/types';

/**
 * Componente Select con two-way binding via model() y emisión del objeto completo.
 */
@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-1">
      @if (label()) {
        <label class="text-sm font-medium text-slate-300">{{ label() }}</label>
      }

      @if (loading()) {
        <div class="h-10 w-full rounded-lg bg-space-light animate-pulse"></div>
      } @else {
        <select
          [value]="value() ?? ''"
          [disabled]="disabled()"
          (change)="onChange($event)"
          class="w-full px-3 py-2 rounded-lg bg-space-light border border-space-light text-white
                 focus:outline-none focus:ring-2 focus:ring-portal-green focus:border-portal-green
                 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200
                 appearance-none cursor-pointer"
        >
          <option value="" disabled>{{ placeholder() }}</option>
          @for (opt of options(); track opt.value) {
            <option [value]="opt.value">{{ opt.label }}</option>
          }
        </select>
      }
    </div>
  `,
})
export class SelectComponent {
  /** Lista de opciones */
  options = input.required<SelectOption[]>();

  /** Etiqueta visible */
  label = input<string>('');

  /** Texto placeholder */
  placeholder = input<string>('Selecciona una opción');

  /** Estado de carga */
  loading = input<boolean>(false);

  /** Deshabilita el select */
  disabled = input<boolean>(false);

  /** Two-way binding del valor seleccionado */
  value = model<string | null>(null);

  /** Emite el objeto completo al cambiar */
  selectionChange = output<SelectOption>();

  onChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.value.set(val || null);
    const found = this.options().find(o => o.value === val);
    if (found) this.selectionChange.emit(found);
  }
}
