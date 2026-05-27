import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/** Variantes visuales del botón */
type ButtonVariant = 'primary' | 'secondary' | 'danger';

/** Tamaños disponibles del botón */
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Componente de botón reutilizable.
 * Soporta variantes visuales, tamaños, estado disabled y estado loading con spinner.
 */
@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="handleClick()"
      type="button"
    >
      @if (loading()) {
        <svg class="animate-spin h-4 w-4 mr-2 inline-block" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      }
      {{ label() }}
    </button>
  `,
})
export class ButtonComponent {
  /** Texto visible del botón */
  label = input.required<string>();

  /** Estilo visual del botón */
  variant = input<ButtonVariant>('primary');

  /** Tamaño del botón */
  size = input<ButtonSize>('md');

  /** Deshabilita el botón */
  disabled = input<boolean>(false);

  /** Muestra spinner y bloquea el click */
  loading = input<boolean>(false);

  /** Emite solo si no está disabled ni loading */
  clicked = output<void>();

  /** Construye las clases Tailwind según el estado actual */
  buttonClasses(): string {
    const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-space-dark';

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-7 py-3.5 text-lg',
    };

    const variants: Record<ButtonVariant, string> = {
      primary:   'bg-portal-green text-space-dark hover:bg-portal-lime focus:ring-portal-green disabled:opacity-50 disabled:cursor-not-allowed',
      secondary: 'bg-space-light text-white border border-portal-green hover:bg-space-mid focus:ring-portal-green disabled:opacity-50 disabled:cursor-not-allowed',
      danger:    'bg-rick-orange text-white hover:bg-red-700 focus:ring-rick-orange disabled:opacity-50 disabled:cursor-not-allowed',
    };

    return [base, sizes[this.size()], variants[this.variant()]].join(' ');
  }

  handleClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit();
    }
  }
}
