const API_URL = "http://127.0.0.1:5000"; 

async function carregarTodosUsuarios() {
  try {
    const response = await fetch(`${API_URL}/usuarios`); 
    if (!response.ok) throw new Error("Erro ao carregar usuários");
    
    const usuarios = await response.json(); 
    const tbody = document.querySelector("#tabelaUsuarios tbody"); 
    tbody.innerHTML = "";

    usuarios.forEach(user => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${user.id}</td>
        <td>${user.nome}</td>
        <td>${user.email}</td>
        <td>${user.altura}</td>
        <td>${user.idade}</td>
        <td>
          <button
            class="btn btn-warning"
            onclick="editarUsuario(${user.id})">
            Editar
          </button>
          
          <button
            class="btn btn-danger"
            onclick="deletarUsuario(${user.id})">
            Apagar
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    alert("Erro: " + error.message);
  }
}

async function editarUsuario(userID) {
  // Redireciona para a página de edição levando o ID na URL
  window.location.href = `usuariEditar.html?id=${userID}`;
}

async function deletarUsuario(userID) {
  if (!confirm("Tem certeza que deseja apagar este usuário?")) return;

  try {
    const response = await fetch(`${API_URL}/usuarios/${userID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    }); 

    if (!response.ok) throw new Error("Erro ao deletar usuário");
   
    carregarTodosUsuarios();
  } catch (error) {
    alert("Erro: " + error.message);
  }
}

carregarTodosUsuarios();