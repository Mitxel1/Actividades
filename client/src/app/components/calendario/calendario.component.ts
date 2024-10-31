import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { 
  startOfDay, 
  endOfDay,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  parseISO
} from 'date-fns'; // Agregamos estas importaciones
import { Subject } from 'rxjs';
import { ActividadesService } from 'src/app/services/actividades.service';
@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css'],
})
export class CalendarioComponent implements OnInit{

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = false;
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];

  // Array de colores para asignar a las actividades
  colors: any[] = [
    { primary: '#ad2121', secondary: '#FAE3E3' }, // Rojo
    { primary: '#1e90ff', secondary: '#D1E8FF' }, // Azul
    { primary: '#e3bc08', secondary: '#FDF1BA' }, // Amarillo
    { primary: '#28a745', secondary: '#D4EDDA' }, // Verde
    { primary: '#9c27b0', secondary: '#E8D5E7' }, // Púrpura
    { primary: '#fd7e14', secondary: '#FFE5D0' }, // Naranja
    { primary: '#20c997', secondary: '#D2F4EA' }, // Turquesa
    { primary: '#6f42c1', secondary: '#E2D9F3' }  // Índigo
  ];
  router: any;

  constructor(private actividadesService: ActividadesService) {} // Asegúrate de importar tu servicio

  async ngOnInit() {
    await this.cargarActividades();
  }

  async cargarActividades() {
    try {
      const actividades = await this.actividadesService.obtenerActividadesPorUsuario();
      this.events = actividades.map((actividad, index) => ({
        title: actividad.title || 'Actividad sin nombre', // Ajusta según tu modelo de datos
        start: parseISO(actividad.startDate), // Asume que fechaInicio es un string ISO
        end: parseISO(actividad.endDate), // Asume que fechaFin es un string ISO
        color: this.colors[index % this.colors.length], // Asigna colores de forma cíclica
        meta: {
          actividad // Guarda la actividad completa para referencia
        }
      }));
      this.refresh.next(null); // Actualiza la vista del calendario
    } catch (error) {
      console.error('Error al cargar actividades:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  }

  // Función para manejar el clic en un día
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (events.length > 0) {
      this.viewDate = date;
      this.activeDayIsOpen = true;
      this.view = CalendarView.Day; // Cambia a la vista diaria para ver más detalles
    }
  }

  // Funciones existentes de navegación
  incrementDate(): void {
    const addFn = {
      day: addDays,
      week: addWeeks,
      month: addMonths,
    }[this.view];
    this.viewDate = addFn(this.viewDate, 1);
  }

  decrementDate(): void {
    const subFn = {
      day: subDays,
      week: subWeeks,
      month: subMonths,
    }[this.view];
    this.viewDate = subFn(this.viewDate, 1);
  }

  today(): void {
    this.viewDate = new Date();
  }

  setView(view: CalendarView) {
    this.view = view;
  }


  onClickLogout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }
}
