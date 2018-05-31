import * as THREE from 'three'
class loadingManager {
    constructor(params){
        this.loader = new THREE.JSONLoader()
        this.paths = []
    }

    loadObject(paths, colorId, type) {
        let pathsArray = paths
        let colorIdArray = colorId
        let typeArray = type
        let loaded = false;
        let count = 0;
        let geometries = [];
        let materials = []
        let object = []
        return new Promise (resolve => {
          
            for(let i = 0; i < pathsArray.length; i++) {

                this.loader.load(pathsArray[i], (geometry, material)=>{
                    count ++
                    geometry.colorId = colorIdArray[i]
                    geometry.type = typeArray[i]
                    geometries.push(geometry)
                    if(material) {
                        materials.push(material)
                    }  
                    
                    if(count == pathsArray.length) {
                        loaded = true;
                        if (material) {
                            object.push(geometries, materials)
                            resolve((object))
                          } else {
                              object.push(geometries)
                            resolve(object)
                          }
                    }
                })
    
               
            }        
        })
        
    }

    loadMesh(element, type) {
        let loaded = false;
        let count = 0;
        let objects = [];
        return new Promise (resolve => {
          console.log(element)
            for(let i = 0; i < element.length; i++) {

                this.loader.load(element[i].path+".json", (object)=>{
                    count ++
                    object.colorId = element[i].colorId
                    object.type = type
                    objects.push(object)
                    
                    if(count == element.length) {
                        loaded = true;
                        resolve(objects)
                    }
                })
    
               
            }        
        })
        
    }
}

export default loadingManager
