// app/index.js
const util = require('./util')

const addressesToLocate =  "134 Mullen Ave, 94110"

const result = util.locateIP(addressesToLocate)  
console.log(`The result is: ${result}`) 
