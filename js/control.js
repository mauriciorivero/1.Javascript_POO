include("Persona.js");
include("GestorPersonas.js");
include("Proyecto.js");
include("Departamento.js");


// Crear algunas personas
const persona1 = new Persona("P001", "Juan", "Pérez", new Date(1990, 5, 15), "Masculino", "Desarrollador");
const persona2 = new Persona("P002", "María", "González", new Date(1985, 10, 22), "Femenino", "Diseñadora");
const persona3 = new Persona("P003", "Carlos", "Rodríguez", new Date(1992, 2, 8), "Masculino", "Desarrollador");

// Crear un gestor de personas y agregar las personas
const gestor = new GestorPersonas();
gestor.agregarPersona(persona1);
gestor.agregarPersona(persona2);
gestor.agregarPersona(persona3);

// Crear un departamento y asignar personas
const departamento = new Departamento("D001", "Desarrollo");
departamento.agregarMiembro(persona1);
departamento.agregarMiembro(persona3);

// Crear un proyecto y asignar participantes con roles
const proyecto = new Proyecto("PR001", "Sistema de Gestión", new Date(2025, 0, 1));
proyecto.agregarParticipante(persona1, "Programador");
proyecto.agregarParticipante(persona2, "Diseñador UX");
proyecto.agregarParticipante(persona3, "Tester");

// Demostración de uso
console.log(`Total de personas en el sistema: ${gestor.contarPersonas()}`);
console.log(`Desarrolladores en el sistema: ${gestor.buscarPorCargo("Desarrollador").length}`);

console.log(`\nMiembros del departamento ${departamento.getNombre()}: ${departamento.contarMiembros()}`);
departamento.getMiembros().forEach(persona => {
    console.log(`- ${persona.getNombreCompleto()}, ${persona.getCargo()}`);
});

console.log(`\nParticipantes del proyecto ${proyecto.getNombre()}: ${proyecto.contarParticipantes()}`);
proyecto.getParticipantes().forEach(p => {
    console.log(`- ${p.persona.getNombreCompleto()}, Rol: ${p.rol}`);
});