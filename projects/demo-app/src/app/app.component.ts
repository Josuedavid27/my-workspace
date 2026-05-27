import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonComponent,
  CardComponent,
  SelectComponent,
  TableComponent,
  TableAction,
  TableColumn,
  SelectOption,
} from 'ui-lib';
import { ResourceService } from './services/resource.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CardComponent,
    SelectComponent,
    TableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-space-dark text-white font-body">

      <!-- Header -->
      <header class="bg-space-mid border-b border-portal-green/30 px-6 py-4">
        <h1 class="text-2xl font-black font-display text-portal-green tracking-widest uppercase">
          🌀 Rick & Morty Explorer
        </h1>
        <p class="text-slate-400 text-sm mt-1">Explora personajes, episodios y locaciones</p>
      </header>

      <main class="max-w-7xl mx-auto px-4 py-8">

        <!-- Filtros -->
        <div class="flex flex-col sm:flex-row gap-4 mb-8">

          <div class="w-full sm:w-64">
            <ui-select
              label="Recurso"
              [options]="resourceOptions"
              [value]="activeResource"
              (selectionChange)="onResourceChange($event)"
            />
          </div>

          <div class="w-full sm:w-64">
            <ui-select
              label="Filtrar por status"
              placeholder="Sin filtro"
              [options]="statusOptions"
              [value]="activeFilter"
              [disabled]="svc.activeResource() !== 'character'"
              (selectionChange)="onFilterChange($event)"
            />
          </div>

        </div>

        <!-- Tabla -->
        <ui-table
          [columns]="tableColumns"
          [rows]="tableRows"
          [loading]="svc.loading()"
          [errorMessage]="svc.error()"
          emptyMessage="No se encontraron resultados en esta dimensión 🛸"
          (actionTriggered)="onAction($event)"
        />

      </main>

      <!-- Modal detalle -->
      @if (selectedRow()) {
        <div
          class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          (click)="closeModal()"
        >
          <div class="w-full max-w-lg" (click)="$event.stopPropagation()">
            <ui-card
              [title]="getField(selectedRow()!, 'name')"
              [subtitle]="'ID: ' + getField(selectedRow()!, 'id')"
              elevation="outlined"
            >
              <div class="space-y-2 text-sm text-slate-300">
                @for (entry of getEntries(selectedRow()!); track entry[0]) {
                  <div class="flex justify-between border-b border-space-light pb-1">
                    <span class="text-portal-green font-medium capitalize">{{ entry[0] }}</span>
                    <span class="text-right max-w-[60%] truncate">{{ entry[1] }}</span>
                  </div>
                }
              </div>
              <div class="mt-4">
                <ui-button
                  label="Cerrar"
                  variant="secondary"
                  size="sm"
                  (clicked)="closeModal()"
                />
              </div>
            </ui-card>
          </div>
        </div>
      }

    </div>
  `,
})
export class AppComponent {
  svc = inject(ResourceService);

  selectedRow = signal<Record<string, unknown> | null>(null);

  // ── Getters tipados para el template ──────────────────────
  get resourceOptions(): SelectOption[] {
    return this.svc.resourceOptions;
  }

  get statusOptions(): SelectOption[] {
    return this.svc.statusOptions;
  }

  get activeResource(): string {
    return this.svc.activeResource();
  }

  get activeFilter(): string | null {
    return this.svc.activeFilter();
  }

  get tableColumns(): TableColumn[] {
    return this.svc.columns();
  }

  get tableRows(): Record<string, unknown>[] {
    return this.svc.rows();
  }

  // ── Handlers ──────────────────────────────────────────────
  onResourceChange(option: SelectOption): void {
    this.svc.changeResource(option.value);
  }

  onFilterChange(option: SelectOption): void {
    this.svc.changeFilter(option.value);
  }

  onAction(event: TableAction<Record<string, unknown>>): void {
    if (event.action === 'view') {
      this.selectedRow.set(event.row);
    } else if (event.action === 'delete') {
      if (confirm('¿Eliminar este registro del estado local?')) {
        console.log('delete emitted', event.row);
      }
    }
  }

  closeModal(): void {
    this.selectedRow.set(null);
  }

  getField(row: Record<string, unknown>, key: string): string {
    return String(row[key] ?? '');
  }

  getEntries(row: Record<string, unknown>): [string, string][] {
    return Object.entries(row)
      .filter(([, v]) => typeof v !== 'object')
      .map(([k, v]) => [k, String(v)]);
  }
}
