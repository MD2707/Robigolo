//UTILS
const BASE_API_URL = "https://127.0.0.1:8000/api/motDef/";
const sleep = m => new Promise(r => setTimeout(r, m))
//message
const messageDebutJeu = 'A vous de jouer ! Ecrivez un mot !';
const messageErreur = "Malheureusement je ne connais pas ce mot, si vous souhaitez me l'apprendre, appuyer sur le bouton !" ;
const messageAttente = "Je réfléchis ...";
const messageAccueil = 'Bonjour je suis Robigolo ! Grâce à moi , vous ne vous prendrez plus jamais de "feur" ou de "stiti". Essayez - moi !';

function filterBadChar(str){
   lettersToRemove= [';','§','~','&', '_','0','9','8','7','6','5','4','3','2','1','{','}','[',']',
   '¤','£','$',"'",'@','=','>','<','%','*','?', ',', '.', ':', '!','-','^','"','`','+','/','\\'];
   for (const letter of lettersToRemove){
      str = str.replaceAll(letter,"");
   }
    return str;
 }

function animateRobot(){
  setTimeout(() => {
    document.getElementById("robot").classList.remove("zoom");
    document.getElementById("robot").classList.add("bounce");
  }, 400);
}

function createTypeWriter(string,e){
  var typewriterRes = new Typewriter(e, {
    loop: false,
    delay: 45
  });
  typewriterRes
    .pauseFor(100)
    .typeString(string)
    .start();   
}

//code executed when page is loaded
//main code here ...
//setup typewriter
function indexHandling(){
  var app = document.getElementById('tw');
  animateRobot();
  createTypeWriter(messageAccueil,app)
}

function robigoloHandling(){
  animateRobot();
  var firstMsgRobigolo = document.getElementById("twRes");
  createTypeWriter(messageDebutJeu,firstMsgRobigolo)
  //gestion input robigolo.html
  document.querySelector("#form-input").addEventListener("submit", (e) => {
    e.preventDefault();
    f=document.querySelector("#form-input");
    tmpStr = filterBadChar(f.children[1].value);
    tmpStrArray = tmpStr.split(/(\s+)/).filter( e => e.trim().length > 0) ; 
    motResultat = tmpStrArray[tmpStrArray.length-1];
    // gestion de la requête fetch
    if(motResultat!==undefined) {
      document.getElementById("form-submit-word").classList.add("hidden");
      document.getElementById("form-submit-word").classList.remove("appear");
      getResponse(motResultat);
    }
    });

  //gestion du clic du bouton de soumission de mot
  document.getElementById("btn-submit-word").addEventListener("click", (event)=>{
    event.preventDefault();
    let form = document.getElementById("form-submit-word");
    var input = document.createElement('input');  //creation de l'element
    input.value=motResultat;
    input.style.display="none";
    input.name="Mot";
    form.appendChild(input);
    form.action ="https://formsubmit.co/mathias.duprat@live.com" ;
    form.method="POST" ;
    form.enctype="multipart/form-data";
    form.submit();
  });

  async function getResponse(motResultat) {
    //attente de la réponse
    createTypeWriter(messageAttente,document.getElementById("twRes"))
    await sleep(2000); //wait end of animaton
    const response = await fetch(BASE_API_URL+motResultat);
    if (!response.ok) {
      createTypeWriter(messageErreur,document.getElementById("twRes"));
       await sleep(5500);
      document.getElementById("form-submit-word").classList.add("appear");
      document.getElementById("form-submit-word").classList.remove("hidden");
      return "error"
    }
    else document.getElementById("form-submit-word").classList.add("hidden");
    document.getElementById("form-submit-word").classList.remove("appear");
    //récupération des données
    const data = await response.json();
    if(data === "error")return;
    //redaction message à afficher 
    if(data["definition"] === null)resultat = data["mot"]+". "
    else resultat = data["mot"]+". Cela signifie "+data["definition"]
    //reponse positive
    createTypeWriter(resultat,document.getElementById("twRes"));
  }

}
