const imageWrapper = document.querySelector('.images')
const loadMoreBtn = document.querySelector('.load-more')
const searchInput = document.querySelector('#search')
const lightBox = document.querySelector('.lightbox')
const closeBtn = document.querySelector('#close')
const downloadBtn = document.querySelector('#dwd')


const apiKey ='9XnqlocPnCdZ5AuVr0X19ohxMohSlAQguSTZ1wZRBLUER9uNeO4qusVh'
const perPage = 15;
let currentPage = 1;
let searchTerm = null


const downloadImage = (url) =>{

   fetch(url).then((res)=> res.blob()).then((file)=>{
    const a = document.createElement('a')
    a.href = URL.createObjectURL(file)
    a.download = new Date().getTime()
    a.click()
    console.log(file)
   }).catch(()=>{
        alert('Impossible de télécharger l\'image')
   })
}

const showBox = (image,name)=>{
    lightBox.querySelector("img").src = image
    lightBox.querySelector("span").innerText = name
    downloadBtn.setAttribute("data-img",image)
    lightBox.classList.add('show')
}

const hideBox = ()=>{
    lightBox.classList.remove('show')
}

/**
 *@param {Array} images
 */
const generateHTML = (images) =>{

    let datas = images.map(img => `

    <li class="card" onclick="showBox('${img.src.large2x}','${img.photographer}')">
        <img src="${img.src.large2x}" alt="image" >
        <div class="details">
            <div class="photographer">
                <i class="fa-solid fa-camera"></i>
                <span>${img.photographer}</span>
            </div>
            <button onclick="downloadImage('${img.src.large2x}')">
              <i class="fa-solid fa-arrow-down"></i>
            </button>
        </div>
    </li>`)

    datas.forEach(data => imageWrapper.innerHTML += data)
}

/**
 *@param {string} url
 */
const getImages = (url)=>{
    loadMoreBtn.innerText = "Chargement..."
    loadMoreBtn.classList.add('disabled')
    fetch(url,{
        headers:{
            Authorization : apiKey
        }
    }).then((res) => res.json()).then((data)=>{
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Charger encore"
        loadMoreBtn.classList.remove('disabled')
    }).catch(()=>{
        alert('Impossible de charger les images')
    })
}


const loadMoreImages = ()=>{

    currentPage++
    let apiUrl = `https://api.pexels.com/v1/curated?&page=${currentPage}?&per_page=${perPage}`
    apiUrl == searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&curated?&page=${currentPage}?&per_page=${perPage}` : apiUrl
    getImages(apiUrl)

}

const loadSearchImages = (e)=>{
    if (e.target.value === '') return searchTerm = null
    if(e.key === 'Enter'){
        currentPage = 1
        searchTerm = e.target.value
        imageWrapper.innerHTML = ''
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&curated?&page=${currentPage}?&per_page=${perPage}`);
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}?&per_page=${perPage}`);
loadMoreBtn.addEventListener('click',loadMoreImages)
searchInput.addEventListener('keyup',loadSearchImages)
closeBtn.addEventListener('click',hideBox)
downloadBtn.addEventListener('click',(e)=>{downloadImage(e.target.dataset.img)})