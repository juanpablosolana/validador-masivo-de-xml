const express = require('express')
const cors = require('cors')
const axios = require('axios');
const CfdiToJson = require('cfdi-to-json');
const fs = require('fs');
const path = require('path');
//const {save} = require('./db.js')
let cfdi=[];
let cfdiJson=[];
let findId = [];
const app = express();

app.use(cors())

fs.readdir('./',  function (err, archivos) {
  if (err) {
    onError(err);
    return;
  }

  archivos.forEach(file => {
    if (path.extname(file) == '.xml'){
       let stats = fs.statSync(file);
       stats.size>2000? cfdi.push(file): null
    }
  })
cfdi.forEach(element => {
    cfdiJson.push(jsonCfdi = CfdiToJson.parse({ path: element }));
  })
  console.log(` Hay un total de : ${cfdiJson.length} archivos`)

  cfdiJson.forEach((cfdi, index) => {
       axios.get(`https://cfdiestaus.herokuapp.com/${cfdi.emisor.rfc}&&${cfdi.receptor.rfc}&&${cfdi.total}&&${cfdi.timbreFiscal.uuid}`)
        .then(response => {
          findId.push(`${cfdi.timbreFiscal.uuid.toUpperCase()} | ${cfdi.emisor.rfc} | ${cfdi.receptor.rfc} | ${cfdi.total} | ${response.data['s:Envelope']['s:Body']['ConsultaResponse']['ConsultaResult']['a:Estado']['_text']}`)
          console.log(findId[index])
        })
        .catch((err) => {
          console.log(err);
        });
  })
});

app.get('/',  (request, response)=>{
     response.setHeader("Content-disposition", "attachment; filename=CFDINovalan.txt");
     response.setHeader("Content-type", "text/plain");
     response.charset = "ANSI";
     cfdiJson.map(async(cfdi, index) => {
       response.write(`${findId[index]}  \n`);
     })
     response.end();
    })

app.get('/api/v1', (request, response)=>{
  response.send(cfdiJson)
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
    if(err) throw err;
    console.log('server corriendo en el puerto',PORT);
});