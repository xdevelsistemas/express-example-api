import { IUser } from '@prodest/mapeandoes-typings'
import * as shortid from 'shortid'
import * as _ from 'lodash'
import * as EmailValidator from 'email-validator'

/**
 * Valida cpf e cnpj
 */
const cpfCnpj = require('cpf_cnpj')

/**
 * shortid
 */
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@')

export let lib = {
  /**
   * Cpf
   */
  cpf: cpfCnpj.CPF,
  /**
   * Cnpj
   */
  cnpj: cpfCnpj.CNPJ,
  /**
   * Valida se é um email válido
   *
   * @param {string} email
   * @returns {boolean}
   */
  emailValidator: (email: string): boolean => EmailValidator.validate(email),
  /**
   * Valida o documento do usuário
   * Para cpf ou cnpj
   *
   * @param {string} numDocFed
   * @returns {boolean}
   *
   * @memberOf UserDAO
   */
  cpfCnpjValidator: (numDocFed: string): boolean => {
    return lib.cpf.isValid(numDocFed) ? true : lib.cnpj.isValid(numDocFed) ? true : false
  },
  /**
   * Através de 'fieldsUp' um novo objeto é formado e somente os campos ditos nele serão atualizados.
   * Ou seja, permitindo que campos que não podem ser alterados fiquem seguros e inalterados na atualização.
   *
   * @param {*} obj
   * @param {Array<string>} fieldsObj
   * @param {Array<string>} fieldsUp
   * @returns {*}
   *
   */
  fieldsUpValidator: (obj: any, fieldsObj: Array<string>, fieldsUp: Array<string>): any => {
    let newObj: any = {}

    fieldsUp.forEach(field => {
      if (_.indexOf(fieldsObj, field) !== -1) {
        newObj[field] = obj[field]
      }
    })

    return newObj
  },
  /**
   * Valida os dados básicos de usuário
   *
   * @param {IUser} user
   * @returns {string}
   */
  validandoUser: (user: IUser): string => {
    let userValidado: string

    if (user.name && user.name.length < 6) {
      userValidado = 'O nome deve conter no mínimo 6 letras'
    } else if (user.password && user.password.length < 6) {
      userValidado = 'A senha deve conter no mínimo 6 caracteres'
    } else if (user.email && !lib.emailValidator(user.email)) {
      userValidado = 'O email possui um formato inválido'
      // } else if (user.numDocFed && !lib.cpfCnpjValidator(user.numDocFed)) {
      //    userValidado = 'O Cpf/Cnpj está incorreto'
    }
    return userValidado
  }
}
