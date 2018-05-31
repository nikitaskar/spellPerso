import loadingManager from '../utils/loadingManager'
import * as THREE from 'three'
import charOrga from '../assets/charOrga'
import colors from '../assets/colors'

class customizeChar {
    constructor() {
        this.loadingManager = new loadingManager()
        this.mesh = new THREE.Group()

        this.bodyParts = []
        this.paths = []        
        this.colorId = []
        this.type = []

        for(let key in charOrga) {
            this.bodyParts.push(key)
            for(let i=0; i< charOrga[key][0].object.length; i++) {
                let path = charOrga[key][0].object[i].path
                let colorId =  charOrga[key][0].object[i].colorId
                if(key == "jambe" || key == "bras") {
                    this.colorId.push(colorId,colorId)
                    this.type.push(key, key)
                    this.paths.push(path+"Droit.json", path+"Gauche.json")

                } else {
                    this.type.push(key)
                    this.colorId.push(colorId)
                    this.paths.push(path+".json")
                }

                if(key == "jambe" && i+1 == charOrga[key][0].object.length) {
                    console.log('ok')
                }
            }
           
        }
        // console.log(this.paths)
        // for (let i = 0; i < this.fileNames.length; i++) {
        //     this.paths.push("src/assets/chars/"+this.fileNames[i]+".json")    
        // }
    }

    loadCharacter() {
        return this.loadingManager.loadObject(this.paths, this.colorId, this.type)
    }

    createMeshGroup(object) {
        console.log(object[0])
        return new Promise(resolve => {
            for (let i = 0; i < object[0].length; i++) {
                let mat = null;
                if(object.length > 1) {
                    console.log(object[1])
                    mat =  new THREE.MeshBasicMaterial({color: object[1][i][0].color})
                } else {
                    mat = new THREE.MeshBasicMaterial({color: colors[1][object[0][i].colorId]})
                }
                   
                    mat.skinning = true
                    let mesh = new THREE.SkinnedMesh(object[0][i], mat)
                //    mesh.rotation.x = Math.PI/2
                //    mesh.scale.set(0.5,0.5,0.5)
                   console.log(mesh)
                    this.mesh.add(mesh)  
                
                
                if(i+1 == object[0].length) {
                    resolve(this.mesh)
                }
            }
        })
    }

    createCharacter(character) {
        
        return new Promise(resolve => {
            this.character = character.children[0].clone()
   
            for (let i = 1; i < character.children.length; i++) {
       
                let bodyPart = character.children[i].clone()
                
                bodyPart.updateMatrix();
                this.character.geometry.merge(bodyPart.geometry, bodyPart.matrix, i)
                
                for (let j = 0; j < bodyPart.geometry.skinIndices.length; j++) {
                    this.character.geometry.skinIndices.push(bodyPart.geometry.skinIndices[j ])
                    this.character.geometry.skinWeights.push(bodyPart.geometry.skinWeights[j ])
                }


                if(i+1 == character.children.length) {
                    this.character.material = new THREE.MeshFaceMaterial([character.children[0].material, character.children[1].material, character.children[2].material])                    
                    resolve(this.character)
                }
            }
        })
    }
}

export default customizeChar