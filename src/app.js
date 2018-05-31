import * as THREE from 'three'
import customizeChar from './components/customizeChar'
import loadingManager from './utils/loadingManager'
import charOrga from './assets/charOrga'
import colors from './assets/colors'

class App {
    constructor() {
        
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.001, 10000)
        this.camera.position.z = 5;
        // this.camera.position.y = 5;
        this.scene = new THREE.Scene()

        let mat = new THREE.MeshBasicMaterial({color: "white"})
        let geo = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
        this.mixer = null;
        this.loadingManager = new loadingManager()

        this.customizeChar = new customizeChar()

        this.customizeChar.loadCharacter()
        .then( geometries=>{
            this.customizeChar.createMeshGroup(geometries)
            .then(group => {
                
                this.character = group.clone()
                this.character.name ="char"
                
                this.character.rotation.x = Math.PI/2
                this.character.scale.set(0.5,0.5,0.5)
                this.scene.add(this.character)
                console.log(this.scene)
            
            })
        })

    
        this.renderer = new THREE.WebGLRenderer({antialias: true})
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setClearColor('white')
        document.body.appendChild( this.renderer.domElement );
        
        this.render()
        document.getElementById('changeHead').addEventListener('click', this.changeHead.bind(this))
        document.getElementById('validate').addEventListener('click', this.createChar.bind(this))
        
        this.generateUI()
    }

    generateUI() {
        // this.customizeContainer = document.createElement('div')
        // this.customizeContainer.classList.add('customizeContainer')

        // this.customizeContainer.innerHTML = `
        //     <div class="hello"> je ne sais pas </div>
        // `
        // this.body = document.getElementsByTagName('body')

        // this.body[0].appendChild(this.customizeContainer)
    }


    changeHead() {
        if(this.character) {
            for (let i = 0; i < this.character.children.length; i++) {
                let bodyPart = this.character.children[i]
             
                if(bodyPart.geometry.type == "casque") {
                    console.log('ok')
                    this.character.remove(bodyPart)
                   this.loadingManager.loadMesh(charOrga.casque[1].object, "casque")
                   .then(object => {
                       console.log(object)
                       let mat = new THREE.MeshBasicMaterial({color: colors[1][object[0].colorId]})
                       mat.skinning = true
                       let mesh = new THREE.SkinnedMesh(object[0], mat)
                       mesh.name = "testCasque"
                       this.character.add(mesh)
                   })
                }
            }
        }
    
    }

    createChar() {
        let charClone = this.character.clone()
        this.customizeChar.createCharacter(charClone)
        .then(character2 => {
            this.characterDef = character2            
            this.characterDef.mixer = new THREE.AnimationMixer(this.characterDef)
            console.log(this.characterDef)
            // this.characterDef.geometry.dynamic = true;
            this.characterDef.geometry.verticesNeedUpdate = true;
            this.characterDef.geometry.elementsNeedUpdate = true;
            this.characterDef.geometry.morphTargetsNeedUpdate = true;
            this.characterDef.geometry.uvsNeedUpdate = true;
            this.characterDef.geometry.normalsNeedUpdate = true;
            this.characterDef.geometry.colorsNeedUpdate = true;
            this.characterDef.geometry.tangentsNeedUpdate = true;
            this.characterDef.geometry.groupsNeedUpdate = true;
            this.characterDef.rotation.x = Math.PI/2
            this.characterDef.scale.set(0.5,0.5,0.5)
            for (let i = 0; i < this.characterDef.skeleton.bones.length; i++) {
                let mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({color: 'black'}))
                mesh.scale.set(0.2,0.2,0.2)
                this.characterDef.skeleton.bones[i].add(mesh)
            }   

            this.walkAction = this.characterDef.mixer.clipAction(this.characterDef.geometry.animations[0]);
            this.walkAction.enabled = true

            this.walkAction.play()
            console.log(this.characterDef, this.character)
            this.scene.add(this.characterDef)
            this.scene.remove(this.character)
            
        })
    }

  

    render() {
        requestAnimationFrame(this.render.bind(this))
        this.renderer.render(this.scene, this.camera)

        if(this.characterDef && this.characterDef.mixer) {
              
                    this.characterDef.mixer.update( 15/1000 );
          
        }
        
    }
}

export default App