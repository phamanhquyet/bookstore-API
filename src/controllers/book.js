import * as services from "../services";
import { internalServerError, badRequest} from "../middlewares/handle_errors";
import { bid, title, price, available, category_code, image } from "../helpers/joi_schemas";
import Joi from "joi";
const cloudinary = require('cloudinary').v2;

//READ
export const getBooks = async (req, res) => {
    try {
        const response = await services.getBooks(req.query)
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}

//CREATE
export const createNewBook = async (req, res) => {
    try {
        const fileData = req.file
        //tiền xử lý
        const { error } = Joi.object({title, price, available, category_code, image}).validate({...req.body, image: fileData?.path})
        if(error) {
            if(fileData) cloudinary.uploader.destroy(fileData.filename)
            return badRequest(error.details[0].message, res)
        } 
        const response = await services.createNewBook(req.body, fileData)
        return res.status(200).json(response)
        // return res.status(200).json('ok')

    } catch (error) {
        console.log(error);
        return internalServerError(res)
    }
}

//UPDATE
export const updateBook = async (req, res) => {
    try {
        const fileData = req.file
        //tiền xử lý
        const { error } = Joi.object({bid}).validate({bid: req.body.bid})
        if(error) {
            if(fileData) cloudinary.uploader.destroy(fileData.filename)
            return badRequest(error.details[0].message, res)
        } 
        const response = await services.updateBook(req.body, fileData)
        return res.status(200).json(response)
        // return res.status(200).json('ok')

    } catch (error) {
        console.log(error);
        return internalServerError(res)
    }
}