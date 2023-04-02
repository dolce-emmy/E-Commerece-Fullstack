import ProductCollection from '../models/productSchema.js'

export const getAllProducts = async (req, res) => {

    //request handler // controller

    try{
        const products = await ProductCollection.find();
        res.status(200).json({success: true, data: products});

    }

    catch(error){
        res.status(500).json({success: false, data: error.message})
    }
}


export const addNewProduct = async(req, res) => {
    try {

        //console.log(body.req)
        //console.log(req.files)

        const product = new ProductCollection(req.body)
        await product.save()
        res.status(201).json({success: true, data: product})

        






    } catch (error) {
        res.status(500).json({success: false, data: error.message})

    }
}

export const getSingleProduct = async(req, res) => {
    try{

        const {id} = req.params
        const product = await ProductCollection.findById(id)

        if (!product) {
            res.status(404).json({success: false, data: "Product not found"})
        }else{
            res.status(200).json({success: true, data: product})
        }

    }catch (error) {

        res.status(500).json({success: false, data: error.message})

    }
}

export const updateProduct = async(req, res) => {

    try {
        const {id} = req.params
        const updatedProduct = await ProductCollection.findByIdAndUpdate(id, req.body, {new: true})
        res.status(200).json({success: true, data: updatedProduct})

        

    } catch (error) {
        res.status(500).json({success: false, data: error.message})

    }
}

export const deleteProduct = async(req, res) => {

    try {
        const {id} = req.params
        const deletedProduct = await ProductCollection.findByIdAndRemove(id)
        res.json({success: true, data: deletedProduct})

    }catch (error) {

        res.status(500).json({success: false, data: error.message})

    }

}
