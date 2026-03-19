//TODO: enable exporting as image.

const STUFF = document.getElementById("stuff");

const CAT_CONTAINER = document.getElementById("tsucky-container");
const HITBOX_CONTAINER = document.getElementById("hitbox-container");

const EDITOR = document.getElementById("editor");
const HUE_SELECTOR = {"this": document.getElementById("hue-selector"), "slider": document.getElementById("hue-slider"), "value": document.getElementById("hue-value")};
const BRIGHTNESS_SELECTOR = {"this": document.getElementById("brightness-selector"), "slider":  document.getElementById("brightness-slider"), "value": document.getElementById("brightness-value")};
const GRAYSCALE_SELECTOR = {"this": document.getElementById("grayscale-selector"), "slider":  document.getElementById("grayscale-slider"), "value": document.getElementById("grayscale-value")};

let ACHIEVEMENTS_ENABLED = false;


const KITTY = [];
const RAINBOW = [];
const ACCESSORIES = [];

const PARAMS = [
    ["body", [86.3, 62.6, 22.4, 8.3, 0, 0]],
    ["head", [50.1, 34.3, 3.2, 44.2, 0, 1]],
    ["iris-left", [4.6, 4.5, 21, 77.5, 35, 2]],
    ["iris-right", [7.4, 3.3, 23.9, 60.7, 21, 2]],
    ["leaf", [17, 7.7, 9.7, 60, 17, 2]],
    ["leg-left", [10.6, 10.1, 63.1, 66.5, 63, 1]],
    ["leg-right", [13.1, 10.6, 72, 46.9, 66, 1]],
    ["nose", [6.4, 3, 31.3, 73, 1, 3]],
    ["paw-left", [19.1, 10.3, 71.6, 68.7, 59, 1]],
    ["paw-right", [21.9, 13.3, 82, 48.2, 65, 1]],
    ["paw-left2", [10.9, 5.3, 68, 56.2, 67, 1]],
    ["paw-right2", [8.9, 5.3, 82, 42.2, 65, 2]],
    ["pupil-left", [2.4, 2.1, 22, 78.2, 0, 3]],
    ["pupil-right", [2.3, 2.4, 24.3, 62.9, -12, 3]],
    ["tail-1", [9.2, 6, 84.1, 60.3, 48, 3]],
    ["tail-2", [3.7, 7.6, 86.8, 59, -11, 3]],
    ["tail-3", [3.3, 8.6, 88, 56.4, -12, 3]],
    ["tail-4", [5.2, 9.5, 86.9, 51, 0, 3]],
    ["tail-5", [4.1, 10, 87, 46.9, 10, 3]],
    ["tail-6", [7.3, 10.6, 85, 40, 16, 3]],
    ["tail-7", [4, 9.8, 84.6, 36.7, 18, 3]],
    ["tail-8", [7.5, 10.4, 82.6, 29, 26, 3]],
    ["tail-9", [4.3, 9.8, 81.6, 26.3, 25, 3]],
    ["tail-10", [3.3, 8.2, 81.1, 24.2, 33, 3]],
    ["tail-11", [3.1, 9.1, 79.2, 22.5, 42, 3]],
    ["tail-12", [10.9, 2.3, 81, 15.7, -47, 3]],
    ["tail-13", [11.1, 10.7, 70.9, 11.2, -35, 3]],
    ["whiskers", [53.9, 10.6, 29.3, 45.1, -12, 2]]
]



