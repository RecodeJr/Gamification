/** Cria o banco de dados, chamado de quiz **/
CREATE SCHEMA gamification;

/** Antes de criar tabela, inserir, buscar ou atualizar, utiliza-se o comando abaixo (somente aqui no workbech). Esse comando serve para informar ao programa qual é o banco
que ele deve utilizar para realizar comandos do MySQL **/
USE gamification;


/** Cria a tabela classe **/
create table classe(
    idClasse int auto_increment,
    nomeClasse varchar(100) NOT NULL,
    pontuacaoMinima float NOT NULL DEFAULT 0.0,
    pontosNivelAcima float NOT NULL DEFAULT 0.0,
    pontosNivelAtual float NOT NULL DEFAULT 0.0,
    pontosNivelAbaixo float NOT NULL DEFAULT 0.0,
    constraint idClasseNome primary key (idClasse,nomeClasse)
);

/** Cria a tabela sexo **/
create table sexo(
    idSexo int auto_increment,
    nomeSexo varchar(40) NOT NULL,
    constraint idSexo primary key(idSexo,nomeSexo)
);


/** Cria a tabela usuario **/
create table usuario(
    idUser int auto_increment,
    nome varchar(255) NOT NULL,
    email varchar(100) NOT NULL,
    senha varchar(40) NOT NULL,
    sexo int NOT NULL,
    ativado bool NOT NULL DEFAULT 0,
    dataIngresso varchar(10) NOT NULL,
    matricula varchar(10) NOT NULL,
    userIDHabi varchar(36),
    tokenHabi varchar(36),
    userGit varchar(40) NOT NULL,
    userFacebook BIGINT,
    CONSTRAINT uc_usuario UNIQUE (email),
    constraint idUser primary key (idUser,matricula),
    constraint sexo foreign key (sexo) references sexo(idSexo)
);
/** Cria a tabela categoria **/
create table categoria(
    idCategoria int auto_increment,
    nomeCategoria varchar(100) NOT NULL,
    constraint idCategoria primary key (idCategoria)
);

/** Cria a tabela status_tarefa **/
create table status_tarefa(
    idStatusT int auto_increment,
    nomeStatus varchar(100) NOT NULL,
    constraint idStatusT primary key (idStatusT)
);

/** Cria a tabela tag **/
create table tag(
    idTag int auto_increment,
    nomeTag varchar(100) NOT NULL,
    constraint idTag primary key (idTag,nomeTag)
);


/** Cria a tabela tarefa **/
create table tarefa(
    idTarefa int auto_increment,
    titulo VARCHAR(100) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    idClasse int NOT NULL,
    idStatusT int NOT NULL,
    idUserCriador int NOT NULL,
    tarefaFixa bool NOT NULL DEFAULT 0,
    pontuacaoBonus float DEFAULT 0,
    dataCriacao varchar(10) NOT NULL,
    dataLimite varchar(10),
    constraint idStatusT foreign key (idStatusT) references status_tarefa(idStatusT),
    constraint idClasseT foreign key (idClasse) references classe(idClasse),
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
    idRegistro int auto_increment,
    idTarefa int NOT NULL,
    idStatusT int NOT NULL,
    idUserResp int NOT NULL,
    constraint idRegistro primary key (idRegistro),
    constraint idTarefaR foreign key (idTarefa) references tarefa(idTarefa),
    constraint idUserResp foreign key (idUserResp) references usuario(idUser),
    constraint idStatusTarefa foreign key (idStatusT) references status_tarefa(idStatusT)
);

/** Cria a tabela post **/
create table post(
    idPost int auto_increment,
    titulo varchar(100) NOT NULL,
    idAutor int NOT NULL,
    dataPost varchar(10) NOT NULL,
    endPost varchar(255) NOT NULL,
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

/** Insere os Sexos **/
INSERT INTO `gamification`.`sexo` (`idSexo`, `nomeSexo`) VALUES ('1', 'Masculino');
INSERT INTO `gamification`.`sexo` (`idSexo`, `nomeSexo`) VALUES ('2', 'Feminino');

/** Insere as Classes **/
INSERT INTO `gamification`.`classe` (`nomeClasse`, `pontuacaoMinima`, `pontosNivelAcima`, `pontosNivelAtual`, `pontosNivelAbaixo`) VALUES ('NewBie', '0', '0', '0', '0');
INSERT INTO `gamification`.`classe` (`nomeClasse`, `pontuacaoMinima`, `pontosNivelAcima`, `pontosNivelAtual`, `pontosNivelAbaixo`) VALUES ('Trainee', '100', '5', '10', '30');
INSERT INTO `gamification`.`classe` (`nomeClasse`, `pontuacaoMinima`, `pontosNivelAcima`, `pontosNivelAtual`, `pontosNivelAbaixo`) VALUES ('Estagiario', '300', '30', '70', '100');
INSERT INTO `gamification`.`classe` (`nomeClasse`, `pontuacaoMinima`, `pontosNivelAcima`, `pontosNivelAtual`, `pontosNivelAbaixo`) VALUES ('Junior', '500', '30', '100', '150');
INSERT INTO `gamification`.`classe` (`nomeClasse`, `pontuacaoMinima`, `pontosNivelAcima`, `pontosNivelAtual`, `pontosNivelAbaixo`) VALUES ('Pleno', '700', '20', '150', '200');
INSERT INTO `gamification`.`classe` (`nomeClasse`, `pontuacaoMinima`, `pontosNivelAcima`, `pontosNivelAtual`, `pontosNivelAbaixo`) VALUES ('Senior', '900', '50', '200', '250');
INSERT INTO `gamification`.`classe` (`nomeClasse`, `pontuacaoMinima`, `pontosNivelAcima`, `pontosNivelAtual`, `pontosNivelAbaixo`) VALUES ('Master', '1500', '100', '250', '400');
INSERT INTO `gamification`.`classe` (`nomeClasse`, `pontuacaoMinima`, `pontosNivelAcima`, `pontosNivelAtual`, `pontosNivelAbaixo`) VALUES ('Gold', '3000', '200', '500', '1000');
INSERT INTO `gamification`.`classe` (`nomeClasse`, `pontuacaoMinima`, `pontosNivelAcima`, `pontosNivelAtual`, `pontosNivelAbaixo`) VALUES ('Diamond', '6000', '0', '0', '2000');

/** Insere as Categorias **/
