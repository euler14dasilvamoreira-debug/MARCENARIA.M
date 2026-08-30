const WA="5593991849777";
let products=JSON.parse(localStorage.getItem("mm_products_v11")||"null")||initial;
let currentCat="Todos";
let slide=0;

const doorProducts=products.filter(p=>p.cat==="Portas");

function save(){
  localStorage.setItem("mm_products_v11",JSON.stringify(products));
  render();
  buildCarousel();
}

function render(){
  const cats=["Todos",...new Set(products.map(p=>p.cat))];
  document.getElementById("filters").innerHTML=cats.map(c=>
    `<button class="filter ${c===currentCat?"active":""}" onclick='setCat(${JSON.stringify(c)})'>${c}</button>`
  ).join("");

  const list=products.filter(p=>currentCat==="Todos"||p.cat===currentCat);
  document.getElementById("products").innerHTML=list.map(p=>
    `<article class="card">
      <img src="${p.img}" alt="${escapeHtml(p.name)}" onclick="openImage(this.src)">
      <div class="in">
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.desc)}</p>
        <div class="price">${escapeHtml(p.price||"Consultar")}</div>
        <a class="wa" target="_blank" href="https://wa.me/${WA}?text=${encodeURIComponent("Olá! Vi no catálogo da Marcenaria Moreira o produto: "+p.name+". Quero um orçamento.")}">Pedir orçamento pelo WhatsApp</a>
      </div>
    </article>`
  ).join("");

  document.getElementById("adminList").innerHTML=products.map(p=>
    `<div class="productLine">
      <img src="${p.img}" alt="${escapeHtml(p.name)}">
      <div class="prodInfo"><div class="prodName">${escapeHtml(p.name)}</div><small>${escapeHtml(p.cat)} • ${escapeHtml(p.price||"Consultar")}</small><br><small>${escapeHtml(p.desc||"")}</small></div>
      <div class="productActions">
        <button class="mini" onclick="editProduct(${p.id})">✏️ Editar</button>
        <button class="mini" onclick="changeProductPhoto(${p.id})">📷 Foto</button>
        <button class="mini danger deleteBtn" data-id="${p.id}" type="button">🗑️ Excluir</button>
      </div>
    </div>`
  ).join("");

  document.querySelectorAll(".deleteBtn").forEach(btn=>{
    btn.addEventListener("click",()=>delProduct(Number(btn.dataset.id)));
  });
}

function openImage(src){
  document.getElementById("fullImg").src=src;
  document.getElementById("imgModal").classList.add("open");
  document.body.style.overflow="hidden";
}
function closeImage(e){
  if(e) e.stopPropagation();
  document.getElementById("imgModal").classList.remove("open");
  document.body.style.overflow="";
}
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeImage()});

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}

function setCat(c){currentCat=c;render();document.getElementById("catalogo").scrollIntoView({behavior:"smooth"})}

function buildCarousel(){
  const doors=products.filter(p=>p.cat==="Portas");
  if(!doors.length){
    document.getElementById("track").innerHTML="<div class='slide'><div style='padding:60px;text-align:center'>Adicione uma porta pelo painel.</div></div>";
    document.getElementById("dots").innerHTML="";
    document.getElementById("modelBar").innerHTML="";
    return;
  }
  if(slide>=doors.length) slide=0;
  document.getElementById("track").innerHTML=doors.map((p,i)=>
    `<div class="slide">
      <img src="${p.img}" alt="${escapeHtml(p.name)}" onclick="openImage(this.src)">
      <div class="slideInfo"><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.price)} • Sob medida</p></div>
    </div>`
  ).join("");
  document.getElementById("dots").innerHTML=doors.map((_,i)=>
    `<button class="dot ${i===slide?"active":""}" onclick="goSlide(${i})" aria-label="Modelo ${i+1}"></button>`
  ).join("");
  document.getElementById("modelBar").innerHTML=doors.map((p,i)=>
    `<button class="modelBtn ${i===slide?"active":""}" onclick="goSlide(${i})">Modelo ${i+1} · ${escapeHtml(p.price)}</button>`
  ).join("");
  document.getElementById("track").style.transform=`translateX(-${slide*100}%)`;
}

