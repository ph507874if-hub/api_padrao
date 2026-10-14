from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from models import Base, Usuario, Produto, Pedido


app = Flask(__name__)
CORS(app)


# =========================
# BANCO DE DADOS
# =========================

engine = create_engine("sqlite:///database.db")

Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)


# =========================
# ROTAS PARA SERVIR OS ARQUIVOS HTML
# =========================

@app.route("/")
def index():
    return send_from_directory(".", "usuarios.html")  # Altere para o arquivo principal que deseja abrir na raiz

@app.route("/usuarios.html")
def pagina_usuarios():
    return send_from_directory(".", "usuarios.html")

@app.route("/usuariEditar.html")
def pagina_editar_usuario():
    return send_from_directory(".", "usuariEditar.html")

# (Caso você crie páginas para produtos ou pedidos no futuro, basta seguir o mesmo padrão abaixo):
# @app.route("/produtos.html")
# def pagina_produtos():
#     return send_from_directory(".", "produtos.html")


# =========================
# PRODUTOS
# =========================

@app.route("/produtos", methods=["GET"])
def get_produtos():
    s = Session()
    produtos = s.query(Produto).all()
    return jsonify([
        {
            "id": p.id,
            "nome": p.nome,
            "preco": p.preco,
            "quantidade": p.quantidade
        }
        for p in produtos
    ])

@app.route("/produtos/<int:id>", methods=["GET"])
def get_produto_unico(id):
    s = Session()
    produto = s.get(Produto, id)
    if not produto:
        return jsonify({"mensagem": "Produto não encontrado!"}), 404
    return jsonify({
        "id": produto.id,
        "nome": produto.nome,
        "preco": produto.preco,
        "quantidade": produto.quantidade
    })

@app.route("/produtos", methods=["POST"])
def add_produto():
    s = Session()
    data = request.json
    produto = Produto(
        nome=data["nome"],
        preco=data["preco"],
        quantidade=data["quantidade"]
    )
    s.add(produto)
    s.commit()
    return jsonify({
        "mensagem": "Produto cadastrado com sucesso!",
        "id": produto.id
    }), 201

@app.route("/produtos/<int:id>", methods=["PUT"])
def atualizar_produto(id):
    s = Session()
    produto = s.get(Produto, id)
    if not produto:
        return jsonify({"mensagem": "Produto não encontrado!"}), 404
    data = request.json
    produto.nome = data["nome"]
    produto.preco = data["preco"]
    produto.quantidade = data["quantidade"]
    s.commit()
    return jsonify({
        "mensagem": "Produto atualizado com sucesso!"
    })

@app.route("/produtos/<int:id>", methods=["DELETE"])
def deletar_produto(id):
    s = Session()
    produto = s.get(Produto, id)
    if not produto:
        return jsonify({"mensagem": "Produto não encontrado!"}), 404
    s.delete(produto)
    s.commit()
    return jsonify({
        "mensagem": "Produto deletado com sucesso!"
    })


# =========================
# USUÁRIOS
# =========================

@app.route("/usuarios", methods=["GET"])
def get_usuarios():
    s = Session()
    usuarios = s.query(Usuario).all()
    return jsonify([
        {
            "id": u.id,
            "nome": u.nome,
            "email": u.email,
            "idade": u.idade,
            "altura": u.altura
        }
        for u in usuarios
    ])

@app.route("/usuarios/<int:id>", methods=["GET"])
def get_usuario_unico(id):
    s = Session()
    usuario = s.get(Usuario, id)
    if not usuario:
        return jsonify({"mensagem": "Usuário não encontrado!"}), 404
    return jsonify({
        "id": usuario.id,
        "nome": usuario.nome,
        "email": usuario.email,
        "idade": usuario.idade,
        "altura": usuario.altura
    })

@app.route("/usuarios", methods=["POST"])
def add_usuario():
    s = Session()
    data = request.json
    usuario = Usuario(
        nome=data["nome"],
        email=data["email"],
        idade=data["idade"],
        altura=data["altura"]
    )
    s.add(usuario)
    s.commit()
    return jsonify({
        "mensagem": "Usuário cadastrado com sucesso!",
        "id": usuario.id
    }), 201

