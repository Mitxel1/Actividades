class ReporteBuilder {
    constructor() {
        this.reporte = {
            recursos: [],
            problemas: [],
            soluciones: []
        };
    }
  
    setActividad(actividadId) {
        this.reporte.actividad = actividadId;
        return this;
    }

    setTitulo(titulo) {
        this.reporte.titulo = titulo;
        return this;
    }
  
    setContenido(contenido) {
        this.reporte.contenido = contenido;
        return this;
    }
  
    addRecurso(recurso) {
        this.reporte.recursos.push(recurso);
        return this;
    }
  
    addProblema(problema) {
        this.reporte.problemas.push(problema);
        return this;
    }
  
    addSolucion(solucion) {
        this.reporte.soluciones.push(solucion);
        return this;
    }
  
    setCreadoPor(usuarioId) {
        this.reporte.creadoPor = usuarioId;
        return this;
    }
  
    build() {
        return this.reporte;
    }
  }
  
  module.exports = ReporteBuilder;
  