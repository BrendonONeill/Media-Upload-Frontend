const fileBrowserButton = document.querySelector(".file-browser-button");
const fileBrowserInput = document.querySelector(".file-browser-input");
const fileUploadBox = document.querySelector(".file-upload-box");
const filesCount = document.querySelector(".file-completed-status");
const filesList = document.querySelector(".file-list");
let formSubmit = document.querySelector("#form-submit");
const passkey = document.querySelector("#passkey");
const notify = document.querySelector(".notify");
const notifyError = document.querySelector(".notify-error");
const notifyText = document.querySelector(".update");
const notifyErrorText = document.querySelector(".update-error");
const errorcontainerButton = document.querySelector(".error-list-container-button")

const errorbg = document.querySelector(".error-bg")
const errorList = document.querySelector(".error-list")
const loadingBG = document.querySelector(".loading-bg");
const addFilesButton = document.querySelector(".add-files-button")
const loadingUpdating = document.querySelector(".loading-updater")
const loadingPercentage = document.querySelector(".loading-percentage")

const infoErrorImg = document.querySelector(".info-error-img")
const notifyErrorButton = document.querySelector(".notify-error-button")

const notifyImg = document.querySelector(".notify-img")
const notifyButton = document.querySelector(".notify-button")

const loadingbar = document.querySelector(".loading-bar")
const loadingtext = document.querySelector(".loading-text")  

const block = "/video.svg"
const progressBar = document.querySelector(".progress-bar")
const fileMemory = document.querySelector(".files-memory")
let id = "123"


let listMemory = 0

let mediaListMemory = 0
let TempListMemory = 0

let listMemoryUploads = 0

// array of media
let media = [];
let tempMedia = []

//upload results
let globalUploadData = []

//when
fileBrowserInput.addEventListener("change", (e) => handleFiles(e.target.files))
fileBrowserButton.addEventListener("click", () => fileBrowserInput.click())
addFilesButton.addEventListener("click", () => fileBrowserInput.click())

const handleFiles = ([...files] = []) =>
{
    for(let i = 0; i < files.length; i++)
    {
        
        if((media.length + tempMedia.length) == 20 || tempMedia.length == 20 || media.length == 20 || (mediaListMemory + TempListMemory + files[i].size) >= 5368709120)
        {
            break
        }
        if(files[i].type.startsWith("image"))
        {
            let file = fileSizeChecker(files[i], mediaObjectCreator)
            TempListMemory += file.size
            tempMedia.push(file)
        }
        else if(files[i].type.startsWith("video"))
        {
            let file = fileSizeChecker(files[i], mediaObjectCreator)
            TempListMemory += file.size
            tempMedia.push(file)
        }
        else
        {
            errorFlashCard({message: "Please only add Images and videos.",nofiles: true})
        }
    }
    if(media.length <= 0)
    {
        media = [...media, ...tempMedia]
    } 
    else
    {
        if(tempMedia.length > 0)
        {
                media = filterFiles(tempMedia, media)
        }
    }     
    if(media.length == 0)
    {
        fileMemory.textContent = `0KB/5GB`
        return
    }
    filesCount.textContent = `${media.length}/20 files`
    document.querySelector(".file-list").innerHTML = ""
    for (let i = 0; i < media.length; i++)
    {
        let img = createThumbnail(media[i])
        let item = generateListItem(media[i], i)
        item.querySelector(".file-image").append(img)
        document.querySelector(".file-list").append(item)
    } 
    tempMedia = []
    TempListMemory = 0
    mediaListMemory = 0
    fileBrowserInput.value = ''
    media.forEach((m) => {mediaListMemory += m.size})
    fileMemory.textContent = `${fileSize(mediaListMemory)}/5GB`
}


function fileSizeChecker(file, func)
{
    if(file.size > 8388608)
    {
        let newFile = func(file)
        return newFile
    }
    else
    {
        return file
    }
}


