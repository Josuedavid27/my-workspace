import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, Character, Episode, Location, SelectOption } from 'ui-lib';

type ResourceType = 'character' | 'episode' | 'location';

/**
 * Servicio central de estado.
 * Todos los signals viven aquí. Los componentes no hacen HTTP directamente.
 */
@Injectable({ providedIn: 'root' })
export class ResourceService {
  private readonly BASE = 'https://rickandmortyapi.com/api';

  // ── Estado ──────────────────────────────────────────────
  readonly activeResource = signal<ResourceType>('character');
  readonly activeFilter    = signal<string | null>(null);
  readonly rows            = signal<Record<string, unknown>[]>([]);
  readonly loading         = signal<boolean>(false);
  readonly error           = signal<string | null>(null);

  // ── Opciones fijas ──────────────────────────────────────
  readonly resourceOptions: SelectOption[] = [
    { label: 'Characters', value: 'character' },
    { label: 'Episodes',   value: 'episode'   },
    { label: 'Locations',  value: 'location'  },
  ];

  readonly statusOptions: SelectOption[] = [
    { label: 'Alive',   value: 'alive'   },
    { label: 'Dead',    value: 'dead'    },
    { label: 'Unknown', value: 'unknown' },
  ];

  // ── Columnas por recurso ────────────────────────────────
  readonly columns = computed(() => {
    switch (this.activeResource()) {
      case 'character': return [
        { key: 'id',      header: '#'        },
        { key: 'name',    header: 'Nombre'   },
        { key: 'status',  header: 'Estado'   },
        { key: 'species', header: 'Especie'  },
        { key: 'gender',  header: 'Género'   },
      ];
      case 'episode': return [
        { key: 'id',       header: '#'        },
        { key: 'name',     header: 'Nombre'   },
        { key: 'episode',  header: 'Código'   },
        { key: 'air_date', header: 'Emisión'  },
      ];
      case 'location': return [
        { key: 'id',        header: '#'          },
        { key: 'name',      header: 'Nombre'     },
        { key: 'type',      header: 'Tipo'       },
        { key: 'dimension', header: 'Dimensión'  },
      ];
    }
  });

  constructor(private http: HttpClient) {
    this.fetchData();
  }

  /** Cambia el recurso activo y resetea el filtro */
  changeResource(resource: string): void {
    this.activeResource.set(resource as ResourceType);
    this.activeFilter.set(null);
    this.fetchData();
  }

  /** Aplica el filtro de status */
  changeFilter(status: string | null): void {
    this.activeFilter.set(status);
    this.fetchData();
  }

  /** Realiza la petición HTTP y actualiza el estado */
  fetchData(): void {
    this.loading.set(true);
    this.error.set(null);

    const resource = this.activeResource();
    const filter   = this.activeFilter();
    let url = `${this.BASE}/${resource}`;

    if (filter && resource === 'character') {
      url += `?status=${filter}`;
    }

    this.http.get<ApiResponse<Character | Episode | Location>>(url).subscribe({
      next: (res) => {
        this.rows.set(res.results as unknown as Record<string, unknown>[]);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo conectar con la API de Rick & Morty. Intenta de nuevo.');
        this.loading.set(false);
      },
    });
  }
}