function goSlide(i){
  const doors=products.filter(p=>p.cat==="Portas");
  slide=(i+doors.length)%doors.length;
  buildCarousel();
}
function moveSlide(dir){goSlide(slide+dir)}

let startX=0;
document.getElementById("doorCarousel").addEventListener("touchstart",e=>{startX=e.touches[0].clientX},{passive:true});
document.getElementById("doorCarousel").addEventListener("touchend",e=>{
  const dx=e.changedTouches[0].clientX-startX;
  if(Math.abs(dx)>45) moveSlide(dx<0?1:-1);
},{passive:true});

function showAdmin(){
  document.getElementById("admin").classList.add("open");
  document.getElementById("admin").scrollIntoView({behavior:"smooth"});
}

function togglePass(){
  const p=document.getElementById("pass");
  p.type=p.type==="password"?"text":"password";
}

function login(){
  if(document.getElementById("pass").value==="Euler.123"){
    document.getElementById("login").style.display="none";
    document.getElementById("editor").style.display="block";
    const msg=document.getElementById("accessMsg");
    msg.textContent="Acesso concedido.";
    msg.style.color="#8fce7a";
  }else{
    const msg=document.getElementById("accessMsg");
    msg.textContent="Senha incorreta. Acesso negado.";
    msg.style.color="#ff7777";
  }
}

function logout(){
  document.getElementById("editor").style.display="none";
  document.getElementById("login").style.display="block";
  document.getElementById("pass").value="";
}

let previewObjectUrl=null;

function previewPhoto(){
  const f=document.getElementById("photo").files[0];
  const p=document.getElementById("preview");
  if(previewObjectUrl){ URL.revokeObjectURL(previewObjectUrl); previewObjectUrl=null; }
  if(f){
    previewObjectUrl=URL.createObjectURL(f);
    p.src=previewObjectUrl;
    p.style.display="block";
  }else{
    p.removeAttribute("src");
    p.style.display="none";
  }
}

function clearProductForm(){
  const photo=document.getElementById("photo");
  const preview=document.getElementById("preview");
  const name=document.getElementById("name");
  const price=document.getElementById("price");
  const desc=document.getElementById("desc");
  if(previewObjectUrl){ URL.revokeObjectURL(previewObjectUrl); previewObjectUrl=null; }
  if(photo) photo.value="";
  if(preview){ preview.removeAttribute("src"); preview.style.display="none"; }
  if(name) name.value="";
  if(price) price.value="";
  if(desc) desc.value="";
  const cat=document.getElementById("cat");
  if(cat) cat.selectedIndex=0;
}

function addProduct(){
  const f=document.getElementById("photo").files[0];
  const name=document.getElementById("name").value.trim();
  if(!f||!name){alert("Escolha uma foto e coloque o nome.");return}

  const cat=document.getElementById("cat").value;
  const price=document.getElementById("price").value.trim()||"Consultar";
  const desc=document.getElementById("desc").value.trim()||"Produto sob medida.";
  const r=new FileReader();

  r.onload=()=>{
    const novo={
      id:Date.now(),
      name,
      cat,
      price,
      desc,
      img:r.result
    };

    const confirmar=confirm(
      "Deseja salvar este produto no catálogo?\n\n"+
      "Produto: "+novo.name+"\n"+
      "Categoria: "+novo.cat+"\n"+
      "Preço: "+novo.price+"\n\n"+
      "Ao confirmar, ele será salvo no catálogo principal."
    );

    if(!confirmar){
      alert("Cadastro cancelado. Nada foi salvo.");
      return;
    }

    // O produto só entra no catálogo depois da confirmação.
    products.unshift(novo);
    save();

    // Depois de salvar, limpa completamente o formulário administrativo.
    // A foto e os dados ficam somente no catálogo principal.
    clearProductForm();

    // Sempre volta ao catálogo principal e mostra imediatamente o produto novo.
    currentCat="Todos";
    render();
    buildCarousel();
    document.getElementById("admin").classList.remove("open");
    document.getElementById("catalogo").scrollIntoView({behavior:"smooth",block:"start"});
    setTimeout(()=>alert("Produto salvo com sucesso! Ele já está no catálogo principal."),350);
  };
  r.readAsDataURL(f);
}