function mediaObjectCreator(file)
{
    let mediaChunks = []
    let start = 0
    let chunkSize = (1024 * 1024) * 8
    let end = file.size
    let id = 0
    while(start < end)
     {
          id += 1
          let chunkEnd = start + chunkSize
          if(chunkEnd > end)
          {
              chunkEnd = end
          }
          let chunk = new File([file.slice(start,(chunkEnd))],file.name,{type: file.type})
          mediaChunks.push(chunk)
          start = start + chunkSize
     }
    return {mediaChunks: mediaChunks, type: file.type, name: file.name, numberOfChunks: id, size: file.size}
}




function filterFiles(files, media)
{
   for(let i = 0; i < media.length; i++)
   {
    files = files.filter((file) => (file.name != media[i].name))
   }
   return [...media, ...files]
}

function generateListItem(file, num)
{
    const li = document.createElement("li");
    li.innerHTML = `
        <div class="file-image"></div>
        <div class="file-details">
            <small class="file-name" data-name='${file.name}'>${nameCleanUp(file.name)}</small>
        </div>
        <div class="cancel-button-container">
            <button class="cancel-button" id="photoId-${num}"></button>
        </div>
        <div class="file-size-container">
            <small class="file-size">${fileSize(file.size)}</small>
            <small class="file-type">${file.name.split('.').pop().toUpperCase()}</small>
        </div>`
    li.classList.add("file-item");
    if(file.size >= 2147483648)
    {
        li.classList.add("file-error");
    }
    li.id = `${num}`
    return li
}


function nameCleanUp(name)
{
    if(name.length < 20)
    {
        return name
    }
    else
    {
        let text = name.slice(0,20) + '...'
        return text
    }
}

function nameCleanUpLoading(name)
{
    if(name.length < 15)
    {
        return name
    }
    else
    {
        let text = name.slice(0,15) + '...'
        return text
    }
}
function fileSize(bytes)
{
    if(bytes > 1073741824 )
    {
        let num = bytes/1073741824
        return num.toFixed(2)  + "GB"
    }
    else if(bytes > 1048576)
    {
        let num = bytes/1048576
        return num.toFixed(2)  + "MB"
    }
    else
    {
        let num =  bytes/1024
        return num.toFixed(2) + "KB"
    }
}

function createThumbnail(file)
{
    let img = document.createElement("img")
    if(file.type.startsWith("video"))
    {
        img.src = block
    }
    else if(file.type.startsWith("image") && file.size >= 8388608)
    {
        img.src = block
    }
    else
    {
        img.src = URL.createObjectURL(file)
    }
    img.style.maxHeight= '100%'
    img.style.maxWidth = '100%'
    img.style.objectFit = 'contain';
    return img
}




filesList.addEventListener("click", (e) => {
    let id = e.target.id.slice(8,)
    if(e.target.classList.value === "cancel-button")
    {
        let item = e.target.closest("li")
        if(item)
        {
            item.remove()
        }
        media[id] = null
        media = media.filter((m) => (m != null))
        filesCount.textContent = `${media.length}/20 files`
        handleFiles()
    }
})

// drag and drop functions
fileUploadBox.addEventListener("drop", (e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files) 
    fileUploadBox.classList.add("active")
    fileUploadBox.querySelector(".file-instructions").textContent = "Drop to upload"
})

fileUploadBox.addEventListener("dragover", (e) => {
    e.preventDefault()
    fileUploadBox.classList.add("active")
    fileUploadBox.querySelector(".file-instructions").textContent = "Drop to upload"
})

fileUploadBox.addEventListener("dragleave", (e) => {
    e.preventDefault()
    fileUploadBox.classList.remove("active")
    fileUploadBox.querySelector(".file-instructions").textContent = "Drag file here or"
})

