const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    const data = req.body;

    const item = await prisma.estadia.create({
        data
    });

    res.status(201).json(item);
};

const listar = async (req, res) => {
    const lista = await prisma.estadia.findMany({
        include: {
            automovel: true
        }
    });

    res.status(200).json(lista);
};

const buscar = async (req, res) => {
    const { id } = req.params;
    
    const item = await prisma.estadia.findUnique({
        where: { id: Number(id) },
        include: {
            automovel: true
        }
    });

    res.status(200).json(item);
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const dados = req.body;

    const estadiaAtual = await prisma.estadia.findUnique({
        where: { id: Number(id) }
    });

    if (dados.saida) {

        const entrada = new Date(estadiaAtual.entrada);
        const saida = new Date(dados.saida);

        const diferencaMs = saida - entrada;

        const horas = diferencaMs / (1000 * 60 * 60);

        dados.valorTotal = horas * estadiaAtual.valorHora;
    }
    
    const item = await prisma.estadia.update({
        where: { id: Number(id) },
        data: dados
    });

    res.status(200).json(item);
};

const excluir = async (req, res) => {
    const { id } = req.params;
    
    const item = await prisma.estadia.delete({
        where: { id: Number(id) }
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