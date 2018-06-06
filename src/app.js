import * as THREE from 'three'
import customizeChar from './components/customizeChar'
import loadingManager from './utils/loadingManager'
import GLTFLoader from './utils/glTFLoader'
import charOrga from './assets/charOrga'
import colors from './assets/colors'
var fbx = require('three-fbx-loader')

class App {
    constructor() {
        
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.001, 10000)
        this.camera.position.z = 1000;
        // this.camera.position.y = 5;
        this.scene = new THREE.Scene()
        this.actions = []
        let mat = new THREE.MeshBasicMaterial({color: "white"})
        let geo = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
        this.mixer = null;
        this.loadingManager = new loadingManager()

        this.customizeChar = new customizeChar()
        this.fbxLoader = new fbx()
        this.mainChar = true
        this.bodyParts = {
            
            csqe: [],
            tete: [],
            crps: [],
            bras: [],
            jmbe: [],
        }
       
        this.selected = null
        
        let light = new THREE.HemisphereLight( 0x00000, 0x00000     );
        light.position.set( 0, 50, 30 );
        this.scene.add( light );

        light = new THREE.DirectionalLight( 0x00000 );
        light.position.set( 0, 50, 30 );
        this.scene.add( light )
        console.log(GLTFLoader)
        this.loader = new GLTFLoader()
        this.loader.setCrossOrigin = "anonymous"

            this.loader.load( './src/assets/rig-heros.glb',  ( gltf ) => {
                gltf.scene.traverse((child)=> {
            if(child.scale.x == 100) {
            }
            if (child.isMesh) {
    
              if(this.morphTargets) {
                  let color = child.material.color
                  let opacity = child.material.opacity
                  child.material.color = color
                  if(this.hide) {
                    child.material.opacity = 0
                  } else {
                    child.material.opacity = opacity
                  }
    
                  child.material.realOpacity = opacity
                  child.material.transparent = true
                  child.material.depthTest = false
                  child.material.depthWrite = false
                  child.material.morphTargets = true
              } else {
                if(child.name == "Curve003") {
                  child['visible'] == null
                  child.children[0].children[0].visible = false
                  
                }
          
                if(child['material']) {
                  let mat = new THREE.MeshBasicMaterial()
                  let color = child.material.color
                  let opacity = child.material.opacity
                  child.material = mat
                  child.material.color = color
                  if(this.hide) {
                    child.material.opacity = 0
                  } else {
                    child.material.opacity = opacity
                  }
                  
                  child.material.realOpacity = opacity
                  child.material.transparent = true
                  child.material.depthTest = false
                  child.material.depthWrite = false

                  child.name = child.parent.parent.name.replace('-', '').slice(0,5)
                  this.bodyParts[child.name.slice(0,4)].push(child)
                  
                  if(this.mainChar) {
                    var matches = child.name.match(/\d+/g);
                    if (matches[0] != 2) {
                      child.visible = false
                    }
                  }
                 
                }
              }
            }
          })
    
    
          this.character = new THREE.Group()
          this.character.name = this.name;
          this.character.add(gltf.scene)
          this.character.rotation.x = Math.PI/2
          this.character.scale.set(4,4,4)
          this.scene.add(this.character)
                if ( this.character === undefined ) {
                    alert( 'Unable to find a SkinnedMesh in this place:\n\n' + url + '\n\n' );
                    return;
          }

          this.mixer = new THREE.AnimationMixer( gltf.scene );
          for(let i=0; i< gltf.animations.length; i++) {
            
            this.actions.push(this.mixer.clipAction(gltf.animations[i]))
          }
                this.actions[5].play()
        });

        this.ambiant = new THREE.AmbientLight(0x000000)
        this.scene.add(this.ambiant)
        
    
        this.renderer = new THREE.WebGLRenderer({antialias: true})
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setClearColor('white')
        document.body.appendChild( this.renderer.domElement );
        
        this.render()

        
        this.generateUI()
    }

    generateUI() {
      this.categories = document.querySelectorAll('.categoryItem')
        
      for (let i = 0; i < this.categories.length; i++) {
          const element = this.categories[i];
          console.log(element)
          element.addEventListener('click', this.displayItems.bind(this, element.id))
          
      }
    }

    displayItems(currentType) {
        this.armorChoiceContainer = document.querySelector('.armorChoice')
        console.log(currentType)
        this.armorChoiceContainer.innerHTML = ''
        for (let i = 0; i < 4; i++) {
            let btn = document.createElement("BUTTON");
            btn.id = currentType+(i+1)
            btn.innerHTML = btn.id
            btn.classList.add('armorItem')
            
            btn.addEventListener('click', this.changeElement.bind(this, btn.id))
            
           this.armorChoiceContainer.appendChild(btn)
            
        }
    }

    changeElement(selectedElement) {
     
        if(this.character) {
           for (let i = 0; i < this.bodyParts[selectedElement.slice(0,4)].length; i++) {
               let element = this.bodyParts[selectedElement.slice(0,4)][i]
               element.visible = false
               console.log(selectedElement)
               if(element.name == selectedElement) {
                   element.visible = true
               }
               
           }
        }
    
    }

   
  

    render() {
        requestAnimationFrame(this.render.bind(this))
        this.renderer.render(this.scene, this.camera)

        if(this.characterDef && this.characterDef.mixer) {
              
                    this.characterDef.mixer.update( 15/1000 );
          
        }

        if ( this.mixer ) {

            var time = Date.now();

            this.mixer.update(17/1000 );
        }
    }
}

export default App