function removeFromList(data)
{
    const listItems = filesList.querySelectorAll("li")
    listItems.forEach((item) => {
        let itemText = item.querySelector(".file-name")
        for(let i= 0; i < data.length; i++)
        {
            if(data[i].data === itemText.dataset.name && data[i].success == true)
            {
                item.remove()
            }
        }
    })
    media = filterMedia(data, media)
    filesCount.textContent = `${media.length}/20 files`
}



function filterMedia(data, media)
{
    for(let i = 0; i < data.length; i++)
    {
        for(let j = 0; j < media.length; j++)
        {
            if(data[i].data == media[j].name && data[i].success === true)
            {
                media[j] = {name: ""}
                break
            }
        }
    }
    return media.filter(m => m.name !== "") 
}



// Form submit 
formSubmit.addEventListener("click", async (e) => {
    
    calculateUpload()
    e.preventDefault()
    if(media.length == 0)
    {
        errorFlashCard({message: "No Files were added",nofiles: true})
        return
    }
        let uploadData = []
        loadingBG.classList.remove("notify-hide")
        notifyError.classList.add("notify-hide")
        for (const [index,file] of media.entries()) {

            if(file.size >= 2147483648)
            {
                continue
            }
            if(file.size < 8388608)
            { 
              let res = await passKeyCheck(uploadData, smallUpload, file)
              if(!res)
              {
                return
              }
              uploadData = res
            }
            if(file.size >= 8388608)
            {  
              let res = await passKeyCheck(uploadData, largeFileUpload, file)
              if(!res)
              {
                return
              }
              uploadData = res
            }
            
        }
        globalUploadData = uploadData
        removeFromList(uploadData)
        successfulFlashCard(uploadData)
        listMemoryUploads = 0
        handleFiles([])
        return   
})

async function passKeyCheck(uploadData,fn,file)
{
   
    try {
        let returnedValue = await fn(file)
        uploadData.push(returnedValue)
        return uploadData
       } catch (error) {
        errorFlashCard({message: error.message,wrongKey: true})
        return
       }
}

function errorFlashCard(obj)
{
        if(obj.nofiles == true)
        {
            notifyErrorText.textContent = `${obj.message}`
            notifyErrorButton.classList.add("not-list")
            setTimeout(() => {
                notifyError.classList.add("notify-hide")
            }, 8000)
        }
        else if(obj.wrongKey !== true)
        {
            notifyErrorButton.classList.remove("not-list")
            let count = 0
            errorList.innerHTML= ""
            for(let i = 0; i < obj.length; i++)
            {
                if(obj[i].success != true)
                {
                    let listItem = generateErrorCard(obj[i])
                    errorList.append(listItem)
                    count++
                }
            }
            notifyErrorText.textContent = `${count}/${obj.length} files failed.`
        }
        else
        {
            notifyErrorText.textContent = `${obj.message}`
            notifyErrorButton.classList.add("not-list")
        }
        notifyError.classList.remove("notify-hide")
        loadingBG.classList.add("notify-hide");
        notifyError.style.background = "#FBEFEB"
        notifyError.style.border = "2px solid #FC5758"
}

function generateErrorCard(obj)
{
    let li = document.createElement("li")
    li.innerHTML = `
    <div class="error-card">
                    <h3>${obj.error}</h3>
                    <p>${obj.data}</p>
    </div>
    `
    return li
}

function successfulFlashCard(obj)
{
    let count = 0
    for(let i = 0; i < obj.length; i++)
    {
        if(obj[i].success == true)
        {
            count++
        }
    }
    notify.classList.remove("notify-hide")
    loadingBG.classList.add("notify-hide");
    notify.style.background = "#F1F8F4"
    notify.style.border = "2px solid #50dc6c"
    notifyText.textContent = `${count}/${obj.length} files uploaded successfully.`
    setTimeout(() => {
        if(!notify.classList.contains("notify-hide"))
        {
            let errorsFound = false
            for(let i = 0; i < obj.length; i++)
            {
            if(obj[i].success == false)
            {
                errorsFound = true
            }
    }
            notify.classList.add("notify-hide")
            if(errorsFound)
            {
                errorFlashCard(obj)
            }
        }
    },15000)
}

