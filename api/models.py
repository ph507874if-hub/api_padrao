from sqlalchemy import Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True)
    nome = Column(String)
    email = Column(String)
    idade = Column(Integer)
    altura = Column(Float)

    pedidos = relationship("Pedido", back_populates="usuario")


class Produto(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True)
    nome = Column(String)
    preco = Column(Float)
    quantidade = Column(Integer)

    pedidos = relationship("Pedido", back_populates="produto")


class Pedido(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True)

    usuario_id = Column(
        Integer,
        ForeignKey("usuarios.id")
    )

    produto_id = Column(
        Integer,
        ForeignKey("produtos.id")
    )

    quantidade = Column(Integer)
    total = Column(Float)

    usuario = relationship(
        "Usuario",
        back_populates="pedidos"
    )

    produto = relationship(
        "Produto",
        back_populates="pedidos"
    )