class KITTY_PART {
    /*
    name - string
    hue - deg 0-360
    grayscale - % 0-100
    brightness - % 0-100
    hitbox - [x, y]
        x,y - % 0-100
    */
    constructor(name, hitbox, selected=false){
        
        this.name = name;
        this.hitbox = hitbox;
        this.selected = selected;

        this.image = document.createElement("img");
        this.image.setAttribute("id", this.name);
        this.image.classList.add("cat_part");
        this.image.setAttribute("src", `images/edited/cat/${this.name}.png`);

        this.outline_img = document.createElement("img");
        this.outline_img.setAttribute("id", `${this.name}-outline`);
        this.outline_img.classList.add("outline");
        this.outline_img.setAttribute("src", `images/edited/outlines/${this.name}.png`);
        this.outline_img.style.visibility = "hidden";

        this.hitbox = document.createElement("div");
        this.hitbox.setAttribute("id", `${this.name}_hitbox`);
        this.hitbox.classList.add("hitbox");

        this.hitbox.style.width = `${hitbox[0]}%`;
        this.hitbox.style.height = `${hitbox[1]}%`;
        this.hitbox.style.top = `${hitbox[2]}%`;
        this.hitbox.style.left = `${hitbox[3]}%`;
        this.hitbox.style.rotate = `${hitbox[4]}deg`;
        this.hitbox.style.zIndex = 2 + hitbox[5];

        this.hitbox.addEventListener("click", e => {

            document.getElementById("rainbow-switch").checked = RAINBOW.includes(this);
            select_all_switch.checked = false;
            document.getElementById("full-outline").style.visibility = "hidden";

            if(e.ctrlKey){
                if(this.selected){
                    this.selected = false;
                    this.toggleOutline();
                    SELECTED.splice(SELECTED.indexOf(this), 1);
                }else{
                    selectPart(this.name);
                    this.selected = true;
                    this.toggleOutline();
                }
            }else{
                if(this.selected){
                    if(SELECTED.length == 1){
                        this.selected = false;
                        this.toggleOutline();
                        SELECTED = [];
                    }else{
                        for(let i = 0; i < SELECTED.length-1; i++){
                            let partToDeselect = SELECTED.find(element => element != this);
                            partToDeselect.selected = false;
                            partToDeselect.toggleOutline();
                            SELECTED.splice(SELECTED.indexOf(partToDeselect), 1);
                        }
                    }
                }else{

                    let num_of_selected = SELECTED.length; 
                    
                    for(let i = 0; i < num_of_selected; i++){
                        let partToDeselect = SELECTED[0];
                        
                        partToDeselect.selected = false;
                        partToDeselect.toggleOutline();
                        SELECTED.splice(SELECTED.indexOf(partToDeselect), 1);
                    }

                    selectPart(this.name);
                    this.selected = true;
                    this.toggleOutline();
                }
            }
            updateSliders();
            updateSelectors();
        });

        this.hue = 0;
        this.grayscale = 0;
        this.brightness = 100;

        this.addImage();
        this.updateImage();
    }

    addImage() {
        KITTY.push(this);
        CAT_CONTAINER.appendChild(this.image);
        CAT_CONTAINER.appendChild(this.outline_img);
        HITBOX_CONTAINER.appendChild(this.hitbox);
    }

    toggleOutline() {
        this.outline_img.style.visibility = this.selected == false ? "hidden" : "visible";
    }

    updateImage() {
        this.image.style.filter = `hue-rotate(${this.hue}deg) grayscale(${this.grayscale}%) brightness(${this.brightness}%)`;
    }   
}

// construct kitty ≽^•⩊•^≼
function constructKitty() {    
    for(let i = 0; i < PARAMS.length; i++) {
        let part = PARAMS[i];
        new KITTY_PART(part[0], part[1]);
    }
}


// part selection and editing

let outline_full = document.createElement("img");
outline_full.setAttribute("id", "full-outline");
outline_full.classList.add("outline");
outline_full.setAttribute("src", "images/edited/outlines/full.png");
outline_full.style.visibility = "hidden";

CAT_CONTAINER.appendChild(outline_full);

document.getElementById("rainbow-switch").addEventListener("change", e => {
    if(e.target.checked == true) {
        SELECTED.forEach(part => {
            if(!RAINBOW.includes(part)){
                RAINBOW.push(part)
            }
        })
    }else{
        SELECTED.forEach(part => {
            if(RAINBOW.includes(part)){
                RAINBOW.splice(RAINBOW.indexOf(part), 1);
            }
        })
    }
});

let select_all_switch = document.getElementById("select-all-switch");
select_all_switch.addEventListener("change", e => {e.target.checked ==  true ? selectAll() : deselectAll()});

function selectAll(){
    
    let num_of_selected = SELECTED.length; 
                    
    for(let i = 0; i < num_of_selected; i++){
        let partToDeselect = SELECTED[0];
        
        partToDeselect.selected = false;
        partToDeselect.toggleOutline();
        SELECTED.splice(SELECTED.indexOf(partToDeselect), 1);
    }
    
    for(let i = 0; i < KITTY.length; i++){
        let part = KITTY[i];
        selectPart(part.name);
    }

    document.getElementById("full-outline").style.visibility = "visible";
}

