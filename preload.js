const { contextBridge,ipcRenderer } = require('electron')
// const { print ,getPrinters} = require('pdf-to-printer')
// const report = require('puppeteer-report')
// const puppeteer = require('puppeteer')
const path = require('path')

let browserSingleton = (async function(){
  let instance;

  const init = async() => {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    const page = await browser.newPage()
    // await page.goto('http://192.168.1.104:81/giaidoan2/resource.php?module=login&action=login_controler&username=vanttd&password=123456&c_tendangnhap=vanttd')
    return page
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




let browserA;
(async function(){
  const result = await browserSingleton
  browserA = await result.getInstance()
})();

contextBridge.exposeInMainWorld('myAPI', {
  desktop: true,
  getPrinters: async function(){
    return printers = await ipcRenderer.invoke('getPrinters')
  },


  getPaperSize: async function(printName){
    printers = await ipcRenderer.invoke('getPaperSize', printName)
    return printers
  }, 

  openPrintScreen: async function(reportName){
   await ipcRenderer.invoke('openPrintScreen', reportName)
  },


  handlePrint: async function(){
    await ipcRenderer.invoke('handlePrint')
   },

  // handlePrint: async function(){
  //   console.log(12321321321)
  //   // await ipcRenderer.invoke('handlePrint')
    
  //   const options = {
  //     printer: 'TSC TTP-244 Pro',
  //     // side: 'duplex',
  //     scale: 'fit'
  //     // printDialog: true
  
  //   }
  
  //   print('D:\\electron\\report.pdf', options)
  // },


  // hidePrintScreen: async function(){
  //   await ipcRenderer.invoke('hidePrintScreen')
  // },


  handleChangePdf: async function(options){
    
 
    try {
      // you must use full path `home/puppeteer/index.hmtl`
      let dir = './pdf'
      if(!fs.existsSync(dir)){
        fs.mkdirSync(dir)
      }
      const file = path.join(__dirname, "index1.html");
      // console.log('///////////////////////////////////////');
      await report.pdf(browserA, file, options);
      
      // await report.pdf(browser, file, {
      //   path: "report.pdf",
      //   format: "a4",
      //   margin: {
      //     bottom: "10mm",
      //     left: "10mm",
      //     right: "10mm",
      //     top: "10mm",
      //   },
      // });
    } finally {
      // await browser.close();
    }
  }
})

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const type of ['chrome', 'node', 'electron']) {
      replaceText(`${type}-version`, process.versions[type])
    }

  })
  



