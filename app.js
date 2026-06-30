const API_URL = 'http://localhost:8080/api/jugadores';

let editId = null;

async function cargar() {
  const res = await fetch(API_URL);
  const jugadores = await res.json();
  const tbody = document.getElementById('tabla-body');
  tbody.innerHTML = jugadores.map(j => `
    <tr>
      <td>${j.nombre}</td>
      <td>${j.posicion}</td>
      <td>${j.equipo}</td>
      <td>${j.numero}</td>
      <td>${j.goles}</td>
      <td>
        <button class="edit" onclick="editar(${j.id})">Editar</button>
        <button class="del" onclick="eliminar(${j.id})">Eliminar</button>
      </td>
    </tr>
  `).join('');
  window._jugadores = jugadores;
}

async function guardar() {
  const datos = {
    nombre: document.getElementById('f-nombre').value,
    posicion: document.getElementById('f-posicion').value,
    equipo: document.getElementById('f-equipo').value,
    numero: parseInt(document.getElementById('f-numero').value) || 0,
    goles: parseInt(document.getElementById('f-goles').value) || 0
  };

  if (editId) {
    await fetch(`${API_URL}/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    editId = null;
  } else {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
  }

  limpiar();
  cargar();
}

function editar(id) {
  const j = window._jugadores.find(x => x.id === id);
  document.getElementById('f-nombre').value = j.nombre;
  document.getElementById('f-posicion').value = j.posicion;
  document.getElementById('f-equipo').value = j.equipo;
  document.getElementById('f-numero').value = j.numero;
  document.getElementById('f-goles').value = j.goles;
  editId = id;
}

async function eliminar(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  cargar();
}

function limpiar() {
  document.getElementById('f-nombre').value = '';
  document.getElementById('f-posicion').value = '';
  document.getElementById('f-equipo').value = '';
  document.getElementById('f-numero').value = '';
  document.getElementById('f-goles').value = '';
}

document.getElementById('btn-guardar').addEventListener('click', guardar);

cargar();