function deselectAll(){
    let num_of_selected = SELECTED.length; 
                    
    for(let i = 0; i < num_of_selected; i++){
        let partToDeselect = SELECTED[0];
        
        partToDeselect.selected = false;
        partToDeselect.toggleOutline();
        SELECTED.splice(SELECTED.indexOf(partToDeselect), 1);
    }
    
    document.getElementById("full-outline").style.visibility = "hidden";
}

document.getElementById("bg-picker").addEventListener("change", e => {document.body.style.backgroundColor = e.target.value; document.querySelector(":root").style.setProperty("--accent-color", e.target.value)});

function getPart(name){
    return KITTY.find((element) => element.name == name);
}

function selectPart(name){
    let part = getPart(name);
    SELECTED.push(part);

    HUE_SELECTOR.slider.value  = part.hue;
    HUE_SELECTOR.value.innerText = part.hue;
    BRIGHTNESS_SELECTOR.slider.value = part.brightness - 50;
    BRIGHTNESS_SELECTOR.value.innerText = part.brightness - 50;
    GRAYSCALE_SELECTOR.slider.value = part.grayscale;
    GRAYSCALE_SELECTOR.value.innerText = part.grayscale;
}
//hue
HUE_SELECTOR.slider.addEventListener("input", e => {
    let value = e.target.value;
    HUE_SELECTOR.value.innerText = value;
    changeHue(value);
    updateSliders();
    updateSelectors();
})

function changeHue(deg){
    SELECTED.forEach(part => {
        part.hue = deg;
        part.updateImage();
    });
}

//grayscale
GRAYSCALE_SELECTOR.slider.addEventListener("input", e => {
    let value = e.target.value;
    GRAYSCALE_SELECTOR.value.innerText = value;
    changeGrayscale(value);
    updateSliders();
    updateSelectors();
})

function changeGrayscale(p){
    SELECTED.forEach(part => {
        part.grayscale = p;
        part.updateImage();
    });
}

//brightness
BRIGHTNESS_SELECTOR.slider.addEventListener("input", e => {
    let value = e.target.value;
    BRIGHTNESS_SELECTOR.value.innerText = value;
    changeBrightness(value);
    updateSliders();
    updateSelectors();
})

function changeBrightness(p){
    SELECTED.forEach(part => {
        part.brightness = p*2;
        part.updateImage();
    });
}

function updateSliders() {
    let h = 60 + parseInt(HUE_SELECTOR.slider.value); //hue
    let s = 100 - parseInt(GRAYSCALE_SELECTOR.slider.value); //saturation
    let l = BRIGHTNESS_SELECTOR.slider.value; //lightness

    HUE_SELECTOR.slider.style.background = `linear-gradient(to right in hsl longer hue, hsl(60deg, ${s}%, ${l}%), hsl(60deg, ${s}%, ${l}%))`;
    GRAYSCALE_SELECTOR.slider.style.background = `linear-gradient(to right, hsl(${h}deg, 100%, ${l}%), hsl(${h}deg, 0%, ${l}%))`;
    BRIGHTNESS_SELECTOR.slider.style.background = `linear-gradient(to right, hsl(${h}deg, ${s}%, 0%), hsl(${h}deg, ${s}%, 100%))`;
}

function updateSelectors(){
    HUE_SELECTOR.this.style.backgroundColor = `hsla(${parseInt(HUE_SELECTOR.slider.value)+60}deg, 100%, 50%, 0.3)`;
    GRAYSCALE_SELECTOR.this.style.backgroundColor = `hsla(${parseInt(HUE_SELECTOR.slider.value) + 60}deg, ${100 - parseInt(GRAYSCALE_SELECTOR.slider.value)}%, 50%, 0.3)`;
    BRIGHTNESS_SELECTOR.this.style.backgroundColor = `rgba(${Math.floor((parseInt(BRIGHTNESS_SELECTOR.slider.value)/100)*255)}, ${Math.floor((parseInt(BRIGHTNESS_SELECTOR.slider.value)/100)*255)}, ${Math.floor((parseInt(BRIGHTNESS_SELECTOR.slider.value)/100)*255)}, 0.3)`;
}


function addAccessory(img_name) {
    let image = document.createElement("img");
    image.setAttribute("id", img_name);
    image.classList.add("accessory");
    image.setAttribute("src", `images/accessories/${img_name}.png`);
    CAT_CONTAINER.appendChild(image);
}

