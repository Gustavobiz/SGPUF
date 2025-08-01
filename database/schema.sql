-- MySQL Script generated by MySQL Workbench
-- sáb 05 jul 2025 16:59:05
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema sgpuf_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema sgpuf_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `sgpuf_db` DEFAULT CHARACTER SET utf8 ;
USE `sgpuf_db` ;

-- -----------------------------------------------------
-- Table `sgpuf_db`.`Funcionário`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sgpuf_db`.`Funcionário` ;

CREATE TABLE IF NOT EXISTS `sgpuf_db`.`Funcionário` (
  `idFuncionário` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `endereco` VARCHAR(200) NOT NULL,
  `Email` VARCHAR(45) NOT NULL,
  `Telefone` VARCHAR(45) NULL,
  `senha` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idFuncionário`),
  UNIQUE INDEX `Email_UNIQUE` (`Email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sgpuf_db`.`Engenheiro`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sgpuf_db`.`Engenheiro` ;

CREATE TABLE IF NOT EXISTS `sgpuf_db`.`Engenheiro` (
  `Funcionário_idFuncionário` INT NOT NULL,
  PRIMARY KEY (`Funcionário_idFuncionário`),
  CONSTRAINT `fk_Engenheiro_Funcionário`
    FOREIGN KEY (`Funcionário_idFuncionário`)
    REFERENCES `sgpuf_db`.`Funcionário` (`idFuncionário`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)
ENGINE = InnoDB;



-- -----------------------------------------------------
-- Table `sgpuf_db`.`Gerente`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sgpuf_db`.`Gerente` ;

CREATE TABLE IF NOT EXISTS `sgpuf_db`.`Gerente` (
  `Funcionário_idFuncionário` INT NOT NULL,
  INDEX `fk_Gerente_Funcionário1_idx` (`Funcionário_idFuncionário` ASC) VISIBLE,
  PRIMARY KEY (`Funcionário_idFuncionário`),
  CONSTRAINT `fk_Gerente_Funcionário1`
    FOREIGN KEY (`Funcionário_idFuncionário`)
    REFERENCES `sgpuf_db`.`Funcionário` (`idFuncionário`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sgpuf_db`.`Estagiário`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sgpuf_db`.`Estagiário` ;

CREATE TABLE IF NOT EXISTS `sgpuf_db`.`Estagiário` (
  `Funcionário_idFuncionário` INT NOT NULL,
  INDEX `fk_Estagiário_Funcionário1_idx` (`Funcionário_idFuncionário` ASC) VISIBLE,
  PRIMARY KEY (`Funcionário_idFuncionário`),
  CONSTRAINT `fk_Estagiário_Funcionário1`
    FOREIGN KEY (`Funcionário_idFuncionário`)
    REFERENCES `sgpuf_db`.`Funcionário` (`idFuncionário`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sgpuf_db`.`Unidade Consumidora`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sgpuf_db`.`Unidade Consumidora` ;

CREATE TABLE IF NOT EXISTS `sgpuf_db`.`Unidade Consumidora` (
 `NumeroID` INT NOT NULL AUTO_INCREMENT,
  `Longitude` VARCHAR(45) NULL,
  `Latitude` VARCHAR(45) NULL,
  `TipoCabo` VARCHAR(45) NULL,
  `Nome` VARCHAR(45) NULL,
  `Potência` VARCHAR(45) NULL,
  `Bitola` VARCHAR(45) NULL,
  PRIMARY KEY (`NumeroID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sgpuf_db`.`Cliente`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sgpuf_db`.`Cliente` ;

CREATE TABLE IF NOT EXISTS `sgpuf_db`.`Cliente` (
  `CPF` VARCHAR(11) NOT NULL,
  `endereco` VARCHAR(200) NULL,
  `Nome` VARCHAR(45) NULL,
  `codigoCliente` VARCHAR(15) NOT NULL UNIQUE,
  PRIMARY KEY (`CPF`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sgpuf_db`.`Concessionária`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sgpuf_db`.`Concessionária` ;

CREATE TABLE IF NOT EXISTS `sgpuf_db`.`Concessionária` (
  `CNPJ` VARCHAR(14) NOT NULL,
  `telefone` VARCHAR(45) NULL,
  `endereço` VARCHAR(45) NULL,
  `razaosocial` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  PRIMARY KEY (`CNPJ`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sgpuf_db`.`Projeto`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sgpuf_db`.`Projeto` ;

CREATE TABLE IF NOT EXISTS `sgpuf_db`.`Projeto` (
  `idProjeto` INT NOT NULL AUTO_INCREMENT,
  `Status` VARCHAR(45) NOT NULL,
  `Nome` VARCHAR(45) NOT NULL,
  `PreçoFinal` FLOAT NULL,
  `VOC` FLOAT NULL,
  `Isc` FLOAT NULL,
  `Lmax` FLOAT NULL,
  `Vmax` VARCHAR(45) NULL,
  `Data_Solicitaçao` DATE NULL,
  `UniConsID` INT NOT NULL,
  `ConcessionáriaID` VARCHAR(14) NOT NULL,
  `Cliente_CPF` VARCHAR(11) NOT NULL,
  PRIMARY KEY (`idProjeto`),
  INDEX `fk_Projeto_Unidade Consumidora1_idx` (`UniConsID` ASC) VISIBLE,
  INDEX `fk_Projeto_Concessionária1_idx` (`ConcessionáriaID` ASC) VISIBLE,
  INDEX `fk_Projeto_Cliente1_idx` (`Cliente_CPF` ASC) VISIBLE,
  CONSTRAINT `fk_Projeto_Unidade Consumidora1`
    FOREIGN KEY (`UniConsID`)
    REFERENCES `sgpuf_db`.`Unidade Consumidora` (`NumeroID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Projeto_Concessionária1`
    FOREIGN KEY (`ConcessionáriaID`)
    REFERENCES `sgpuf_db`.`Concessionária` (`CNPJ`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Projeto_Cliente1`
    FOREIGN KEY (`Cliente_CPF`)
    REFERENCES `sgpuf_db`.`Cliente` (`CPF`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sgpuf_db`.`Instalação`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sgpuf_db`.`Instalação` ;

CREATE TABLE IF NOT EXISTS `sgpuf_db`.`Instalação` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Status` VARCHAR(45) NOT NULL DEFAULT 'marcado',
  `Previsão_inicio` VARCHAR(45) NULL,
  `Previsão_fim` VARCHAR(45) NULL,
  `Execução_inicio` VARCHAR(45) NULL,
  `Execução_fim` VARCHAR(45) NULL,
  `Projeto_idProjeto` INT NOT NULL,
  PRIMARY KEY (`Id`),
  INDEX `fk_Instalação_Projeto1_idx` (`Projeto_idProjeto` ASC) VISIBLE,
  CONSTRAINT `fk_Instalação_Projeto1`
    FOREIGN KEY (`Projeto_idProjeto`)
    REFERENCES `sgpuf_db`.`Projeto` (`idProjeto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sgpuf_db`.`Homologa`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sgpuf_db`.`Homologa` ;

CREATE TABLE IF NOT EXISTS `sgpuf_db`.`Homologa` (
  `idEstagiário` INT NOT NULL,
  `Projeto_idProjeto` INT NOT NULL,
  `data` DATE NULL,
  `pdf` VARCHAR(45) NULL,
  PRIMARY KEY (`idEstagiário`, `Projeto_idProjeto`),
  INDEX `fk_Estagiário_has_Projeto_Projeto1_idx` (`Projeto_idProjeto` ASC) VISIBLE,
  INDEX `fk_Estagiário_has_Projeto_Estagiário1_idx` (`idEstagiário` ASC) VISIBLE,
  CONSTRAINT `fk_Estagiário_has_Projeto_Estagiário1`
    FOREIGN KEY (`idEstagiário`)
    REFERENCES `sgpuf_db`.`Estagiário` (`Funcionário_idFuncionário`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Estagiário_has_Projeto_Projeto1`
    FOREIGN KEY (`Projeto_idProjeto`)
    REFERENCES `sgpuf_db`.`Projeto` (`idProjeto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sgpuf_db`.`Vistorias`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sgpuf_db`.`Vistorias` ;

CREATE TABLE IF NOT EXISTS `sgpuf_db`.`Vistorias` (
  `idVistorias` INT NOT NULL AUTO_INCREMENT,
  `Engenheiro_Funcionário_idFuncionário` INT NOT NULL,
  `Lmax` FLOAT NULL,
  `Vmax` VARCHAR(45) NULL,
  PRIMARY KEY (`idVistorias`, `Engenheiro_Funcionário_idFuncionário`),
  INDEX `fk_Vistorias_Engenheiro1_idx` (`Engenheiro_Funcionário_idFuncionário` ASC) VISIBLE,
  CONSTRAINT `fk_Vistorias_Engenheiro1`
    FOREIGN KEY (`Engenheiro_Funcionário_idFuncionário`)
    REFERENCES `sgpuf_db`.`Engenheiro` (`Funcionário_idFuncionário`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sgpuf_db`.`Revisa`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sgpuf_db`.`Revisa` ;

CREATE TABLE IF NOT EXISTS `sgpuf_db`.`Revisa` (
  `IDProjeto` INT NOT NULL,
  `Vistorias_idVistorias` INT NOT NULL,
  PRIMARY KEY (`IDProjeto`, `Vistorias_idVistorias`),
  INDEX `fk_Vistoria_has_Projeto_Projeto1_idx` (`IDProjeto` ASC) VISIBLE,
  INDEX `fk_Revisa_Vistorias1_idx` (`Vistorias_idVistorias` ASC) VISIBLE,
  CONSTRAINT `fk_Vistoria_has_Projeto_Projeto1`
    FOREIGN KEY (`IDProjeto`)
    REFERENCES `sgpuf_db`.`Projeto` (`idProjeto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Revisa_Vistorias1`
    FOREIGN KEY (`Vistorias_idVistorias`)
    REFERENCES `sgpuf_db`.`Vistorias` (`idVistorias`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sgpuf_db`.`Aprova`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sgpuf_db`.`Aprova` ;

CREATE TABLE IF NOT EXISTS `sgpuf_db`.`Aprova` (
  `Gerente_idFuncionário` INT NOT NULL,
  `Projeto_idProjeto` INT NOT NULL,
  `DataAprovação` VARCHAR(45) NULL,
  PRIMARY KEY (`Gerente_idFuncionário`, `Projeto_idProjeto`),
  INDEX `fk_Gerente_has_Projeto_Projeto1_idx` (`Projeto_idProjeto` ASC) VISIBLE,
  INDEX `fk_Gerente_has_Projeto_Gerente1_idx` (`Gerente_idFuncionário` ASC) VISIBLE,
  CONSTRAINT `fk_Gerente_has_Projeto_Gerente1`
    FOREIGN KEY (`Gerente_idFuncionário`)
    REFERENCES `sgpuf_db`.`Gerente` (`Funcionário_idFuncionário`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Gerente_has_Projeto_Projeto1`
    FOREIGN KEY (`Projeto_idProjeto`)
    REFERENCES `sgpuf_db`.`Projeto` (`idProjeto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sgpuf_db`.`Solicita_Instalaçao`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sgpuf_db`.`Solicita_Instalaçao` ;

CREATE TABLE IF NOT EXISTS `sgpuf_db`.`Solicita_Instalaçao` (
  `Funcionário_idFuncionário` INT NOT NULL,
  `Instalação_Id` INT NOT NULL,
  PRIMARY KEY (`Funcionário_idFuncionário`, `Instalação_Id`),
  INDEX `fk_Funcionário_has_Instalação_Instalação1_idx` (`Instalação_Id` ASC) VISIBLE,
  INDEX `fk_Funcionário_has_Instalação_Funcionário1_idx` (`Funcionário_idFuncionário` ASC) VISIBLE,
  CONSTRAINT `fk_Funcionário_has_Instalação_Funcionário1`
    FOREIGN KEY (`Funcionário_idFuncionário`)
    REFERENCES `sgpuf_db`.`Funcionário` (`idFuncionário`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Funcionário_has_Instalação_Instalação1`
    FOREIGN KEY (`Instalação_Id`)
    REFERENCES `sgpuf_db`.`Instalação` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
