/** Cria o banco de dados, chamado de quiz **/
CREATE SCHEMA gamification;

/** Antes de criar tabela, inserir, buscar ou atualizar, utiliza-se o comando abaixo (somente aqui no workbech). Esse comando serve para informar ao programa qual é o banco
que ele deve utilizar para realizar comandos do MySQL **/
USE gamification;

/** Cria a tabela usuario **/
create table usuario(
    idUser int auto_increment,
    nome varchar(255),
    email varchar(100),
    senha varchar(40),
    matricula varchar(10),
    userIDHabi varchar(36),
    tokenHabi varchar(36),
    userGit varchar(40),
    userFacebook BIGINT,
    constraint idUser primary key (idUser,matricula)
);
/** Cria a tabela categoria **/
create table categoria(
    idCategoria int,
    nomeCategoria varchar(100),
    constraint idCategoria primary key (idCategoria)
);

/** Cria a tabela status_tarefa **/
create table status_tarefa(
    idStatusT int,
    nomeStatus varchar(100),
    constraint idStatusT primary key (idStatusT)
);

/** Cria a tabela tag **/
create table tag(
    idTag int,
    nomeTag varchar(100),
    constraint idTag primary key (idTag,nomeTag)
);


/** Cria a tabela tarefa **/
create table tarefa(
    idTarefa int auto_increment,
    titulo VARCHAR(100),
    descricao VARCHAR(255),
    pontuacao int,
    idStatusT int,
    idUserCriador int,
    dataCriacao varchar(10),
    dataLimite varchar(10),
    constraint idStatusT foreign key (idStatusT) references status_tarefa(idStatusT),
    constraint idUserCriador foreign key (idUserCriador) references usuario(idUser),
    constraint idTarefa primary key (idTarefa)
);


/** Cria a tabela categoria_tarefa **/
create table categoria_tarefa(
    idTarefa int,
    idCategoria int,
    constraint TarefaCat primary key (idTarefa,idCategoria),
    constraint idTarefa foreign key (idTarefa) references tarefa(idTarefa),
    constraint idCategoria foreign key (idCategoria) references categoria(idCategoria)
);

/** Cria a tabela registro **/
create table registro(
    idTarefa int,
    idStatusT int,
    idUserResp int,
    constraint TarefaRespons primary key (idTarefa,idUserResp),
    constraint idTarefaR foreign key (idTarefa) references tarefa(idTarefa),
    constraint idUserResp foreign key (idUserResp) references usuario(idUser),
    constraint idStatusTarefa foreign key (idStatusT) references status_tarefa(idStatusT)
);

/** Cria a tabela post **/
create table post(
    idPost int,
    titulo varchar(100),
    idAutor int,
    endPost varchar(255),
    constraint idPost primary key (idPost),
    constraint idAutor foreign key (idAutor) references usuario(idUser)
);

/** Cria a tabela tags_post **/
create table tags_post(
    idPost int,
    idTag int,
    constraint idPostTag primary key (idPost,idTag),
    constraint idPostT foreign key (idPost) references post(idPost),
    constraint idTagP foreign key (idTag) references tag(idTag)
);
