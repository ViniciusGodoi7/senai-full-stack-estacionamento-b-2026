const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    const data = req.body;

    const item = await prisma.automovel.create({
        data
    });

    res.status(201).json(item);
};

const listar = async (req, res) => {
    const lista = await prisma.automovel.findMany({
        include: {
            estadias: true
        }
    });

    res.status(200).json(lista);
};

const buscar = async (req, res) => {
    const { placa } = req.params;
    
    const item = await prisma.automovel.findUnique({
        where: { placa },
        include: {
            estadias: true
        }
    });

    res.status(200).json(item);
};

const atualizar = async (req, res) => {
    const { placa } = req.params;
    const dados = req.body;
    
    const item = await prisma.automovel.update({
        where: { placa },
        data: dados
    });

    res.status(200).json(item);
};

const excluir = async (req, res) => {
    const { placa } = req.params;
    
    const item = await prisma.automovel.delete({
        where: { placa }
    });

    res.status(200).json(item);
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
}