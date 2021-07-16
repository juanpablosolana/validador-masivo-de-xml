// const express = require('express')
// import mongoose from "mongoose"
const {Schema, model, connect} = require ('mongoose')
const dotenv = require ('dotenv')
const findId = require('./index.js')
dotenv.config()

// console.log(process.env.cs)
console.log(findId)

connect(process.env.cs, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false,
  useCreateIndex: true
})
  .then(()=>{
    console.log('conexion realizada')
  })
  .catch(err =>{
    console.error(err)
  })

const emisor = new Schema({
  nombre: String,
  rfc: String,
  regimenFiscal: Number
})

const receptor = new Schema({
  nombre: String,
  rfc: String,
  usoCFDI: String
})

const impuestos = new Schema({
  totalImpuestosTrasladados: Number,
  traslados:[String]
})
const timbreFiscal = new Schema({
  fechaTimbrado: Date,
  uuid: String,
  noCertificadoSAT: Number,
  selloSAT:String,
  SelloCFD:String,
  RFCProvCertif: String
})

const cfdiRegistroFiscal = new Schema({
  version:Number,
  folio: Number
})

  const cfdiSchema = new Schema({
    version:String,
    folio:Number,
    sello:String,
    formaPago:Number,
    NoCertificado:String,
    subTotal:Number,
    moneda:String,
    total:Number,
    tipoDeComprbante:String,
    metodoPago:String,
    lugarExpedicion:Number,
    type:emisor,
    type:receptor,
    conceptos:[String],
    type: impuestos,
    type: timbreFiscal,
    type: cfdiRegistroFiscal
  },{
    timestamps:true
  })

const Cfdi = model('CFDI',cfdiSchema)
const cfdiSave = new Cfdi()


cfdiSave.save(findId)
    .then(result => {
      console.log(result)
    })
    .catch(err => {
      console.error(err)
    })


module.exports = cfdiSave

