include("Persona.js");
include("GestorPersonas.js");
include("Proyecto.js");
include("Departamento.js");


// Inicialización de clases
// Crear un gestor de personas global
const gestor = new GestorPersonas();

// Crear algunas personas de ejemplo
const persona1 = new Persona("P001", "Juan", "Pérez", new Date(1990, 5, 15), "Masculino", "Desarrollador");
const persona2 = new Persona("P002", "María", "González", new Date(1985, 10, 22), "Femenino", "Diseñadora");
const persona3 = new Persona("P003", "Carlos", "Rodríguez", new Date(1992, 2, 8), "Masculino", "Desarrollador");

// Agregar las personas al gestor
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

// Función para formatear fecha para mostrar en la tabla
function formatDate(date) {
    return date.toLocaleDateString();
}

// Función para convertir string a Date desde un input date
function parseInputDate(dateString) {
    return new Date(dateString);
}

// Función para cargar la lista de personas en la tabla
function loadPersonasTable() {
    const personasList = document.getElementById('personas-list');
    personasList.innerHTML = '';
    
    const personas = gestor.obtenerTodas();
    
    if (personas.length === 0) {
        personasList.innerHTML = '<tr><td colspan="7">No hay personas registradas</td></tr>';
        return;
    }
    
    personas.forEach(persona => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${persona.getCodigo()}</td>
            <td>${persona.getNombre()}</td>
            <td>${persona.getApellido()}</td>
            <td>${formatDate(persona.getFechaNacimiento())}</td>
            <td>${persona.getGenero()}</td>
            <td>${persona.getCargo()}</td>
            <td>
                <button class="edit-btn" data-codigo="${persona.getCodigo()}">Editar</button>
                <button class="delete-btn" data-codigo="${persona.getCodigo()}">Eliminar</button>
            </td>
        `;
        
        personasList.appendChild(row);
    });
    
    // Agregar event listeners a los botones de acción
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const codigo = this.getAttribute('data-codigo');
            loadPersonaForEdit(codigo);
            
            // Cambiar a la pestaña de edición
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.querySelector('[data-tab="edit-persona"]').classList.add('active');
            document.getElementById('edit-persona').classList.add('active');
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const codigo = this.getAttribute('data-codigo');
            if (confirm(`¿Está seguro de eliminar la persona con código ${codigo}?`)) {
                gestor.eliminarPersona(codigo);
                loadPersonasTable();
                loadPersonasSelect(); // Actualizar el select de personas
            }
        });
    });
}

// Función para cargar el select de personas en el formulario de edición
function loadPersonasSelect() {
    const personaSelect = document.getElementById('persona-select');
    personaSelect.innerHTML = '<option value="">Seleccione una persona...</option>';
    
    const personas = gestor.obtenerTodas();
    
    personas.forEach(persona => {
        const option = document.createElement('option');
        option.value = persona.getCodigo();
        option.textContent = `${persona.getCodigo()} - ${persona.getNombreCompleto()}`;
        personaSelect.appendChild(option);
    });
}

// Función para cargar los datos de una persona en el formulario de edición
function loadPersonaForEdit(codigo) {
    const persona = gestor.buscarPorCodigo(codigo);
    
    if (!persona) {
        alert('Persona no encontrada');
        return;
    }
    
    document.getElementById('edit-codigo').value = persona.getCodigo();
    document.getElementById('edit-nombre').value = persona.getNombre();
    document.getElementById('edit-apellido').value = persona.getApellido();
    
    // Formatear la fecha para el input date (YYYY-MM-DD)
    const fechaNac = persona.getFechaNacimiento();
    const year = fechaNac.getFullYear();
    const month = String(fechaNac.getMonth() + 1).padStart(2, '0');
    const day = String(fechaNac.getDate()).padStart(2, '0');
    document.getElementById('edit-fechaNacimiento').value = `${year}-${month}-${day}`;
    
    document.getElementById('edit-genero').value = persona.getGenero();
    document.getElementById('edit-cargo').value = persona.getCargo();
    
    // Actualizar el select
    document.getElementById('persona-select').value = codigo;
}

// Event Listeners para formularios y botones
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos iniciales
    loadPersonasTable();
    loadPersonasSelect();
    
    // Formulario de creación de persona
    document.getElementById('persona-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const codigo = document.getElementById('codigo').value;
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const fechaNacimiento = parseInputDate(document.getElementById('fechaNacimiento').value);
        const genero = document.getElementById('genero').value;
        const cargo = document.getElementById('cargo').value;
        
        // Validar que no exista una persona con el mismo código
        if (gestor.buscarPorCodigo(codigo)) {
            alert(`Ya existe una persona con el código ${codigo}`);
            return;
        }
        
        // Crear y agregar la persona
        const nuevaPersona = new Persona(codigo, nombre, apellido, fechaNacimiento, genero, cargo);
        gestor.agregarPersona(nuevaPersona);
        
        // Actualizar la UI
        loadPersonasTable();
        loadPersonasSelect();
        
        // Limpiar el formulario
        this.reset();
        
        // Cambiar a la pestaña de visualización
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.querySelector('[data-tab="view-personas"]').classList.add('active');
        document.getElementById('view-personas').classList.add('active');
        
        alert('Persona creada exitosamente');
    });
    
    // Select de personas para edición
    document.getElementById('persona-select').addEventListener('change', function() {
        const codigo = this.value;
        if (codigo) {
            loadPersonaForEdit(codigo);
        } else {
            document.getElementById('edit-persona-form').reset();
        }
    });
    
    // Formulario de edición de persona
    document.getElementById('edit-persona-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const codigo = document.getElementById('edit-codigo').value;
        const persona = gestor.buscarPorCodigo(codigo);
        
        if (!persona) {
            alert('Persona no encontrada');
            return;
        }
        
        // Actualizar datos de la persona
        persona.setNombre(document.getElementById('edit-nombre').value);
        persona.setApellido(document.getElementById('edit-apellido').value);
        persona.setFechaNacimiento(parseInputDate(document.getElementById('edit-fechaNacimiento').value));
        persona.setGenero(document.getElementById('edit-genero').value);
        persona.setCargo(document.getElementById('edit-cargo').value);
        
        // Actualizar la UI
        loadPersonasTable();
        loadPersonasSelect();
        
        // Cambiar a la pestaña de visualización
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.querySelector('[data-tab="view-personas"]').classList.add('active');
        document.getElementById('view-personas').classList.add('active');
        
        alert('Persona actualizada exitosamente');
    });
    
    // Botón de eliminar persona
    document.getElementById('delete-persona').addEventListener('click', function() {
        const codigo = document.getElementById('edit-codigo').value;
        
        if (!codigo) {
            alert('Seleccione una persona para eliminar');
            return;
        }
        
        if (confirm(`¿Está seguro de eliminar la persona con código ${codigo}?`)) {
            gestor.eliminarPersona(codigo);
            
            // Actualizar la UI
            loadPersonasTable();
            loadPersonasSelect();
            
            // Limpiar el formulario
            document.getElementById('edit-persona-form').reset();
            
            // Cambiar a la pestaña de visualización
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.querySelector('[data-tab="view-personas"]').classList.add('active');
            document.getElementById('view-personas').classList.add('active');
            
            alert('Persona eliminada exitosamente');
        }
    });
});