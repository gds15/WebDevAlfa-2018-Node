const {sequelize, Usuario} = require('../models');
const {generateToken} = require("../utils/token");


function cadastro(request, response, next) {
	Usuario.create(request.body)

	.then( usuario => {
        response.status(201).json(usuario)
    })
    .catch( ex => {
        console.error(ex);
        response.status(412).send('erro ao cadastrar o usuario')
    })
}

function buscaPorId(request, response, next) {
	Usuario.findById(usuarioId)
    .then(usuario => {
        response.status(200).json(usuario)
    })
    .catch(ex=>{
        console.error(ex)
        response.status(412).send('usuario não encontrado')
    })
}

function edicao(request, response, next) {
	Usuario.findById(usuarioId)
    .then( usuario => {
        if (!usuario){
            response.status(404).send('esse usuario não existe')
        }else{
            return usuario.update({
                nome, email, cpf, nascimento, senha
            })
            .then(()=>{
                response.status(200).json(usuario)
            })
        }
    })
    .catch(ex=>{
        console.error(ex)
        response.status(412).send('não foi possível realizar o update')
    })
}

function login(request, response, next) {
	const {body:{ email, senha }} = request

    Usuario.findOne({
        where:{
            email
        }
    })
    .then(usuario => {
        if( (usuario !== null) || bcrypt.compareSync(senha, usuario.senha))
        {
            const token = gerarToken(usuario);
            response.status(200).cookie('token',token).send('usuário logado');
        }
        else
        {
            response.status(401).send('E-mail ou senha inválidos');
        }
    })
    .catch(ex=>{
        console.error(ex)
        response.status(412).send('erro ao acessar o banco de dados')
    })
}

module.exports = {
    cadastro,
    buscaPorId,
    edicao,
    login,
};