constructKitty();
updateSelectors();
updateSliders();

function exportImage(){
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "export");
    canvas.setAttribute("width", "2560");
    canvas.setAttribute("height", "3072");
    const ctx = canvas.getContext("2d");

    if(document.getElementById("export-bg-switch").checked){
        let body_color = document.body.style.backgroundColor;
        if(body_color != ""){
            ctx.fillStyle = body_color;
        }else{
            ctx.fillstyle = "#141014";
        }
        ctx.fillRect(0, 0, 2560, 3072);
    }

    for(let i = 0; i < KITTY.length; i++){
        const part = KITTY[i];
        const image = document.getElementById(part.name);
        ctx.filter = `hue-rotate(${part.hue}deg) grayscale(${part.grayscale}%) brightness(${part.brightness}%)`;
        ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
    }

    for(let i = 0; i < ACCESSORIES.length; i++){
        const acc = ACCESSORIES[i];
        const image = document.getElementById(acc.name);
        ctx.filter = `hue-rotate(${acc.hue}deg) grayscale(${acc.grayscale}%) brightness(${acc.brightness}%)`;
        ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
    }

    canvas.toBlob((blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "kitty.png";
        document.body.appendChild(link);
        link.click();

        URL.revokeObjectURL(url);
        document.body.removeChild(link);
    }, "image/png");
}

//global variables to be kept track of
let HUE = 0;
let SELECTED = [];

function Update() {
    let width = Array.from(CAT_CONTAINER.children)[0].getBoundingClientRect().width;
    CAT_CONTAINER.style.width = `${width}px`;
    HITBOX_CONTAINER.style.width = `${width}px`;

    HUE += 1;
    if(HUE == 360){
        HUE = 0;
    }

    RAINBOW.forEach(part => {
        part.hue = HUE;
        part.updateImage();
    })

    if(RAINBOW.length != 0){
        updateSelectors();
        updateSliders();
    }

    if(ACHIEVEMENTS_ENABLED) {
        checkForAchievements();
    }
}

setInterval(Update, 1000/60);

const ACHIEVEMENTS = [{"function": eyes, "completed": false}, {"function": favouriteColor, "completed": false, "timer": 0}];

function checkForAchievements() {
    for(let i = 0; i < ACHIEVEMENTS.length; i++){
       const achievement = ACHIEVEMENTS[i];

       if(!achievement.completed){
            if(achievement.function()){
                achievement.completed = true;
            }
       }
    }
}

function eyes(){    
    if(getPart("iris-right").hue > 300 && getPart("iris-left").hue > 300 && getPart("iris-right").hue < 330 && getPart("iris-left").hue < 330){
        alert("When my eyes turn red...")
        return true;
    }
}

function favouriteColor(){
    let purple = true;

    KITTY.forEach(part => {
        if(part.hue < 245 || part.hue > 285){
            purple = false;
        }
    })

    if(purple){
        ACHIEVEMENTS[1].timer += 1

        if(ACHIEVEMENTS[1].timer > 2) {
            let a = document.createElement("a");
            a.setAttribute("id", "flower-link")
            a.setAttribute("href", "/images/Happy Birthday!.png");
            a.setAttribute("download", "Flower");

            let img = document.createElement("img");
            img.setAttribute("id", "flower");
            img.setAttribute("src", "images/Happy Birthday!.png");

            a.appendChild(img);

            a.addEventListener("mousedown", e => {document.getElementById("flower-link").remove()})

            alert("A beautiful colour (168, y, 946)");
            STUFF.appendChild(a);

            return true;
        }
    }
}

//devtools

function enableAchievements(password) {
    if(password == "0317"){
        ACHIEVEMENTS_ENABLED = true;
        document.getElementById("notice").style.visibility = "visible";
        console.log("achievements enabled");
    }
}

function toggleHitboxVisibility(){
    if(HITBOX_CONTAINER.classList.contains("invisible")){
        HITBOX_CONTAINER.classList.remove("invisible");
        Array.from(document.getElementsByClassName("hitbox")).forEach(hitbox => {hitbox.style.backgroundColor = `hsla(${60*parseInt(hitbox.style.zIndex)}, 100%, 50%, 0.3)`});
    }else{
        HITBOX_CONTAINER.classList.add("invisible");
    }
}