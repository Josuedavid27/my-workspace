import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

type CardElevation = 'flat' | 'raised' | 'outlined';

/**
 * Componente Card con header clickeable y proyección de contenido via ng-content.
 */
@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="cardClasses()">
      <!-- Header -->
      <div
        class="px-5 py-4 border-b border-space-light cursor-pointer hover:bg-space-light transition-colors duration-200"
        (click)="headerClicked.emit()"
      >
        <h3 class="text-lg font-bold text-portal-green font-display">{{ title() }}</h3>
        @if (subtitle()) {
          <p class="text-sm text-slate-400 mt-0.5">{{ subtitle() }}</p>
        }
      </div>

      <!-- Body: proyecta contenido arbitrario -->
      <div class="px-5 py-4">
        <ng-content />
      </div>
    </div>
  `,
})
export class CardComponent {
  /** Título del header de la card */
  title = input.required<string>();

  /** Subtítulo opcional */
  subtitle = input<string | null>(null);

  /** Estilo visual del contenedor */
  elevation = input<CardElevation>('raised');

  /** Emite al hacer clic en el header */
  headerClicked = output<void>();

  cardClasses(): string {
    const base = 'rounded-xl overflow-hidden bg-space-mid';

    const elevations: Record<CardElevation, string> = {
      flat:     '',
      raised:   'shadow-lg shadow-black/50',
      outlined: 'border border-portal-green/40',
    };

    return [base, elevations[this.elevation()]].join(' ');
  }
}