@app.route("/usuarios/<int:id>", methods=["PUT"])
def atualizar_usuario(id):
    s = Session()
    usuario = s.get(Usuario, id)
    if not usuario:
        return jsonify({"mensagem": "Usuário não encontrado!"}), 404
    data = request.json
    usuario.nome = data["nome"]
    usuario.email = data["email"]
    usuario.idade = data["idade"]
    usuario.altura = data["altura"]
    s.commit()
    return jsonify({
        "mensagem": "Usuário atualizado com sucesso!"
    })

@app.route("/usuarios/<int:id>", methods=["DELETE"])
def deletar_usuario(id):
    s = Session()
    usuario = s.get(Usuario, id)
    if not usuario:
        return jsonify({"mensagem": "Usuário não encontrado!"}), 404
    s.delete(usuario)
    s.commit()
    return jsonify({
        "mensagem": "Usuário deletado com sucesso!"
    })


# =========================
# PEDIDOS
# =========================

@app.route("/pedidos", methods=["GET"])
def get_pedidos():
    s = Session()
    pedidos = s.query(Pedido).all()
    return jsonify([
        {
            "id": ped.id,
            "usuario_id": ped.usuario_id,
            "usuario_nome": ped.usuario.nome if ped.usuario else None,
            "produto_id": ped.produto_id,
            "produto_nome": ped.produto.nome if ped.produto else None,
            "quantidade": ped.quantidade,
            "total": ped.total
        }
        for ped in pedidos
    ])

@app.route("/pedidos/<int:id>", methods=["GET"])
def get_pedido_unico(id):
    s = Session()
    pedido = s.get(Pedido, id)
    if not pedido:
        return jsonify({"mensagem": "Pedido não encontrado!"}), 404
    return jsonify({
        "id": pedido.id,
        "usuario_id": pedido.usuario_id,
        "usuario_nome": pedido.usuario.nome if pedido.usuario else None,
        "produto_id": pedido.produto_id,
        "produto_nome": pedido.produto.nome if pedido.produto else None,
        "quantidade": pedido.quantidade,
        "total": pedido.total
    })

@app.route("/pedidos", methods=["POST"])
def add_pedido():
    s = Session()
    data = request.json
    usuario = s.get(Usuario, data["usuario_id"])
    if not usuario:
        return jsonify({"mensagem": "Usuário não encontrado!"}), 404
    produto = s.get(Produto, data["produto_id"])
    if not produto:
        return jsonify({"mensagem": "Produto não encontrado!"}), 404
    quantidade = data["quantidade"]
    total = produto.preco * quantidade
    pedido = Pedido(
        usuario_id=usuario.id,
        produto_id=produto.id,
        quantidade=quantidade,
        total=total
    )
    s.add(pedido)
    s.commit()
    return jsonify({
        "mensagem": "Pedido cadastrado com sucesso!",
        "id": pedido.id,
        "total": total
    }), 201

@app.route("/pedidos/<int:id>", methods=["PUT"])
def atualizar_pedido(id):
    s = Session()
    pedido = s.get(Pedido, id)
    if not pedido:
        return jsonify({"mensagem": "Pedido não encontrado!"}), 404
    data = request.json
    usuario = s.get(Usuario, data["usuario_id"])
    if not usuario:
        return jsonify({"mensagem": "Usuário não encontrado!"}), 404
    produto = s.get(Produto, data["produto_id"])
    if not produto:
        return jsonify({"mensagem": "Produto não encontrado!"}), 404
    pedido.usuario_id = usuario.id
    pedido.produto_id = produto.id
    pedido.quantidade = data["quantidade"]
    pedido.total = produto.preco * data["quantidade"]
    s.commit()
    return jsonify({
        "mensagem": "Pedido atualizado com sucesso!",
        "total": pedido.total
    })

@app.route("/pedidos/<int:id>", methods=["DELETE"])
def deletar_pedido(id):
    s = Session()
    pedido = s.get(Pedido, id)
    if not pedido:
        return jsonify({"mensagem": "Pedido não encontrado!"}), 404
    s.delete(pedido)
    s.commit()
    return jsonify({
        "mensagem": "Pedido deletado com sucesso!"
    })


# =========================
# INICIAR SERVIDOR
# =========================

if __name__ == "__main__":
    app.run(debug=True)