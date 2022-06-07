
// const { print ,getPrinters} = require('pdf-to-printer')
const { app, BrowserWindow,contextBridge,ipcMain } = require('electron')

// const report = require('puppeteer-report')
// const puppeteer = require('puppeteer')
const util = require('util')
const fs = require('fs')
const {execFile} = require('child_process')
const path = require('path')
const exec = util.promisify(execFile)
const express = require("express");
const cors = require("cors");
const { Console } = require('console')
const appExress = express()

appExress.set('port', 8080)
appExress.use(cors({
  origin: '*'
}))
appExress.get("/pdf", async(req, res) => {
  let dir = './pdf' 
  if(fs.existsSync(dir)){ //kiểm tra tồn tại thư mục pdf hay ko
    const directoryPath = path.join(__dirname, dir)
    fs.readdir(directoryPath, (err, files) => { 
      if(err) throw err
      let file = fs.readFileSync(`./pdf/${files[0]}`) // nếu có thì read name file trong để show pdf
      let stat = fs.statSync(`./pdf/${files[0]}`)
  
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Type', 'application/pdf')
      res.send(file)
    }) 
  }else{
    console.log('no ok');

  }
})


appExress.listen(8080)


const browserSingleton = ( function(){
 
  let instance;

  const init = () => {
    const win = new BrowserWindow({
      width: 1000,
      height: 1000,
      // autoHideMenuBar: true,
      // closable: false,
      // titleBarStyle: 'hidden',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      },
      
    })
  
    win.loadURL('http://localhost:3000/#/print')
    win.webContents.openDevTools();

    // return win
    return {
      show: function(){
         win.show()
         
      },

      hide: function(){
         win.hide()
      }
    }
  } 
  return {
    getInstance : function(){
      if(!instance){
        instance = init()
      }
      return instance
    }
  }
})()


async function createWindow () {
  const win = new BrowserWindow({
    // width: 1000,
    // height: 1000,
    // fullscreen: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    
  })

  win.maximize()
  win.show()
  win.loadURL('http://localhost:3000')
  win.on("close", (e) => {

      fs.rmSync('./pdf', { recursive: true, force: true })
      // e.preventDefault()
      // win.hide()
  })
  return win;
}





//hidePrintScreen 
ipcMain.handle('hidePrintScreen', async event => {
    browserSingleton.getInstance().hide()
})


ipcMain.handle('getPrinters', async event => {
  return await event.sender.getPrintersAsync()
})



//get papersize
ipcMain.handle('getPaperSize', async (event, printName) => {
  return await  exec(`windows_printer`,["printer_paper_size",printName])
})

//get papersize
ipcMain.handle('handlePrint', async (event, printName) => {
  return await  exec(`windows_printer`,["print"])
})




app.whenReady().then(() => {
  const win = createWindow();
  // const win1 = createWindow1(win);


  
  app.on('activate', () => {
    // if (BrowserWindow.getAllWindows().length === 0) {
   
    // }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
