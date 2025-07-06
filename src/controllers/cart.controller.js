import { User } from "../models/user.model.js"

// add to cart:
const addToCart = async (req, res) => {
    try {
        const {userId, itemId, size} = req.body

        const user = await User.findById(userId);
        let cartData = await user.cartData

        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1
            }else{
                cartData[itemId][size] = 1
            }
        }else{
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }

        await User.findByIdAndUpdate(userId, {cartData})
        res.json({success: true, message: 'Added to Cart'})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// update to cart:
const updateToCart = async (req, res) => {
    try {
        const {userId, itemId, size, quantity} = req.body

        const user = await User.findById(userId);
        let cartData = structuredClone(user.cartData);

        /* checking if the quantity  is zero: then removing the item from the cart */
        if(quantity === 0){
            delete cartData[itemId][size]

            /* if the item has no more size left then delete the whole product */
            if(Object.keys(cartData[itemId]).length === 0){
                delete cartData[itemId]
            }
        }else{
            cartData[itemId][size] = quantity
        }
        
        await User.findByIdAndUpdate(userId, {cartData})
        res.json({success: true, message: 'Updated Cart'})
        
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}


// get cartData:
const getCartData = async (req, res) => {
    try {
        const {userId} = req.body

        const user = await User.findById(userId);
        const cartData = await user.cartData

        if(cartData){
            res.json({success: true, cartData})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export { addToCart, updateToCart, getCartData };