notifyButton.addEventListener("click", (e) => {
    e.preventDefault()
    let errorsFound = false
    for(let i = 0; i < globalUploadData.length; i++)
    {
        if(globalUploadData[i].success == false)
        {
            errorsFound = true
        }
    }
    notify.classList.add("notify-hide")
    if(errorsFound)
    {
        errorFlashCard(globalUploadData)
    }
})

notifyErrorButton.addEventListener("click", (e) => {
    e.preventDefault()
    errorbg.classList.toggle("notify-hide")
})

errorcontainerButton.addEventListener("click", (e) => {
    e.preventDefault()
    errorbg.classList.toggle("notify-hide")
})

errorbg.addEventListener("click", (e) => {
    e.preventDefault()
    errorbg.classList.add("notify-hide")
})

// --cal
function  calculateUpload(file)
{
    let full = 700
    if(file)
    {
        loadingUpdating.textContent = `${nameCleanUpLoading(file)}`
    }
    let percentage = Math.floor((listMemoryUploads/mediaListMemory)* 100)
    let pixelpercentage = Math.floor(full - (7 * percentage))
    loadingbar.setAttribute("stroke-dashoffset", `${pixelpercentage}px`);
    if(percentage == 0)
    {
        loadingtext.setAttribute("x","80px")
        loadingbar.setAttribute("stroke","#B5B5B5")
    }
    if(percentage < 10 && percentage > 0)
    {
        loadingtext.setAttribute("x","80px")
        loadingbar.setAttribute("stroke","#364A3F")
    }
    else if(percentage > 10 && percentage < 100)
    {
        loadingtext.setAttribute("x","64px")
        loadingbar.setAttribute("stroke","#364A3F")
    }
    if(percentage == 100)
    {
        loadingtext.setAttribute("x","48px")
        loadingbar.setAttribute("stroke","#364A3F")
    }
    loadingtext.textContent = `${percentage}%`
    
}


async function smallUpload(smallFile)
{
    let data = {test:"testing"}
    try {
        calculateUpload(smallFile.name)
        let res = await fetch("/fakeuploadsmall",{ method: "POST", body: JSON.stringify(data), headers: {'Content-Type': 'application/json'} });
        if(res.ok)
        {   
            listMemoryUploads = listMemoryUploads + smallFile.size
            calculateUpload(null)
            return {data: smallFile.name, success: true}
        }
        else
        {
            listMemoryUploads = listMemoryUploads + smallFile.size
            calculateUpload(null)
            let error = await res.json()
            throw error.message
        }
    } catch (error) {
        return {data: smallFile.name, success: false, error: error, passKeyFailed: false}
    }
}

async function largeFileUpload(largeFile)
{
    let passKeyFailed = false
    let error = null
    let errorObj = null
try {
   calculateUpload(largeFile.name)
   let returnObj = await startMultipartUpload(largeFile, passKeyFailed)
   passKeyFailed = returnObj.passKeyFailed
   error = returnObj.error
   errorObj = returnObj.errorObj
   if(error)
   {
    throw error
   }

   
   returnObj = await partsMultipartUpload(largeFile, passKeyFailed)
   passKeyFailed = returnObj.passKeyFailed
   error = returnObj.error
   errorObj = returnObj.errorObj
   if(error)
   {
    throw error
   }
   returnObj = await finishMultipartUpload(largeFile,passKeyFailed)

   let complete = returnObj.uploaded
   passKeyFailed = returnObj.passKeyFailed
   error = returnObj.error
   errorObj = returnObj.errorObj

   if(error)
   {
    throw error
   }

   return complete

} catch (error) {
    return errorObj       
}

}