function changeProductPhoto(id){
  const input=document.createElement("input");
  input.type="file"; input.accept="image/*";
  input.onchange=()=>{
    const f=input.files[0]; if(!f) return;
    const r=new FileReader();
    r.onload=()=>{
      const p=products.find(x=>x.id===id);
      if(!p) return;
      const confirmar=confirm("Deseja salvar esta nova foto no produto \""+p.name+"\"?\n\nEla substituirá a foto atual e aparecerá no catálogo principal.");
      if(!confirmar){ alert("Alteração cancelada. A foto atual foi mantida."); return; }
      p.img=r.result;
      currentCat="Todos";
      save();
      render();
      buildCarousel();
      document.getElementById("admin").classList.remove("open");
      document.getElementById("catalogo").scrollIntoView({behavior:"smooth",block:"start"});
      setTimeout(()=>alert("Nova foto salva com sucesso! Ela já está no catálogo principal."),350);
    };
    r.readAsDataURL(f);
  };
  input.click();
}

function delProduct(id){
  const p=products.find(x=>x.id===id);
  if(!p){ alert("Produto não encontrado."); return; }
  const ok=confirm("Excluir \""+p.name+"\" do catálogo?\n\nEssa ação remove somente este produto deste aparelho.");
  if(!ok) return;
  products=products.filter(x=>x.id!==id);
  save();
  if(slide>=products.filter(x=>x.cat==="Portas").length) slide=0;
  alert("Produto excluído com sucesso!");
}

function editProduct(id){
  const p=products.find(x=>x.id===id); if(!p)return;
  const name=prompt("Nome do produto:",p.name); if(name===null)return;
  const price=prompt("Preço:",p.price||""); if(price===null)return;
  const desc=prompt("Descrição:",p.desc||""); if(desc===null)return;
  const cat=prompt("Categoria (Portas, Janelas, Caixilhos e portais, Mesas e cadeiras, Móveis, Artesanato):",p.cat); if(cat===null)return;

  const novo={
    name:name.trim()||p.name,
    price:price.trim()||"Consultar",
    desc:desc.trim()||"Produto sob medida.",
    cat:cat.trim()||p.cat
  };

  const confirmar=confirm(
    "Deseja salvar estas alterações?\n\n"+
    "Produto: "+novo.name+"\n"+
    "Categoria: "+novo.cat+"\n"+
    "Preço: "+novo.price
  );
  if(!confirmar){
    alert("Alterações canceladas. Nada foi modificado.");
    return;
  }

  p.name=novo.name;
  p.price=novo.price;
  p.desc=novo.desc;
  p.cat=novo.cat;
  currentCat="Todos";
  save();
  render();
  buildCarousel();
  document.getElementById("admin").classList.remove("open");
  document.getElementById("catalogo").scrollIntoView({behavior:"smooth",block:"start"});
  setTimeout(()=>alert("Alterações salvas com sucesso! O produto atualizado já está no catálogo principal."),350);
}

function exportBackup(){
  const blob=new Blob([JSON.stringify(products,null,2)],{type:"application/json"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="backup-marcenaria-moreira.json"; a.click(); URL.revokeObjectURL(a.href);
}

function importBackup(e){
  const f=e.target.files[0]; if(!f)return; const r=new FileReader();
  r.onload=()=>{try{const data=JSON.parse(r.result); if(!Array.isArray(data))throw new Error(); products=data.filter(p=>p&&p.id&&p.name&&p.img); save(); alert("Backup restaurado com sucesso!");}catch(err){alert("Backup inválido.")}};
  r.readAsText(f); e.target.value="";
}

render();
buildCarousel();