async function startMultipartUpload(largeFile, passKeyFailed)
{
    const returnObj = {}
    try {
        let startres = await fetch("/fakestartmultipartupload",{ method: "POST",body: JSON.stringify({name:`${largeFile.name}`, size:largeFile.size, id:id}), headers: {"Content-Type": "application/json"}})
        if(startres.ok)
        {
            await startres.json()
            returnObj.passKeyFailed = false
            returnObj.error = returnObj.errorObj = null
            return returnObj
        }
        else
        {
            let error = await startres.json()
            throw new Error(error.message)
        }    
    } catch (error) {
        returnObj.error = error
        returnObj.passKeyFailed = true
        returnObj.errorObj = {data: largeFile.name, success: false, error: error, passKeyFailed: passKeyFailed}
        return returnObj
    }
}

async function partsMultipartUpload(largeFile, passKeyFailed)
{
    const returnObj = {}
    for (const [index,chunk] of largeFile.mediaChunks.entries()) {
            try {
            let res = await fetch("/fakeuploadchunk",{ method: "POST",body: JSON.stringify({fileName: largeFile.name}), headers: {'Content-Type': 'application/json'} })
            
            if(res.ok)
            {
                listMemoryUploads = listMemoryUploads + chunk.size
                calculateUpload(null)
            }
            else
            {
                let error = await res.json()
                if(error.passKeyFailed)
                {
                    passKeyFailed = true
                } 
                throw new Error(error.message)
            }
        } catch (error) {
            
            abortMultiPartUpload(uploadId, largeFile.name)
            returnObj.error = error
            returnObj.errorObj = {data: largeFile.name, success: false, error: error, passKeyFailed: passKeyFailed}
            return returnObj
        }
    }
    returnObj.passKeyFailed = false
    returnObj.error = returnObj.errorObj = null
    return returnObj
}

async function finishMultipartUpload(largeFile, passKeyFailed)
{
    const returnObj = {}
    let formData = new FormData();
    formData.append("name",largeFile.name)
    formData.append("size",largeFile.size)
    try {
        let endres = await fetch("/fakefinishmultipartupload",{ method: "POST", body: JSON.stringify({test:"testing123"}), headers: {'Content-Type': 'application/json'}})
        if(endres.ok)
        {
           await endres.json()
           returnObj.uploaded = {data: largeFile.name, success: true} 
           returnObj.passKeyFailed = false
           returnObj.error = returnObj.errorObj = null
           return returnObj
        }
        else
        {
                let error = await end.json()
                if(error.passKeyFailed)
                {
                    passKeyFailed = true
                } 
                throw new Error(error.message)
        }
    } catch (error) {
        abortMultiPartUpload(uploadId, largeFile.name)
        returnObj.error = error
        returnObj.errorObj = {data: largeFile.name, success: false, error: error, passKeyFailed: passKeyFailed}
        return returnObj
    }
}


async function abortMultiPartUpload(uploadId, key)
{
    let formData = new FormData();
    formData.append("name",key)
    formData.append("id",id)
    formData.append("uploadId", uploadId)
    try {
        let res = await fetch("/abortMultipartUpload",{ method: "POST",body: formData, headers: {Authorization: `Bearer ${passkey.value.trim()}`}})
        if(res.ok)
        {
            await endres.json()
        }
        else
        {
             throw new Error("")
        }
    } catch (error) {
         // throw flash card
         return {data: key, success: false}
    }
}

notifyErrorButton.addEventListener("mouseover", () => {
    infoErrorImg.src = "./info-hover.svg"
})

notifyErrorButton.addEventListener("mouseout", () => {
    infoErrorImg.src = "./info-error.svg"
})


notifyButton.addEventListener("mouseover", () => {
    notifyImg.src = "./x-hover.svg"
})

notifyButton.addEventListener("mouseout", () => {
    notifyImg.src = "./x.svg"
})




